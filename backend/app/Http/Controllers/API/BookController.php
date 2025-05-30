<?php

namespace App\Http\Controllers\API;
use Aws\S3\S3Client;
use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Models\BookDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

    class BookController extends Controller
    {
    public function index(Request $request)
    {
        try {
            $query = Book::with('category');
            
            // Apply filters
            if ($request->has('category_id')) {
                $query->byCategory($request->category_id);
            }
            
            // Search functionality
            if ($request->has('search')) {
                $query->search($request->search);
            }
            
            // Price range filter
            if ($request->has('min_price')) {
                $query->where('Price', '>=', $request->min_price);
            }
            
            if ($request->has('max_price')) {
                $query->where('Price', '<=', $request->max_price);
            }
            
            // Sorting
            $sortField = $request->get('sort_by', 'CreatedAt');
            $sortDirection = $request->get('sort_direction', 'desc');
            
            // Map API sort fields to database fields if needed
            $sortFieldMap = [
                'title' => 'Title',
                'author' => 'Author',
                'price' => 'Price',
                'created_at' => 'CreatedAt'
            ];
            
            $dbSortField = $sortFieldMap[$sortField] ?? 'CreatedAt';
            
            $query->orderBy($dbSortField, $sortDirection === 'asc' ? 'asc' : 'desc');
            
            // Pagination
            $perPage = $request->get('per_page', 15);
            $books = $query->paginate($perPage);
            
            // Get the paginated items
            $booksArray = $books->items();
            
            // Create S3 client
            $s3 = new \Aws\S3\S3Client([
                'version' => 'latest',
                'region' => env('AWS_DEFAULT_REGION'),
                'credentials' => [
                    'key' => env('AWS_ACCESS_KEY_ID'),
                    'secret' => env('AWS_SECRET_ACCESS_KEY'),
                ],
            ]);
            
            // Generate pre-signed URLs for each book's image
            foreach ($booksArray as $book) {
                if (!empty($book->Image) && strpos($book->Image, 's3.') !== false) {
                    try {
                        // Extract the key from the URL
                        $parsedUrl = parse_url($book->Image);
                        $path = ltrim($parsedUrl['path'], '/');
                        
                        // If the path contains the bucket name, remove it
                        $bucketName = env('AWS_BUCKET');
                        if (strpos($path, $bucketName . '/') === 0) {
                            $path = substr($path, strlen($bucketName) + 1);
                        }
                        
                        // Generate pre-signed URL (valid for 1 hour)
                        $command = $s3->getCommand('GetObject', [
                            'Bucket' => $bucketName,
                            'Key' => $path,
                        ]);
                        
                        $request = $s3->createPresignedRequest($command, '+1 hour');
                        $presignedUrl = (string) $request->getUri();
                        
                        // Replace the original URL with the pre-signed URL
                        $book->Image = $presignedUrl;
                    } catch (\Exception $e) {
                        // Log error but continue processing
                        Log::error('Failed to generate pre-signed URL: ' . $e->getMessage());
                    }
                }
            }
            
            return response()->json([
                'success' => true,
                'data' => $booksArray,
                'meta' => [
                    'total' => $books->total(),
                    'per_page' => $books->perPage(),
                    'current_page' => $books->currentPage(),
                    'last_page' => $books->lastPage(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
   

    public function store(Request $request)
    {
        try {
            // Log incoming request data for debugging
            \Log::info('Book store request data:', $request->all());
            
            $validator = Validator::make($request->all(), [
                'CategoryID' => 'nullable|exists:tbCategory,CategoryID',
                'Title' => 'required|string|max:255',
                'Author' => 'required|string|max:100',
                'Price' => 'required|numeric|min:0',
                'StockQuantity' => 'nullable|integer|min:0',
                'Image' => 'nullable',  // Accept both files and strings
                'ISBN10' => 'nullable|string|max:10',
                'ISBN13' => 'nullable|string|max:17',
                'Publisher' => 'nullable|string|max:255',
                'PublishYear' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
                'Edition' => 'nullable|string|max:50',
                'PageCount' => 'nullable|integer|min:1',
                'Language' => 'nullable|string|max:50',
                'Format' => 'nullable|in:Hardcover,Paperback,Ebook,Audiobook',
                'Dimensions' => 'nullable|string|max:100',
                'Weight' => 'nullable|numeric|min:0',
                'Description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            try {
                // Handle image upload
                $imageUrl = null;
                if ($request->hasFile('Image')) {
                    $image = $request->file('Image');
                    $filename = 'book_' . Str::uuid() . '_' . time() . '.' . $image->getClientOriginalExtension();
                    
                    // Create S3 client
                    $s3 = new S3Client([
                        'version' => 'latest',
                        'region' => env('AWS_DEFAULT_REGION', 'ap-southeast-1'),
                        'credentials' => [
                            'key' => env('AWS_ACCESS_KEY_ID'),
                            'secret' => env('AWS_SECRET_ACCESS_KEY'),
                        ],
                    ]);
                    
                    try {
                        // Upload to S3
                        $result = $s3->putObject([
                            'Bucket' => env('AWS_BUCKET'),
                            'Key' => 'Picture/' . $filename,
                            'SourceFile' => $image->getRealPath(),
                            'ContentType' => $image->getMimeType(),
                        ]);
                        
                        $imageUrl = $result['ObjectURL'];
                    } catch (\Exception $e) {
                        \Log::error('S3 upload error: ' . $e->getMessage());
                        // Use a default image or return an error
                        return response()->json([
                            'success' => false,
                            'message' => 'Failed to upload image: ' . $e->getMessage()
                        ], 500);
                    }
                }
                // Handle image URL provided as a string
                elseif ($request->has('Image') && is_string($request->Image)) {
                    $imageUrl = $request->Image;
                }

                // Create the book
                $bookData = $request->only([
                    'CategoryID', 'Title', 'Author', 'Price', 'StockQuantity'
                ]);
                
                if ($imageUrl) {
                    $bookData['Image'] = $imageUrl;
                }
                
                // Ensure numeric fields are properly cast
                if (isset($bookData['Price'])) {
                    $bookData['Price'] = (float)$bookData['Price'];
                }
                
                if (isset($bookData['StockQuantity'])) {
                    $bookData['StockQuantity'] = (int)$bookData['StockQuantity'];
                }
                
                // Log book data before save
                \Log::info('Book data to save:', $bookData);
                
                $book = Book::create($bookData);
                
                // Create book details if provided
                $bookDetailFields = [
                    'ISBN10', 'ISBN13', 'Publisher', 'PublishYear', 'Edition',
                    'PageCount', 'Language', 'Format', 'Dimensions', 'Weight', 'Description'
                ];
                
                // Always create book details, even if only the BookID is set
                // This ensures we have a detail record for every book
                $bookDetailData = [];
                $bookDetailData['BookID'] = $book->BookID;
                
                // Collect all detail fields from the request
                foreach ($bookDetailFields as $field) {
                    // If the field exists in the request, use it; otherwise set to empty string or null
                    if ($request->has($field)) {
                        // Handle different data types
                        if ($field === 'PublishYear' || $field === 'PageCount') {
                            $bookDetailData[$field] = $request->$field !== '' ? (int)$request->$field : null;
                        } else if ($field === 'Weight') {
                            $bookDetailData[$field] = $request->$field !== '' ? (float)$request->$field : null;
                        } else {
                            $bookDetailData[$field] = $request->$field;
                        }
                    }
                }
                
                // Log book detail data before save
                \Log::info('Book detail data to save:', $bookDetailData);
                
                BookDetail::create($bookDetailData);
                
                return response()->json([
                    'success' => true,
                    'data' => $book->load('category'),
                    'message' => 'Book created successfully'
                ], 201);
            } catch (\Exception $e) {
                \Log::error('Book creation error: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to create book: ' . $e->getMessage()
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Unexpected error in BookController@store: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $book = Book::with(['category', 'bookDetail'])->find($id);
            
            if (!$book) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $book
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Log incoming request data for debugging
            \Log::info("Book update request for ID {$id}:", $request->all());
            
            $validator = Validator::make($request->all(), [
                'CategoryID' => 'nullable|exists:tbCategory,CategoryID',
                'Title' => 'sometimes|required|string|max:255',
                'Author' => 'sometimes|required|string|max:100',
                'Price' => 'sometimes|required|numeric|min:0',
                'StockQuantity' => 'nullable|integer|min:0',
                'Image' => 'nullable|sometimes',  // Allow strings or files
                // Book detail validation
                'ISBN10' => 'nullable|string|max:10',
                'ISBN13' => 'nullable|string|max:17',
                'Publisher' => 'nullable|string|max:255',
                'PublishYear' => 'nullable|integer|min:1800|max:' . (date('Y') + 1),
                'Edition' => 'nullable|string|max:50',
                'PageCount' => 'nullable|integer|min:1',
                'Language' => 'nullable|string|max:50',
                'Format' => 'nullable|in:Hardcover,Paperback,Ebook,Audiobook',
                'Dimensions' => 'nullable|string|max:100',
                'Weight' => 'nullable|numeric|min:0',
                'Description' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            try {
                $book = Book::find($id);
                
                if (!$book) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Book not found'
                    ], 404);
                }

                // Handle image updates
                $imageUrl = null;
                if ($request->hasFile('Image')) {
                    // Handle file upload
                    // Delete old image if it exists
                    if ($book->Image) {
                        try {
                            $oldKey = $this->getS3KeyFromUrl($book->Image);
                            if ($oldKey) {
                                $s3 = new S3Client([
                                    'version' => 'latest',
                                    'region' => env('AWS_DEFAULT_REGION', 'ap-southeast-1'),
                                    'credentials' => [
                                        'key' => env('AWS_ACCESS_KEY_ID'),
                                        'secret' => env('AWS_SECRET_ACCESS_KEY'),
                                    ],
                                ]);
                                
                                // Delete old image
                                $s3->deleteObject([
                                    'Bucket' => env('AWS_BUCKET'),
                                    'Key' => $oldKey,
                                ]);
                            }
                        } catch (\Exception $e) {
                            \Log::warning("Failed to delete old image: {$e->getMessage()}");
                            // Continue with update even if old image deletion fails
                        }
                    }
                    
                    // Upload new image
                    $image = $request->file('Image');
                    $filename = 'book_' . Str::uuid() . '_' . time() . '.' . $image->getClientOriginalExtension();
                    
                    try {
                        $s3 = new S3Client([
                            'version' => 'latest',
                            'region' => env('AWS_DEFAULT_REGION', 'ap-southeast-1'),
                            'credentials' => [
                                'key' => env('AWS_ACCESS_KEY_ID'),
                                'secret' => env('AWS_SECRET_ACCESS_KEY'),
                            ],
                        ]);
                        
                        $result = $s3->putObject([
                            'Bucket' => env('AWS_BUCKET'),
                            'Key' => 'Picture/' . $filename,
                            'SourceFile' => $image->getRealPath(),
                            'ContentType' => $image->getMimeType(),
                        ]);
                        
                        $imageUrl = $result['ObjectURL'];
                    } catch (\Exception $e) {
                        \Log::error("S3 upload error: {$e->getMessage()}");
                        return response()->json([
                            'success' => false,
                            'message' => "Failed to upload image: {$e->getMessage()}"
                        ], 500);
                    }
                } 
                // Handle image URL provided as a string
                elseif ($request->has('Image') && is_string($request->Image)) {
                    $imageUrl = $request->Image;
                }

                // Update book data
                $bookFields = ['CategoryID', 'Title', 'Author', 'Price', 'StockQuantity'];
                $bookData = [];
                
                foreach ($bookFields as $field) {
                    if ($request->has($field)) {
                        // Cast numeric values
                        if ($field === 'Price') {
                            $bookData[$field] = (float)$request->$field;
                        } else if ($field === 'StockQuantity') {
                            $bookData[$field] = (int)$request->$field;
                        } else {
                            $bookData[$field] = $request->$field;
                        }
                    }
                }
                
                if ($imageUrl) {
                    $bookData['Image'] = $imageUrl;
                }
                
                // Log data before update
                \Log::info("Book data to update:", $bookData);
                
                $book->update($bookData);
                
                // Update book details if provided
                $bookDetailFields = [
                    'ISBN10', 'ISBN13', 'Publisher', 'PublishYear', 'Edition',
                    'PageCount', 'Language', 'Format', 'Dimensions', 'Weight', 'Description'
                ];
                
                // Always update or create book details, even if fields are empty
                // Find or create book detail
                $bookDetail = BookDetail::firstOrNew(['BookID' => $book->BookID]);
                $bookDetailData = [];
                
                // Collect all detail fields from the request
                foreach ($bookDetailFields as $field) {
                    // If the field exists in the request, use it
                    if ($request->has($field)) {
                        // Handle different data types
                        if ($field === 'PublishYear' || $field === 'PageCount') {
                            $bookDetailData[$field] = $request->$field !== '' ? (int)$request->$field : null;
                        } else if ($field === 'Weight') {
                            $bookDetailData[$field] = $request->$field !== '' ? (float)$request->$field : null;
                        } else {
                            $bookDetailData[$field] = $request->$field;
                        }
                    }
                }
                
                // Log data before update
                \Log::info("Book detail data to update:", $bookDetailData);
                
                // Update with the merged array
                foreach ($bookDetailData as $key => $value) {
                    $bookDetail->$key = $value;
                }
                
                $bookDetail->save();
                
                return response()->json([
                    'success' => true,
                    'data' => $book->load('category', 'bookDetail'),
                    'message' => 'Book updated successfully'
                ]);
            } catch (\Exception $e) {
                \Log::error("Book update error: {$e->getMessage()}");
                return response()->json([
                    'success' => false,
                    'message' => "Failed to update book: {$e->getMessage()}"
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error("Unexpected error in BookController@update: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => "An unexpected error occurred: {$e->getMessage()}"
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            \Log::info("Attempting to delete book with ID: {$id}");
            
            $book = Book::find($id);
            
            if (!$book) {
                \Log::warning("Book not found for deletion: {$id}");
                return response()->json([
                    'success' => false,
                    'message' => 'Book not found'
                ], 404);
            }
            
            // Delete image from S3 if exists
            if ($book->Image && strpos($book->Image, 's3.amazonaws.com') !== false) {
                \Log::info("Attempting to delete image from S3 for book: {$id}");
                try {
                    $s3 = new S3Client([
                        'version' => 'latest',
                        'region' => env('AWS_DEFAULT_REGION', 'ap-southeast-1'),
                        'credentials' => [
                            'key' => env('AWS_ACCESS_KEY_ID'),
                            'secret' => env('AWS_SECRET_ACCESS_KEY'),
                        ],
                    ]);
                    
                    $key = $this->getS3KeyFromUrl($book->Image);
                    \Log::info("Deleting S3 object with key: {$key}");
                    
                    $s3->deleteObject([
                        'Bucket' => env('AWS_BUCKET'),
                        'Key' => $key,
                    ]);
                    
                    \Log::info("S3 image deleted successfully for book: {$id}");
                } catch (\Exception $e) {
                    // Log S3 deletion error but continue with database deletion
                    \Log::error('Failed to delete image from S3: ' . $e->getMessage());
                }
            }
            
            // Delete associated details if needed
            if (class_exists('App\Models\BookDetail')) {
                \Log::info("Checking for book details to delete for book: {$id}");
                $bookDetail = BookDetail::where('BookID', $id)->first();
                
                if ($bookDetail) {
                    \Log::info("Deleting book detail with ID: {$bookDetail->DetailID} for book: {$id}");
                    $bookDetail->delete();
                    \Log::info("Book detail deleted successfully");
                } else {
                    \Log::info("No book details found for book: {$id}");
                }
            }
            
            // Delete the book
            \Log::info("Deleting book with ID: {$id}");
            $book->delete();
            \Log::info("Book deleted successfully: {$id}");
            
            return response()->json([
                'success' => true,
                'message' => 'Book deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error("Error deleting book {$id}: " . $e->getMessage());
            \Log::error($e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    // Featured books
    public function featured()
    {
        try {
            $featuredBooks = Book::with('category')
                ->orderBy('CreatedAt', 'desc')
                ->take(8)
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $featuredBooks
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    // Related books
    public function related($id)
    {
        try {
            $book = Book::find($id);
            
            if (!$book) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book not found'
                ], 404);
            }
            
            // Get books in the same category
            $relatedBooks = Book::where('BookID', '!=', $id)
                ->where('CategoryID', $book->CategoryID)
                ->with('category')
                ->take(4)
                ->get();
                
            return response()->json([
                'success' => true,
                'data' => $relatedBooks
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function search(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'query' => 'required|string|min:2',
                'per_page' => 'nullable|integer|min:1|max:50',
                'category_id' => 'nullable|exists:tbCategory,CategoryID',
                'min_price' => 'nullable|numeric|min:0',
                'max_price' => 'nullable|numeric|min:0',
                'format' => 'nullable|in:Hardcover,Paperback,Ebook,Audiobook',
                'language' => 'nullable|string',
                'in_stock' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $query = Book::with(['category', 'bookDetail']);
            
            // Search in multiple fields
            $searchTerm = $request->input('query');
            $query->where(function($q) use ($searchTerm) {
                $q->where('Title', 'LIKE', "%{$searchTerm}%")
                ->orWhere('Author', 'LIKE', "%{$searchTerm}%")
                ->orWhereHas('bookDetail', function($q) use ($searchTerm) {
                    $q->where('Publisher', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('ISBN10', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('ISBN13', 'LIKE', "%{$searchTerm}%")
                        ->orWhere('Description', 'LIKE', "%{$searchTerm}%");
                });
            });
            
            // Apply additional filters
            if ($request->has('category_id')) {
                $query->where('CategoryID', $request->category_id);
            }
            
            if ($request->has('min_price')) {
                $query->where('Price', '>=', $request->min_price);
            }
            
            if ($request->has('max_price')) {
                $query->where('Price', '<=', $request->max_price);
            }
            
            if ($request->has('format')) {
                $query->whereHas('bookDetail', function($q) use ($request) {
                    $q->where('Format', $request->format);
                });
            }
            
            if ($request->has('language')) {
                $query->whereHas('bookDetail', function($q) use ($request) {
                    $q->where('Language', 'LIKE', "%{$request->language}%");
                });
            }
            
            if ($request->has('in_stock') && $request->in_stock) {
                $query->where('StockQuantity', '>', 0);
            }
            
            // Pagination
            $perPage = $request->get('per_page', 15);
            $books = $query->paginate($perPage);
            
            return response()->json([
                'success' => true,
                'data' => $books->items(),
                'meta' => [
                    'total' => $books->total(),
                    'per_page' => $books->perPage(),
                    'current_page' => $books->currentPage(),
                    'last_page' => $books->lastPage(),
                    'query' => $searchTerm,
                    'filters' => $request->only(['category_id', 'min_price', 'max_price', 'format', 'language', 'in_stock']),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
        private function getS3KeyFromUrl($url)
    {
        $parsedUrl = parse_url($url);
        if (isset($parsedUrl['path'])) {
            return ltrim($parsedUrl['path'], '/');
        }
        return null;
    }
    
    // Add your image retrieval method similar to your other project
    public function getImage($id)
    {
        try {
            $book = Book::find($id);
            
            if (!$book || empty($book->Image)) {
                return response()->json(['message' => 'Image not found'], 404);
            }
            
            // Create S3 client
            $s3 = new S3Client([
                'version' => 'latest',
                'region' => env('AWS_DEFAULT_REGION', 'ap-southeast-1'),
                'credentials' => [
                    'key' => env('AWS_ACCESS_KEY_ID'),
                    'secret' => env('AWS_SECRET_ACCESS_KEY'),
                ],
            ]);
            
            $key = $this->getS3KeyFromUrl($book->Image);
            
            // Generate a pre-signed URL
            $presignedUrl = $s3->createPresignedRequest(
                $s3->getCommand('GetObject', [
                    'Bucket' => env('AWS_BUCKET'),
                    'Key' => $key,
                ]),
                '+5 minutes'
            )->getUri()->__toString();
            
            return redirect($presignedUrl);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\BookDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookDetailController extends Controller
{
    public function index()
    {
        try {
            $bookDetails = BookDetail::with('book')->get();
            return response()->json([
                'success' => true,
                'data' => $bookDetails
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
            \Log::info("Book detail store request data:", $request->all());
            
            $validator = Validator::make($request->all(), [
                'BookID' => 'required|exists:tbBook,BookID',
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
                'Description' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                \Log::warning("Book detail validation failed:", $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            try {
                // Check if a detail record already exists for this book
                $existingDetail = BookDetail::where('BookID', $request->BookID)->first();
                
                if ($existingDetail) {
                    \Log::info("Book detail already exists for book ID: {$request->BookID}, updating instead of creating");
                    
                    // Instead of returning an error, let's update the existing record
                    $existingDetail->fill($request->all());
                    $existingDetail->save();
                    
                    return response()->json([
                        'success' => true,
                        'data' => $existingDetail->load('book'),
                        'message' => 'Book detail updated successfully'
                    ]);
                }
                
                // Type cast numeric values
                $bookDetailData = $request->all();
                if (isset($bookDetailData['PublishYear'])) {
                    $bookDetailData['PublishYear'] = (int)$bookDetailData['PublishYear'];
                }
                if (isset($bookDetailData['PageCount'])) {
                    $bookDetailData['PageCount'] = (int)$bookDetailData['PageCount'];
                }
                if (isset($bookDetailData['Weight'])) {
                    $bookDetailData['Weight'] = (float)$bookDetailData['Weight'];
                }
                
                \Log::info("Creating book detail with data:", $bookDetailData);
                
                $bookDetail = BookDetail::create($bookDetailData);
                
                \Log::info("Book detail created successfully with ID: {$bookDetail->DetailID}");
                
                return response()->json([
                    'success' => true,
                    'data' => $bookDetail->load('book'),
                    'message' => 'Book detail created successfully'
                ], 201);
            } catch (\Exception $e) {
                \Log::error("Error saving book detail: " . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error("Unexpected error in BookDetailController@store: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $bookDetail = BookDetail::with('book')->find($id);
            
            if (!$bookDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book detail not found'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'data' => $bookDetail
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
            \Log::info("Book detail update request for ID {$id}:", $request->all());
            
            $validator = Validator::make($request->all(), [
                'BookID' => 'sometimes|required|exists:tbBook,BookID',
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
                'Description' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                \Log::warning("Book detail validation failed:", $validator->errors()->toArray());
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            try {
                $bookDetail = BookDetail::find($id);
                
                if (!$bookDetail) {
                    \Log::warning("Book detail not found for ID: {$id}");
                    return response()->json([
                        'success' => false,
                        'message' => 'Book detail not found'
                    ], 404);
                }
                
                // Process and prepare update data
                $updateData = $request->all();
                
                // Type cast numeric values
                if (isset($updateData['PublishYear'])) {
                    $updateData['PublishYear'] = (int)$updateData['PublishYear'];
                }
                if (isset($updateData['PageCount'])) {
                    $updateData['PageCount'] = (int)$updateData['PageCount'];
                }
                if (isset($updateData['Weight'])) {
                    $updateData['Weight'] = (float)$updateData['Weight'];
                }
                
                \Log::info("Updating book detail with data:", $updateData);
                
                $bookDetail->update($updateData);
                
                \Log::info("Book detail updated successfully");
                
                return response()->json([
                    'success' => true,
                    'data' => $bookDetail->fresh()->load('book'),
                    'message' => 'Book detail updated successfully'
                ]);
            } catch (\Exception $e) {
                \Log::error("Error updating book detail: " . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error("Unexpected error in BookDetailController@update: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $bookDetail = BookDetail::find($id);
            
            if (!$bookDetail) {
                return response()->json([
                    'success' => false,
                    'message' => 'Book detail not found'
                ], 404);
            }
            
            $bookDetail->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Book detail deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
    
    public function getByBookId($bookId)
    {
        try {
            \Log::info("Fetching book detail for book ID: {$bookId}");
            
            $bookDetail = BookDetail::where('BookID', $bookId)->first();
            
            if (!$bookDetail) {
                \Log::info("No book detail found for book ID: {$bookId}");
                return response()->json([
                    'success' => false,
                    'message' => 'Book detail not found for this book'
                ], 404);
            }
            
            \Log::info("Found book detail for book ID: {$bookId}", [
                'detail_id' => $bookDetail->DetailID,
                'fields' => $bookDetail->toArray()
            ]);
            
            return response()->json([
                'success' => true,
                'data' => $bookDetail
            ]);
        } catch (\Exception $e) {
            \Log::error("Error fetching book detail for book ID {$bookId}: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
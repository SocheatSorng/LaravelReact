<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Purchase::with('book');

            // Filter by date range
            if ($request->has('from_date')) {
                $query->whereDate('OrderDate', '>=', $request->from_date);
            }
            if ($request->has('to_date')) {
                $query->whereDate('OrderDate', '<=', $request->to_date);
            }

            // Filter by book
            if ($request->has('book_id')) {
                $query->where('BookID', $request->book_id);
            }

            // Sort purchases
            $sortField = $request->input('sort_by', 'OrderDate');
            $sortDirection = $request->input('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            // Paginate results
            $perPage = $request->input('per_page', 10);
            $purchases = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $purchases,
                'message' => 'Purchases retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve purchases: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'BookID' => 'required|exists:tbBook,BookID',
            'Quantity' => 'required|integer|min:1',
            'UnitPrice' => 'required|numeric|min:0',
            'PaymentMethod' => 'required|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $purchase = Purchase::create($request->all());

            // Update book stock
            $book = Book::find($request->BookID);
            $book->update([
                'StockQuantity' => $book->StockQuantity + $request->Quantity
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $purchase->load('book'),
                'message' => 'Purchase created successfully'
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $purchase = Purchase::with('book')->find($id);
            
            if (!$purchase) {
                return response()->json([
                    'success' => false,
                    'message' => 'Purchase not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $purchase,
                'message' => 'Purchase retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve purchase: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'Quantity' => 'sometimes|required|integer|min:1',
            'UnitPrice' => 'sometimes|required|numeric|min:0',
            'PaymentMethod' => 'sometimes|required|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $purchase = Purchase::find($id);
            
            if (!$purchase) {
                return response()->json([
                    'success' => false,
                    'message' => 'Purchase not found'
                ], 404);
            }

            // Calculate stock difference if quantity is being updated
            if ($request->has('Quantity')) {
                $quantityDiff = $request->Quantity - $purchase->Quantity;
                $book = Book::find($purchase->BookID);
                $book->update([
                    'StockQuantity' => $book->StockQuantity + $quantityDiff
                ]);
            }

            $purchase->update($request->all());

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => $purchase->fresh()->load('book'),
                'message' => 'Purchase updated successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();

            $purchase = Purchase::find($id);
            
            if (!$purchase) {
                return response()->json([
                    'success' => false,
                    'message' => 'Purchase not found'
                ], 404);
            }

            // Update book stock
            $book = Book::find($purchase->BookID);
            $book->update([
                'StockQuantity' => $book->StockQuantity - $purchase->Quantity
            ]);

            $purchase->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Purchase deleted successfully'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete purchase: ' . $e->getMessage()
            ], 500);
        }
    }
}

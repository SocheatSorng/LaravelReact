<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class UserController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = User::query();

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('FirstName', 'like', "%{$search}%")
                      ->orWhere('LastName', 'like', "%{$search}%")
                      ->orWhere('Email', 'like', "%{$search}%");
                });
            }

            // Filter by role
            if ($request->has('role')) {
                $query->where('Role', $request->role);
            }

            // Sorting
            $sortField = $request->input('sort_by', 'CreatedAt');
            $sortDirection = $request->input('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);

            // Pagination
            $perPage = $request->input('per_page', 10);
            $users = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $users,
                'message' => 'Users retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve users: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'FirstName' => 'required|string|max:50',
            'LastName' => 'required|string|max:50',
            'Email' => 'required|email|unique:tbUser,Email|max:100',
            'Password' => 'required|string|min:6',
            'Phone' => 'nullable|string|max:15',
            'Address' => 'nullable|string',
            'Role' => 'required|in:admin,user'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::create([
                'FirstName' => $request->FirstName,
                'LastName' => $request->LastName,
                'Email' => $request->Email,
                'Password' => Hash::make($request->Password),
                'Phone' => $request->Phone,
                'Address' => $request->Address,
                'Role' => $request->Role
            ]);

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $user = User::with(['orders'])->find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $user,
                'message' => 'User retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'FirstName' => 'sometimes|required|string|max:50',
            'LastName' => 'sometimes|required|string|max:50',
            'Email' => 'sometimes|required|email|unique:tbUser,Email,' . $id . ',UserID|max:100',
            'Password' => 'nullable|string|min:6',
            'Phone' => 'nullable|string|max:15',
            'Address' => 'nullable|string',
            'Role' => 'sometimes|required|in:admin,user'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            $updateData = $request->except(['Password']);
            if ($request->filled('Password')) {
                $updateData['Password'] = Hash::make($request->Password);
            }

            $user->update($updateData);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'User updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getStats()
    {
        try {
            // Get admin count
            $adminCount = User::where('Role', 'admin')->count();
            
            // Get new users in the last 30 days
            $thirtyDaysAgo = Carbon::now()->subDays(30);
            $newUsersCount = User::where('CreatedAt', '>=', $thirtyDaysAgo)->count();
            
            // Get active users count (all users for now)
            $activeUsersCount = User::count();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'adminCount' => $adminCount,
                    'newUsersCount' => $newUsersCount,
                    'activeUsersCount' => $activeUsersCount
                ],
                'message' => 'User statistics retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user statistics: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // Check if user has related records
            if ($user->orders()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete user with existing orders'
                ], 400);
            }

            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user: ' . $e->getMessage()
            ], 500);
        }
    }
}
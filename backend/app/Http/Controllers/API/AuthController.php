<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login a user and return a token
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Find the user by email
        $user = User::where('Email', $request->email)->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($request->password, $user->Password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Create token (in a real app, you'd use Laravel Sanctum or JWT)
        // For this example, we'll just create a simple token
        $token = bin2hex(random_bytes(40));

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->UserID,
                'firstName' => $user->FirstName,
                'lastName' => $user->LastName,
                'email' => $user->Email,
                'role' => $user->Role,
            ],
            'token' => $token,
            'message' => 'Login successful'
        ]);
    }

    /**
     * Get the authenticated user
     */
    public function me(Request $request)
    {
        // In a real app, this would use authentication middleware
        // For now, we'll mock this by returning an example user
        
        // Get user ID from request (in a real app, this would come from the auth middleware)
        $userId = $request->user_id;
        
        if (!$userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }
        
        $user = User::find($userId);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->UserID,
                'firstName' => $user->FirstName,
                'lastName' => $user->LastName,
                'email' => $user->Email,
                'role' => $user->Role,
            ],
            'message' => 'User retrieved successfully'
        ]);
    }

    /**
     * Logout the user
     */
    public function logout(Request $request)
    {
        // In a real app, this would invalidate the token
        // For now, we'll just return a success response
        
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
} 
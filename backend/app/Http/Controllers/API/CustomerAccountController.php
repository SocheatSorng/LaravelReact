<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CustomerAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CustomerAccountController extends Controller
{
    /**
     * Register a new customer account
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:tbCustomerAccount,Username|max:255',
            'email' => 'required|email|unique:tbCustomerAccount,Email|max:255',
            'password' => 'required|string|min:8',
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $account = CustomerAccount::create([
            'Username' => $request->username,
            'Email' => $request->email,
            'Password' => Hash::make($request->password),
            'FirstName' => $request->firstName,
            'LastName' => $request->lastName,
            'Phone' => $request->phone,
            'Address' => $request->address,
            'IsActive' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Account created successfully',
            'data' => $account
        ], 201);
    }

    /**
     * Login an existing customer account
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required_without:email|string|max:255',
            'email' => 'required_without:username|email|max:255',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Find account by username or email
        $account = null;
        if ($request->has('username')) {
            $account = CustomerAccount::where('Username', $request->username)->first();
        } else {
            $account = CustomerAccount::where('Email', $request->email)->first();
        }

        if (!$account || !Hash::check($request->password, $account->Password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid credentials'
            ], 401);
        }

        if (!$account->IsActive) {
            return response()->json([
                'status' => 'error',
                'message' => 'Account is inactive'
            ], 403);
        }

        // Update last login timestamp
        $account->LastLogin = now();
        $account->save();

        // Create token
        $token = $account->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'token' => $token,
            'data' => $account
        ]);
    }

    /**
     * Logout a customer account
     */
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Display the specified customer account
     */
    public function show(Request $request)
    {
        $account = $request->user();
        
        return response()->json([
            'status' => 'success',
            'data' => $account
        ]);
    }

    /**
     * Update customer account details
     */
    public function update(Request $request)
    {
        $account = $request->user();
        
        $validator = Validator::make($request->all(), [
            'username' => [
                'sometimes', 
                'string', 
                'max:255',
                Rule::unique('tbCustomerAccount', 'Username')->ignore($account->AccountID, 'AccountID')
            ],
            'email' => [
                'sometimes', 
                'email', 
                'max:255',
                Rule::unique('tbCustomerAccount', 'Email')->ignore($account->AccountID, 'AccountID')
            ],
            'firstName' => 'sometimes|string|max:255',
            'lastName' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'profileImage' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Map request fields to model fields
        $updateData = [];
        if ($request->has('username')) $updateData['Username'] = $request->username;
        if ($request->has('email')) $updateData['Email'] = $request->email;
        if ($request->has('firstName')) $updateData['FirstName'] = $request->firstName;
        if ($request->has('lastName')) $updateData['LastName'] = $request->lastName;
        if ($request->has('phone')) $updateData['Phone'] = $request->phone;
        if ($request->has('address')) $updateData['Address'] = $request->address;
        if ($request->has('profileImage')) $updateData['ProfileImage'] = $request->profileImage;

        $account->update($updateData);

        return response()->json([
            'status' => 'success',
            'message' => 'Account updated successfully',
            'data' => $account
        ]);
    }

    /**
     * Change account password
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'currentPassword' => 'required|string',
            'newPassword' => 'required|string|min:8|different:currentPassword',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $account = $request->user();

        if (!Hash::check($request->currentPassword, $account->Password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Current password is incorrect'
            ], 401);
        }

        $account->update([
            'Password' => Hash::make($request->newPassword)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully'
        ]);
    }

    /**
     * Deactivate a customer account
     */
    public function deactivate(Request $request)
    {
        $account = $request->user();
        
        $account->update([
            'IsActive' => false
        ]);

        // Logout by deleting tokens
        $account->tokens()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Account deactivated successfully'
        ]);
    }

    /**
     * Admin-only: List all customer accounts
     */
    public function index()
    {
        $accounts = CustomerAccount::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $accounts
        ]);
    }

    /**
     * Admin-only: Get a specific customer account by ID
     */
    public function getById($id)
    {
        $account = CustomerAccount::find($id);
        
        if (!$account) {
            return response()->json([
                'status' => 'error',
                'message' => 'Account not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $account
        ]);
    }

    /**
     * Admin-only: Activate or deactivate a customer account
     */
    public function toggleActivation(Request $request, $id)
    {
        $account = CustomerAccount::find($id);
        
        if (!$account) {
            return response()->json([
                'status' => 'error',
                'message' => 'Account not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'isActive' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $account->update([
            'IsActive' => $request->isActive
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Account activation status updated successfully',
            'data' => $account
        ]);
    }
} 
<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ApiKey;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class ApiKeyController extends Controller
{
    public function index()
    {
        try {
            $apiKeys = ApiKey::all();
            
            return response()->json([
                'success' => true,
                'data' => $apiKeys,
                'message' => 'API keys retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve API keys: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'expires_at' => 'nullable|date|after:today',
            'permissions' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Generate a random API key
            $key = Str::random(60);
            
            $apiKey = ApiKey::create([
                'name' => $request->name,
                'key' => $key,
                'expires_at' => $request->expires_at,
                'permissions' => $request->permissions,
                'active' => true
            ]);

            return response()->json([
                'success' => true,
                'data' => $apiKey,
                'message' => 'API key created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create API key: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $apiKey = ApiKey::findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $apiKey,
                'message' => 'API key retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve API key: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'active' => 'sometimes|boolean',
            'expires_at' => 'nullable|date|after:today',
            'permissions' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $apiKey = ApiKey::findOrFail($id);
            $apiKey->update($request->all());
            
            return response()->json([
                'success' => true,
                'data' => $apiKey,
                'message' => 'API key updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update API key: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $apiKey = ApiKey::findOrFail($id);
            $apiKey->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'API key deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete API key: ' . $e->getMessage()
            ], 500);
        }
    }

    // Regenerate API key
    public function regenerate($id)
    {
        try {
            $apiKey = ApiKey::findOrFail($id);
            
            // Generate a new key
            $newKey = Str::random(60);
            $apiKey->update(['key' => $newKey]);
            
            return response()->json([
                'success' => true,
                'data' => $apiKey,
                'message' => 'API key regenerated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to regenerate API key: ' . $e->getMessage()
            ], 500);
        }
    }
}
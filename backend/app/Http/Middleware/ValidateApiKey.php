<?php

namespace App\Http\Middleware;

use App\Models\ApiKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateApiKey
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check for API key in header or query parameter
        $key = $request->header('X-API-Key') ?? $request->query('api_key');

        if (!$key) {
            return response()->json([
                'success' => false,
                'message' => 'API key is missing'
            ], 401);
        }

        // Find and validate the API key
        $apiKey = ApiKey::where('key', $key)->first();

        if (!$apiKey || !$apiKey->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired API key'
            ], 401);
        }

        // Store API key in request for later use
        $request->attributes->set('api_key', $apiKey);

        return $next($request);
    }
}
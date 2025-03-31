<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PageContent;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class PageContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = PageContent::select('id', 'slug', 'title', 'description', 'type', 'status', 'created_at', 'updated_at');
            
            // Filter by type if provided
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }
            
            $pageContents = $query->orderBy('updated_at', 'desc')->get();
                
            return response()->json($pageContents);
        } catch (\Exception $e) {
            Log::error('Error fetching page contents: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching pages: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'slug' => 'required|string|max:255|unique:page_contents',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'content' => 'required',
            'type' => 'required|string|max:50',
            'status' => 'required|in:draft,published,archived',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Get content from request
            $content = $request->content;
            
            Log::info('Content type: ' . gettype($content));
            
            // Create the page content
            $pageContent = PageContent::create([
                'slug' => $request->slug,
                'title' => $request->title,
                'description' => $request->description,
                'content' => $content, // Let Laravel handle JSON conversion
                'type' => $request->type,
                'status' => $request->status,
            ]);

            return response()->json($pageContent, 201);
        } catch (\Exception $e) {
            Log::error('Error saving page content: ' . $e->getMessage());
            return response()->json(['message' => 'Error saving page content: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        try {
            $pageContent = PageContent::where('slug', $slug)->first();
            
            if (!$pageContent) {
                return response()->json(['message' => 'Page content not found'], 404);
            }
            
            return response()->json($pageContent);
        } catch (\Exception $e) {
            Log::error('Error fetching page content: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching page content: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $slug)
    {
        try {
            $pageContent = PageContent::where('slug', $slug)->first();
            
            if (!$pageContent) {
                return response()->json(['message' => 'Page content not found'], 404);
            }
            
            $validator = Validator::make($request->all(), [
                'title' => 'string|max:255',
                'description' => 'nullable|string',
                'content' => 'required',
                'type' => 'string|max:50',
                'status' => 'in:draft,published,archived',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $request->only(['title', 'description', 'status', 'type', 'content']);
            
            Log::info('Update content type: ' . gettype($request->content));
            
            // Update the page content
            $pageContent->update($data);
            
            return response()->json($pageContent);
        } catch (\Exception $e) {
            Log::error('Error updating page content: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating page content: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $slug)
    {
        try {
            $pageContent = PageContent::where('slug', $slug)->first();
            
            if (!$pageContent) {
                return response()->json(['message' => 'Page content not found'], 404);
            }
            
            $pageContent->delete();
            
            return response()->json(['message' => 'Page content deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting page content: ' . $e->getMessage());
            return response()->json(['message' => 'Error deleting page content: ' . $e->getMessage()], 500);
        }
    }
    
    /**
     * Get page content by slug for public viewing (published only)
     */
    public function getPublishedPage(string $slug, string $type = 'page')
    {
        try {
            $pageContent = PageContent::where('slug', $slug)
                                   ->where('type', $type)
                                   ->where('status', 'published')
                                   ->first();
            
            if (!$pageContent) {
                return response()->json(['message' => 'Page not found'], 404);
            }
            
            return response()->json($pageContent);
        } catch (\Exception $e) {
            Log::error('Error fetching published page: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching published page: ' . $e->getMessage()], 500);
        }
    }
}
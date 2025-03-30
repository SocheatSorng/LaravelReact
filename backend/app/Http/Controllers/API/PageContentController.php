<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PageContent;
use Illuminate\Support\Facades\Validator;

class PageContentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pageContents = PageContent::all();
        return response()->json($pageContents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'page_slug' => 'required|string|max:255|unique:tbPage_Contents',
            'title' => 'required|string|max:255',
            'content' => 'required',
            'status' => 'required|in:draft,published',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Get content from request
            $content = $request->content;
            
            \Log::info('Content type: ' . gettype($content));
            
            // Create the page content
            $pageContent = PageContent::create([
                'page_slug' => $request->page_slug,
                'title' => $request->title,
                'content' => $content, // Let Laravel handle JSON conversion
                'status' => $request->status,
                'created_by' => $request->user() ? $request->user()->id : null,
            ]);

            return response()->json($pageContent, 201);
        } catch (\Exception $e) {
            \Log::error('Error saving page content: ' . $e->getMessage());
            return response()->json(['message' => 'Error saving page content: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug)
    {
        $pageContent = PageContent::where('page_slug', $slug)->first();
        
        if (!$pageContent) {
            return response()->json(['message' => 'Page content not found'], 404);
        }
        
        return response()->json($pageContent);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $slug)
    {
        $pageContent = PageContent::where('page_slug', $slug)->first();
        
        if (!$pageContent) {
            return response()->json(['message' => 'Page content not found'], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'content' => 'required',
            'status' => 'in:draft,published',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $request->only(['title', 'status', 'content']);
            
            \Log::info('Update content type: ' . gettype($request->content));
            
            // Update the page content
            $pageContent->update($data);
            
            return response()->json($pageContent);
        } catch (\Exception $e) {
            \Log::error('Error updating page content: ' . $e->getMessage());
            return response()->json(['message' => 'Error updating page content: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $slug)
    {
        $pageContent = PageContent::where('page_slug', $slug)->first();
        
        if (!$pageContent) {
            return response()->json(['message' => 'Page content not found'], 404);
        }
        
        $pageContent->delete();
        
        return response()->json(['message' => 'Page content deleted successfully']);
    }
    
    /**
     * Get page content by slug for public viewing (published only)
     */
    public function getPublishedPage(string $slug)
    {
        $pageContent = PageContent::where('page_slug', $slug)
                                   ->where('status', 'published')
                                   ->first();
        
        if (!$pageContent) {
            return response()->json(['message' => 'Page not found'], 404);
        }
        
        return response()->json($pageContent);
    }
}
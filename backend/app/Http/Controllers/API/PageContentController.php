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
            // Process content - could be JSON string or already decoded
            $content = $request->content;
            if (is_string($content)) {
                $content = json_decode($content, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return response()->json(['errors' => ['content' => 'Invalid JSON format']], 422);
                }
            }
            
            $pageContent = PageContent::create([
                'page_slug' => $request->page_slug,
                'title' => $request->title,
                'content' => $content,
                'status' => $request->status,
                'created_by' => $request->user() ? $request->user()->id : null,
            ]);

            return response()->json($pageContent, 201);
        } catch (\Exception $e) {
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
            $data = $request->only(['title', 'status']);
            
            // Process content - could be JSON string or already decoded
            if ($request->has('content')) {
                $content = $request->content;
                if (is_string($content)) {
                    $content = json_decode($content, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        return response()->json(['errors' => ['content' => 'Invalid JSON format']], 422);
                    }
                }
                $data['content'] = $content;
            }
            
            $pageContent->update($data);
            
            return response()->json($pageContent);
        } catch (\Exception $e) {
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
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageContent extends Model
{
    protected $table = 'page_contents';
    
    protected $fillable = [
        'slug',
        'title',
        'description',
        'content',
        'type',
        'status',
    ];

    /**
     * Define how content is stored and retrieved
     */
    protected $casts = [
        'content' => 'json',
    ];
    
    /**
     * Ensure content is properly formatted as JSON when saving
     */
    public function setContentAttribute($value)
    {
        if (is_array($value)) {
            $this->attributes['content'] = json_encode($value);
        } else if (is_string($value)) {
            // Check if this is already a valid JSON string
            json_decode($value);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->attributes['content'] = $value;
            } else {
                $this->attributes['content'] = json_encode($value);
            }
        } else {
            $this->attributes['content'] = json_encode($value);
        }
    }
    
    /**
     * Return content as an array
     */
    public function getContentAttribute($value)
    {
        if (is_string($value)) {
            return json_decode($value, true);
        }
        return $value;
    }
}
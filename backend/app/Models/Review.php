<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'tbReview';
    protected $primaryKey = 'ReviewID';
    public $timestamps = false;
    
    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = null;

    protected $fillable = [
        'UserID',
        'BookID',
        'Rating',
        'Comment',
        'CreatedAt'
    ];

    protected $casts = [
        'CreatedAt' => 'datetime',
        'Rating' => 'integer'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function book()
    {
        return $this->belongsTo(Book::class, 'BookID', 'BookID');
    }
} 
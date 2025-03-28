<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $table = 'tbWishlist';
    protected $primaryKey = 'WishlistID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'BookID',
        'CreatedAt'
    ];

    protected $casts = [
        'CreatedAt' => 'datetime'
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

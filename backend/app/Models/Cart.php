<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $table = 'tbCart';
    protected $primaryKey = 'CartID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'BookID',
        'Quantity',
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

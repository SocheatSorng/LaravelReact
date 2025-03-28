<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $table = 'tbPurchase';
    protected $primaryKey = 'PurchaseID';
    public $timestamps = false;
    public $incrementing = true; // Enable auto-incrementing

    protected $fillable = [
        'BookID',
        'Quantity',
        'UnitPrice',
        'PaymentMethod',
        'OrderDate'
    ];

    protected $attributes = [
        'OrderDate' => null // Set default value for OrderDate
    ];

    protected $casts = [
        'OrderDate' => 'datetime',
        'UnitPrice' => 'decimal:2'
    ];

    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($model) {
            if (!$model->OrderDate) {
                $model->OrderDate = now();
            }
        });
    }

    // Relationships
    public function book()
    {
        return $this->belongsTo(Book::class, 'BookID', 'BookID');
    }
}

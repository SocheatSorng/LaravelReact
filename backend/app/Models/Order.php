<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $table = 'tbOrder';
    protected $primaryKey = 'OrderID';
    public $timestamps = false;

    protected $fillable = [
        'UserID',
        'AccountID',
        'OrderDate',
        'TotalAmount',
        'Status',
        'ShippingAddress',
        'PaymentMethod',
        'GuestEmail',
        'GuestName',
        'GuestPhone'
    ];

    protected $casts = [
        'OrderDate' => 'datetime',
        'TotalAmount' => 'decimal:2'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'UserID', 'UserID');
    }

    public function customerAccount()
    {
        return $this->belongsTo(CustomerAccount::class, 'AccountID', 'AccountID');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'OrderID', 'OrderID');
    }
}

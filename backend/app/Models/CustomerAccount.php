<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class CustomerAccount extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'tbCustomerAccount';
    protected $primaryKey = 'AccountID';
    public $timestamps = false;
    
    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = 'UpdatedAt';

    protected $fillable = [
        'Username',
        'Email',
        'Password',
        'FirstName',
        'LastName',
        'Phone',
        'Address',
        'IsActive',
        'ProfileImage',
    ];

    protected $hidden = [
        'Password',
        'RememberToken'
    ];

    protected $casts = [
        'CreatedAt' => 'datetime',
        'UpdatedAt' => 'datetime',
        'LastLogin' => 'datetime',
        'Password' => 'hashed',
        'IsActive' => 'boolean'
    ];

    // Relationships
    public function orders()
    {
        return $this->hasMany(Order::class, 'AccountID', 'AccountID');
    }

    public function cart()
    {
        return $this->hasMany(Cart::class, 'AccountID', 'AccountID');
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class, 'AccountID', 'AccountID');
    }
} 
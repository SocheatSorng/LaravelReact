<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'tbUser';
    protected $primaryKey = 'UserID';
    public $timestamps = false;
    
    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = null;

    protected $fillable = [
        'FirstName',
        'LastName',
        'Email',
        'Password',
        'Phone',
        'Address',
        'Role'
    ];

    protected $hidden = [
        'Password'
    ];

    protected $casts = [
        'CreatedAt' => 'datetime',
        'Password' => 'hashed'
    ];

    // Relationships
    public function orders()
    {
        return $this->hasMany(Order::class, 'UserID', 'UserID');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'UserID', 'UserID');
    }
}

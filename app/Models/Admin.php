<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin extends Authenticatable implements JWTSubject
{
    protected $table = 'admins';

    protected $fillable = ['name', 'email', 'password', 'role'];

    protected $hidden = ['password'];

    protected $casts = [
        'password' => 'hashed',
    ];

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }
}

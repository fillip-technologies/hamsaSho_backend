<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'contacts';

    protected $fillable = [
        'name', 'organization', 'designation', 'email', 'mobile',
        'city', 'hospital_type', 'beds', 'product', 'current_his',
        'message', 'status', 'admin_notes',
    ];
}

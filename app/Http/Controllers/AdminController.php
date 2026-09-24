<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdminController extends Controller
{
    // POST /api/admin/login  — public
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $admin = Admin::where('email', strtolower(trim($request->email)))->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid admin email or password.',
            ], 401);
        }

        $token = JWTAuth::fromUser($admin);

        return response()->json([
            'success' => true,
            'message' => 'Admin authenticated successfully.',
            'token'   => $token,
            'admin'   => [
                'id'    => $admin->id,
                'name'  => $admin->name,
                'email' => $admin->email,
                'role'  => $admin->role,
            ],
        ]);
    }

    // GET /api/admin/me  — protected
    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'admin'   => $request->admin,
        ]);
    }

    // GET /api/admin/db-status  — public
    public function dbStatus()
    {
        try {
            DB::connection()->getPdo();
            $connected = true;
        } catch (\Exception) {
            $connected = false;
        }

        return response()->json([
            'success'   => true,
            'connected' => $connected,
        ]);
    }
}

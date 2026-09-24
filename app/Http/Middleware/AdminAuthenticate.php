<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;

class AdminAuthenticate
{
    public function handle(Request $request, Closure $next): mixed
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized. Please log in as an administrator.',
            ], 401);
        }

        $admin = Admin::where('api_token', $token)->first();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Session expired or invalid. Please log in again.',
            ], 401);
        }

        $request->merge(['admin' => $admin]);

        return $next($request);
    }
}

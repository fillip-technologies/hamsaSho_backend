<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;

class AdminAuthenticate
{
    public function handle(Request $request, Closure $next): mixed
    {
        try {
            $admin = JWTAuth::parseToken()->authenticate();
            if (!$admin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin account not found or session expired.',
                ], 401);
            }
            $request->merge(['admin' => $admin]);
        } catch (TokenExpiredException) {
            return response()->json([
                'success' => false,
                'message' => 'Token expired. Please log in again.',
            ], 401);
        } catch (TokenInvalidException) {
            return response()->json([
                'success' => false,
                'message' => 'Token verification failed.',
            ], 401);
        } catch (JWTException) {
            return response()->json([
                'success' => false,
                'message' => 'Not authorized to access this route. Please log in as an administrator.',
            ], 401);
        }

        return $next($request);
    }
}

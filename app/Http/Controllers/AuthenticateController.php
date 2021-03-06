<?php

namespace App\Http\Controllers;

use App\Thread;
use App\User;
use Illuminate\Http\Request;

use AppHttpRequests;
use AppHttpControllersController;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class AuthenticateController extends Controller
{
    public function __construct(){
        $this->middleware('jwt.auth', ['except' => ['authenticate']]);
    }

    public function index($userID){
        return User::orderBy('created_at', 'desc')->find($userID)->threads()->paginate(5);
    }

    public function authenticate(Request $request){
        $credentials = $request->only('email', 'password');

        try{
            if (!$token = JWTAuth::attempt($credentials)){
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $exception){
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        return response()->json(compact('token'));
    }

    public function getAuthenticatedUser(){
        try{
            if (! $user = JWTAuth::parseToken()->authenticate()){
                return response()->json(['user_not_found'], 404);
            }
        } catch (TokenExpiredException $e){
            return response()->json(['token_expired'], $e->getStatusCode());
        } catch (TokenInvalidException $e){
            return response()->json(['token_invalid'], $e->getStatusCode());
        } catch (JWTException $e){
            return response()->json(['token_absent'], $e->getStatusCode());
        }

        return response()->json(compact('user'));
    }
}

<?php

namespace App\Http\Controllers;

use App\Thread;
use App\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function __construct(){
        $this->middleware('jwt.auth');
    }

    public function index(){
        return User::all();
    }

    public function getUsersForThread ($tid){
        return Thread::find($tid)->users()->get();
    }
}

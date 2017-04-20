<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Post;
use App\User;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct(){
        $this->middleware('jwt.auth');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $pid, $uid)
    {
        $post = Post::find($pid);
        $user = User::find($uid);
        $comment = new Comment($request->all());
        $comment->user_id = $user->id;

        $comment = $post->comments()->save($comment);
        return $comment;
    }
}
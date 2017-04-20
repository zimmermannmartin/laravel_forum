<?php

namespace App\Http\Controllers;

use App\Post;
use App\Thread;
use App\User;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function __construct(){
        $this->middleware('jwt.auth');
    }

    public function getComments4Post($postID){
        $comments = Post::find($postID)->comments()->get();

        foreach ($comments as $comment){
            $user = $comment->user()->get();
            $comment->user = $user[0]->name;
        }

        return $comments;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $tid, $uid){
        $thread = Thread::find($tid);
        $user = User::find($uid);
        $post = new Post($request->all());
        $post->user_id = 0;
        $post = $thread->posts()->save($post);
        $post->user()->associate($user)->save();
        return $post;
    }

    public function destroy($pid){
        $comments = Post::find($pid)->comments()->get();
        foreach ($comments as $comment){
            $comment->delete();
        }

        Post::destroy($pid);
    }
}

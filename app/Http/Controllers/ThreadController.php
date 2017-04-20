<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Post;
use App\Thread;
use App\User;
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    public function __construct(){
        $this->middleware('jwt.auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    public function getPosts4Thread($threadID){
        $posts = Thread::find($threadID)->posts()->get();

        foreach ($posts as $post){
            $user = $post->user()->get();
            $comments = $post->comments()->get();
            $post->user = $user[0]->name;
            $post->num_comments = $comments->count();

            // FOR LIST
            /*$comments = Post::find($post->id)->comments()->get();
            foreach ($comments as $comment){
                $comment_user = $comment->user()->get();
                $comment->user = $comment_user[0]->name;
            }
            $post->comments = $comments;*/
        }

        return $posts;
    }

    public function getThreadbyId($threadId){
        return Thread::find($threadId);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $userID)
    {
        $user = User::find($userID);
        $thread = Thread::create($request->all())->users()->save($user);
        return $thread;
        /*$newThread = Thread::create($request->all());
        unset($newThread['user']);
        $thread = User::find($userID)->threads()->create($newThread);
        Thread::find($thread->id)->users()->attach($userID);
        return $thread;*/
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

    }
}

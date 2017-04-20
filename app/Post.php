<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = ['title', 'content', 'thread_id', 'user_id'];

    public function comments(){
        return $this->hasMany('App\Comment');
    }

    public function thread(){
        return $this->belongsTo('App\Thread');
    }

    public function user(){
        return $this->belongsTo('App\User');
    }
}

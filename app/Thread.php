<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    protected $fillable = ['title', 'description'];

    public function posts(){
        return $this->hasMany('App\Post');
    }

    public function users(){
        return $this->belongsToMany('App\User', 'thread_user')->withTimestamps();
    }
}

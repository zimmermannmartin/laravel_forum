<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Route::group(['prefix' => 'api'], function (){
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
    Route::get('authenticate/{uid}', 'AuthenticateController@index');
    Route::post('thread/{uid}', 'ThreadController@store');
    Route::get('thread/{tid}', 'ThreadController@getPosts4Thread');
    Route::get('thread/get/{tid}', 'ThreadController@getThreadbyId');
    Route::get('post/{pid}', 'PostController@getComments4Post');
    Route::post('post/create/{tid}/{uid}', 'PostController@store');
    Route::delete('post/{pid}', 'PostController@destroy');
    Route::post('comment/create/{pid}/{uid}', 'CommentController@store');
});
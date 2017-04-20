<?php

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| Here you may define all of your model factories. Model factories give
| you a convenient way to create models for testing and seeding your
| database. Just tell the factory how a default model should look.
|
*/

/** @var \Illuminate\Database\Eloquent\Factory $factory */
$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});

$factory->define(App\Thread::class, function (Faker\Generator $faker){
   return [
       'title' => $faker->title,
       'description' => $faker->paragraph
   ];
});

$factory->define(App\Post::class, function (Faker\Generator $faker){
    return [
        'title' => $faker->title,
        'content' => $faker->paragraph,
        'thread_id' => App\Thread::all()->random()->id,
        'user_id' => App\User::all()->random()->id
    ];
});

$factory->define(App\Comment::class, function (Faker\Generator $faker){
    return [
        'content' => $faker->paragraph,
        'post_id' => App\Post::all()->random()->id,
        'user_id' => App\User::all()->random()->id
    ];
});
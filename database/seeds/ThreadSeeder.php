<?php

use Illuminate\Database\Seeder;

class ThreadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\Thread::class, 15)->create();
        foreach (App\Thread::all() as $thread){
            $thread->users()->attach(App\User::all()->random()->id);
            //$user->threads()->attach(App\Thread::all()->random()->id);
        }
    }
}

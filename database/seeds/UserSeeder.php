<?php

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        DB::table('users')->delete();

        $users = array(
            ['name' => 'John Doe', 'email' => 'john@doe.com', 'password' => Hash::make('secret')],
            ['name' => 'Max Mustermann', 'email' => 'max.mustermann@gmail.com', 'password' => Hash::make('secret')],
            ['name' => 'Sabine Wappler', 'email' => 'sabine@wappler.at', 'password' => Hash::make('secret')],
            ['name' => 'Peter Wappler', 'email' => 'peter@wappler.at', 'password' => Hash::make('secret')]
        );

        foreach ($users as $user){
            \App\User::create($user);
        }

        Model::reguard();
    }
}

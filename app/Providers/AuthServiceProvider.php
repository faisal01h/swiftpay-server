<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\User;
use App\Models\Transaction;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        //
        Gate::define('read-transaction', function (User $user) {
            $allowed = [
                "CEO",
                "CTO",
                "COO",
                "Finance",
                "Senior Software Engineer",
                "Junior Software Engineer",
                "Devops & QA",
                "Operations",
                "Customer Relations"
            ];
            $user->roles;
            foreach($user["roles"] as $role) {
                $role->detail;
                for($i = 0; $i < count($allowed); ++$i) {
                    if($role["detail"]["name"] === $allowed[$i]) return true;
                }
            }
            return false;
        });

        Gate::define('manual-transaction', function (User $user) {
            $allowed = [
                "CEO",
                "CTO",
                "COO",
                "CFO",
                "Operations"
            ];
            $user->roles;
            foreach($user["roles"] as $role) {
                $role->detail;
                for($i = 0; $i < count($allowed); ++$i) {
                    if($role["detail"]["name"] === $allowed[$i]) return true;
                }
            }
            return false;
        });

        Gate::define('management', function (User $user) {
            $allowed = [
                "CEO",
                "CTO",
                "COO",
                "CFO",
                "Human Resources"
            ];
            $user->roles;
            foreach($user["roles"] as $role) {
                $role->detail;
                for($i = 0; $i < count($allowed); ++$i) {
                    if($role["detail"]["name"] === $allowed[$i]) return true;
                }
            }
            return false;
        });

        Gate::define('management.set-role', function (User $user) {
            $allowed = [
                "CEO",
                "CTO",
                "COO",
                "CFO"
            ];
            $user->roles;
            foreach($user["roles"] as $role) {
                $role->detail;
                for($i = 0; $i < count($allowed); ++$i) {
                    if($role["detail"]["name"] === $allowed[$i]) return true;
                }
            }
            return false;
        });
    }
}

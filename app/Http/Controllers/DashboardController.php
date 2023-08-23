<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Transaction;
use App\Traits\Transaction as TraitsTransaction;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    use TraitsTransaction;
    /**
     * Display the user's profile form.
     */
    public function index(Request $request) {

        $user = Auth::guard('web')->user();

        $roles = [];

        $user["roles"] = $user->roles;
        foreach($user["roles"] as $role) {
            $role->detail;
            $role->createdBy;
            array_push($roles, $role->detail->name);
        }
        // return response()->json($user);
        if($user->email_verified_at === null) {
            return Inertia::render('Onboarding', ["roles" => $roles]);
        } else {
            $data["transactions"] = Transaction::where('updated_at', '>=', Carbon::create(date('Y'), date('m'), date('d')-7))->get();
            // return response()->json($data["transactions"]);
            return Inertia::render('Dashboard', ["stats" => $data]);
        }


    }

    public function showTransactions(Request $request) {
        $user = Auth::guard('web')->user();

        $roles = [];

        $user["roles"] = $user->roles;
        foreach($user["roles"] as $role) {
            $role->detail;
            $role->createdBy;
            array_push($roles, $role->detail->name);
        }

        $searchQuery = $request->only(['user_identifier', 'invoice', 'ref_id', 'sold_price', 'status']);
        $searchQuery = array_filter($searchQuery, function ($a) {
            return $a !== null;
        });

        if(!Gate::allows('read-transaction', Auth::user())) {
            return Inertia::render('Errors/403');
        }
        $filteredData = $this->find($searchQuery);
        $stats["transactions"] = Transaction::where('updated_at', '>=', Carbon::create(date('Y'), date('m'), date('d')-7))->get();
        return Inertia::render('Transactions', [
            'stats' => $stats,
            'filteredData' => fn () => $filteredData,
        ]);

    }
}

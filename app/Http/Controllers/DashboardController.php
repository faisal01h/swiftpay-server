<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Userrole;
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
            $data["transactions"] = [
                "UNPAID" => Transaction::where('status', "UNPAID")->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
                "PENDING" => Transaction::where('status', "PENDING")->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
                "SUCCESS" => Transaction::where('status', "SUCCESS")->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
                "FAILED" => Transaction::where('status', "FAILED")->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
                "PEND_REFUND" => Transaction::where('status', TransactionStatus::PENDING_REFUND)->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
                "SUCC_REFUND" => Transaction::where('status', TransactionStatus::SUCCESS_REFUND)->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
                "CANC_REFUND" => Transaction::where('status', TransactionStatus::CANCELED_REFUND)->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
            ];
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
        // foreach($filteredData as $filteredDatum) {
        //     $filteredDatum->product;
        // }
        // $statistics = Transaction::where('updated_at', '>=', Carbon::create(date('Y'), date('m'), date('d')-7))->get();

        $stats["transactions"] = [
            "UNPAID" => Transaction::where('status', "UNPAID")->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
            "PENDING" => Transaction::where('status', "PENDING")->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
            "SUCCESS" => Transaction::where('status', "SUCCESS")->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
            "FAILED" => Transaction::where('status', "FAILED")->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
            "PEND_REFUND" => Transaction::where('status', TransactionStatus::PENDING_REFUND)->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
            "SUCC_REFUND" => Transaction::where('status', TransactionStatus::SUCCESS_REFUND)->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
            "CANC_REFUND" => Transaction::where('status', TransactionStatus::CANCELED_REFUND)->where('updated_at', '>=', Carbon::now()->subDays(7))->count(),
        ];
        return Inertia::render('Transactions', [
            'stats' => $stats,
            'filteredData' => fn () => $filteredData,
            'permissions' => [
                'manual_transaction' => Gate::allows('manual-transaction', Auth::user()),
            ]
        ]);

    }

    public function managementIndex(Request $request) {
        $user = Auth::guard('web')->user();

        if(!Gate::allows('management', $user)) {
            return Inertia::render('Errors/403');
        }

        $roles = [];

        $user["roles"] = $user->roles;
        foreach($user["roles"] as $role) {
            $role->detail;
            $role->createdBy;
            array_push($roles, $role->detail->name);
        }

        $employees = User::get();
        foreach($employees as $employee) {
            foreach($employee["roles"] as $role) {
                $role->detail;
                $role->createdBy;
            }
        }

        return Inertia::render('Management', [
            'employees' => $employees,
            'canAssignRole' => Gate::allows('management.set-role', $user),
            'roles' => Role::where('name', '<>', 'BOT')->where('name', '<>', 'Co-Founders')->orderByDesc('importance')->get(),
            'canDeleteUser' => Gate::allows('management.delete-user', $user)
        ]);
    }

    public function assignRole(Request $request) {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id'
        ]);

        $user = User::findOrFail($request->user_id);

        $count = Userrole::where('user_id', $request->user_id)->where('role_id', $request->role_id)->count();
        if($count > 0) {
            abort(400);
        }

        $userRole = Userrole::create([
            'user_id' => $request->user_id,
            'role_id' => $request->role_id,
            'created_by' => Auth::guard('web')->user()->id
        ]);

        if(!$user->email_verified_at) {
            $user->email_verified_at = Carbon::now();
            $user->save();
        }


        if($userRole) {
            return response()->json([
                "message" => "User role assigned!"
            ], 201);
        }
        abort(500);
    }

    public function removeRole(Request $request) {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id'
        ]);

        $count = Userrole::where('user_id', $request->user_id)->where('role_id', $request->role_id)->count();
        if($count === 0) {
            abort(404);
        }

        $userRole = Userrole::where('user_id', $request->user_id)->where('role_id', $request->role_id)->delete();

        return response()->json([
            "message" => "User role removed!"
        ], 200);
    }

    public function products(Request $request) {
        $products = Product::query();
        if($request->sku) {
            $products->where('sku', $request->sku);
        }
        if($request->name) {
            $products->where('name', 'LIKE', '%'.$request->name.'%');
        }
        $products = $products->get();

        foreach($products as $product) {
            $product->category;
            if($product->cutoff_start) $product->cutoff_start = date('H:i:s', $product->cutoff_start);
            if($product->cutoff_end) $product->cutoff_end = date('H:i:s', $product->cutoff_end);
        }

        $user = Auth::guard('web')->user();

        $roles = [];

        $user["roles"] = $user->roles;
        foreach($user["roles"] as $role) {
            $role->detail;
            $role->createdBy;
            array_push($roles, $role->detail->name);
        }

        return Inertia::render('Products', [
            'products' => $products,
            'categories' => Category::get()
        ]);
    }
}

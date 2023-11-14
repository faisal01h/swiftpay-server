<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Http\Requests\ProfileUpdateRequest;
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

class TransactionController extends Controller
{
    use TraitsTransaction;
    public function setStatus(Request $request) {
        $request->validate([
            'ref_id' => 'required|exists:'.Transaction::class,
            'status' => 'required|in:UNPAID,SUCCESS,PENDING,FAILED,PEND_REFUND,SUCC_REFUND,CANC_REFUND'
        ]);

        $status = $this->updateStatus($request->ref_id, $request->status);
        return Redirect::route('dashboard.transactions');
    }
}

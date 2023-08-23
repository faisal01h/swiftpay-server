<?php
namespace App\Http\Controllers;

use App\Enums\PaymentGateway;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use App\Traits\Payment;
use App\Traits\Transaction;
use Illuminate\Support\Facades\Gate;

class TransactionJwtController extends Controller
{
    use Transaction;

    public function __construct()
    {
        // $this->middleware('auth:api', ['except' => ['search']]);
    }

    public function search(Request $request)
    {
        $searchQuery = $request->only(['user_identifier', 'invoice', 'ref_id', 'sold_price', 'status']);
        $searchQuery = array_filter($searchQuery, function ($a) {
            return $a !== null;
        });

        if(!Gate::allows('read-transaction', Auth::user())) {
            return response()->json([
                "message" => "Unauthorized",
                "meta" => [
                    "search_query" => $searchQuery,
                ],
            ], 403);
        }

        $result = $this->find($searchQuery);
        $code = count($result) > 0 ? 200 : 404;
        return response()->json([
            "meta" => [
                "search_query" => $searchQuery
            ],
            "data" => $result
        ], $code);
    }

    public function update() {

    }
}

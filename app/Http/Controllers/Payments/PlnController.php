<?php
namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class PlnController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['checkSub']]);
    }

    public function checkSub(Request $request) {
        $request->validate([
            'subscriber_id' => 'required|string|min:8'
        ]);
        $result = Http::post("https://api.digiflazz.com/v1/transaction", [
            "commands" => "pln-subscribe",
            "customer_no" => $request->subscriber_id
        ]);
        $result = json_decode($result->body())->data;
        $code = $result->meter_no ? 200 :  404;

        return response()->json([
            "status" => $code === 200 ? "success" : "not found",
            "data" => $result
        ], $code);
    }

    public function listPrice(Request $request) {

    }

    public function setPrice(Request $request) {

    }

    public function disableCommodities(Request $request) {

    }

    public function enableCommodities(Request $request) {

    }

    public function panicCeaseOperation(Request $request) {

    }


}

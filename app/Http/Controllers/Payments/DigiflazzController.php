<?php
namespace App\Http\Controllers\Payments;

use App\Enums\PaymentGateway;
use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use App\Traits\Payment;
use Ramsey\Uuid\Rfc4122\UuidV6;

class DigiflazzController extends Controller
{
    use Payment;

    public function balanceCheck() {
        $url = "https://api.digiflazz.com/v1/cek-saldo";

    }

    public function create(Request $request) {
        $request->validate([
            "commodity" => "required|string",
            "payment_method" => "required|string",
            "phone_number" => "required",
            "commodity_kind" => "required", // "G: game / T: telco / X: other"
        ]);

        $invoice = "SWF$request->commodity_kind"."_".preg_replace('/[^A-Za-z0-9]/', '', UuidV6::uuid6());
        $ref_uuid = UuidV6::uuid4();
        $payload = [
            "name" => "",
            "user_identifier" => $request->phone_number,
            "commodity" => $request->commodity,
            "created_by" => 1,
            "invoice" => strtoupper($invoice),
            "ref_id" => strtoupper(preg_replace('/[^A-Za-z0-9]/', '', $ref_uuid)),
            "payment_method" => $request->payment_method,
            "source" => "digiflazz",
            "base_price" => 0,
            "sold_price" => 0,
            "status" => "UNPAID",
            "remarks" => "-",
        ];
        $payload["raw_json"] = json_encode([
            "initial_trx" => $payload
        ]);

        $trx = Transaction::create($payload);

        return response()->json($trx);
    }
}

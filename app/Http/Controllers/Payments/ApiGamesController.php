<?php
namespace App\Http\Controllers\Payments;

use App\Enums\PaymentGateway;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use App\Traits\Payment;
use App\Traits\Transaction;

class ApiGamesController extends Controller
{
    use Payment;
    use Transaction;

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['accountInfo', 'purchase', 'checkTransactionStatus']]);
    }

    public function accountInfo() {
        $uri = "https://v1.apigames.id/merchant/".env("APIGAMES_MERCHANT_ID")."/?signature=".md5(env("APIGAMES_MERCHANT_ID").env("APIGAMES_SECRET"));
        $result = Http::get($uri);
        $result = json_decode($result);

        return response()->json($result, $result->rc);
    }

    public function purchase(Request $request) {
        $uri = "https://v1.apigames.id/v2/transaksi";
        $refId = "SWIFT000TEST01".now();

        $ewalletMeta = [
            "channel_code" => "ID_DANA",
            "channel_properties" => [
                "success_redirect_url" => "https://swiftpay.com"
            ]
        ];

        $result = $this->pay(gateway: PaymentGateway::XENDIT, method: "ewallet", amountIdr: "6000", refId: $refId, ewalletMeta: $ewalletMeta);

        // $result = Http::post($uri, [
        //     "ref_id" => $refId,
        //     "merchant_id" => env("APIGAMES_MERCHANT_ID"),
        //     "produk" => $request->product,
        //     "tujuan" => $request->destination,
        //     "server_id" => "",
        //     "signature" => md5(env("APIGAMES_MERCHANT_ID").":".env("APIGAMES_SECRET").":".$refId)
        // ]);
        $result = json_decode($result);
        return response()->json($result);
    }

    public function checkTransactionStatus(Request $request) {
        $uri = "https://v1.apigames.id/v2/transaksi/status";
        $result = Http::post($uri, [
            "ref_id" => $request->reference_id,
            "merchant_id" => env("APIGAMES_MERCHANT_ID"),
            "produk" => $request->product,
            "tujuan" => $request->destination,
            "server_id" => "",
            "signature" => md5(env("APIGAMES_MERCHANT_ID").":".env("APIGAMES_SECRET").":".$request->reference_id)
        ]);
        $result = json_decode($result);
        return response()->json($result);
    }
}

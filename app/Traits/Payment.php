<?php
namespace App\Traits;

use App\Enums\PaymentGateway;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

trait Payment
{
    private $xendit = [
        "qr" => "qr_codes",
        "ewallet" => "ewallets/charges"
    ];
    public function pay($gateway, string $method, int $amountIdr, string $refId, array $ewalletMeta = []) {
        switch($gateway) {
            case PaymentGateway::XENDIT:
                if(!$this->xendit[$method]) return false;
                $url = "https://api.xendit.co/".$this->xendit[$method];

                $auth = base64_encode(env("XENDIT_SECRET").":");

                $body = [
                    "reference_id" => $refId,
                    "currency" => "IDR",
                    "amount" => $amountIdr
                ];
                if($method === "qr") $body["type"] = "DYNAMIC";
                if($method === "ewallet") {
                    $join = [
                        "checkout_method" => "ONE_TIME_PAYMENT",
                        "channel_code" => $ewalletMeta["channel_code"],
                        "channel_properties" => $ewalletMeta["channel_properties"]
                    ];
                    $body = array_merge($body, $join);
                }

                return $this->post($url, $body, [
                    "Authorization" => "Basic $auth",
                    "api-version" => "2022-07-31"
                ]);
                break;
            default:
                return false;
        }
    }

    private function post($url, $body, $header = []) {
        $req = Http::withHeaders($header);
        // return json_encode($body);
        return $req->post($url, $body);
    }

    public function refund(Request $request) {
        $url = "https://api.xendit.co/ewallets/charges/$request->transaction_id/refunds";
        // check if user has Authorization:
            // role => ceo, cfo, operations
    }
}

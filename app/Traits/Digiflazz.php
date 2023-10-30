<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;

trait Digiflazz
{
    public function digiflazzPriceList($mode, $code = null) {
        $payload = [
            "cmd" => $mode,
            "username" => env('DIGIFLAZZ_API_USERNAME'),
            "sign" => md5(env("DIGIFLAZZ_API_USERNAME").env("DIGIFLAZZ_API_KEY")."pricelist")
        ];
        if($code) {
            $payload["code"] = $code;
        }
        $http = Http::post('https://api.digiflazz.com/v1/price-list', $payload);
        return $http['data'];
    }

    public function digiflazzPurchase($code, $destination, $referenceId) {
        $payload = [
            "username" => env("DIGIFLAZZ_API_USERNAME"),
            "code" => $code,
            "customer_no" => $destination,
            "ref_id" => $referenceId,
            "sign" => md5(env("DIGIFLAZZ_API_USERNAME").env("DIGIFLAZZ_API_KEY").$referenceId)
        ];
    }

    public function digiflazzPlnInquiry($destination) {
        $payload = [
            "commands" => "pln-subscribe",
            "customer_no" => $destination
        ];
        $http = Http::post('https://api.digiflazz.com/v1/transaction');
        return $http['data'];
    }
}

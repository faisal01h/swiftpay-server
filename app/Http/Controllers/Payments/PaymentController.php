<?php
namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class PaymentController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['getCommodities']]);
    }

    public function getCommodities(Request $request) {

        $payload = array();

        switch ($request->filter) {
            case 'merchant:mlbb':
                $payload = ["merch" => "mlbb"];
                break;
            case 'merchant:pulsa_indosat':
                $payload = ["merch" => "pulsa_indosat"];
                break;
            default:
                # code...
                break;
        }
        return response([
            "status" => "success",
            "data" => $payload
        ], 200);
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

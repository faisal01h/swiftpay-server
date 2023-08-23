<?php
namespace App\Traits;

use App\Enums\PaymentGateway;
use App\Models\Transaction as Transactions;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

trait Transaction
{
    private $findKey = [
        "user_identifier" => true,
        "invoice" => true,
        "ref_id" => true,
        "sold_price" => true,
        "status" => true
    ];
    public function find(array $keyValuePairs)
    {
        $query = DB::table('transactions');
        foreach($this->findKey as $key => $_value) {
            if(array_key_exists($key, $keyValuePairs)) {
                $query->where($key, $keyValuePairs[$key]);
            }
        }
        $result = $query->get();
        return $result;
    }

    public function create()
    {

    }

    public function updateStatus($status)
    {

    }

    public function modifyDestination()
    {

    }

    public function archive()
    {

    }
}

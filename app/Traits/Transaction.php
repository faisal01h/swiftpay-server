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
    public function find(array $keyValuePairs, $limit = 30)
    {
        $query = Transactions::query();
        foreach($this->findKey as $key => $_value) {
            if(array_key_exists($key, $keyValuePairs)) {
                $query->where($key, $keyValuePairs[$key]);
            }

        }
        if($limit > 0) {
            $query->limit($limit);
        }
        // $query->limit(25);
        // $result = $query->orderByDesc('updated_at')->get();
        $result = $query->get();
        foreach($result as $res) {
            $res->product;
        }
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

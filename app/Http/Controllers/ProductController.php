<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Userrole;
use App\Traits\Digiflazz;
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

class ProductController extends Controller
{
    use Digiflazz;
    public function pullDigiflazzPrices(Request $request) {
        $request->validate([
            'sku' => 'string',
            'mode' => 'in:prepaid,pasca'
        ], [
            'mode' => 'The accepted value for mode is either "prepaid" or "pasca"'
        ]);
        $pricelist = $this->digiflazzPriceList($request->mode, $request->sku);
        // return response()->json($pricelist);
        foreach($pricelist as $price) {
            //synchronize to db
            if(Product::where('sku', $price['buyer_sku_code'])->count() === 0) {
                Product::create([
                    'name' => $price['product_name'],
                    'description' => $price['desc'],
                    'category_id' => 1,
                    'sku' => $price['buyer_sku_code'],
                    'source' => 'digiflazz',
                    'max_price' => $price['price'],
                    'base_price' => $price['price'],
                    'discounted_price' => $price['price']+2000,
                    'selling_price' => $price['price']+2000,
                    'enabled' => true,
                    'cutoff_start' => null,
                    'cutoff_end' => null
                ]);
            }

            $product = Product::where('sku', $price['buyer_sku_code'])->first();
            if($request->pull_price) $product->base_price = $price['price'];
            $product->save();
        }
        return response()->json(Product::get());
    }
}

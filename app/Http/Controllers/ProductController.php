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
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

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
            } else {
                $product = Product::where('sku', $price['buyer_sku_code'])->first();
                $product->base_price = $price['price'];
                $product->max_price = $price['price'];
                $product->save();
            }


        }
        return response()->json(Product::get());
    }

    public function toggleEnabled(Request $request) {
        $request->validate([
            'sku' => 'required|exists:products,sku',
            'command' => 'required|in:enable,disable'
        ]);

        $product = Product::where('sku', $request->sku)->first();

        if($request->command == 'enable') {
            $product->enabled = true;
        } else {
            $product->enabled = false;
        }
        $product->save();

        return response()->json([
            'data' => $product
        ]);
    }

    public function viewEdit(Request $request, $sku) {
        $product = Product::where('sku', $sku)->first();
        if(!$product) {
            abort(404, "Product not found!");
        }
        $product->category;

        $user = Auth::guard('web')->user();

        $roles = [];

        $user["roles"] = $user->roles;
        foreach($user["roles"] as $role) {
            $role->detail;
            $role->createdBy;
            array_push($roles, $role->detail->name);
        }

        $categories = Category::get();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories
        ]);
    }

    public function edit(Request $request) {
        $request->validate([
            'sku' => 'required|exists:product,sku',
            'base_price' => 'numeric|min:1',
            'name' => 'string',
            'sku' => 'string|unique:products,sku',
            'selling_price' => 'numeric',
            'discounted_price' => 'numeric',
            // 'cutoff_start' => 'date',
            // 'cutoff_end' => 'date',
            'category_id' => 'numeric'
        ]);

        $product = Product::where('sku', $request->sku)->first();

        if($request->base_price && $request->base_price < $product->selling_price && $request->base_price < $product->discounted_price) {
            $product->base_price = $request->base_price;
            $product->save();
        }

        if($request->name) {
            $product->name = $request->name;
        }

        if($request->description) {
            $product->description = $request->description;
        }

        if($request->sku) {
            $product->sku = $request->sku;
        }

        if($request->selling_price && $request->selling_price > $product->base_price) {
            $product->selling_price = $request->selling_price;
            $product->save();
        }

        if($request->discounted_price && $request->discounted_price > $product->base_price) {
            $product->discounted_price = $request->discounted_price;
        }

        if($request->cutoff_start && $request->cutoff_end) {
            $product->cutoff_start = strtotime($request->cutoff_start);
            $product->cutoff_end = strtotime($request->cutoff_end);
        }

        if($request->category_id) {
            if(Category::findOrFail($request->category_id)) {
                $product->category_id = $request->category_id;
            }
        }

        $product->save();
        return Redirect::route('dashboard.products.edit', $product->sku);
    }

    public function delete(Request $request) {
        $request->validate([
            'sku' => 'required|exists:products,sku'
        ]);

        $product = Product::where('sku', $request->sku)->first();
        $product->delete();

        return response()->json([
            'message' => 'Deleted'
        ]);
    }

    public function addCategory(Request $request) {
        $request->validate([
            'name' => 'required|string',
            'slug' => 'required|unique:categories,slug',
            'prompt' => 'required|string|min:5'
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'prompt' => $request->prompt
        ]);

        return Redirect::route('dashboard.products');
    }

    public function categoryImageUpload(Request $request) {
        $request->validate([
            'type' => 'required|in:cover,image',
            'image' => 'required|image',
            'category_id' => 'required|exists:categories,id'
        ]);

        $category = Category::findOrFail($request->category_id);

        if($request->file()) {
            if($request->type === 'cover') {
                if($category->cover_image) {
                    Storage::disk('public')->delete($category->cover_image);
                }
                $fileName = $category->id.'c_'.Str::ulid().'.'.$request->file('image')->getClientOriginalExtension();
                $filePath = $request->file('image')->storeAs('media', $fileName, 'public');
                $category->cover_image = $filePath;
                $category->save();
            }

            if($request->type === 'image') {
                if($category->image) {
                    Storage::disk('public')->delete($category->image);
                }
                $fileName = $category->id.'i_'.Str::ulid().'.'.$request->file('image')->getClientOriginalExtension();
                $filePath = $request->file('image')->storeAs('media', $fileName, 'public');
                $category->image = $filePath;
                $category->save();
            }
        }

        return Redirect::route('dashboard.products');

    }
}

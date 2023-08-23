<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;


class ProfileJwtController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getProfile() {
        return response([
            "status" => "success",
            "data" => Auth::guard('api')->user()
        ], 200);
    }


}

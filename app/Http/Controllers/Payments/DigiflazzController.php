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

    class DigiflazzController extends Controller
    {
        use Payment;

        public function balanceCheck() {
            $url = "https://api.digiflazz.com/v1/cek-saldo";

        }
    }

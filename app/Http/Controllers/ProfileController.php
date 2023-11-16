<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

use function PHPSTORM_META\type;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
        $user = Auth::guard('web')->user();
        // $user->roles();
        foreach($user["roles"] as $role) {
            $role->detail;
            $role->createdBy;
        }

        $roles = json_decode(json_encode($user["roles"]), true);

        usort($roles, function ($a, $b) {
            return $a["detail"]["importance"] < $b["detail"]["importance"];
        });

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'roles' => $roles
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    public function destroyByAdmin(Request $request) {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $admin = User::findOrFail(Auth::guard('web')->user()->id);
        if(Gate::allows('management.delete-user') && $admin->id != $request->user_id) {
            $user = User::findOrFail($request->user_id);
            $user->delete();
            return response()->json([
                'message' => 'User deleted!'
            ]);
        }
        return response()->json([
            'message' => "Action forbidden"
        ], 403);

    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}

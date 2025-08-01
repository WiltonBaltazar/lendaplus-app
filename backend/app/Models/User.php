<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Filament\Panel;
use App\Traits\UUID;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Filament\Models\Contracts\HasName;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements HasName, MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, UUID, SoftDeletes, HasApiTokens, HasRoles;

    public function getFilamentName(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'profile_photo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected function fullName(): Attribute
    {
        return Attribute::get(
            fn() => "{$this->first_name} {$this->last_name}"
        );
    }
    // Relationship: User has many Subscriptions
    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    // Get the active subscription
    public function activeSubscription()
    {
        // return $this->hasOne(Subscription::class)->where('status', 'active')->where('end_date', '>', now());

        return $this->subscriptions()
        ->where('status', 'active')
        ->where('end_date', '>', now())
        ->first();
    }
    
    // User Model
    public function currentPlan()
    {
        return $this->activeSubscription ? $this->activeSubscription->plan : null;
    }

    public function hasActivePlan($planSlug = null)
    {
        $subscription = $this->activeSubscription;
        if (!$subscription) 
            return false;

        if ($planSlug) {
            return $subscription->plan->slug === $planSlug; 
        }

        return  true;
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->hasRole(['super-admin', 'admin']);
    }
}

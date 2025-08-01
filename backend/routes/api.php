<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\PageController;
use App\Http\Controllers\Api\V1\EbookController;
use App\Http\Controllers\Api\V1\EpisodeController;
use App\Http\Controllers\Api\V1\PodcastController;
use App\Http\Controllers\Api\V1\AudiobookController;
use App\Http\Controllers\Api\V1\NewsletterController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->get('/users', function (Request $request) {
    try {
        return response()->json(User::paginate(10));
    } catch (\Exception $e) {
        Log::error($e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
});

Route::prefix('v1')->group(function () {
    Route::get('termos-e-condicoes', [PageController::class, 'termsAndConditions']);
    Route::get('politicas-de-privacidade', [PageController::class, 'privacyPolicy']);
    Route::get('sobre-nos', [PageController::class, 'aboutUs']);

    Route::post('/signup', [AuthController::class, 'signup']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
});

// Add these routes for email verification
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verifyEmail'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');
    
    Route::post('/email/verification-notification', [AuthController::class, 'resendVerification'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

Route::prefix('v1')->group(function () {
    //create routes using resource api for ebooks, audiobooks, and newsletters
    // Ebooks API routes
    Route::get('/ebook/all-books', [EbookController::class, 'getAllEbooks']);
    Route::get('/ebook/show/{slug}', [EbookController::class, 'showBySlug']);
    Route::get('/ebook/{slug}', [EbookController::class, 'showDetailsBySlug']);
    Route::get('/ebbok/{filename}', [EbookController::class, 'getFile']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    Route::get('ebooks/latest-ebook', [EbookController::class, 'getLatestEbook']);
    Route::apiResource('ebooks', EbookController::class);


    // Audiobooks API routes
    // get latest audiobook
    Route::get('audiobooks/latest-audiobook', [AudiobookController::class, 'getLatestAudiobook']);
    // get audiobook by slug
    Route::get('audiobook/{slug}', [AudiobookController::class, 'showBySlug']);

    Route::apiResource('audiobooks', AudiobookController::class);

    // Newsletters API routes
    Route::get('newsletter/{slug}', [NewsletterController::class, 'showBySlug']);
    Route::apiResource('newsletters', NewsletterController::class);

    Route::apiResource('podcasts', PodcastController::class);
    Route::get('latest-episode', [PodcastController::class, 'getLatestPodcastEpisode']);
    Route::get('/podcasts/rumores-da-lenda', [PodcastController::class, 'getRumoresDaLenda']);
    //get episodes for slider
    Route::get('episodes-slider', [PodcastController::class, 'getEpisodesForSlider']);

    Route::get('episodes/{slug}', [EpisodeController::class, 'showBySlug']);

    Route::apiResource('episodes', EpisodeController::class);

    Route::get('latest-newsletter', [NewsletterController::class, 'getLatestNewsletter']);

    //Plans API routes
    Route::get('plans', [\App\Http\Controllers\Api\V1\PlanController::class, 'index'])->name('api.plan.index');
    Route::get('plans/{slug}', [\App\Http\Controllers\Api\V1\PlanController::class, 'show'])->name('api.plan.show');
    Route::post('plans', [\App\Http\Controllers\Api\V1\PlanController::class, 'store'])->name('api.plan.store');
    Route::put('plans/{plan}', [\App\Http\Controllers\Api\V1\PlanController::class, 'update'])->name('api.plan.update');
    Route::delete('plans/{plan}', [\App\Http\Controllers\Api\V1\PlanController::class, 'destroy'])->name('api.plan.destroy');


    // Route::get('ebooks',[EbookController::class, 'index'])->name('api.ebook.index');
    // Route::post('ebooks',[EbookController::class, 'store'])->name('api.ebook.store');
    // Route::get('ebooks/{ebook}',[EbookController::class, 'show'])->name('api.ebook.show');
    // Route::put('ebooks/{ebook}',[EbookController::class, 'update'])->name('api.ebook.update');
    // Route::delete('ebooks/{ebook}',[EbookController::class, 'destroy'])->name('api.ebook.destroy');
});

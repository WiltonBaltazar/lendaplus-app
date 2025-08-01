<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAudiobookRequest;
use App\Http\Requests\UpdateAudiobookRequest;
use App\Http\Resources\AudiobookResource;
use App\Models\Audiobook;

class AudiobookController extends Controller
{
    // getLatestAudiobook
    public function getLatestAudiobook()
    {
        // get latest audiobook limit by 3 order by date desc and return as a collection
        return AudiobookResource::collection(Audiobook::latest()->limit(1)->get());
    }

    // display audiobook by slug a show it's chapters and other details
    public function showBySlug($slug)
    {
        $audiobook = Audiobook::where('slug', $slug)->firstOrFail();

        return (new AudiobookResource($audiobook));
    }

   
}

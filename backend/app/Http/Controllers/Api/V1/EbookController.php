<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Ebook;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\EbookResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreEbookRequest;
use App\Http\Requests\UpdateEbookRequest;

class EbookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return EbookResource::collection(Ebook::paginate());
    }

    public function getLatestEbook()
    {


        $user = Auth::check();

        // Fetch the main ebook
        if ($user) {
            $ebook =  Ebook::where('is_free', 0)->latest()->limit(4)->get();
        } else {
            $ebook = Ebook::where('is_free', 1)->latest()->limit(4)->get();
        }


        return EbookResource::collection($ebook);
    }

    //Display all ebooks
    public function getAllEbooks()
    {
        return EbookResource::collection(Ebook::all());
    }

    public function showBySlug($slug)
    {
        $user = Auth::check();
        if ($user) {
            $ebook = Ebook::where('slug', $slug)->where('is_free', false)->firstOrFail();
        } else {
            $ebook = Ebook::where('slug', $slug)->where('is_free', true)->firstOrFail();
        }

        return (new EbookResource($ebook));
    }

    public function showDetailsBySlug($slug)
    {
        $user = Auth::check();

        // Dispatch a job to fetch other books in parallel
        if ($user) {
            $ebook = Ebook::where('slug', $slug)->where('is_free', 0)->firstOrFail();

            $otherBooks = Ebook::where('id', '!=', $ebook->id)
                ->where('is_free', 0)
                ->inRandomOrder()
                ->limit(4)
                ->get();
        } else {
            $ebook = Ebook::where('slug', $slug)->where('is_free', 1)->firstOrFail();
            $otherBooks =  Ebook::where('id', '!=', $ebook->id)
                ->where('is_free', 1)
                ->inRandomOrder()
                ->limit(4)
                ->get();
        }

        return response()->json([
            'ebook' => new EbookResource($ebook),
            'otherBooks' => EbookResource::collection($otherBooks),
        ]);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEbookRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Ebook $ebook)
    {
        return new EbookResource($ebook);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEbookRequest $request, Ebook $ebook)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ebook $ebook)
    {
        //
    }
}

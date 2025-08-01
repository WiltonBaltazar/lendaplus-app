<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Episode extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'podcast_id',
        'cover_image',
        'title',
        'slug',
        'description',
        'guest',
        'audio_file',
        'release_date',
        'duration',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'id' => 'integer',
        'release_date' => 'datetime',
        'podcast_id' => 'integer',
    ];

    //one episode belongs to a category_podcast
    public function podcast()
    {
        return $this->belongsTo(Podcast::class);
    }


}

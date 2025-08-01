<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Audiobook extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'audiobook_serie_id',
        'title',
        'slug',
        'cover_image',
        'year',
        'narrator',
    ];


    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
      protected $casts = [
        'id' => 'integer',
        'audiobook_serie_id' => 'integer',
    ];
    
    public function audiobookChapters(): HasMany
    {
        return $this->hasMany(AudiobookChapter::class);
    }

    public function audiobookSerie()
    {
        return $this->belongsTo(AudiobookSerie::class);
    }
}

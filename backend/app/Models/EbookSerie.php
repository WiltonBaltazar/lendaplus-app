<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EbookSerie extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'cover_image',
        'description'
    ];


    //one CategoryPodcast has one or many episodes
    public function episodes()
    {
        return $this->hasMany(Ebook::class);
    }
}

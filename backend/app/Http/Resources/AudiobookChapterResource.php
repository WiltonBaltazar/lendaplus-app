<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AudiobookChapterResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'audiobook_id' => $this->audiobook_id,
            'title' => $this->name,
            'audio_file' => url('storage/' . $this->audio_file),
            'image_cover' => url('storage/' . $this->image_cover),
        ];
    }
}

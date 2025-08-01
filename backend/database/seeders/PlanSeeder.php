<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::create([
            'name' => 'Premium',
            'duration_days' => 365,
            'description'=> '<ul><li>Acesso ao conteúdo gratuíto sem publicidades</li><li>Acesso a todos e-livros e áudiolivros</li><li>Participar de discussões online exclusivas para membros</li><li>Receber atualizações e lançamentos antecipados</li></ul>',
            'price' => 1800,
            'bg_color' => '#FFFFFF',
            'text_color' => '#000000',
            'slug' => Str::slug('Premium'),
        ]);

        Plan::create([
            'name' => 'Lendinhas',
            'duration_days' => 365,
            'description'=> '<ul><li>Acesso ao conteúdo gratuíto sem publicidades</li><li>Acesso à todo conteúdo exclusivo de Lendinhas</li><li>Receber Actualizações e lançamentos antecipados</li></ul>',
            'price' => 1200,
            'bg_color' => '##805DFF',
            'text_color' => '#ffffff',
            'slug' => Str::slug('Lendinhas'),
        ]);

        Plan::create([
            'name' => 'Premium + Lendinhas',
            'duration_days' => 365,
            'description'=> '<p>Se quiseres ter acesso ao conteúdo Premium e de Lendinhas, esse pacote é para ti.</p>',
            'price' => 2700,
            'bg_color' => '#000000',
            'text_color' => '#ffffff',
            'slug' => Str::slug('Premium + Lendinhas'),
        ]);

        
    
       
    }
}

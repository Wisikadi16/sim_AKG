<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form_Maternal extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_rujukan' => 'date',
        'atas_permintaan' => 'array',
        'petugas_pendamping' => 'array',
        'kondisi_saat_ini' => 'array',
        'tanda_syok' => 'array',
        'alasan_dirujuk' => 'array',
        'riwayat' => 'array',
        'fisik' => 'array',
        'lab' => 'array',
        'monitoring' => 'array',
        'handover' => 'array',
    ];

    public function pasien(){
        return $this->belongsTo('App\Models\Pasien','id_pasien');
    }

    public function form()
    {
        return $this->belongsTo('App\Models\Form', 'id_form');
    }
}
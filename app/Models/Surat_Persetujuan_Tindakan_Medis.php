<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Form;
use App\Models\Pasien;

class Surat_Persetujuan_Tindakan_Medis extends Model
{
    use HasFactory;
    protected $table = "surat_persetujuan_tindakan_medis";

    protected $fillable = [
        'id_form',
        'id_pasien',
        'nama',
        'umur',
        'jenis_kelamin',
        'alamat',
        'alamat_kelurahan',
        'alamat_kecamatan',
        'status_surat',
        'tindakan_medis',
        'terhadap',
        'memberikan_nama',
        'memberikan_umur',
        'memberikan_jenis_kelamin',
        'memberikan_alamat_kelurahan',
        'memberikan_alamat_kecamatan',
        'memberikan_alamat',
        'tambahan_pernyataan',
        'tgl_surat',
        'nama_saksi',
        'status_ttd_dokter_paramedis',
        'nama_dokter_paramedis',
    ];

    public function form()
    {
        return $this->belongsTo(Form::class, 'id_form', 'id');
    }

    public function pasien()
    {
        return $this->belongsTo(Pasien::class, 'id_pasien', 'id');
    }
}

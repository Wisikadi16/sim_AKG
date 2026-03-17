<?php

namespace App\Http\Controllers;

use App\Models\Form_Maternal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class FormMaternalController extends Controller
{
    public function store(Request $request)
    {
        Log::info('Maternal Store Payload:', $request->all());
        try {
            // Validasi dasar
            $validatedData = $request->validate([
                'nama_pasien' => 'nullable|string|max:255',
                'rs_tujuan' => 'nullable|string|max:255',
            ]);

            // Cek/Buat Pasien (Sama dengan alur di FormUmumController)
            // Cek/Buat Pasien (Sistem NON- dihapus, NIK murni dari input)
            // Cek/Buat Pasien (Perbaikan Jalur Pengambilan NIK)
            $identitas = $request->identitas_ibu; 
            $nik = $identitas['nik'] ?? null; 

            if ($nik == null || $nik == '') {
                $cari_pasien_non_nik = \App\Models\Pasien::where('nik', 'LIKE', 'NON%')->orderBy('id', 'desc')->first();
                if($cari_pasien_non_nik == null){
                    $nik = "NON-1";
                } else {
                    $get_nik = $cari_pasien_non_nik->nik;
                    $get_nomor = substr($get_nik, strlen("NON-"));
                    $nik = "NON-".((int)$get_nomor + 1);
                }
                $pasien = \App\Models\Pasien::create([
                    'nik' => $nik,
                    'nama' => $request->nama_pasien,
                    'tgl_lahir' => $request->tgl_lahir,
                    'alamat' => $request->alamat,
                ]);
            } else {
                $pasien = \App\Models\Pasien::where('nik', $nik)->first();
                if($pasien == null){
                    $pasien = \App\Models\Pasien::create([
                        'nik' => $nik,
                        'nama' => $request->nama_pasien,
                        'tgl_lahir' => $request->tgl_lahir,
                        'alamat' => $request->alamat,
                    ]);
                }
            }

            // Simpan data semua (Laravel tahu mana yg json berkat $casts di Model)
            $maternalData = Form_Maternal::create([
                'id_pasien' => $pasien->id,
                'nama_pasien' => $request->nama_pasien,
                'tanggal_lahir' => $request->tgl_lahir,
                'alamat' => $request->alamat,
                'rs_tujuan' => $request->rumah_sakit_rujukan['rs'] ?? null,
                'petugas_rs_tujuan' => $request->rumah_sakit_rujukan['petugas'] ?? null,
                'tanggal_rujukan' => isset($request->rumah_sakit_rujukan['tgl']) ? date('Y-m-d', strtotime($request->rumah_sakit_rujukan['tgl'])) : date('Y-m-d'),
                'jam_rujukan' => $request->rumah_sakit_rujukan['jam'] ?? date('H:i'),
                'atas_permintaan' => $request->atas_permintaan,
                'petugas_pendamping' => $request->petugas_pendamping,
                'kondisi_saat_ini' => $request->pemeriksaan_fisik,
                'tanda_syok' => $request->tanda_syok,
                'alasan_dirujuk' => $request->alasan_dirujuk,
                'riwayat' => $request->riwayat,
                'riwayat_lain' => $request->riwayat_lain,
                'fisik' => $request->fisik,
                'lab' => $request->lab,
                'lain_lain' => $request->lain_lain,
                'diagnosa' => $request->diagnosa,
                'penanganan' => $request->penanganan,
                'tindakan_therapy' => $request->tindakan_therapy,
                'monitoring' => $request->monitoring,
                'handover' => $request->handover,
                'ttd_penyerah' => $request->ttd_penyerah,
            ]);

            // Record ke tabel global `form` agar muncul di Catatan Medis
            $form = \App\Models\Form::create([
                'id_form' => $maternalData->id,
                'id_pembuat' => Auth::id() ?? 1,
                'id_pasien' => $pasien->id,
                'tgl_penanganan' => isset($request->tanggal_rujukan) ? date('Y-m-d', strtotime($request->tanggal_rujukan)) : date('Y-m-d'),
                'jenis' => 'form maternal' 
            ]);

            $maternalData->update(['id_form' => $form->id]);

            return response()->json("Berhasil simpan data");
        } catch (\Exception $e) {
            Log::error('Maternal Store Error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function perbarui(Request $request)
    {
        try {
            // 1. CARI DATA LAMA (Menggunakan id_form yang dikirim dari frontend)
            $maternalData = Form_Maternal::where('id_form', $request->id_form)->first();
            
            // Fallback: Jika tak ketemu pakai id_form, coba pakai id utama (antisipasi data lama)
            if (!$maternalData) {
                $maternalData = Form_Maternal::find($request->id_form);
            }

            // Jika benar-benar tidak ada di database
            if (!$maternalData) {
                return response()->json([
                    'error' => 'Data tidak ditemukan (ID: ' . $request->id_form . ')', 
                ], 404);
            }

            // 2. UPDATE DATA PASIEN
            $pasien = \App\Models\Pasien::find($maternalData->id_pasien);
            if ($pasien) {
                $identitas = $request->identitas_ibu;
                $pasien->update([
                    'nik' => $identitas['nik'] ?? $pasien->nik,
                    'nama' => $identitas['nama'] ?? $pasien->nama,
                    'tgl_lahir' => $identitas['tgl_lahir'] ?? $pasien->tgl_lahir,
                    'alamat' => $identitas['alamat'] ?? $pasien->alamat,
                    'alamat_kelurahan' => $identitas['kelurahan'] ?? $pasien->alamat_kelurahan,
                    'alamat_kecamatan' => $identitas['kecamatan'] ?? $pasien->alamat_kecamatan,
                    'no_telepon' => $identitas['no_telepon'] ?? $pasien->no_telepon,
                ]);
            }

            // 3. UPDATE DATA MATERNAL
            $maternalData->update([
                'nama_pasien' => $request->nama_pasien,
                'tanggal_lahir' => $request->tgl_lahir,
                'alamat' => $request->alamat,
                'rs_tujuan' => $request->rumah_sakit_rujukan['rs'] ?? null,
                'petugas_rs_tujuan' => $request->rumah_sakit_rujukan['petugas'] ?? null,
                'tanggal_rujukan' => isset($request->rumah_sakit_rujukan['tgl']) ? date('Y-m-d', strtotime($request->rumah_sakit_rujukan['tgl'])) : date('Y-m-d'),
                'jam_rujukan' => $request->rumah_sakit_rujukan['jam'] ?? date('H:i'),
                'atas_permintaan' => $request->atas_permintaan,
                'petugas_pendamping' => $request->petugas_pendamping,
                'kondisi_saat_ini' => $request->pemeriksaan_fisik,
                'tanda_syok' => $request->tanda_syok,
                'alasan_dirujuk' => $request->alasan_dirujuk,
                'riwayat' => $request->riwayat,
                'riwayat_lain' => $request->riwayat_lain,
                'fisik' => $request->fisik,
                'lab' => $request->lab,
                'lain_lain' => $request->lain_lain,
                'diagnosa' => $request->diagnosa,
                'penanganan' => $request->penanganan,
                'tindakan_therapy' => $request->tindakan_therapy,
                'monitoring' => $request->monitoring,
                'handover' => $request->handover,
                'ttd_penyerah' => $request->ttd_penyerah,
            ]);

            // 4. UPDATE DATA FORM GLOBAL (Jika ada tgl_penanganan yang berubah di tabel catatn medis)
            $formRecord = \App\Models\Form::find($maternalData->id_form);
            if ($formRecord) {
                $formRecord->update([
                    'id_pasien' => $maternalData->id_pasien,
                    'tgl_penanganan' => isset($request->rumah_sakit_rujukan['tgl']) ? date('Y-m-d', strtotime($request->rumah_sakit_rujukan['tgl'])) : $formRecord->tgl_penanganan,
                ]);
            }

            return response()->json("Berhasil perbarui data");
        } catch (\Exception $e) {
            Log::error('Maternal Update Error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function ref_form_maternal(Request $request){
        if($request->id_form==null){
            $data = Form_Maternal::get();
        }
        else{
            $data = Form_Maternal::with('pasien')->with('form')->where('id_form', $request->id_form)->first();
            
            // Fallback pencarian by primary ID (antisipasi data lama)
            if(!$data){
                $data = Form_Maternal::with('pasien')->with('form')->find($request->id_form);
            }
        }
        
        return response()->json($data);
    }

    public function edit($id){
        return \Inertia\Inertia::render('Dashboard/Index', [
            'id' => $id,
            'auth' => Auth::user(),
        ]);
    }

    public function print($id)
    {
        $data = Form_Maternal::findOrFail($id);
        
        // Return view print nanti, sementara kita return json untuk test
        return response()->json($data);
    }
}
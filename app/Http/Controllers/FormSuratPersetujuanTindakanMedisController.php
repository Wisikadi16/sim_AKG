<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Pasien;
use App\Models\Form;
use App\Models\Surat_Persetujuan_Tindakan_Medis;

class FormSuratPersetujuanTindakanMedisController extends Controller
{
    public function index()
    {
        return Inertia::render('Form/Form_Surat_Persetujuan_Tindakan_Medis');
    }

    public function tambah(Request $request)
    {
        // dd($request->all());

        // $cari_pasien_nama = Pasien::where('nama', 'LIKE', '%'.$request->nama.'%')->first();
        
        // if($cari_pasien_nama==null){
        //     $pasien = Pasien::create([
        //         // 'nik' => $nik,
        //         'nama' => $request->nama_pasien,
        //         'tgl_lahir' => $request->tgl_lahir,
        //         'alamat' => $request->alamat,
        //         'alamat_kelurahan' => $request->alamat_kelurahan,
        //         'alamat_kecamatan' => $request->alamat_kecamatan,
        //         'no_telepon' => $request->no_telepon,
        //     ]);
        // }
        // else{

        // }
            
        // if ($nik === null) {
        //     if($cari_pasien_non_nik==null){
        //         $nik = "NON-1";
        //     }
        //     else{
        //         $get_nik = $cari_pasien_non_nik->nik;
        //         $get_nomor = substr($get_nik, strlen("NON-"));
        //         $nik = "NON-".(int)$get_nomor + 1;
        //     }
        //     $pasien = Pasien::create([
        //         'nik' => $nik,
        //         'nama' => $request->nama_pasien,
        //         'tgl_lahir' => $request->tgl_lahir,
        //         'alamat' => $request->alamat,
        //         'alamat_kelurahan' => $request->alamat_kelurahan,
        //         'alamat_kecamatan' => $request->alamat_kecamatan,
        //         'no_telepon' => $request->no_telepon,
        //     ]);
        // }
        // else{
        //     $cari_pasien = Pasien::where('nik', $request->nik)->first();
        //     if($cari_pasien==null){
        //         $pasien = Pasien::create([
        //             'nik' => $request->nik,
        //             'nama' => $request->nama_pasien,
        //             'tgl_lahir' => $request->tgl_lahir,
        //             'alamat' => $request->alamat,
        //             'alamat_kelurahan' => $request->alamat_kelurahan,
        //             'alamat_kecamatan' => $request->alamat_kecamatan,
        //             'no_telepon' => $request->no_telepon,
        //         ]);
        //     }
        //     else{
        //         $pasien = Pasien::where('nik', $request->nik)->first(); 
        //     }
        // }

        // NIK Handling similar to Form Umum
        $nik = $request->nik;
        if ($nik === null || $nik === '') {
            $cari_pasien_non_nik = Pasien::where('nik', 'LIKE', 'NON%')->orderBy('nik', 'desc')->first();
            if($cari_pasien_non_nik==null){
                $nik = "NON-1";
            }
            else{
                $get_nik = $cari_pasien_non_nik->nik;
                $get_nomor = substr($get_nik, strlen("NON-"));
                $nik = "NON-".((int)$get_nomor + 1);
            }
            $pasien = Pasien::create([
                'nik' => $nik,
                'nama' => $request->yg_telah_memberikan_nama,
                'tgl_lahir' => $request->yg_telah_memberikan_tgl_lahir, // Assuming this will be added to request
                'alamat' => $request->yg_telah_memberikan_alamat,
                'alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                'alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
            ]);
        }
        else{
            $pasien = Pasien::where('nik', $request->nik)->first();
            if($pasien==null){
                $pasien = Pasien::create([
                    'nik' => $request->nik,
                    'nama' => $request->yg_telah_memberikan_nama,
                    'tgl_lahir' => $request->yg_telah_memberikan_tgl_lahir,
                    'alamat' => $request->yg_telah_memberikan_alamat,
                    'alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                    'alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
                ]);
            }
            else{
                $pasien->update([
                    'nama' => $request->yg_telah_memberikan_nama,
                    'tgl_lahir' => $request->yg_telah_memberikan_tgl_lahir,
                    'alamat' => $request->yg_telah_memberikan_alamat,
                    'alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                    'alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
                ]);
            }
        }

        $ar_nama_saksi[]=$request->nama_ttd_saksi;
        $form_surat_persetujuan_tindakan_medis = Surat_Persetujuan_Tindakan_Medis::create([
            'id_pasien' => $pasien->id,
            'nama' => $request->yg_bertanda_tangan_nama,
            'umur' => $request->yg_bertanda_tangan_umur,
            'jenis_kelamin' => $request->yg_bertanda_tangan_jenis_kelamin,
            'alamat' => $request->yg_bertanda_tangan_alamat,
            'alamat_kelurahan' => $request->yg_bertanda_tangan_alamat_kelurahan,
            'alamat_kecamatan' => $request->yg_bertanda_tangan_alamat_kecamatan,
            'status_surat' => $request->status_surat,
            'tindakan_medis' => $request->yg_telah_memberikan_tindakan_medis,
            'terhadap' => $request->yg_telah_memberikan_terhadap,
            'memberikan_nama' => $request->yg_telah_memberikan_nama,
            'memberikan_umur' => $request->yg_telah_memberikan_umur,
            'memberikan_jenis_kelamin' => $request->yg_telah_memberikan_jenis_kelamin,
            'memberikan_alamat' => $request->yg_telah_memberikan_alamat,
            'memberikan_alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
            'memberikan_alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
            'tambahan_pernyataan' => json_encode($request->tambahan_pernyataan),
            'tgl_surat' => $request->tgl_surat ? date('Y-m-d', strtotime($request->tgl_surat)) : null,
            'nama_saksi' => json_encode(array_merge($ar_nama_saksi, $request->nama_ttd_tambah_saksi)),
            'status_ttd_dokter_paramedis' => $request->status_ttd_dokter_paramedis,
            'nama_dokter_paramedis' => $request->nama_ttd_dokter_paramedis,
        ]);

        $form = Form::create([
            'id_form' => $form_surat_persetujuan_tindakan_medis->id,
            'id_pasien' => $pasien->id,
            'id_pembuat' => Auth::check() ? Auth::id() : 1,
            'tgl_penanganan' => $request->tgl_surat ? date('Y-m-d', strtotime($request->tgl_surat)) : date('Y-m-d'),
            'jenis' => 'form surat persetujuan tindakan medis' 
        ]);

        $form_surat_persetujuan_tindakan_medis->update(['id_form' => $form->id]);

        // return Redirect::route('form.surat_persetujuan_tindakan_medis');
        return response()->json("Berhasil simpan data");
    }
    public function ref_form_surat_persetujuan_tindakan_medis(Request $request)
    {
        if ($request->id == null) {
            $data = Surat_Persetujuan_Tindakan_Medis::get();
        } else {
            $form = Form::find($request->id);
            if($form) {
                $data = Surat_Persetujuan_Tindakan_Medis::with('pasien')->with('form')->where('id_form', $form->id)->first();
                if(!$data) $data = Surat_Persetujuan_Tindakan_Medis::with('pasien')->with('form')->find($form->id_form);
            } else {
                $data = Surat_Persetujuan_Tindakan_Medis::with('pasien')->with('form')->find($request->id);
            }
        }
        return response()->json($data);
    }

    public function perbarui(Request $request)
    {
        $form = Form::find($request->id);
        $data = Surat_Persetujuan_Tindakan_Medis::where('id_form', $form ? $form->id : $request->id)->first();
        if(!$data) $data = Surat_Persetujuan_Tindakan_Medis::find($form ? $form->id_form : $request->id);
        
        $ar_nama_saksi[]=$request->nama_ttd_saksi;
        
        // Update data pasien jika ada
        if ($data && $data->pasien) {
            $data->pasien->update([
                'nik' => $request->nik,
                'nama' => $request->yg_telah_memberikan_nama,
                'tgl_lahir' => $request->yg_telah_memberikan_tgl_lahir,
                'alamat' => $request->yg_telah_memberikan_alamat,
                'alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
                'alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
            ]);
        }

        $data->update([
            'nama' => $request->yg_bertanda_tangan_nama,
            'umur' => $request->yg_bertanda_tangan_umur,
            'jenis_kelamin' => $request->yg_bertanda_tangan_jenis_kelamin,
            'alamat' => $request->yg_bertanda_tangan_alamat,
            'alamat_kelurahan' => $request->yg_bertanda_tangan_alamat_kelurahan,
            'alamat_kecamatan' => $request->yg_bertanda_tangan_alamat_kecamatan,
            'status_surat' => $request->status_surat,
            'tindakan_medis' => $request->yg_telah_memberikan_tindakan_medis,
            'terhadap' => $request->yg_telah_memberikan_terhadap,
            'memberikan_nama' => $request->yg_telah_memberikan_nama,
            'memberikan_umur' => $request->yg_telah_memberikan_umur,
            'memberikan_jenis_kelamin' => $request->yg_telah_memberikan_jenis_kelamin,
            'memberikan_alamat' => $request->yg_telah_memberikan_alamat,
            'memberikan_alamat_kelurahan' => $request->yg_telah_memberikan_alamat_kelurahan,
            'memberikan_alamat_kecamatan' => $request->yg_telah_memberikan_alamat_kecamatan,
            'tambahan_pernyataan' => json_encode($request->tambahan_pernyataan),
            'tgl_surat' => $request->tgl_surat ? date('Y-m-d', strtotime($request->tgl_surat)) : null,
            'nama_saksi' => json_encode(array_merge($ar_nama_saksi, $request->nama_ttd_tambah_saksi)),
            'status_ttd_dokter_paramedis' => $request->status_ttd_dokter_paramedis,
            'nama_dokter_paramedis' => $request->nama_ttd_dokter_paramedis,
        ]);

        return response()->json("Berhasil perbarui data");
    }
}
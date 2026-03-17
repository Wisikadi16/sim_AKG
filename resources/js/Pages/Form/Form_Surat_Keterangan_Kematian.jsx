import React, { useState, useEffect, useRef, createRef } from "react";
import HeaderFormSurat from "@/Components/Headers/HeaderFormSurat";
import HeaderIdentitas from "@/Components/Headers/HeaderIdentitas";
import { useParams } from "react-router-dom";
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';

import { useReactToPrint } from 'react-to-print';
import { router } from "@inertiajs/react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Form_Surat_Keterangan_Kematian(props) {
    const { id } = useParams();
    const currentId = id || props.id;
    const [nomor_surat, set_nomor_surat] = useState({
        no_1: '',
        no_2: '',
        no_3: '',
    });

    const oc_nomor_surat = (e) => {
        const value = e.target.value;

        set_nomor_surat({
            ...nomor_surat,
            [e.target.name]: value,
        });
    }

    console.log(nomor_surat)

    const [jam_meninggal, set_jam_meninggal] = React.useState(dayjs(new Date));

    const [identitas, set_identitas] = useState({
        nik: '',
        nama: '',
        tempat_lahir: '',
        tgl_lahir: '',
        umur: '',
        jenis_kelamin: 'L',
        agama: '',
        alamat: '',
        alamat_kelurahan: '',
        alamat_kecamatan: '',
        tgl_meninggal: '',
        hari_meninggal: '',
        jam_meninggal: ((JSON.stringify(jam_meninggal.$H)).length == 1 ? "0" + jam_meninggal.$H : jam_meninggal.$H) + ":"
            + ((JSON.stringify(jam_meninggal.$m)).length == 1 ? "0" + jam_meninggal.$m : jam_meninggal.$m),
        // jam:React.useState(dayjs(new Date)),
        tgl_surat: '',
        nama_ttd_dokter: '',
    });

    const [get_nama_kecamatan, set_nama_kecamatan] = useState('-');
    const [get_nama_kelurahan, set_nama_kelurahan] = useState('-');
    const [get_semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [get_semua_kelurahan, set_semua_kelurahan] = useState([]);

    useEffect(() => {
        axios.post(window.location.origin + '/ref_kecamatan',
            {
                // kode_kecamatan:kode_kecamatan,
            }).then(function (response) {
                set_semua_kecamatan(response.data)
                // console.log(response)
            })

        axios.post(window.location.origin + '/ref_kelurahan',
            {
                kode_kecamatan: [],
            }).then(function (response) {
                set_semua_kelurahan(response.data)
                // console.log(response)
            })
    }, [])

    useEffect(() => {
        if (currentId) {
            axios.post(window.location.origin + '/ref_form_surat_keterangan_kematian', {
                id: currentId
            }).then(function (response) {
                const data = response.data;
                if (data) {
                    const no_surat = data.no_surat ? JSON.parse(data.no_surat) : ['', '', ''];
                    set_nomor_surat({
                        no_1: no_surat[0] || '',
                        no_2: no_surat[1] || '',
                        no_3: no_surat[2] || '',
                    });
                    set_identitas({
                        nik: data.pasien ? data.pasien.nik : '',
                        nama: data.nama || '',
                        tempat_lahir: data.tempat_lahir || '',
                        tgl_lahir: data.tgl_lahir || '',
                        umur: data.umur || '',
                        jenis_kelamin: data.jenis_kelamin || 'L',
                        agama: data.agama || '',
                        alamat: data.alamat || '',
                        alamat_kelurahan: data.alamat_kelurahan || '',
                        alamat_kecamatan: data.alamat_kecamatan || '',
                        tgl_meninggal: data.tgl_meninggal || '',
                        jam_meninggal: data.jam_meninggal || '',
                        tgl_surat: data.tgl_surat || '',
                        nama_ttd_dokter: data.nama_ttd_dokter || '',
                    });
                    if (data.jam_meninggal) set_jam_meninggal(dayjs(`2022-01-01 ${data.jam_meninggal}`));
                }
            })
        }
    }, [currentId])

    const oc_identitas = (e) => {
        if (e.$H != null) {
            var jam = JSON.stringify(e.$H);
            if (jam.length == 1) {
                jam = "0" + jam;
            }
            var menit = JSON.stringify(e.$m);
            if (menit.length == 1) {
                menit = "0" + menit;
            }

            set_identitas({
                ...identitas,
                ["jam_meninggal"]: jam + ":" + menit,
            });
        }
        else if (e.target.name == "alamat_kecamatan") {
            const value = e.target.value;
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            set_identitas(
                {
                    ...identitas,
                    ["alamat_kecamatan"]: option,
                });
            set_nama_kecamatan(value);

            //ganti kelurahan
            axios.post(window.location.origin + '/ref_kelurahan',
                {
                    kode_kecamatan: option,
                }).then(function (response) {
                    set_semua_kelurahan(response.data)
                    // console.log(response)
                })
        }
        else if (e.target.name == "tgl_lahir") {
            const value = e.target.value;
            set_identitas(
                {
                    ...identitas,
                    ["umur"]: hit_umur(value),
                    [e.target.name]: value,
                });
        }
        else if (e.target.name == "alamat_kelurahan") {
            const value = e.target.value;
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            set_identitas(
                {
                    ...identitas,
                    ["alamat_kelurahan"]: option,
                });
            set_nama_kelurahan(value);
        }
        else if (e.target.name == "tgl_meninggal") {
            const value = e.target.value;
            var nama_hari = [
                "Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"
            ];

            set_identitas({
                ...identitas,
                [e.target.name]: value,
                ["hari_meninggal"]: nama_hari[new Date(value).getDay()],
            });
        }
        else {
            const value = e.target.value;
            set_identitas({
                ...identitas,
                [e.target.name]: value,
            });
        }
    }

    console.log(identitas)

    let ref_ttd_dokter_ambulan = useRef({})

    const oc_hapus_ttd_dokter_ambulan = () => {
        // get_ttd_keluarga_pasien_petugas_rs.clear();
        ref_ttd_dokter_ambulan.current.clear();
    }

    const [isPrinting, setIsPrinting] = useState(false);
    const ref_print = useRef(null);
    const promiseResolveRef = useRef(null);

    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            promiseResolveRef.current();
        }
    }, [isPrinting]);

    function hit_umur(tgl_lahir) {
        var formattedDate = tgl_lahir.split("-")
        console.log("date" + formattedDate)
        var birthdateTimeStamp = new Date(formattedDate[0], (formattedDate[1] - 1), formattedDate[2])
        var currentDate = new Date().getTime();
        var difference = currentDate - birthdateTimeStamp;
        var currentAge = Math.floor(difference / 31557600000)
        // dividing by 1000*60*60*24*365.25
        return currentAge
    }

    const oc_print = useReactToPrint({
        content: () => ref_print.current,
        // documentTitle: 'emp-data',
        onBeforeGetContent: () => {
            return new Promise((resolve) => {
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint: () => setIsPrinting(false)
    })

    const oc_simpan = (e) => {
        const url = currentId ? '/form_surat_keterangan_kematian/perbarui' : '/form_surat_keterangan_kematian/simpan';
        
        // 1. Ambil data gambar tanda tangan (jika sudah diisi)
        let ttd_dokter_base64 = null;
        if (ref_ttd_dokter_ambulan.current && !ref_ttd_dokter_ambulan.current.isEmpty()) {
            ttd_dokter_base64 = ref_ttd_dokter_ambulan.current.getTrimmedCanvas().toDataURL('image/png');
        }

        axios.post(window.location.origin + url, {
            id: currentId,
            id_form: currentId, // Tambahan aman untuk backend
            no_surat_1: nomor_surat.no_1,
            no_surat_2: nomor_surat.no_2,
            no_surat_3: nomor_surat.no_3,
            nik: identitas.nik,
            nama: identitas.nama,
            tempat_lahir: identitas.tempat_lahir,
            tgl_lahir: identitas.tgl_lahir,
            jenis_kelamin: identitas.jenis_kelamin,
            agama: identitas.agama,
            alamat: identitas.alamat,
            alamat_kelurahan: identitas.alamat_kelurahan,
            alamat_kecamatan: identitas.alamat_kecamatan,
            tgl_meninggal: identitas.tgl_meninggal,
            jam_meninggal: identitas.jam_meninggal,
            tgl_surat: identitas.tgl_surat,
            nama_ttd_dokter: identitas.nama_ttd_dokter,
            ttd_dokter: ttd_dokter_base64 // 2. Kirim tanda tangan ke backend
        }).then(function (response) {
            toast.success(response.data, {
                position: "top-right",
            });
        }).catch(function (error) {
            // 3. Tampilkan error asli dari Laravel ke Console biar gampang dilacak
            console.log("Error Simpan:", error.response); 
            
            let msg = 'Gagal simpan data';
            if (error.response && error.response.data && error.response.data.message) {
                msg += ": " + error.response.data.message; // Tampilkan alasan gagal di Toast
            }
            
            toast.error(msg, {
                position: "top-right",
            });
        });
    }

    return (
        <div className="mb-3">
            <ToastContainer />
            <div className="flex justify-center">
                <a href="/catatan_medis"
                    className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                    Kembali
                </a>
            </div>
            <div ref={ref_print}>
                <HeaderIdentitas
                    isPrinting={isPrinting}
                    data={identitas}
                    onChange={set_identitas}
                />

                <div className="flex justify-center font-bold text-[20px] underline mt-3">SURAT KETERANGAN KEMATIAN</div>

                {/* ... existing nomor surat logic ... */}
                <div className="flex justify-center mb-3">
                    <div>Nomor :</div>
                    <div className="flex">
                        {isPrinting ? (
                            <div>{nomor_surat.no_1}</div>
                        ) : (
                            <input className="w-12 px-1 text-sm border-b focus:outline-none" name="no_1" type="text" onChange={oc_nomor_surat} value={nomor_surat.no_1}></input>
                        )}
                        <div className="mx-1">/ ADM / AH /</div>
                        {isPrinting ? (
                            <div>{nomor_surat.no_2}</div>
                        ) : (
                            <input className="w-12 px-1 text-sm border-b focus:outline-none" name="no_2" type="text" onChange={oc_nomor_surat} value={nomor_surat.no_2}></input>
                        )}
                        <div className="mx-1">/</div>
                        {isPrinting ? (
                            <div>{nomor_surat.no_3}</div>
                        ) : (
                            <input className="w-12 px-1 text-sm border-b focus:outline-none" name="no_3" type="text" onChange={oc_nomor_surat} value={nomor_surat.no_3}></input>
                        )}
                    </div>
                </div>

                <div className="ml-5 mr-5">
                    <div className="mb-4">Yang bertanda tangan dibawah ini, Dokter Ambulance Hebat Dinas Kesehatan Kota Semarang menerangkan dengan sebenarnya bahwa :</div>
                    <div className="ml-3 space-y-1">
                        {/* NAMA - Sudah di Header, tapi kalau mau tetap ada di teks surat: */}
                        <div className="flex">
                            <div className="w-[25%] font-semibold">Nama</div>
                            <div>:</div>
                            <div className="w-[75%] px-2">{identitas.nama}</div>
                        </div>

                        {/* TEMPAT / TGL LAHIR */}
                        <div className="flex">
                            <div className="w-[25%] font-semibold">Tempat / Tanggal Lahir</div>
                            <div>:</div>
                            <div className="flex w-[75%] px-2">
                                {!isPrinting ? (
                                    <input className="border-b focus:outline-none px-1" type="text" name="tempat_lahir" onChange={oc_identitas} value={identitas.tempat_lahir} placeholder="Tempat Lahir" />
                                ) : (
                                    <div>{identitas.tempat_lahir}</div>
                                )}
                                <span className="mx-2">/</span>
                                <div>{identitas.tgl_lahir}</div>
                            </div>
                        </div>

                        {/* UMUR */}
                        <div className="flex">
                            <div className="w-[25%] font-semibold">Umur</div>
                            <div>:</div>
                            <div className="w-[75%] px-2">{identitas.umur} Tahun</div>
                        </div>

                        {/* JENIS KELAMIN */}
                        <div className="flex">
                            <div className="w-[25%] font-semibold">Jenis Kelamin</div>
                            <div>:</div>
                            <div className="w-[75%] px-2">
                                {!isPrinting ? (
                                    <select className="border-b focus:outline-none py-0" name="jenis_kelamin" onChange={oc_identitas} value={identitas.jenis_kelamin}>
                                        <option value="L">Laki-Laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                ) : (
                                    <div>{identitas.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</div>
                                )}
                            </div>
                        </div>

                        {/* AGAMA */}
                        <div className="flex">
                            <div className="w-[25%] font-semibold">Agama</div>
                            <div>:</div>
                            <div className="w-[75%] px-2">
                                {!isPrinting ? (
                                    <input className="w-full border-b focus:outline-none px-1" type="text" name="agama" onChange={oc_identitas} value={identitas.agama}></input>
                                ) : (
                                    <div>{identitas.agama}</div>
                                )}
                            </div>
                        </div>

                        {/* ALAMAT */}
                        <div className="flex">
                            <div className="w-[25%] font-semibold">Alamat</div>
                            <div>:</div>
                            <div className="w-[75%] px-2">{identitas.alamat}</div>
                        </div>
                    </div>
                    <div className="mt-3">
                        Telah meninggal dunia pada :
                    </div>
                    <div className="ml-3">
                        <div className="flex">
                            <div className="w-[25%]">Hari / Tanggal</div>
                            <div>:</div>
                            <div className="w-[7%]">
                                {identitas.hari_meninggal}
                            </div>
                            <div className="w-[68%]">
                                {
                                    isPrinting == false &&
                                    <input className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white" type="date" name="tgl_meninggal" onChange={oc_identitas} value={identitas.tgl_meninggal}></input>
                                }
                                {
                                    isPrinting &&
                                    <div>{identitas.tgl_meninggal.slice(8, 10) + "/" + identitas.tgl_meninggal.slice(5, 7) + "/" + identitas.tgl_meninggal.slice(0, 4)}</div>
                                }
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-[25%]">Pukul</div>
                            <div>:</div>
                            <div className="w-[75%]">
                                {
                                    isPrinting == false &&
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <MobileTimePicker
                                            value={jam_meninggal}
                                            // name="jam_meninggal"
                                            onChange={oc_identitas} ampm={false} />
                                    </LocalizationProvider>
                                }
                                {
                                    isPrinting &&
                                    <div>{identitas.jam_meninggal}</div>
                                }

                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        Demikian Surat Keterangan Kematian ini dibuat dengan sebenarnya-benarnya dan digunakan sebagaimana mestinya.
                    </div>
                    <div className="flex justify-end mt-3">
                        <div>Semarang,</div>
                        <div>
                            {
                                isPrinting == false &&
                                <input className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white" type="date" name="tgl_surat" onChange={oc_identitas} value={identitas.tgl_surat}></input>
                            }
                            {
                                isPrinting &&
                                <div>{identitas.tgl_surat.slice(8, 10) + "/" + identitas.tgl_surat.slice(5, 7) + "/" + identitas.tgl_surat.slice(0, 4)}</div>
                            }
                        </div>
                    </div>
                    <div className="flex justify-end mt-3">
                        <div>
                            <div className="flex justify-center">
                                Dokter Ambulance Hebat
                            </div>
                            <div>
                                <SignatureCanvas
                                    canvasProps={{ className: 'sigCanvas w-full h-full' }}
                                    ref={ref_ttd_dokter_ambulan}
                                // onEnd={oe_ttd_saksi}
                                />
                            </div>
                            <div>
                                {
                                    isPrinting == false &&
                                    <input className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:border-red-500 focus:ring-red-500/20 shadow-sm transition-all bg-white" type="text" name="nama_ttd_dokter" onChange={oc_identitas} value={identitas.nama_ttd_dokter}></input>
                                }
                                {
                                    isPrinting &&
                                    <div className="flex justify-center">{identitas.nama_ttd_dokter}</div>
                                }
                            </div>
                            {
                                isPrinting == false &&
                                <div className="flex justify-center">
                                    <button type="button"
                                        onClick={oc_hapus_ttd_dokter_ambulan}
                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div>

                </div>
                {
                    isPrinting == false &&
                    <div className="flex justify-center mt-5 ">
                        <button type="button" onClick={oc_simpan} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Simpan
                        </button>
                        <button type="button" onClick={oc_print} className="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Print
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}
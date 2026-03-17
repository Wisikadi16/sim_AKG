import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import HeaderLogo from "@/Components/Headers/HeaderLogo";
import Identitas_Tim from "@/Components/Form/Identitas_Tim";

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { createTheme } from "@mui/system";
import { TextField } from "@mui/material";

import { styled } from '@mui/material/styles';

import SignatureCanvas from 'react-signature-canvas';
import { useReactToPrint } from 'react-to-print';
import HeaderFormMaternal from "@/Components/Headers/HeaderFormMaternal";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderIdentitas from "@/Components/Headers/HeaderIdentitas";


export default function Form_Maternal(props) {
    const { id } = useParams();
    const currentId = id || props.id;
    const [isPrinting, setIsPrinting] = useState(false);

    const [jam_lahir_identitas_bayi, set_jam_lahir_identitas_bayi] = React.useState(dayjs(new Date))

    const [identitas_bayi, set_identitas_bayi] = useState({
        nama_pasien: "",
        tgl_lahir: "",
        jam_lahir: ((JSON.stringify(jam_lahir_identitas_bayi.$H)).length == 1 ? "0" + jam_lahir_identitas_bayi.$H : jam_lahir_identitas_bayi.$H) + ":"
            + ((JSON.stringify(jam_lahir_identitas_bayi.$m)).length == 1 ? "0" + jam_lahir_identitas_bayi.$m : jam_lahir_identitas_bayi.$m),
        jenis_kelamin: "Laki-Laki"
    });

    const oc_identitas_bayi = (e) => {
        if (e.$H != null) {
            var jam = JSON.stringify(e.$H);
            if (jam.length == 1) {
                jam = "0" + jam;
            }
            var menit = JSON.stringify(e.$m);
            if (menit.length == 1) {
                menit = "0" + menit;
            }

            set_identitas_bayi({
                ...identitas_bayi,
                ["jam_lahir"]: jam + ":" + menit,
            });
        }
        else {
            const value = e.target.value;
            set_identitas_bayi({
                ...identitas_bayi,
                [e.target.name]: value,
            });
        }
    }

    const [identitas_tim_ambulance, set_identitas_tim_ambulance] = useState({
        tim: '',
        dokter: '',
        perawat: '',
        bidan: '',
        driver: '',
    });

    const os_identitas_tim_ambulance = (data) => {
        set_identitas_tim_ambulance(data)
    }

    const [kode_kecamatan, set_kode_kecamatan] = useState([]);

    const [semua_kecamatan_identitas_ibu, set_semua_kecamatan_identitas_ibu] = useState([]);
    const [semua_kelurahan_identitas_ibu, set_semua_kelurahan_identitas_ibu] = useState([]);
    const [semua_kecamatan_identitas_ayah, set_semua_kecamatan_identitas_ayah] = useState([]);
    const [semua_kelurahan_identitas_ayah, set_semua_kelurahan_identitas_ayah] = useState([]);

    useEffect(() => {
        axios.post(window.location.origin + '/ref_kecamatan',
            {
            }).then(function (response) {
                set_semua_kecamatan_identitas_ibu(response.data)
                set_semua_kecamatan_identitas_ayah(response.data)
            })

        axios.post(window.location.origin + '/ref_kelurahan',
            {
                kode_kecamatan: kode_kecamatan,
            }).then(function (response) {
                set_semua_kelurahan_identitas_ibu(response.data)
                set_semua_kelurahan_identitas_ayah(response.data)
            })

    }, [])

    useEffect(() => {
        if (currentId) {
            axios.post(window.location.origin + '/ref_form_maternal', {
                id_form: currentId
            }).then(function (response) {
                const data = response.data;
                console.log("ref_form_maternal data:", data);
                if (data) {
                    if (data.pasien) {
                        set_identitas_ibu(prev => ({
                            ...prev,
                            id: data.pasien.id,
                            nik: data.pasien.nik,
                            nama: data.pasien.nama || data.nama_pasien || '',
                            tgl_lahir: data.pasien.tgl_lahir || data.tanggal_lahir || '',
                            alamat: data.pasien.alamat || data.alamat || '',
                            umur: data.usia_pasien || '',
                            pekerjaan: data.pekerjaan_pasien || '',
                            golongan_darah: data.golongan_darah_pasien || '',
                            no_telepon: data.pasien.no_telepon || '',
                            kecamatan: data.pasien.alamat_kecamatan || '',
                            kelurahan: data.pasien.alamat_kelurahan || '',
                            tgl_penanganan: data.form ? data.form.tgl_penanganan : (data.tanggal_rujukan || dayjs().format('YYYY-MM-DD')),
                        }));
                    } else {
                        set_identitas_ibu(prev => ({
                            ...prev,
                            nama: data.nama_pasien || '',
                            tgl_lahir: data.tanggal_lahir || '',
                            alamat: data.alamat || '',
                            umur: data.usia_pasien || '',
                            pekerjaan: data.pekerjaan_pasien || '',
                            golongan_darah: data.golongan_darah_pasien || '',
                            no_telepon: data.no_telepon || data.telepon || '',
                        }));
                    }

                    set_rumah_sakit_rujukan({
                        rs: data.rs_tujuan || '',
                        petugas: data.petugas_rs_tujuan || '',
                        tgl: data.tanggal_rujukan || dayjs().format('YYYY-MM-DD'),
                        jam: data.jam_rujukan || dayjs().format('HH:mm'),
                        tp_jam: data.jam_rujukan ? dayjs(`2022-01-01 ${data.jam_rujukan}`) : dayjs()
                    });

                    if (data.alasan_dirujuk) set_alasan_dirujuk(data.alasan_dirujuk);
                    if (data.tanda_syok) set_tanda_syok(data.tanda_syok);
                    if (data.riwayat) set_riwayat(data.riwayat);
                    if (data.fisik) set_fisik(data.fisik);
                    if (data.lab) set_lab(data.lab);
                    if (data.diagnosa) set_diagnosa(data.diagnosa);
                    if (data.penanganan) set_penanganan(data.penanganan);
                    if (data.tindakan_therapy) set_tindakan_therapy(data.tindakan_therapy);
                    if (data.riwayat_lain) set_riwayat_lain(data.riwayat_lain);
                    if (data.monitoring) set_monitoring(data.monitoring);
                    if (data.kondisi_saat_ini) set_pemeriksaan_fisik(data.kondisi_saat_ini);
                    if (data.petugas_pendamping) set_petugas_pendamping(data.petugas_pendamping);
                    if (data.atas_permintaan) set_atas_permintaan(data.atas_permintaan);
                    if (data.lain_lain) set_lain_lain(data.lain_lain);

                    if (data.handover) {
                        set_handover({
                            ...data.handover,
                            jam: data.handover.jam ? dayjs('2022-01-01 ' + data.handover.jam) : null
                        });
                    }
                }
            }).catch(error => {
                console.error("Error loading maternal data:", error);
            });
        }
    }, [currentId]);

    const [identitas_ibu, set_identitas_ibu] = useState({
        id: '',
        nik: '',
        nama: '',
        umur: '',
        pekerjaan: '',
        golongan_darah: '',
        no_telepon: '',
        alamat: '',
        kecamatan: '',
        kelurahan: '',
    });

    const oc_identitas_ibu = (e) => {
        if (e.target.name == "kecamatan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            set_identitas_ibu(
                {
                    ...identitas_ibu,
                    ["kecamatan"]: option,
                });
            axios.post(window.location.origin + '/ref_kelurahan',
                {
                    kode_kecamatan: option,
                }).then(function (response) {
                    set_semua_kelurahan_identitas_ibu(response.data)
                })
        }
        else if (e.target.name == "kelurahan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            set_identitas_ibu(
                {
                    ...identitas_ibu,
                    ["kelurahan"]: option,
                });
        }
        else {
            const value = e.target.value;
            set_identitas_ibu({
                ...identitas_ibu,
                [e.target.name]: value,
            });
        }
    }

    const [identitas_ayah, set_identitas_ayah] = useState({
        nama: '',
        usia: '',
        pekerjaan: '',
        golongan_darah: '',
        no_telepon: '',
        alamat: '',
        kecamatan: '',
        kelurahan: '',
    });

    const oc_identitas_ayah = (e) => {
        if (e.target.name == "kecamatan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            set_identitas_ayah(
                {
                    ...identitas_ayah,
                    ["kecamatan"]: option,
                });
            axios.post(window.location.origin + '/ref_kelurahan',
                {
                    kode_kecamatan: option,
                }).then(function (response) {
                    set_semua_kelurahan_identitas_ayah(response.data)
                })
        }
        else if (e.target.name == "kelurahan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            set_identitas_ayah(
                {
                    ...identitas_ayah,
                    ["kelurahan"]: option,
                });
        }
        else {
            const value = e.target.value;
            set_identitas_ayah({
                ...identitas_ayah,
                [e.target.name]: value,
            });
        }
    }

    const [riwayat_kehamilan_dan_persalinan, set_riwayat_kehamilan_dan_persalinan] = useState({
        usia_gestasi: '',
        anc: '',
        riwayat_penyakit_kehamilan: '',
        penolong_persalinan: '',
        cara_persalinan: '',
        apgar_score: '',
        apgar_score_status: '',
    });

    const oc_riwayat_kehamilan_dan_persalinan = (e) => {
        const value = e.target.value;
        set_riwayat_kehamilan_dan_persalinan({
            ...riwayat_kehamilan_dan_persalinan,
            [e.target.name]: value,
        });
    }

    function cbx_apgar_score(event) {
        const { value, checked } = event.target;
        if (checked) {
            set_riwayat_kehamilan_dan_persalinan({
                ...riwayat_kehamilan_dan_persalinan,
                ["apgar_score_status"]: "ya",
            });
        }
        else {
            set_riwayat_kehamilan_dan_persalinan({
                ...riwayat_kehamilan_dan_persalinan,
                ["apgar_score_status"]: "",
            });
        }
    }

    const [kronologi_anamnesis, set_kronologi_anamnesis] = useState("")

    const [pemeriksaan_fisik, set_pemeriksaan_fisik] = useState({
        tekanan_darah: '',
        nadi: '',
        pernafasan: '',
        suhu: '',
        saturasi_oksigen: '',
        berat_badan_lahir: '',
        panjang_badan: '',
        lingkar_kepala: '',
        lingkar_dada: '',
        lingkar_perut: '',
    });

    const oc_pemeriksaan_fisik = (e) => {
        const value = e.target.value;
        set_pemeriksaan_fisik({
            ...pemeriksaan_fisik,
            [e.target.name]: value,
        });
    }

    const [pemeriksaan_fisik_warna_kulit, set_pemeriksaan_fisik_warna_kulit] = useState([]);

    function cbx_pemeriksaan_fisik(event) {
        const { value, checked } = event.target;
        if (checked) {
            set_pemeriksaan_fisik_warna_kulit(pemeriksaan_fisik_warna_kulit =>
                [...pemeriksaan_fisik_warna_kulit, value]
            );
        }
        else {
            set_pemeriksaan_fisik_warna_kulit(pemeriksaan_fisik_warna_kulit => {
                return [...pemeriksaan_fisik_warna_kulit.filter(val => val !== value)]
            });
        }
    }

    const [terapi_tindakan_konsul, set_terapi_tindakan_konsul] = useState([])

    const oc_tambah_terapi_tindakan_konsul = () => {
        const c_val = [...terapi_tindakan_konsul, []];
        set_terapi_tindakan_konsul(c_val);
    }

    const oc_value_terapi_tindakan_konsul = (e, i) => {
        const value = [...terapi_tindakan_konsul];
        value[i] = e.target.value;
        set_terapi_tindakan_konsul(value);
    }

    const oc_hapus_terapi_tindakan_konsul = (i) => {
        const value = [...terapi_tindakan_konsul];
        value.splice(i, 1);
        set_terapi_tindakan_konsul(value);
    }

    const [diagnosis_medis, set_diagnosis_medis] = useState([])

    const oc_tambah_diagnosis_medis = () => {
        const c_val = [...diagnosis_medis, []];
        set_diagnosis_medis(c_val);
    }

    const oc_value_diagnosis_medis = (e, i) => {
        const value = [...diagnosis_medis];
        value[i] = e.target.value;
        set_diagnosis_medis(value);
    }

    const oc_hapus_diagnosis_medis = (i) => {
        const value = [...diagnosis_medis];
        value.splice(i, 1);
        set_diagnosis_medis(value);
    }

    const [rumah_sakit_rujukan, set_rumah_sakit_rujukan] = useState({
        rs: '',
        petugas: '',
        tgl: dayjs().format('YYYY-MM-DD'),
        jam: dayjs().format('HH:mm'),
        tp_jam: dayjs(new Date),
    })

    const oc_rumah_sakit_rujukan = (e) => {
        if (e && e.$H != null) {
            set_rumah_sakit_rujukan({
                ...rumah_sakit_rujukan,
                tp_jam: e,
                jam: e.format('HH:mm')
            });
        } else {
            const { name, value } = e.target;
            set_rumah_sakit_rujukan({
                ...rumah_sakit_rujukan,
                [name]: value
            });
        }
    }

    const [processing, setProcessing] = useState(false);

    const [atas_permintaan, set_atas_permintaan] = useState([]);
    const [petugas_pendamping, set_petugas_pendamping] = useState({
        dokter: '',
        perawat: '',
        bidan: '',
        driver: ''
    });

    const [tanda_syok, set_tanda_syok] = useState([]);
    const [alasan_dirujuk, set_alasan_dirujuk] = useState([]);
    const [riwayat, set_riwayat] = useState([]);
    const [fisik, set_fisik] = useState([]);
    const [lab, set_lab] = useState([]);
    const [lain_lain, set_lain_lain] = useState("");
    const [diagnosa, set_diagnosa] = useState("");
    const [penanganan, set_penanganan] = useState("");
    const [tindakan_therapy, set_tindakan_therapy] = useState("");
    const [riwayat_lain, set_riwayat_lain] = useState("");
    const [handover, set_handover] = useState({
        tgl: '',
        jam: null,
        rs: '',
        nama: ''
    });

    const oc_handover = (e) => {
        if (e && e.$d) {
            set_handover({
                ...handover,
                jam: e
            });
        } else {
            set_handover({
                ...handover,
                [e.target.name]: e.target.value
            });
        }
    }

    const [monitoring, set_monitoring] = useState({
        waktu: '',
        tanda_vital: '',
        td: '',
        ku: '',
        pernafasan: '',
        nadi: '',
        ppv: '',
        suhu: '',
        vt: '',
        his: '',
        djj: ''
    });

    const oc_monitoring = (e) => {
        set_monitoring({
            ...monitoring,
            [e.target.name]: e.target.value
        });
    }

    const oc_petugas_pendamping = (e) => {
        set_petugas_pendamping({
            ...petugas_pendamping,
            [e.target.name]: e.target.value
        });
    }

    const oc_checkbox_array = (e, state, setState) => {
        const { value, checked } = e.target;
        if (checked) {
            setState([...state, value]);
        } else {
            setState(state.filter(v => v !== value));
        }
    }

    const c_print_ref = useRef(null);
    const promiseResolveRef = useRef(null);

    useEffect(() => {
        if (isPrinting && promiseResolveRef.current) {
            promiseResolveRef.current();
        }
    }, [isPrinting]);

    const oc_print = useReactToPrint({
        content: () => c_print_ref.current,
        onBeforeGetContent: () => {
            return new Promise((resolve) => {
                promiseResolveRef.current = resolve;
                setIsPrinting(true);
            });
        },
        onAfterPrint: () => setIsPrinting(false)
    })

    const ref_ttd_penyerah = useRef({})
    const ref_ttd_penerima = useRef({})

    const oc_hapus_ttd_penyerah = () => { ref_ttd_penyerah.current.clear(); }
    const oc_hapus_ttd_penerima = () => { ref_ttd_penerima.current.clear(); }

    const simpanData = () => {
        setProcessing(true);
        let payload = {
            id: currentId,
            id_form: currentId,
            nama_pasien: identitas_ibu.nama,
            tgl_lahir: identitas_ibu.tgl_lahir,
            usia: identitas_ibu.umur,
            alamat: identitas_ibu.alamat,
            identitas_ibu: identitas_ibu,
            rumah_sakit_rujukan: rumah_sakit_rujukan,
            alasan_dirujuk: alasan_dirujuk,
            tanda_syok: tanda_syok,
            riwayat: riwayat,
            fisik: fisik,
            lab: lab,
            diagnosa: diagnosa,
            penanganan: penanganan,
            tindakan_therapy: tindakan_therapy,
            riwayat_lain: riwayat_lain,
            monitoring: monitoring,
            pemeriksaan_fisik: pemeriksaan_fisik,
            petugas_pendamping: petugas_pendamping,
            lain_lain: lain_lain,
            handover: {
                ...handover,
                jam: handover.jam ? dayjs(handover.jam).format("HH:mm") : null
            },
            ttd_penyerah: ref_ttd_penyerah.current.isEmpty() ? null : ref_ttd_penyerah.current.getTrimmedCanvas().toDataURL('image/png')
        };

        const endpoint = currentId ? '/form_maternal/perbarui' : '/form_maternal/simpan';

        axios.post(window.location.origin + endpoint, payload)
            .then(function (response) {
                toast.success(response.data, {
                    position: "top-right",
                });
                setProcessing(false);
            })
            .catch(function (error) {
                console.log(error);
                let msg = "Terjadi kesalahan saat menyimpan data.";
                if (error.response && error.response.data && error.response.data.error) {
                    msg += "\nDetail: " + error.response.data.error + " (Baris: " + error.response.data.line + ")";
                }
                toast.error(msg, {
                    position: "top-right"
                });
                setProcessing(false);
            });
    }

    return (
        <div className="mb-3 w-full">
            <ToastContainer />
            <div className="flex justify-center print:hidden">
                <a href="/catatan_medis"
                    className="mb-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                    Kembali
                </a>
            </div>

            <div ref={c_print_ref}>
                <HeaderIdentitas
                    isPrinting={isPrinting}
                    data={identitas_ibu}
                    onChange={set_identitas_ibu}
                />
                <div className="grid grid-cols-5 mt-2">
                    <div>
                        <Identitas_Tim
                            isPrinting={isPrinting}
                            onSubmit={os_identitas_tim_ambulance}
                            auth={props.auth}
                            id_form={currentId}
                        />
                    </div>
                    <div className="col-start-2 col-end-6">
                        <div className="flex justify-center font-bold border-x-2 border-t-2 text-xs md:text-sm">
                            RUJUKAN MATERNAL
                        </div>

                        <div className="flex border-2 w-full">
                            <div className="text-sm w-[30%]">
                                <div className="font-bold flex justify-center border-r border-b bg-gray-50">RUMAH SAKIT TUJUAN</div>
                                <div className="border-r">
                                    <input type="text" className="w-full p-1 border-none focus:ring-0 text-center" name="rs" value={rumah_sakit_rujukan.rs} onChange={oc_rumah_sakit_rujukan} />
                                </div>
                            </div>
                            <div className="text-sm w-[30%]">
                                <div className="font-bold flex justify-center border-r border-b bg-gray-50">Petugas RS Tujuan</div>
                                <div className="border-r">
                                    <input type="text" className="w-full p-1 border-none focus:ring-0 text-center" name="petugas" value={rumah_sakit_rujukan.petugas} onChange={oc_rumah_sakit_rujukan} />
                                </div>
                            </div>
                            <div className="text-sm w-[20%]">
                                <div className="font-bold flex justify-center border-r border-b bg-gray-50">Tanggal</div>
                                <div className="border-r">
                                    <input type="date" className="w-full p-1 border-none focus:ring-0 text-center" name="tgl" value={rumah_sakit_rujukan.tgl} onChange={oc_rumah_sakit_rujukan} />
                                </div>
                            </div>
                            <div className="text-sm w-[20%]">
                                <div className="font-bold flex justify-center border-b bg-gray-50">Jam</div>
                                <div className="">
                                    <input type="time" className="w-full p-1 border-none focus:ring-0 text-center" name="jam" value={rumah_sakit_rujukan.jam} onChange={oc_rumah_sakit_rujukan} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2">
                            <div className="flex border-x-2 border-b-2 text-xxs md:text-sm sm:text-xs p-1">
                                <div>
                                    <div className="font-semibold">Atas permintaan :</div>
                                    <div className="flex mt-1">
                                        <input type="checkbox" id="req_dokter" name="atas_permintaan" value="Dokter" checked={atas_permintaan.includes("Dokter")} onChange={(e) => oc_checkbox_array(e, atas_permintaan, set_atas_permintaan)} />
                                        <label htmlFor="req_dokter" className="mr-3 ml-1">Dokter</label>
                                        <input type="checkbox" id="req_pasien" name="atas_permintaan" value="Pasien/Keluarga" checked={atas_permintaan.includes("Pasien/Keluarga")} onChange={(e) => oc_checkbox_array(e, atas_permintaan, set_atas_permintaan)} />
                                        <label htmlFor="req_pasien" className="ml-1">Pasien/Keluarga</label>
                                    </div>
                                    <div className="flex">
                                        <input type="checkbox" id="req_lainnya" name="atas_permintaan" value="Lainnya" checked={atas_permintaan.includes("Lainnya")} onChange={(e) => oc_checkbox_array(e, atas_permintaan, set_atas_permintaan)} />
                                        <label htmlFor="req_lainnya" className="ml-1">Lainnya</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 border-2 mt-2 text-xs md:text-sm">
                            <div className="">
                                <div className="flex justify-center border-b bg-gray-50 font-bold p-1">Petugas Pendamping</div>
                                <div className="p-1 border-b">Dokter</div>
                                <div className="p-1 border-b">Perawat</div>
                                <div className="p-1 border-b">Bidan</div>
                                <div className="p-1">Driver</div>
                            </div>

                            <div className="border-l">
                                <div className="flex justify-center border-b bg-gray-50 font-bold p-1">Nama</div>
                                <div className="border-b"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="dokter" value={petugas_pendamping.dokter} onChange={oc_petugas_pendamping} /></div>
                                <div className="border-b"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="perawat" value={petugas_pendamping.perawat} onChange={oc_petugas_pendamping} /></div>
                                <div className="border-b"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="bidan" value={petugas_pendamping.bidan} onChange={oc_petugas_pendamping} /></div>
                                <div><input type="text" className="p-1 border-none focus:ring-0 w-full" name="driver" value={petugas_pendamping.driver} onChange={oc_petugas_pendamping} /></div>
                            </div>
                        </div>

                        <div className="border-x-2 border-t-2 mt-2 font-bold text-center bg-gray-100 text-xs md:text-sm py-1">KONDISI SAAT INI</div>

                        <div className="flex border-2 text-xs md:text-sm">
                            <div className="flex w-[50%] border-r">
                                <div className="w-[50%] p-1 border-r bg-gray-50">HPHT</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="hpht" value={pemeriksaan_fisik.hpht || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[50%] p-1 border-r bg-gray-50">Usia Kehamilan (mg)</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="usia_kehamilan" value={pemeriksaan_fisik.usia_kehamilan || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                        </div>

                        <div className="flex border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="flex w-[50%] border-r">
                                <div className="w-[50%] p-1 border-r bg-gray-50">TB (cm)</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="tb" value={pemeriksaan_fisik.tb || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[50%] p-1 border-r bg-gray-50">BB (Kg)</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="bb" value={pemeriksaan_fisik.bb || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                        </div>

                        <div className="flex border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="flex w-[50%] border-r">
                                <div className="w-[50%] p-1 border-r bg-gray-50">KU</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="ku" value={pemeriksaan_fisik.ku || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[50%] p-1 border-r bg-gray-50">Spo2</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="spo2" value={pemeriksaan_fisik.spo2 || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                        </div>

                        <div className="flex border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="flex w-[50%] border-r">
                                <div className="w-[50%] p-1 border-r bg-gray-50">TD</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="td" value={pemeriksaan_fisik.td || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[50%] p-1 border-r bg-gray-50">RR</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="rr" value={pemeriksaan_fisik.rr || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                        </div>

                        <div className="flex border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="flex w-[50%] border-r">
                                <div className="w-[50%] p-1 border-r bg-gray-50">Suhu</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="suhu" value={pemeriksaan_fisik.suhu || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                            <div className="flex w-[50%]">
                                <div className="w-[50%] p-1 border-r bg-gray-50">Denyut jantung janin</div>
                                <div className="w-[50%]"><input type="text" className="p-1 border-none focus:ring-0 w-full" name="djj" value={pemeriksaan_fisik.djj || ''} onChange={oc_pemeriksaan_fisik} /></div>
                            </div>
                        </div>

                        <div className="flex font-bold border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="w-[20%] border-r p-1 flex items-center justify-center bg-gray-100 text-center">JIKA DIDAPATI TANDA SYOK</div>
                            <div className="w-[80%]"><input type="text" className="p-1 border-none focus:ring-0 w-full h-full" name="tanda_syok_text" value={pemeriksaan_fisik.tanda_syok_text || ''} onChange={oc_pemeriksaan_fisik} /></div>
                        </div>

                        <div className="border-x-2 border-b-2 p-2 text-xs">
                            <div>Pasien dengan nadi {">"} 100 x/mnt dan TD sisfolik {"<"} 100 mmHg</div>
                            <div className="mb-2">Pemasangan IV Line 2 jalur dengan abocath</div>
                            <div className="flex items-center mb-1">
                                <input type="checkbox" className="mr-2" value="TD" checked={tanda_syok.includes("TD")} onChange={(e) => oc_checkbox_array(e, tanda_syok, set_tanda_syok)} />
                                <label className="mr-2 w-20">TD</label>
                                <input type="text" className="p-1 border w-12 text-center" name="syok_td_sys" value={pemeriksaan_fisik.syok_td_sys || ''} onChange={oc_pemeriksaan_fisik} />
                                <span className="mx-1">/</span>
                                <input type="text" className="p-1 border w-12 text-center" name="syok_td_dia" value={pemeriksaan_fisik.syok_td_dia || ''} onChange={oc_pemeriksaan_fisik} />
                                <span className="ml-1 mr-4">mmHg</span>
                                <span className="mr-2 font-semibold">Pukul</span>
                                <input type="time" className="p-1 border" name="syok_td_pukul" value={pemeriksaan_fisik.syok_td_pukul || ''} onChange={oc_pemeriksaan_fisik} />
                            </div>
                            <div className="flex items-center mb-1">
                                <input type="checkbox" className="mr-2" value="Ulangi 1 Liter" checked={tanda_syok.includes("Ulangi 1 Liter")} onChange={(e) => oc_checkbox_array(e, tanda_syok, set_tanda_syok)} />
                                <label className="mr-2 w-64">Ulangi 1 Liter jika masih Hipotensi, TD</label>
                                <input type="text" className="p-1 border w-12 text-center" name="syok_liter_td" value={pemeriksaan_fisik.syok_liter_td || ''} onChange={oc_pemeriksaan_fisik} />
                                <span className="ml-1 mr-4">mmHg</span>
                                <span className="mr-2 font-semibold">Pukul</span>
                                <input type="time" className="p-1 border" name="syok_liter_pukul" value={pemeriksaan_fisik.syok_liter_pukul || ''} onChange={oc_pemeriksaan_fisik} />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-2" value="Pasang kateter" checked={tanda_syok.includes("Pasang kateter")} onChange={(e) => oc_checkbox_array(e, tanda_syok, set_tanda_syok)} />
                                <label className="mr-2 w-32">Pasang kateter, Urine</label>
                                <input type="text" className="p-1 border w-12 text-center" name="syok_urine" value={pemeriksaan_fisik.syok_urine || ''} onChange={oc_pemeriksaan_fisik} />
                                <span className="ml-1 mr-4">cc</span>
                                <span className="mr-2 font-semibold">Pukul</span>
                                <input type="time" className="p-1 border" name="syok_urine_pukul" value={pemeriksaan_fisik.syok_urine_pukul || ''} onChange={oc_pemeriksaan_fisik} />
                            </div>
                        </div>

                        {/* --- SEKSI RIWAYAT GRID --- */}
                        <div className="border-2 mt-2">
                            <div className="bg-gray-100 py-1 text-center font-bold text-xs border-b">RIWAYAT</div>
                            <div className="grid grid-cols-4 md:grid-cols-5 text-xs">
                                <div className="border-r">
                                    {[
                                        { label: "Sakit Kepala", value: "Sakit Kepala" },
                                        { label: "Nyeri Ulu Hati", value: "Nyeri Ulu Hati" },
                                        { label: "Pandangan Kabur", value: "Pandangan Kabur" },
                                        { label: "Kejang", value: "Kejang" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center p-1 border-b last:border-b-0 min-h-[30px]">
                                            <input type="checkbox" className="mr-2" checked={riwayat.includes(item.value)} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value={item.value} />
                                            <label className="text-[10px] leading-tight">{item.label}</label>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-r">
                                    <div className="flex items-center p-1 border-b min-h-[30px]">
                                        <input type="checkbox" className="mr-2" checked={riwayat.includes("Usia Kehamilan")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="Usia Kehamilan" />
                                        <label className="text-[10px]">Usia Kehamilan</label>
                                    </div>
                                    <div className="p-1 border-b min-h-[30px] bg-gray-50"></div>
                                    <div className="flex items-center p-1 border-b min-h-[30px]">
                                        <input type="checkbox" className="mr-2" checked={riwayat.includes("Nyeri")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="Nyeri" />
                                        <label className="text-[10px]">Nyeri</label>
                                    </div>
                                    <div className="flex items-center p-1 min-h-[30px]">
                                        <input type="checkbox" className="mr-2" checked={riwayat.includes("Kontraksi")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="Kontraksi" />
                                        <label className="text-[10px]">Kontraksi</label>
                                    </div>
                                </div>
                                <div className="border-r">
                                    {[
                                        { label: "Partograf > Garis Waspada", value: "panograf melewati garis waspada" },
                                        { label: "Tidak Adekuat", value: "tidak adekuatik" },
                                        { label: "Tidak Terbaca", value: "tidak terbaca" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center p-1 border-b min-h-[30px]">
                                            <input type="checkbox" className="mr-2" checked={riwayat.includes(item.value)} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value={item.value} />
                                            <label className="text-[10px] leading-tight">{item.label}</label>
                                        </div>
                                    ))}
                                    <div className="p-1 min-h-[30px]">
                                        <div className="flex items-center mb-1">
                                            <input type="checkbox" className="mr-1" checked={riwayat.includes("kelainan letak")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="kelainan letak" />
                                            <label className="text-[10px]">Kelainan Letak</label>
                                        </div>
                                        <div className="flex items-center">
                                            <input type="checkbox" className="mr-1" checked={riwayat.includes("Taksiran berat bayi")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="Taksiran berat bayi" />
                                            <label className="text-[10px] mr-1">TBB:</label>
                                            <input type="text" className="w-10 border-b p-0 text-[10px] text-center" name="tbb" value={pemeriksaan_fisik.tbb || ''} onChange={oc_pemeriksaan_fisik} />
                                            <span className="text-[9px] ml-1">gr</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-r">
                                    <div className="flex items-center p-1 border-b min-h-[30px]">
                                        <input type="checkbox" className="mr-2" checked={riwayat.includes("<37 minggu")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="<37 minggu" />
                                        <label className="text-[10px]">{"<37 Minggu"}</label>
                                    </div>
                                    <div className="flex items-center p-1 border-b min-h-[30px]">
                                        <input type="checkbox" className="mr-2" checked={riwayat.includes("Ketuban pecah")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="Ketuban pecah" />
                                        <label className="text-[10px]">Ketuban Pecah</label>
                                    </div>
                                    <div className="p-1 min-h-[60px] bg-gray-50"></div>
                                </div>
                                <div className="">
                                    <div className="flex items-center p-1 border-b min-h-[30px]">
                                        <input type="checkbox" className="mr-2" checked={riwayat.includes("Demam")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="Demam" />
                                        <label className="text-[10px]">Demam</label>
                                    </div>
                                    <div className="flex items-center p-1 border-b min-h-[30px]">
                                        <input type="checkbox" className="mr-2" checked={riwayat.includes("kesadaran")} onChange={(e) => oc_checkbox_array(e, riwayat, set_riwayat)} value="kesadaran" />
                                        <label className="text-[10px]">Kesadaran</label>
                                    </div>
                                    <div className="p-1 min-h-[60px] bg-gray-50"></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex font-bold border-x-2 border-b-2 text-xs md:text-sm items-center">
                            <div className="w-[15%] p-1 bg-gray-50 border-r">Riwayat lain</div>
                            <div className="w-[85%]">
                                <input type="text" className="p-1 border-none focus:ring-0 w-full" name="riwayat_lain" value={riwayat_lain} onChange={(e) => set_riwayat_lain(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex font-bold border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="w-[10%] border-r p-1 bg-gray-100 flex items-center justify-center">Fisik</div>
                            <div className="w-[15%] border-r">
                                <div className="flex items-center p-1 border-b h-10">
                                    <input type="checkbox" className="mr-1" value="TD>140/90 mmHg" checked={fisik.includes("TD>140/90 mmHg")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                    <label className="text-[10px]">TD{">"}140/90</label>
                                </div>
                                <div className="h-20 bg-gray-50"></div>
                            </div>
                            <div className="w-[15%] border-r">
                                <div className="flex items-center p-1 border-b h-10">
                                    <input type="checkbox" className="mr-1" value="Nadi>100/mnt" checked={fisik.includes("Nadi>100/mnt")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                    <label className="text-[10px]">Nadi{">"}100/m</label>
                                </div>
                                <div className="flex items-center p-1 border-b h-10">
                                    <input type="checkbox" className="mr-1" value="Sistolik<100 mmHg" checked={fisik.includes("Sistolik<100 mmHg")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                    <label className="text-[10px]">Sistolik{"<"}100</label>
                                </div>
                                <div className="h-10 bg-gray-50"></div>
                            </div>
                            <div className="w-[25%] border-r">
                                <div className="p-1 border-b h-10 flex items-center justify-between">
                                    <label className="text-[10px]">Penurunan</label>
                                    <select className="p-0 text-[10px] border h-6" name="penurunan" value={pemeriksaan_fisik.penurunan || ''} onChange={oc_pemeriksaan_fisik}>
                                        <option value="">-Select-</option>
                                        <option>1/5</option><option>2/5</option><option>3/5</option><option>4/5</option><option>5/5</option>
                                    </select>
                                </div>
                                <div className="flex items-center p-1 border-b h-10 justify-between">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-1" value="Lama persalinan" checked={fisik.includes("Lama persalinan")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                        <label className="text-[10px]">Lama</label>
                                    </div>
                                    <div>
                                        <input type="text" className="p-0 border w-8 text-center text-[10px]" name="lama_persalinan" value={pemeriksaan_fisik.lama_persalinan || ''} onChange={oc_pemeriksaan_fisik} />
                                        <span className="text-[10px] ml-1">jam</span>
                                    </div>
                                </div>
                                <div className="flex items-center p-1 h-10">
                                    <input type="checkbox" className="mr-1" value="Moulase" checked={fisik.includes("Moulase")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                    <label className="text-[10px]">Moulase</label>
                                </div>
                            </div>
                            <div className="w-[20%] border-r">
                                <div className="flex items-center justify-between p-1 border-b h-10">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-1" value="Usia kehamilan (fisik)" checked={fisik.includes("Usia kehamilan (fisik)")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                        <label className="text-[10px]">Usia kehamilan</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="text" className="p-0 border w-6 text-center text-[10px]" name="usia_kehamilan_fisik" value={pemeriksaan_fisik.usia_kehamilan_fisik || ''} onChange={oc_pemeriksaan_fisik} />
                                        <span className="text-[9px] ml-1">mgg</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-1 border-b h-10">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-1" value="Kontraksi (fisik)" checked={fisik.includes("Kontraksi (fisik)")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                        <label className="text-[10px]">Kontraksi</label>
                                    </div>
                                    <div className="flex items-center text-[9px]">
                                        <input type="text" className="p-0 border w-5 text-center text-[10px] mx-1" name="kontraksi_x" value={pemeriksaan_fisik.kontraksi_x || ''} onChange={oc_pemeriksaan_fisik} />x/10m
                                        <input type="text" className="p-0 border w-5 text-center text-[10px] mx-1" name="kontraksi_durasi" value={pemeriksaan_fisik.kontraksi_durasi || ''} onChange={oc_pemeriksaan_fisik} />s
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-1 border-b h-10">
                                    <div className="flex items-center">
                                        <input type="checkbox" className="mr-1" value="Ketuban pecah (fisik)" checked={fisik.includes("Ketuban pecah (fisik)")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                        <label className="text-[10px]">Ketuban pecah</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input type="text" className="p-0 border w-6 text-center text-[10px]" name="ketuban_pecah_jam" value={pemeriksaan_fisik.ketuban_pecah_jam || ''} onChange={oc_pemeriksaan_fisik} />
                                        <span className="text-[9px] ml-1">jam</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[15%]">
                                <div className="flex items-center p-1 border-b h-10">
                                    <input type="checkbox" className="mr-1" value="Nadi>100x/mnt (fisik)" checked={fisik.includes("Nadi>100x/mnt (fisik)")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                    <label className="text-[10px]">Nadi{">"}100x</label>
                                </div>
                                <div className="flex items-center p-1 border-b h-10">
                                    <input type="checkbox" className="mr-1" value="Sistolik (fisik)" checked={fisik.includes("Sistolik (fisik)")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                    <label className="text-[10px]">Sistolik</label>
                                </div>
                                <div className="flex items-center p-1 h-10">
                                    <input type="checkbox" className="mr-1" value="Lochia berbau" checked={fisik.includes("Lochia berbau")} onChange={(e) => oc_checkbox_array(e, fisik, set_fisik)} />
                                    <label className="text-[10px]">Lochia berbau</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex font-bold border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="w-[10%] border-r p-1 flex items-center justify-center bg-gray-100">Lab</div>
                            <div className="w-[15%] border-r">
                                <div className="flex items-center p-1 border-b">
                                    <input type="checkbox" className="mr-1" value="Proteinuria" checked={lab.includes("Proteinuria")} onChange={(e) => oc_checkbox_array(e, lab, set_lab)} />
                                    <label className="text-[10px]">Proteinuria 1+2+3+</label>
                                </div>
                                <div className="flex items-center p-1">
                                    <input type="checkbox" className="mr-1" value="HIV/AIDS" checked={lab.includes("HIV/AIDS")} onChange={(e) => oc_checkbox_array(e, lab, set_lab)} />
                                    <label className="text-[10px]">HIV/AIDS</label>
                                </div>
                            </div>
                            <div className="w-[15%] border-r">
                                <div className="flex items-center p-1">
                                    <input type="checkbox" className="mr-1" value="Hb" checked={lab.includes("Hb")} onChange={(e) => oc_checkbox_array(e, lab, set_lab)} />
                                    <label className="text-[10px]">Hb</label>
                                </div>
                            </div>
                            <div className="w-[25%] border-r">
                                <div className="flex items-center p-1">
                                    <input type="checkbox" className="mr-1" value="HBSAg" checked={lab.includes("HBSAg")} onChange={(e) => oc_checkbox_array(e, lab, set_lab)} />
                                    <label className="text-[10px]">HBSAg</label>
                                </div>
                            </div>
                            <div className="w-[20%] border-r">
                                <div className="flex items-center p-1">
                                    <input type="checkbox" className="mr-1" value="Leukosit LEA" checked={lab.includes("Leukosit LEA")} onChange={(e) => oc_checkbox_array(e, lab, set_lab)} />
                                    <label className="text-[10px]">Leukosit LEA air ket</label>
                                </div>
                            </div>
                            <div className="w-[15%]">
                                <div className="flex items-center p-1">
                                    <input type="checkbox" className="mr-1" value="Leukosit" checked={lab.includes("Leukosit")} onChange={(e) => oc_checkbox_array(e, lab, set_lab)} />
                                    <label className="text-[10px]">Leukosit</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex font-bold border-x-2 border-b-2 text-xs md:text-sm items-center mt-2">
                            <div className="w-[15%] p-1 bg-gray-100 border-r">Lain-lain</div>
                            <div className="w-[85%]">
                                <input type="text" className="p-1 border-none focus:ring-0 w-full" value={lain_lain} onChange={(e) => set_lain_lain(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex font-bold border-x-2 border-b-2 text-xs md:text-sm items-center">
                            <div className="w-[15%] p-1 bg-gray-100 border-r">DIAGNOSA</div>
                            <div className="w-[85%]">
                                <input type="text" className="p-1 border-none focus:ring-0 w-full" value={diagnosa} onChange={(e) => set_diagnosa(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex font-bold border-x-2 border-b-2 text-xs md:text-sm items-center">
                            <div className="w-[15%] p-1 bg-gray-100 border-r">PENANGANAN</div>
                            <div className="w-[85%]">
                                <input type="text" className="p-1 border-none focus:ring-0 w-full" value={penanganan} onChange={(e) => set_penanganan(e.target.value)} />
                            </div>
                        </div>

                        <div className="flex font-bold border-x-2 border-b-2 text-xs md:text-sm items-center">
                            <div className="w-[15%] p-1 bg-gray-100 border-r text-[11px] leading-tight">TINDAKAN/THERAPY</div>
                            <div className="w-[85%]">
                                <input type="text" className="p-1 border-none focus:ring-0 w-full" value={tindakan_therapy} onChange={(e) => set_tindakan_therapy(e.target.value)} />
                            </div>
                        </div>

                        {/* --- SEKSI MONITORING GRID --- */}
                        <div className="flex font-bold border-2 text-xs md:text-sm bg-gray-100 justify-center py-1 mt-2">
                            HAL PENTING YANG PERLU DICATAT SELAMA PERJALANAN
                        </div>

                        <div className="flex border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="w-[15%] border-r p-2 flex flex-col items-center justify-center bg-gray-50">
                                <div className="font-bold mb-2">Waktu</div>
                                <input
                                    type="text"
                                    className="p-1 w-full text-center border rounded"
                                    name="waktu"
                                    value={monitoring.waktu}
                                    onChange={oc_monitoring}
                                    placeholder="00:00"
                                />
                            </div>

                            <div className="w-[85%]">
                                <div className="flex justify-center font-bold border-b py-1 bg-gray-50 text-[11px] uppercase">Monitoring</div>
                                <div className="grid grid-cols-2">
                                    {[
                                        { label: "Tanda Vital", name: "tanda_vital" },
                                        { label: "TD", name: "td" },
                                        { label: "KU", name: "ku" },
                                        { label: "Pernafasan", name: "pernafasan" },
                                        { label: "Nadi", name: "nadi" },
                                        { label: "PPV", name: "ppv" },
                                        { label: "Suhu", name: "suhu" },
                                        { label: "VT", name: "vt" },
                                        { label: "Observasi His", name: "his" },
                                        { label: "DJJ", name: "djj" }
                                    ].map((item, index) => (
                                        <div key={index} className="flex border-b border-r last:border-r-0 items-center min-h-[35px]">
                                            <div className="w-32 px-2 font-semibold text-[11px] flex-shrink-0">
                                                {item.label}
                                            </div>
                                            <div className="flex-grow border-l h-full">
                                                <input
                                                    type="text"
                                                    className="p-1 w-full h-full border-none focus:ring-0 text-xs"
                                                    name={item.name}
                                                    value={monitoring[item.name] || ''}
                                                    onChange={oc_monitoring}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className="col-span-2 flex items-center min-h-[35px]">
                                        <div className="w-48 px-2 font-semibold text-[11px] flex-shrink-0">
                                            Monitoring keadaan pasien
                                        </div>
                                        <div className="flex-grow border-l h-full">
                                            <input
                                                type="text"
                                                className="p-1 w-full h-full border-none focus:ring-0 text-xs"
                                                name="keadaan_pasien"
                                                value={monitoring.keadaan_pasien || ''}
                                                onChange={oc_monitoring}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- TANDA TANGAN --- */}
                        <div className="flex justify-center border-x-2 border-b-2 text-xs md:text-sm bg-gray-100 py-1 font-bold mt-2">
                            NAMA DAN TANDA TANGAN PETUGAS
                        </div>

                        <div className="grid grid-cols-3 border-x-2 border-b-2 text-xs md:text-sm">
                            <div className="border-r p-2 bg-gray-50">
                                <div className="flex items-center mb-2">
                                    <span className="w-24 font-semibold">Tanggal</span>
                                    <input className="flex-grow border p-1" type="date" name="tgl" value={handover.tgl} onChange={oc_handover} />
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="w-24 font-semibold">Jam</span>
                                    <div className="flex-grow bg-white border">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <MobileTimePicker value={handover.jam} onChange={oc_handover} ampm={false} slotProps={{ textField: { size: "small", variant: "standard", InputProps: { disableUnderline: true, style: { paddingLeft: 8, fontSize: '0.75rem' } } } }} />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className="w-24 font-semibold">RS / Puskesmas</span>
                                    <input className="flex-grow border p-1" type="text" name="rs" value={handover.rs} onChange={oc_handover} />
                                </div>
                            </div>

                            <div className="border-r flex flex-col">
                                <div className="text-center font-bold bg-gray-50 border-b py-1">Yang menyerahkan</div>
                                <div className="flex-grow flex justify-center items-center h-24 bg-white relative">
                                    <SignatureCanvas canvasProps={{ className: 'sigCanvas absolute inset-0 w-full h-full' }} ref={ref_ttd_penyerah} />
                                </div>
                                <input className="w-full text-center border-t border-none focus:ring-0 p-1 bg-gray-50" type="text" name="nama" value={handover.nama} onChange={oc_handover} placeholder="( Nama Petugas )" />
                            </div>

                            <div className="flex flex-col">
                                <div className="text-center font-bold bg-gray-50 border-b py-1">Yang Menerima</div>
                                <div className="flex-grow flex justify-center items-center h-24 bg-white relative">
                                    <SignatureCanvas canvasProps={{ className: 'sigCanvas absolute inset-0 w-full h-full' }} ref={ref_ttd_penerima} />
                                </div>
                                <input className="w-full text-center border-t border-none focus:ring-0 p-1 bg-gray-50" type="text" name="keluarga_pasien_petugas_rs" placeholder="( Nama Penerima )" />
                            </div>
                        </div>

                    </div>
                </div>

            </div> {/* <--- PENUTUP c_print_ref (PENTING) */}

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-4 mt-3 ml-3 mr-3 text-xxs md:text-sm sm:text-xs print:hidden">
                <div></div>
                <button type="button" onClick={oc_hapus_ttd_penyerah} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
                <button type="button" onClick={oc_hapus_ttd_penerima} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">Hapus</button>
                <div></div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-4 mt-3 ml-3 mr-3 text-xxs md:text-sm sm:text-xs print:hidden">
                <div></div>
                <button type="button" onClick={simpanData} disabled={processing} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    {currentId ? 'Perbarui' : 'Simpan'}
                </button>
                <button type="button" onClick={oc_print} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Print
                </button>
                <div></div>
            </div>

        </div>
    );
}
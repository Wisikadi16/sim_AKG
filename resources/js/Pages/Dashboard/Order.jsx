import React, { Component, useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

export default function Order({ auth }) {
    // export default function Order() {
    const [semua_order, set_semua_order] = useState([]);
    const [semua_order_cari, set_semua_order_cari] = useState([]);
    const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);

    const [tanggalDari, setTanggalDari] = useState('');
    const [tanggalSampai, setTanggalSampai] = useState('');

    // const [semua_rs, set_semua_rs] = useState([]);

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const semua_nama_hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const index_hari = currentDate.getDay();
    const nama_hari_ini = semua_nama_hari[index_hari];

    var nama_bulan;
    if (month == "01") {
        nama_bulan = "Januari";
    }
    else if (month == "02") {
        nama_bulan = "Februari";
    }
    else if (month == "03") {
        nama_bulan = "Maret";
    }
    else if (month == "04") {
        nama_bulan = "April";
    }
    else if (month == "05") {
        nama_bulan = "Mei";
    }
    else if (month == "06") {
        nama_bulan = "Juni";
    }
    else if (month == "07") {
        nama_bulan = "Juli";
    }
    else if (month == "08") {
        nama_bulan = "Agustus";
    }
    else if (month == "09") {
        nama_bulan = "September";
    }
    else if (month == "10") {
        nama_bulan = "Oktober";
    }
    else if (month == "11") {
        nama_bulan = "November";
    }
    else if (month == "12") {
        nama_bulan = "Desember";
    }

    const [edit, set_edit] = useState(false);

    const [koorku, set_koorku] = useState({
        lat: '',
        lng: '',
    });

    const [c_cari, set_c_cari] = useState(false);
    const [val_cari, set_val_cari] = useState('');

    // console.log("lokasi")
    // console.log(window.location.origin)


    // useEffect(()=>{
    //     const invtime = setInterval(() => {
    //         if(!val_cari){
    //             // axios.post(window.location.origin+'/ref_order',
    //             // {
    //             //     tanggal_dari:tanggalDari,
    //             //     tanggal_sampai:tanggalSampai
    //             // }).then(function (response){
    //             //     set_semua_order(response.data)
    //             //     set_semua_order_cari(response.data)
    //             // })
    //             console.log("timing")
    //             refresh_all_data()

    //             // axios.post(window.location.origin+'/ref_tim_ambulan_order',
    //             // {
    //             // }).then(function (response){
    //             //     set_semua_tim_ambulan(response.data)
    //             //     // console.log(response)
    //             // })

    //         }

    //     }, 10000)

    //     return () => {
    //         clearInterval(invtime);
    //     };

    // // },[])
    // },[val_cari])

    useEffect(() => {
        const invtime = setInterval(() => {
            if (!val_cari) {
                if (tanggalDari && tanggalSampai) {
                    refresh_all_data();
                    // console.log("geolocation")
                    // console.log(koorku)
                    if (auth.role == "Tim Ambulan") {
                        // console.log("tim ambulan posisi")
                        if ("geolocation" in navigator) {
                            kirim_lokasi()
                        }
                    }
                }
                // else {
                //     console.log("Tanggal dari atau tanggal sampai belum diatur.");
                // }
            }
        }, 10000);

        return () => {
            clearInterval(invtime);
        };

        // },[]); // Uncomment if needed
    }, [val_cari, tanggalDari, tanggalSampai]);


    useEffect(() => {
        if (tanggalDari && tanggalSampai) {
            refresh_all_data();
        }
    }, [tanggalDari, tanggalSampai]);


    useEffect(() => {
        setTanggalDari(`${year}-${month}-${day}`)
        setTanggalSampai(`${year}-${month}-${day}`)

        // refresh_all_data()

        axios.post(window.location.origin + '/ref_kecamatan',
            {
                // kode_kecamatan:kode_kecamatan,
            }).then(function (response) {
                set_semua_kecamatan(response.data)
                // console.log(response)
            })

        axios.post(window.location.origin + '/ref_kelurahan',
            {
                kode_kecamatan: kode_kecamatan,
                // kode_kecamatan:"",
            }).then(function (response) {
                set_semua_kelurahan(response.data)
                // console.log(response)
            })

        // axios.post(window.location.origin+'/ref_tim_ambulan_order',
        // {
        //     // tanggung_jawab:'Dokter',
        // }).then(function (response){
        //     console.log(response)
        //     // set_semua_petugas(response.data)
        //     set_semua_tim_ambulan(response.data)
        //     // set_semua_ambulan_cari(response.data)
        //     // console.log(response)
        // })

        // if(auth.role=="Operator"){
        //     axios.post(window.location.origin+'/ref_faskes',
        //     {
        //         jenis:"rumah sakit",
        //     }).then(function (response){
        //         // console.log("rumah sakit")
        //         set_semua_rs(response.data)
        //         // console.log(response)
        //     })
        // }
        if (auth.role == "Tim Ambulan") {
            // console.log("tim ambulan posisi")
            if ("geolocation" in navigator) {
                // console.log("geolocation")
                // console.log(koorku)
                // navigator.geolocation.getCurrentPosition(position=>{
                //     const {latitude, longitude} = position.coords;

                //     set_koorku({
                //         ...koorku,
                //         ["lat"]: latitude,
                //         ["lng"]: longitude,
                //     })

                kirim_lokasi()

                //         console.log("tim ambulan role")
                //         console.log("lat"+latitude+" long"+longitude)
                //         ,(error) => console.warn(error.message),
                //     { enableHighAccuracy: true}
                // // enableHighAccuracy=true
                //     })
            }
        }
    }, [])

    const refresh_all_data = () => {
        // function refresh_all_data(){
        // axios.post(window.location.origin+'/ref_order',
        //     {

        //     }).then(function (response){
        //         set_semua_order(response.data)
        //         set_semua_order_cari(response.data)
        //     })
        console.log("refresh")
        // console.log(tanggalDari)
        axios.post(window.location.origin + '/ref_order',
            {
                tanggal_dari: tanggalDari,
                tanggal_sampai: tanggalSampai
            }).then(function (response) {
                set_semua_order(response.data)
                set_semua_order_cari(response.data)
            })

        axios.post(window.location.origin + '/ref_tim_ambulan_order',
            {
            }).then(function (response) {
                set_semua_tim_ambulan(response.data)
            })
    }

    const oc_hapus = (id) => {
        get_id_ref_order(id)

        set_modal_hapus(true)
    }

    const oc_hapus_simpan = (id) => {
        // console.log("hpaus id")
        // console.log(id)
        router.post('/hapus_order', {
            id: id,
        })

        set_modal_hapus(false)

        axios.post(window.location.origin + '/ref_order',
            {
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_order(response.data)
                set_semua_order_cari(response.data)
                // console.log(response)
            })

        get_id_ref_order(id)

        // set_data({
        //     ...data,
        //     ['id']:id,
        //     ['cara_order']: response.data.cara_order,
        //     ['no_penelepon']: response.data.no_penelepon,
        //     ['nama_penelepon']:response.data.nama_penelepon,
        //     ['nama_pasien']:response.data.nama_pasien,
        //     ['kasus']: response.data.kasus,
        //     ['kecamatan']: response.data.ref_kecamatan.kode_kecamatan,
        //     ['kelurahan']: response.data.ref_kelurahan.kode_kelurahan,
        //     ['nama_kecamatan']: response.data.ref_kecamatan.nama_kecamatan,
        //     ['nama_kelurahan']: response.data.ref_kelurahan.nama_kelurahan,
        //     ['alamat']:response.data.alamat,
        //     ['latitude']:response.data.latitude,
        //     ['longitude']:response.data.longitude,
        //     ['tim_ambulan']:response.data.tim_ambulan.nama_tim,
        //     ['waktu_order']:response.data.waktu_order,
        // })
    }

    const oc_edit = (id) => {
        // console.log("edit")
        set_edit(true);

        set_modal(true)
        // console.log("waktu"+data.waktu_order)

        get_id_ref_order(id)
    }

    const [page, set_page] = useState([0]);

    const [terima, set_terima] = useState(false);

    const oc_terima = (id) => {
        set_terima(true);

        // console.log("waktu"+data.waktu_order)
        get_id_ref_order(id)

        // axios.post(window.location.origin+'/ref_order',
        // {
        //     id:id,
        // }).then(function (response){
        //     set_data({
        //         ...data,
        //         ['id']:id,
        //         ['cara_order']: response.data.cara_order,
        //         ['no_penelepon']: response.data.no_penelepon,
        //         ['nama_penelepon']:response.data.nama_penelepon,
        //         ['kasus']: response.data.kasus,
        //         ['kecamatan']: response.data.ref_kecamatan.kode_kecamatan,
        //         ['kelurahan']: response.data.ref_kelurahan.kode_kelurahan,
        //         ['nama_kecamatan']: response.data.ref_kecamatan.nama_kecamatan,
        //         ['nama_kelurahan']: response.data.ref_kelurahan.nama_kelurahan,
        //         ['alamat']:response.data.alamat,
        //         ['latitude']:response.data.latitude,
        //         ['longitude']:response.data.longitude,
        //         ['tim_ambulan']:response.data.tim_ambulan.nama_tim,
        //         ['waktu_order']:response.data.waktu_order,
        //     })


        //     console.log("terima")
        //     console.log(response)
        // })

    }

    const oc_terima_simpan = (id) => {
        axios.post(window.location.origin + '/order/terima',
            {
                id: id,
            }).then(function (response) {
                console.log(response)
                set_null_data()

                set_terima(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });

            })

    }

    const [selesai, set_selesai] = useState(false);

    const oc_selesai = (id) => {
        set_selesai(true);
        get_id_ref_order(id)
    }

    const oc_selesai_simpan = (id) => {
        axios.post(window.location.origin + '/order/selesai',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_selesai(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })
    }

    const [batal, set_batal] = useState(false);

    const oc_batal = (id) => {
        set_batal(true);
        get_id_ref_order(id)
    }

    const oc_batal_simpan = (id) => {
        axios.post(window.location.origin + '/order/batal',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_batal(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [catatan, set_catatan] = useState(false);

    const oc_catatan = (id) => {
        set_catatan(true);
        get_id_ref_order(id)
    }

    const oc_catatan_simpan = (id) => {
        axios.post(window.location.origin + '/order/catatan',
            {
                id: id,
                catatan: data.catatan,
            }).then(function (response) {
                set_null_data()

                set_catatan(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [ajukan_rujuk, set_ajukan_rujuk] = useState(false);

    const oc_ajukan_rujuk = (id) => {
        set_ajukan_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_ajukan_rujuk_simpan = (id) => {
        axios.post(window.location.origin + '/order/ajukan_rujuk',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_ajukan_rujuk(false)

                refresh_all_data()
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [rujuk, set_rujuk] = useState(false);

    const oc_rujuk = (id) => {
        set_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_rujuk_simpan = (id) => {
        axios.post(window.location.origin + '/order/rujuk',
            {
                id: id,
                // faskes_rujukan:data.faskes_rujukan,
            }).then(function (response) {
                set_null_data()

                set_rujuk(false)

                refresh_all_data()
                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [sampai_rujuk, set_sampai_rujuk] = useState(false);

    const oc_sampai_rujuk = (id) => {
        set_sampai_rujuk(true);
        get_id_ref_order(id)
    }

    const oc_sampai_rujuk_simpan = (id) => {
        axios.post(window.location.origin + '/order/sampai_rujuk',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_sampai_rujuk(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [bersiap_kembali, set_bersiap_kembali] = useState(false);

    const oc_bersiap_kembali = (id) => {
        set_bersiap_kembali(true);
        get_id_ref_order(id)
    }

    const oc_bersiap_kembali_simpan = (id) => {
        axios.post(window.location.origin + '/order/bersiap_kembali',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_bersiap_kembali(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const [sampai_lokasi, set_sampai_lokasi] = useState(false);

    const oc_sampai_lokasi = (id) => {
        set_sampai_lokasi(true);
        get_id_ref_order(id)
    }

    const oc_sampai_lokasi_simpan = (id) => {
        axios.post(window.location.origin + '/order/sampai_lokasi',
            {
                id: id,
            }).then(function (response) {
                set_null_data()

                set_sampai_lokasi(false)

                refresh_all_data()

                toast.success(response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                });
            })

    }

    const columns =
        auth.role == "admin" || auth.role == "Operator" ? [
            { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
            {
                name: 'Status', cell: (row) =>
                    <div title={row.status}>{row.status}</div>, width: "100px"
            },
            {
                name: 'Tim Ambulan', cell: (row) =>
                    <div title={row.tim_ambulan.nama_tim}>{row.tim_ambulan.nama_tim}</div>, width: "130px"
            },
            {
                name: 'Nama Pasien', cell: (row) =>
                    <div title={row.nama_pasien}>{row.nama_pasien}</div>, width: "170px"
            },
            {
                name: 'Alamat', cell: (row) =>
                    <div title={row.alamat}>{row.alamat}</div>, width: "190px"
            },
            {
                name: 'Kelurahan', cell: (row) =>
                    <div title={row.ref_kelurahan.nama_kelurahan}>{row.ref_kelurahan.nama_kelurahan}</div>, width: "110px"
            },
            {
                name: 'Kecamatan', cell: (row) =>
                    <div title={row.ref_kecamatan.nama_kecamatan}>{row.ref_kecamatan.nama_kecamatan}</div>, width: "110px"
            },
            {
                name: 'Nama Penelepon', cell: (row) =>
                    <div title={row.nama_penelepon}>{row.nama_penelepon}</div>, width: "130px"
            },
            { name: 'No Penelepon', selector: (row) => row.no_penelepon, width: "135px" },
            {
                name: 'Kasus', cell: (row) =>
                    <div title={row.kasus}>{row.kasus}</div>, width: "250px"
            },
            auth.role == "Operator" ? "" : { name: 'Petugas', selector: (row) => row.user.name, width: "140px" },
            { name: 'Cara Order', selector: (row) => row.cara_order, width: "100px" },
            {
                name: 'Waktu Order', cell: (row) =>
                    <div title={row.waktu_order}>{row.waktu_order}</div>, width: "170px"
            },
            {
                name: 'Waktu Terima', cell: (row) =>
                    <div title={row.waktu_terima}>{row.waktu_terima}</div>, width: "170px"
            },
            {
                name: 'Waktu Rujuk', cell: (row) =>
                    <div title={row.waktu_rujuk}>{row.waktu_rujuk}</div>, width: "170px"
            },
            {
                name: 'Waktu Sampai Lokasi', cell: (row) =>
                    <div title={row.waktu_sampai_lokasi}>{row.waktu_sampai_lokasi}</div>, width: "170px"
            },
            // {name:'Waktu Ajukan Rujuk', cell:(row)=>
            //     <div title={row.waktu_terima}>
            //         {row.waktu_terima} 
            //     </div>
            //     },
            {
                name: 'Waktu Sampai Rujuk', cell: (row) =>
                    <div title={row.waktu_sampai_rujuk}>{row.waktu_sampai_rujuk}</div>, width: "170px"
            },
            {
                name: 'Waktu Selesai', cell: (row) =>
                    <div title={row.waktu_selesai}>{row.waktu_selesai}</div>, width: "170px"
            },
            {
                name: 'Waktu Bersiap Kembali', cell: (row) =>
                    <div title={row.waktu_bersiap_kembali}>{row.waktu_bersiap_kembali}</div>, width: "170px"
            },
            {
                name: 'Catatan', cell: (row) =>
                    <div title={row.catatan}>
                        {row.catatan}
                    </div>
            },
            {
                name: 'Aksi', cell: (row) =>
                    <div className="flex gap-2 items-center flex-wrap">
                        {row.status == "ajukan rujuk" &&
                            <button type="button"
                                id={row.id}
                                onClick={() => oc_rujuk(row.id)}
                                className="text-white bg-[#4138ca] hover:bg-[#4138ca] focus:ring-4 font-medium rounded-xl text-xs px-4 py-2 transition-all shadow-sm focus:outline-none">
                                Rujuk
                            </button>
                        }
                        <button type="button"
                            id={row.id}
                            onClick={() => oc_hapus(row.id)}
                            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-xl text-xs px-4 py-2 transition-all shadow-sm">
                            Hapus
                        </button>
                        <button type="button"
                            id={row.id}
                            onClick={() => oc_edit(row.id)}
                            className="text-white bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-emerald-300 font-medium rounded-xl text-xs px-4 py-2 transition-all shadow-sm">
                            Edit
                        </button>
                    </div>
                , width: "180px"
            },
        ] :
            auth.role == "Tim Ambulan" ? [
                { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
                {
                    name: 'Status', cell: (row) =>
                        <div title={row.status}>{row.status}</div>, width: "100px"
                },
                { name: 'Cara Order', selector: (row) => row.cara_order, width: "130px" },
                {
                    name: 'Petugas', cell: (row) =>
                        <div title={row.user.name}>{row.user.name}</div>, width: "100px"
                },
                {
                    name: 'Nama Pasien', cell: (row) =>
                        <div title={row.nama_pasien}>{row.nama_pasien}</div>, width: "170px"
                },
                {
                    name: 'Alamat', cell: (row) =>
                        <div title={row.alamat}>{row.alamat}</div>, width: "190px"
                },
                {
                    name: 'Kelurahan', cell: (row) =>
                        <div title={row.ref_kelurahan.nama_kelurahan}>{row.ref_kelurahan.nama_kelurahan}</div>, width: "110px"
                },
                {
                    name: 'Kecamatan', cell: (row) =>
                        <div title={row.ref_kecamatan.nama_kecamatan}>{row.ref_kecamatan.nama_kecamatan}</div>, width: "110px"
                },
                {
                    name: 'Nama Penelepon', cell: (row) =>
                        <div title={row.nama_penelepon}>{row.nama_penelepon}</div>, width: "130px"
                },
                { name: 'No Penelepon', selector: (row) => row.no_penelepon, width: "130px" },
                {
                    name: 'Kasus', cell: (row) =>
                        <div title={row.kasus}>{row.kasus}</div>, width: "250px"
                },
                { name: 'Waktu Order', selector: (row) => row.waktu_order, width: "170px" },
                { name: 'Waktu Terima', selector: (row) => row.waktu_terima, width: "170px" },
                { name: 'Waktu Sampai Lokasi', selector: (row) => row.waktu_sampai_lokasi, width: "170px" },
                { name: 'Waktu Rujuk', selector: (row) => row.waktu_rujuk, width: "170px" },
                { name: 'Waktu Sampai Rujuk', selector: (row) => row.waktu_sampai_rujuk, width: "170px" },
                { name: 'Waktu Selesai', selector: (row) => row.waktu_selesai, width: "170px" },
                { name: 'Waktu Bersiap Kembali', selector: (row) => row.waktu_bersiap_kembali, width: "170px" },
                { name: 'Catatan', selector: (row) => row.catatan, width: "140px" },
                {
                    name: 'Aksi', cell: (row) =>
                        <div>
                            {row.status == "belum diterima" &&
                                <button type="button"
                                    id={row.id}
                                    onClick={() => oc_terima(row.id)}
                                    className="text-black bg-[#FDE68A] hover:bg-[#FDE68A] focus:ring-4 focus:ring-[#FDE68A] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#FDE68A] dark:hover:bg-[#FDE68A] focus:outline-none dark:focus:ring-[#FDE68A]">
                                    Terima
                                </button>
                            }
                            {row.status == "sudah diterima" &&
                                <div>
                                    <button type="button"
                                        id={row.id}
                                        onClick={() => oc_sampai_lokasi(row.id)}
                                        className="text-black mb-1 bg-[#c76dfc] hover:bg-[#c76dfc] focus:ring-4 focus:ring-[#c76dfc] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#c76dfc] dark:hover:bg-[#c76dfc] focus:outline-none dark:focus:ring-[#c76dfc]">
                                        Sampai Lokasi
                                    </button>
                                </div>
                            }
                            {row.status == "sampai lokasi" &&
                                <div>
                                    <button
                                        type="button"
                                        id={row.id}
                                        onClick={() => oc_selesai(row.id)}
                                        className="text-black mb-1 bg-[#eefa49] hover:bg-[#eefa49] focus:ring-4 focus:ring-[#eefa49] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#eefa49] dark:hover:bg-[#eefa49] focus:outline-none dark:focus:ring-[#eefa49]">
                                        Selesai
                                    </button>
                                    {/* <button type="button"
                                id={row.id}
                                onClick={()=>oc_ajukan_rujuk(row.id)}
                                    className="text-black bg-[#37ffde] hover:bg-[#37ffde] focus:ring-4 focus:ring-[#37ffde] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#37ffde] dark:hover:bg-[#37ffde] focus:outline-none dark:focus:ring-[#37ffde]">
                                    Ajukan Rujuk
                            </button> */}
                                    <button type="button"
                                        id={row.id}
                                        onClick={() => oc_rujuk(row.id)}
                                        className="text-black bg-[#37ffde] hover:bg-[#37ffde] focus:ring-4 focus:ring-[#37ffde] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#37ffde] dark:hover:bg-[#37ffde] focus:outline-none dark:focus:ring-[#37ffde]">
                                        Rujuk
                                    </button>
                                </div>
                            }
                            {row.status == "rujuk" &&
                                <button type="button"
                                    id={row.id}
                                    onClick={() => oc_sampai_rujuk(row.id)}
                                    className="text-black mb-1 bg-[#00B3FF] hover:bg-[#00B3FF] focus:ring-4 focus:ring-[#00B3FF] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#00B3FF] dark:hover:bg-[#00B3FF] focus:outline-none dark:focus:ring-[#00B3FF]">
                                    Sampai Rujuk
                                </button>
                            }
                            {row.status == "sampai rujuk" &&
                                <button type="button"
                                    id={row.id}
                                    onClick={() => oc_selesai(row.id)}
                                    className="text-black mb-1 bg-[#eefa49] hover:bg-[#eefa49] focus:ring-4 focus:ring-[#eefa49] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#eefa49] dark:hover:bg-[#eefa49] focus:outline-none dark:focus:ring-[#eefa49]">
                                    Selesai
                                </button>
                            }
                            {row.status == "selesai penanganan" &&
                                <button type="button"
                                    id={row.id}
                                    onClick={() => oc_bersiap_kembali(row.id)}
                                    className="text-black bg-[#80fa7c] hover:bg-[#80fa7c] focus:ring-4 focus:ring-[#80fa7c] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#80fa7c] dark:hover:bg-[#80fa7c] focus:outline-none dark:focus:ring-[#80fa7c]">
                                    Bersiap Kembali
                                </button>
                            }
                            {row.status == "selesai" &&
                                <button type="button"
                                    id={row.id}
                                    onClick={() => oc_catatan(row.id)}
                                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                                    Catatan
                                </button>
                            }
                            {row.status == "batal" &&
                                <div>
                                    <button type="button"
                                        id={row.id}
                                        onClick={() => oc_catatan(row.id)}
                                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                                        Catatan
                                    </button>
                                    <button type="button"
                                        id={row.id}
                                        onClick={() => oc_bersiap_kembali(row.id)}
                                        className="text-black bg-[#80fa7c] hover:bg-[#80fa7c] focus:ring-4 focus:ring-[#80fa7c] font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-[#80fa7c] dark:hover:bg-[#80fa7c] focus:outline-none dark:focus:ring-[#80fa7c]">
                                        Bersiap Kembali
                                    </button>
                                </div>
                            }
                            {row.status != "selesai" && row.status != "batal" &&
                                <button type="button"
                                    id={row.id}
                                    onClick={() => oc_batal(row.id)}
                                    className="text-white mt-1 bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800">
                                    Batal
                                </button>
                            }
                        </div>
                    , width: "130px"
                },
            ] :
                []

    const conditionalRowStyles = [
        {
            when: row => row.status.includes('belum diterima'),
            style: {
                backgroundColor: '#ff9292',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

        {
            when: row => row.status.includes('sampai lokasi'),
            style: {
                backgroundColor: '#c76dfc',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

        {
            when: row => row.status.includes('sudah diterima'),
            style: {
                backgroundColor: '#FDE68A',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

        {
            when: row => row.status === 'selesai penanganan',
            style: {
                backgroundColor: '#eefa49',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

        {
            when: row => row.status === 'selesai',
            style: {
                backgroundColor: '#BEF264',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

        {
            when: row => row.status.includes('batal'),
            style: {
                backgroundColor: '#F43F5E',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

        // {
        //     when: row => row.status=='ajukan rujuk',
        //     style: {
        //         backgroundColor: '#37ffde',
        //         color: 'black',
        //         '&:hover': {
        //         cursor: 'pointer',
        //         },
        //     },
        // },

        {
            when: row => row.status == 'rujuk',
            style: {
                backgroundColor: '#37ffde',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

        {
            when: row => row.status.includes('sampai rujuk'),
            style: {
                backgroundColor: '#00B3FF',
                color: 'black',
                '&:hover': {
                    cursor: 'pointer',
                },
            },
        },

    ];

    const cari = (e) => {
        // console.log("cariii")
        // console.log(e.target.value)
        set_val_cari(e.target.value);
        set_semua_order_cari(semua_order.filter((item) =>
            (item.nama_penelepon?.toLowerCase().includes(e.target.value) || false) ||
            (item.nama_pasien?.toLowerCase().includes(e.target.value) || false)
        ));
    }

    const handleTanggalDariChange = (event) => {
        setTanggalDari(event.target.value);
    };

    const handleTanggalSampaiChange = (event) => {
        setTanggalSampai(event.target.value);
    };

    const cari_data = () => {
        console.log('Tanggal Dari:', tanggalDari);
        console.log('Tanggal Sampai:', tanggalSampai);
        axios.post(window.location.origin + '/ref_order',
            {
                tanggal_dari: tanggalDari,
                tanggal_sampai: tanggalSampai
            }).then(function (response) {
                set_semua_order(response.data)
                set_semua_order_cari(response.data)
            })
    };

    const [modal, set_modal] = useState(false);

    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        waktu_order: new Date().toLocaleString('en-GB', {
            hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
        }).replace(",", ""),
        cara_order: '1500-132',
        no_penelepon: '',
        nama_penelepon: '',
        hubungan: '',
        nama_pasien: '',
        // umur_pasien: '',
        kasus: '',
        jenis_layanan: '',
        faskes_rujukan: '',
        kecamatan: '',
        kelurahan: '',
        nama_kecamatan: '',
        nama_kelurahan: '',
        alamat: '',
        latitude: '',
        longitude: '',
        lat_long: '',
        id_tim_ambulan: '',
        tim_ambulan: '',
        catatan: '',
    });

    const oc_data = (e) => {
        if (e.target.name == "kecamatan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            set_data(
                {
                    ...data,
                    ["kecamatan"]: option,
                    ["nama_kecamatan"]: e.target.value,
                });
            axios.post(window.location.origin + '/ref_kelurahan',
                {
                    kode_kecamatan: option,
                }).then(function (response) {
                    set_semua_kelurahan(response.data)
                })
        }
        else if (e.target.name == "kelurahan") {
            let index = e.target.selectedIndex;
            let el = e.target.childNodes[index]
            let option = el.getAttribute('id');
            // set_kode_kecamatan_identitas_pasien(option);
            set_data(
                {
                    ...data,
                    ["kelurahan"]: option,
                    ["nama_kelurahan"]: e.target.value,
                });
        }
        else if (e.target.name == "tim_ambulan") {
            let id;
            let ei = document.getElementById('dl_tim_ambulan');
            for (let i = 0; i < ei.childElementCount; i++) {
                if (ei.children[i].attributes.value.value == e.target.value) {
                    id = ei.children[i].attributes.id.value;
                }
            }
            set_data(
                {
                    ...data,
                    ["id_tim_ambulan"]: id,
                    ["tim_ambulan"]: e.target.value,
                });
        }
        else if (e.target.name == "lat_long") {
            const val = e.target.value
            const ar_val = val.split(',')
            const lat = ar_val[0]
            const long = ar_val[1]

            set_data(
                {
                    ...data,
                    ["lat_long"]: val,
                    ["latitude"]: lat,
                    ["longitude"]: long,
                });
        }
        else {
            const value = e.target.value;
            set_data({
                ...data,
                [e.target.name]: value,
            })
        }
    }

    function cek_no(str) {
        return /^\d+$/.test(str);
    }

    const oc_simpan = (e) => {
        let cek_cara_order = true
        if (data.cara_order == "" || data.cara_order == "-") {
            cek_cara_order = false
            toast.error("pilih cara order", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        let cek_no_penelepon = true
        if (data.no_penelepon != "" && !cek_no(data.no_penelepon)) {
            cek_no_penelepon = false;
            toast.error("No penelepon harus angka tidak boleh simbol", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }

        if (cek_cara_order && cek_no_penelepon) {
            if (edit) {
                axios.post(window.location.origin + '/order/edit',
                    {
                        id: data.id,
                        cara_order: data.cara_order,
                        nama_penelepon: data.nama_penelepon,
                        nama_pasien: data.nama_pasien,
                        no_penelepon: data.no_penelepon,
                        kasus: data.kasus,
                        alamat: data.alamat,
                        kecamatan: data.kecamatan,
                        kelurahan: data.kelurahan,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        waktu_order: data.waktu_order,
                        id_tim_ambulan: data.id_tim_ambulan,
                    }).then(function (response) {
                        // console.log("data3")
                        toast.success(response.data, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        set_edit(false)
                        set_null_data()
                        set_modal(false)
                        refresh_all_data()
                    })
            }
            else {
                axios.post(window.location.origin + '/order/tambah',
                    {
                        cara_order: data.cara_order,
                        nama_penelepon: data.nama_penelepon,
                        nama_pasien: data.nama_pasien,
                        no_penelepon: data.no_penelepon,
                        kasus: data.kasus,
                        alamat: data.alamat,
                        kecamatan: data.kecamatan,
                        kelurahan: data.kelurahan,
                        latitude: data.latitude,
                        longitude: data.longitude,
                        waktu_order: data.waktu_order,
                        id_tim_ambulan: data.id_tim_ambulan,
                    }).then(function (response) {
                        toast.success(response.data, {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        set_null_data()
                        set_modal(false)
                        refresh_all_data()
                    }).catch(function (error) {
                        toast.error("Gagal tambah order", {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                    });
            }
        }
    }

    function get_id_ref_order(id) {
        axios.post(window.location.origin + '/ref_order',
            {
                id: id,
            }).then(function (response) {
                console.log("get id")
                set_data({
                    ...data,
                    ['id']: id,
                    ['cara_order']: response.data.cara_order,
                    ['no_penelepon']: response.data.no_penelepon,
                    ['nama_penelepon']: response.data.nama_penelepon,
                    ['nama_pasien']: response.data.nama_pasien,
                    ['kasus']: response.data.kasus,
                    ['kecamatan']: response.data.ref_kecamatan.kode_kecamatan,
                    ['kelurahan']: response.data.ref_kelurahan.kode_kelurahan,
                    ['nama_kecamatan']: response.data.ref_kecamatan.nama_kecamatan,
                    ['nama_kelurahan']: response.data.ref_kelurahan.nama_kelurahan,
                    ['alamat']: response.data.alamat,
                    ['latitude']: response.data.latitude,
                    ['longitude']: response.data.longitude,
                    ['lat_long']: response.data.latitude + "," + response.data.longitude,
                    ['tim_ambulan']: response.data.tim_ambulan.nama_tim,
                    ['id_tim_ambulan']: response.data.id_tim_ambulan,
                    ['waktu_order']: response.data.waktu_order,
                    ['catatan']: response.data.catatan,
                })
                // console.log(response)
            })
    }

    function set_null_data() {
        set_data({
            ...data,
            ['id']: '',
            ['cara_order']: '',
            ['no_penelepon']: '',
            ['nama_penelepon']: '',
            ['nama_pasien']: '',
            // ['umur_pasien']: '',
            ['kasus']: '',
            ['kecamatan']: '',
            ['kelurahan']: '',
            ['nama_kecamatan']: '',
            ['nama_kelurahan']: '',
            ['alamat']: '',
            ['latitude']: '',
            ['longitude']: '',
            ['lat_long']: '',
            ['tim_ambulan']: '',
            ['waktu_order']: '',
            ['catatan']: '',
            ['faskes_rujukan']: '',
        })
    }

    function kirim_lokasi() {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;

            axios.post(window.location.origin + '/tim_ambulan/kirim_lokasi',
                {
                    latitude: latitude,
                    longitude: longitude,
                }).then(function (response) {
                    set_koorku({
                        ...koorku,
                        ["lat"]: latitude,
                        ["lng"]: longitude,
                    })
                    console.log("kirim lokasi")
                    console.log("lat" + latitude + " long" + longitude)

                    // console.log(response)
                    // set_semua_order(response.data)
                    // set_semua_order_cari(response.data)
                })
                // kirim_lokasi(latitude, longitude)

                // console.log("tim ambulan role")
                , (error) => console.warn(error.message),
                { enableHighAccuracy: true }
            // enableHighAccuracy=true
        })

    }

    // console.log("auth role")
    // console.log(auth.role)
    // console.log(koorku)
    // console.log(semua_kecamatan)

    // console.log(semua_kelurahan)
    // console.log(edit);
    // console.log(data)
    console.log(semua_order)
    // console.log(semua_tim_ambulan)
    // console.log(semua_tim_ambulan);

    function set_icon(url) {
        return new L.Icon({
            iconUrl: url,
            iconSize: [35, 37],
        });
    }

    useEffect(() => {
        set_data({
            ...data,
            ["waktu_order"]: new Date().toLocaleString('en-GB', {
                hour12: false, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric'
            }).replace(",", "")
        })
    }, [modal])

    function x() {
        set_modal(false)
        set_edit(false)
        set_modal_hapus(false)

        set_terima(false);
        set_sampai_lokasi(false);
        set_selesai(false);
        set_batal(false);
        set_catatan(false);
        set_ajukan_rujuk(false)
        set_rujuk(false)
        set_sampai_rujuk(false)
        set_bersiap_kembali(false)

        set_null_data()
    }

    const warna_tim_ambulan = [
        { text: 'Belum Diterima', text2: 'belum diterima', warna: '#ff9292' },
        { text: 'Sudah Diterima', text2: 'sudah diterima', warna: '#FDE68A' },
        { text: 'Sampai Lokasi', text2: 'sampai lokasi', warna: '#c76dfc' },
        { text: 'Batal', text2: 'batal', warna: '#F43F5E' },
        { text: 'Selesai', text2: 'selesai', warna: '#80fa7c' },
        { text: 'Rujuk', text2: 'rujuk', warna: '#37ffde' },
        { text: 'Sampai Rujuk', text2: 'sampai rujuk', warna: '#00B3FF' },
        { text: 'Selesai Penanganan', text2: 'selesai penanganan', warna: '#eefa49' },
    ];

    const warna_status = (status) => {
        const matchingStatus = warna_tim_ambulan.find(item => item.text2 == status);
        return matchingStatus ? matchingStatus.warna : '#FFFFFF'; // Default to white if no match
    };

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            <ToastContainer />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight">Order Ambulan Hebat</h1>
                    <p className="text-gray-500 text-sm mt-1 capitalize">{nama_hari_ini}, {day} {nama_bulan} {year}</p>
                </div>

                {auth.role === "admin" || auth.role === "Operator" ? (
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase text-right">Status Terakhir Tim</span>
                        <div className="flex flex-wrap gap-2 justify-end">
                            {semua_tim_ambulan.map((val, index) => (
                                val.order !== null && (
                                    <div
                                        key={`row-${index}`}
                                        style={{ backgroundColor: warna_status(val.order.status), color: 'black' }}
                                        className="text-xs font-medium rounded-full shadow-sm px-3 py-1.5 flex items-center justify-center transition-all hover:scale-105"
                                    >
                                        {val.nama_tim}
                                    </div>
                                )
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>

            {/* Action & Filter Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-5">

                {/* Top Row: Search & Add */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 text-sm"
                            placeholder="Cari nama pasien/penelepon..."
                            onChange={cari}
                        />
                    </div>

                    {auth.role !== "Tim Ambulan" && (
                        <button
                            type="button"
                            onClick={(e) => set_modal(true)}
                            className="h-[42px] px-5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors duration-300 shadow-sm shadow-red-200 flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Tambah Order
                        </button>
                    )}
                </div>

                {/* Legend Status Bar */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 flex items-center mr-2">Indikator:</span>
                    {warna_tim_ambulan.map((val, index) => (
                        <div key={index} style={{ backgroundColor: val.warna, color: 'black' }} className="text-xs font-medium rounded-md px-2.5 py-1 border border-black/5 flex items-center shadow-sm">
                            {val.text}
                        </div>
                    ))}
                </div>

                {/* Date Filter Row */}
                <div className="flex flex-col md:flex-row gap-4 items-end pt-2">
                    <div className="flex flex-col flex-1 w-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Tanggal Dari</label>
                        <input
                            type="date"
                            id="tanggal_dari"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 text-sm"
                            value={tanggalDari}
                            onChange={handleTanggalDariChange}
                        />
                    </div>
                    <div className="flex flex-col flex-1 w-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Tanggal Sampai</label>
                        <input
                            type="date"
                            id="tanggal_sampai"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 text-sm"
                            value={tanggalSampai}
                            onChange={handleTanggalSampaiChange}
                        />
                    </div>
                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        <button
                            onClick={cari_data}
                            type="button"
                            className="w-full md:w-[120px] h-[42px] bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors duration-300 shadow-sm flex items-center justify-center gap-2"
                        >
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* DataTable Wrapper */}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
                <div className="border border-gray-100 rounded-xl overflow-hidden mt-2">
                    <DataTable
                        columns={columns}
                        data={semua_order_cari}
                        pagination
                        onChangePage={(newPage) => set_page(newPage)}
                        highlightOnHover
                        conditionalRowStyles={conditionalRowStyles}
                        customStyles={{
                            headRow: {
                                style: {
                                    backgroundColor: '#f8fafc',
                                    color: '#475569',
                                    fontWeight: 'bold',
                                    fontSize: '13px',
                                    borderBottomWidth: '1px',
                                    borderBottomColor: '#f1f5f9',
                                },
                            },
                            rows: {
                                style: {
                                    fontSize: '14px',
                                    color: '#334155',
                                    minHeight: '56px',
                                    '&:not(:last-of-type)': {
                                        borderBottomStyle: 'solid',
                                        borderBottomWidth: '1px',
                                        borderBottomColor: '#f1f5f9',
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {modal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in transition-all">
                    {/* Modal Container */}
                    <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                                    {edit ? 'Edit' : 'Tambah'} Order Ambulan
                                </h3>
                                <p className="text-sm text-gray-500 font-medium mt-0.5">{data.waktu_order || "Waktu otomatis ditetapkan saat simpan"}</p>
                            </div>
                            <button
                                onClick={x}
                                className="text-gray-400 bg-transparent hover:bg-gray-100 hover:text-red-500 rounded-xl text-sm w-8 h-8 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                            {/* Grid Layout Formulir */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Cara Order */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Cara Order <span className="text-red-500">*</span></label>
                                    <select
                                        name="cara_order"
                                        value={data.cara_order}
                                        onChange={oc_data}
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                    >
                                        <option value="-">Pilih Cara Order</option>
                                        <option value="1500-132">1500-132</option>
                                        <option value="119">119</option>
                                        <option value="112">112</option>
                                        <option value="WA">WhatsApp</option>
                                        <option value="permintaan khusus">Permintaan Khusus</option>
                                    </select>
                                </div>

                                {/* No Penelepon */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">No. Penelepon</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="no_penelepon"
                                            value={data.no_penelepon}
                                            onChange={oc_data}
                                            placeholder="Contoh: 08123456789"
                                            className="pl-9 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Nama Penelepon */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Nama Penelepon</label>
                                    <input
                                        type="text"
                                        name="nama_penelepon"
                                        value={data.nama_penelepon}
                                        onChange={oc_data}
                                        placeholder="Masukkan nama penelepon"
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                    />
                                </div>

                                {/* Nama Pasien */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Nama Pasien</label>
                                    <input
                                        type="text"
                                        name="nama_pasien"
                                        value={data.nama_pasien}
                                        onChange={oc_data}
                                        placeholder="Masukkan nama pasien"
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                    />
                                </div>

                                {/* Kecamatan */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Kecamatan</label>
                                    <select
                                        id="id_select_kecamatan"
                                        name="kecamatan"
                                        value={data.nama_kecamatan}
                                        onChange={oc_data}
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                    >
                                        <option value="-">Pilih Kecamatan</option>
                                        {semua_kecamatan.map((opts, i) => (
                                            <option key={i} id={opts.kode_kecamatan} value={opts.nama_kecamatan}>{opts.nama_kecamatan}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Kelurahan */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700">Kelurahan</label>
                                    <select
                                        name="kelurahan"
                                        value={data.nama_kelurahan}
                                        onChange={oc_data}
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                    >
                                        <option value="-">Pilih Kelurahan</option>
                                        {semua_kelurahan.map((opts, i) => (
                                            <option key={i} id={opts.kode_kelurahan} value={opts.nama_kelurahan}>{opts.nama_kelurahan}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Alamat Detail */}
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Alamat Lengkap Kejadian/Penjemputan</label>
                                    <input
                                        type="text"
                                        name="alamat"
                                        value={data.alamat}
                                        onChange={oc_data}
                                        placeholder="Masukkan detail alamat (misal: RT/RW, Patokan)"
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none"
                                    />
                                </div>

                                {/* Kasus (Textarea) */}
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Deskripsi Kasus / Keluhan Pasien</label>
                                    <textarea
                                        name="kasus"
                                        value={data.kasus}
                                        onChange={oc_data}
                                        rows="3"
                                        placeholder="Jelaskan secara singkat kondisi pasien..."
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none custom-scrollbar"
                                    ></textarea>
                                </div>

                                {/* Tim Ambulan */}
                                <div className="flex flex-col gap-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Tugaskan Tim Ambulan</label>
                                    <input
                                        type="text"
                                        name="tim_ambulan"
                                        value={data.tim_ambulan}
                                        list="dl_tim_ambulan"
                                        onChange={oc_data}
                                        placeholder="Ketik atau pilih nama tim ambulan yang akan bertugas..."
                                        className="bg-white border border-gray-200 text-blue-800 font-medium text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all outline-none shadow-sm"
                                    />
                                    <datalist id="dl_tim_ambulan">
                                        {semua_tim_ambulan.map((opts, i) => (
                                            <option key={i} id={opts.id} value={opts.nama_tim}>{opts.nama_tim}</option>
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            {/* Koordinat & Peta */}
                            <div className="mt-2 pt-5 border-t border-gray-100 flex flex-col gap-5">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-600">
                                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                        Titik Koordinat Posisi Kejadian (Latitude & Longitude)
                                    </label>
                                    <input
                                        type="text"
                                        name="lat_long"
                                        value={data.lat_long}
                                        onChange={oc_data}
                                        placeholder="-6.986802, 110.414652"
                                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-red-500 focus:border-red-500 block w-full p-2.5 transition-all font-mono outline-none"
                                    />
                                    <p className="text-xs text-gray-500">Pisahkan dengan koma (contoh: -6.98..., 110.41...). Jika koordinat valid, peta akan otomatis muncul.</p>
                                </div>

                                {data.latitude && data.longitude && (
                                    <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
                                        <MapContainer
                                            center={[parseFloat(data.latitude), parseFloat(data.longitude)]}
                                            zoom={14}
                                            style={{ width: "100%", height: "350px", zIndex: 0 }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker
                                                position={[parseFloat(data.latitude), parseFloat(data.longitude)]}
                                                icon={set_icon("assets/img/marker-map.png")}
                                            >
                                                <Popup>Lokasi Kejadian/Pasien</Popup>
                                            </Marker>
                                            {semua_tim_ambulan.map((value, idx) => {
                                                if (value.latitude !== null && value.status == "bersiap") {
                                                    return (
                                                        <Marker
                                                            key={idx}
                                                            position={[parseFloat(value.latitude), parseFloat(value.longitude)]}
                                                            icon={set_icon("gambar/tim_ambulan/" + value.gambar)}
                                                        >
                                                            <Popup>{value.nama_tim}</Popup>
                                                        </Marker>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </MapContainer>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer - Sticky Bottom */}
                        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 bg-gray-50/80 shrink-0 gap-3">
                            <button
                                type="button"
                                onClick={x}
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-red-700 focus:ring-4 focus:ring-gray-100 transition-all outline-none"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={oc_simpan}
                                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 focus:ring-4 focus:ring-red-300 transition-all shadow-sm shadow-red-200 flex items-center gap-2 outline-none"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                </svg>
                                Simpan Order Ambulan
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Modal Hapus Order */}
            {modal_hapus &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up">
                        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50">
                            <h3 className="font-bold text-red-700 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Hapus Order
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4 font-medium">Apakah Anda yakin ingin <span className="font-bold text-red-600">menghapus</span> order ini secara permanen?</p>

                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2 mb-6 border border-gray-100 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Waktu
                                    </span>
                                    <span className="font-medium text-gray-800">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-100 inline-block w-full">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Lokasi</span>
                                    <span className="font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-100 inline-block w-full text-xs line-clamp-2" title={`${data.alamat} kel. ${data.nama_kelurahan} kec. ${data.nama_kecamatan}`}>
                                        {data.alamat} kel. {data.nama_kelurahan} kec. {data.nama_kecamatan}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Kasus</span>
                                    <span className="font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-100 inline-block w-full text-xs">
                                        {data.kasus || "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                    Batal
                                </button>
                                <button type="button" onClick={() => oc_hapus_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                terima &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Apakah Anda Ingin Menerima Order?
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-center">{data.waktu_order}</div>
                            <div>Nama Penelepon: {data.nama_penelepon}</div>
                            <div>Lokasi: {data.alamat + " kel. " + data.nama_kelurahan + " kec." + data.nama_kecamatan}</div>
                            <div>Kasus: {data.kasus}</div>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_terima_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }
            {
                sampai_lokasi &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Apakah Sudah Sampai Lokasi Order?
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-center">{data.waktu_order}</div>
                            <div>Nama Penelepon: {data.nama_penelepon}</div>
                            <div>Lokasi: {data.alamat + " kel. " + data.nama_kelurahan + " kec." + data.nama_kecamatan}</div>
                            <div>Kasus: {data.kasus}</div>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_sampai_lokasi_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }
            {
                selesai &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Apakah Order Sudah Selesai?
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-center">{data.waktu_order}</div>
                            <div>Nama Penelepon: {data.nama_penelepon}</div>
                            <div>Lokasi: {data.alamat + " kel. " + data.nama_kelurahan + " kec." + data.nama_kecamatan}</div>
                            <div>Kasus: {data.kasus}</div>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_selesai_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }
            {/* Modal Batal Order */}
            {batal &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border-[1.5px] border-red-100">
                        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50/80 backdrop-blur-md">
                            <h3 className="font-bold text-red-700 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                Batalkan Order
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4 font-medium text-center">Apakah Anda ingin <span className="font-bold text-red-600">membatalkan</span> order layanan ambulan ini?</p>

                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-sm text-gray-700 space-y-2.5 mb-6 border border-gray-200/60 shadow-inner">
                                <div className="flex justify-between items-center pb-2 border-b border-gray-200/80">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Waktu Order
                                    </span>
                                    <span className="font-bold text-gray-800 bg-white px-2 py-0.5 rounded shadow-sm border border-gray-100">{data.waktu_order}</span>
                                </div>
                                <div className="pt-1">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Penelepon</span>
                                    <span className="font-semibold text-gray-800 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 block w-full shadow-sm">{data.nama_penelepon || "-"}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Lokasi Kejadian</span>
                                    <span className="font-medium text-gray-800 bg-white px-2.5 py-2 rounded-lg border border-gray-100 block w-full text-xs leading-relaxed shadow-sm">
                                        {data.alamat} <br />
                                        <span className="text-gray-500">Kel. {data.nama_kelurahan}, Kec. {data.nama_kecamatan}</span>
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Kasus / Rincian</span>
                                    <span className="font-medium text-gray-800 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 block w-full text-xs border-l-2 border-l-red-400 shadow-sm">
                                        {data.kasus || "-"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:ring-2 focus:ring-gray-100 transition-all active:scale-95">
                                    Tidak, Kembali
                                </button>
                                <button type="button" onClick={() => oc_batal_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 rounded-xl hover:from-red-700 hover:to-rose-700 focus:ring-2 focus:ring-red-200 focus:ring-offset-1 transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2 active:scale-95">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Ya, Batalkan
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                catatan &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Catatan Order
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-center">{data.waktu_order}</div>
                            <div>Nama Penelepon: {data.nama_penelepon}</div>
                            <div>Lokasi: {data.alamat + " kel. " + data.nama_kelurahan + " kec." + data.nama_kecamatan}</div>
                            <div>Kasus: {data.kasus}</div>
                            <div>Catatan: <input type="text" name="catatan" value={data.catatan} onChange={oc_data}></input></div>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_catatan_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }
            {
                rujuk &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Apakah Anda Ingin Merujuk Order?
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-center">{data.waktu_order}</div>
                            <div>Nama Penelepon: {data.nama_penelepon}</div>
                            <div>Lokasi: {data.alamat + " kel. " + data.nama_kelurahan + " kec." + data.nama_kecamatan}</div>
                            <div>Kasus: {data.kasus}</div>
                            {/* <div>Rumah Sakit: 
                        <input className="text-xxs md:text-sm sm:text-xs p-0"
                            type = "text"
                            name = "faskes_rujukan"
                            value={data.faskes_rujukan}
                            list="dl_rs"
                            onChange={oc_data}
                            />
                            <datalist id="dl_rs">
                                {semua_rs.map((opts,i)=><option key={i} id={opts.id} value={opts.nama}>{opts.nama}</option>)}
                            </datalist>
                    </div> */}
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_rujuk_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }
            {
                rujuk &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Apakah Anda Ingin Rujuk Order?
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-center">{data.waktu_order}</div>
                            <div>Nama Penelepon: {data.nama_penelepon}</div>
                            <div>Lokasi: {data.alamat + " kel. " + data.nama_kelurahan + " kec." + data.nama_kecamatan}</div>
                            <div>Kasus: {data.kasus}</div>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_rujuk_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }
            {/* {
            ajukan_rujuk &&
            <div className="flex justify-center fixed top-[25%] left-0 right-0">
                <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                    <div className="flex justify-end font-bold">
                        <button onClick={(e)=>x()}>X</button>
                    </div>
                    <div className="flex justify-center font-bold mt-2">
                        Apakah Anda Ingin Mengajukan Rujuk Order?
                    </div>
                    <div className="mt-3">
                        <div className="flex justify-center">{data.waktu_order}</div>
                        <div>Nama Penelepon: {data.nama_penelepon}</div>
                        <div>Lokasi: {data.alamat+" kel. "+data.nama_kelurahan+" kec."+data.nama_kecamatan}</div>
                        <div>Kasus: {data.kasus}</div>
                    </div>
                    <div className="mt-2 flex justify-center">
                        <button type="button"
                            onClick={()=>oc_ajukan_rujuk_simpan(data.id)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                    </div>
                </div>
            </div>
        } */}
            {
                sampai_rujuk &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Apakah Sudah Sampai Tempat Rujuk?
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-center">{data.waktu_order}</div>
                            <div>Nama Penelepon: {data.nama_penelepon}</div>
                            <div>Lokasi: {data.alamat + " kel. " + data.nama_kelurahan + " kec." + data.nama_kecamatan}</div>
                            <div>Kasus: {data.kasus}</div>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_sampai_rujuk_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }
            {
                bersiap_kembali &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7 border border-red-500">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Apakah Anda Sudah Bersiap Kembali?
                        </div>
                        <div className="mt-3">
                            <div className="flex justify-center">{data.waktu_order}</div>
                            <div>Nama Penelepon: {data.nama_penelepon}</div>
                            <div>Lokasi: {data.alamat + " kel. " + data.nama_kelurahan + " kec." + data.nama_kecamatan}</div>
                            <div>Kasus: {data.kasus}</div>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_bersiap_kembali_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

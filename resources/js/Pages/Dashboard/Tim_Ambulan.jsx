import React, { useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import "leaflet/dist/leaflet.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import L from 'leaflet';

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

export default function Tim_Ambulan() {
    const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [semua_ambulan_cari, set_semua_ambulan_cari] = useState([]);

    const [edit, set_edit] = useState(false);

    const [val_cari, set_val_cari] = useState('');

    useEffect(() => {
        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_tim_ambulan(response.data)
                set_semua_ambulan_cari(response.data)
                console.log(response)
            })
    }, [])

    useEffect(() => {
        const invtime = setInterval(() => {
            if (!val_cari) {
                // set_val_cari('');
                // axios.post(window.location.origin+'/ref_order',
                axios.post(window.location.origin + '/ref_tim_ambulan',
                    {
                        // tanggung_jawab:'Dokter',
                    }).then(function (response) {
                        // set_semua_petugas(response.data)
                        set_semua_tim_ambulan(response.data)
                        set_semua_ambulan_cari(response.data)
                        console.log(response)
                    })
            }

        }, 10000)

        return () => {
            clearInterval(invtime);
        };

        // },[])
    }, [val_cari])

    const oc_hapus = (id) => {
        // router.post('/hapus_tim_ambulan', {
        //     id:id,
        // })
        console.log(id)
        console.log("ochapus");
        set_modal_hapus(true)

        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['id_admin']: response.data.user.id,
                    ['gambar']: response.data.gambar,
                    ['nama_tim']: response.data.nama_tim,
                    ['latitude']: response.data.latitude,
                    ['longitude']: response.data.longitude,
                    ['username_admin']: response.data.user.username,
                    ['status']: response.data.status,
                })
                console.log(response)
            })


        // axios.post(window.location.origin+'/ref_tim_ambulan',
        // {
        //     // tanggung_jawab:'Dokter',
        // }).then(function (response){
        //     // set_semua_petugas(response.data)
        //     set_semua_tim_ambulan(response.data)
        //     set_semua_ambulan_cari(response.data)
        //     console.log(response)
        // })
    }

    const oc_hapus_simpan = (id) => {
        console.log("id")
        console.log(id)
        router.post('/hapus_tim_ambulan', {
            id: id,
        })
        set_modal_hapus(false)

        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_tim_ambulan(response.data)
                set_semua_ambulan_cari(response.data)
                console.log(response)
            })

        set_null_data()
    }

    const oc_edit = (id) => {
        // console.log("edit"+id)
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['id_admin']: response.data.user ? response.data.user.id : '',
                    ['gambar']: response.data.gambar,
                    ['nama_tim']: response.data.nama_tim,
                    ['homebase']: response.data.homebase,
                    ['longitude']: response.data.longitude,
                    ['latitude']: response.data.latitude,
                    ['username_admin']: response.data.user ? response.data.user.username : '',
                    ['status']: response.data.status,
                    ['idk_navara']: response.data.idk_navara,
                    ['id_assets_navara']: response.data.id_assets_navara,
                    ['jenis_bb']: response.data.jenis_bb,
                    ['masa_berlaku_stnk']: response.data.masa_berlaku_stnk,
                    ['merk']: response.data.merk,
                    ['no_mesin']: response.data.no_mesin,
                    ['no_polisi']: response.data.no_polisi,
                    ['no_rangka']: response.data.no_rangka,
                    ['no_stnk']: response.data.no_stnk,
                    ['tahun_perolehan']: response.data.tahun_perolehan,
                    ['tipe']: response.data.tipe,
                })
                // console.log("editt"+id)
                // console.log(response)
            })
        // console.log("hapus"+id);
    }

    const [page, set_page] = useState([0]);

    const columns = [
        { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        {
            name: 'Gambar', selector: (row) =>
                <img src={row.gambar != null ? "/gambar/tim_ambulan/" + row.gambar : ''}></img>
            , width: "130px"
        },
        { name: 'Nama Tim', selector: (row) => row.nama_tim, width: "190px" },
        { name: 'Homebase', selector: (row) => row.homebase, width: "170px" },
        { name: 'Merk', selector: (row) => row.merk, width: "190px" },
        { name: 'Tipe', selector: (row) => row.tipe, width: "190px" },
        { name: 'No Polisi', selector: (row) => row.no_polisi, width: "190px" },
        { name: 'Latitude', selector: (row) => row.latitude, width: "150px" },
        { name: 'Longitude', selector: (row) => row.longitude, width: "150px" },
        { name: 'Status', selector: (row) => row.status, width: "130px" },
        {
            name: 'Action', cell: (row) =>
                <div className="flex gap-2">
                    <button type="button" id={row.id} onClick={() => oc_hapus(row.id)} className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-1.5 transition-colors shadow-sm">
                        Hapus
                    </button>
                    <button type="button" id={row.id} onClick={() => oc_edit(row.id)} className="text-white bg-slate-700 hover:bg-slate-800 font-medium rounded-lg text-sm px-4 py-1.5 transition-colors shadow-sm">
                        Edit
                    </button>
                </div>
        },
    ]

    const conditionalRowStyles = [
        // {
        //   when: row => row.tanggung_jawab.includes('Driver'),
        //   style: {
        //     backgroundColor: 'green',
        //     color: 'white',
        //     '&:hover': {
        //       cursor: 'pointer',
        //     },
        //   },
        // },

        // {
        //   when: row => row.tanggung_jawab.includes('Dokter'),
        // //   style: row => ({
        // //     // backgroundColor: row.phone.startsWith('9') || row.phone.startsWith('1') ? 'pink' : 'inerit',
        // //   }),
        //   style: {
        //     backgroundColor: 'blue',
        //     color: 'white',
        //     '&:hover': {
        //       cursor: 'pointer',
        //     },
        //   },
        // },
    ];

    const cari = (e) => {
        // console.log(e.target.value)
        // console.log(semua_admin)
        set_val_cari(e.target.value);

        set_semua_ambulan_cari(semua_tim_ambulan.filter((item) =>
            item.nama_tim.toLowerCase().includes(e.target.value)
            // ||
            // item.username.toLowerCase().includes(e.target.value)
            // ||
            // item.role.includes(e.target.value)
        ))
    }

    const [modal, set_modal] = useState(false);

    const [data, set_data] = useState({
        id: '',
        id_admin: '',
        username_admin: '',
        gambar: '',
        gambar_baru: '',
        nama_tim: '',
        longitude: '',
        latitude: '',
        status: '',
        idk_navara: '',
        id_assets_navara: '',
        jenis_bb: '',
        masa_berlaku_stnk: '',
        merk: '',
        no_mesin: '',
        no_polisi: '',
        no_rangka: '',
        tahun_perolehan: '',
        tipe: '',
        homebase: '',
    });

    const oc_data = (e) => {
        // console.log("oc");
        if (e.target.name == "gambar" || e.target.name == "gambar_baru") {
            const value = e.target.files[0];
            // console.log(value);
            set_data({
                ...data,
                [e.target.name]: value,
            })
        }
        else {
            const value = e.target.value;
            set_data({
                ...data,
                [e.target.name]: value,
            })
        }
    }

    const oc_simpan = (e) => {
        console.log(data)
        if (edit) {
            axios.post(window.location.origin + '/tim_ambulan/edit',
                {
                    id: data.id,
                    gambar: data.gambar,
                    gambar_baru: data.gambar_baru,
                    id_admin: data.id_admin,
                    nama_tim: data.nama_tim,
                    homebase: data.homebase,
                    longitude: data.longitude,
                    latitude: data.latitude,
                    status: data.status,
                },
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(function (response) {
                    // console.log("update")
                    // console.log(response)
                    toast.success(response.data, {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // console.log(response)
                })

            set_edit(false)
        }
        else {
            // console.log("tambah")
            router.post('/tambah_simpan_tim_ambulan', {
                gambar: data.gambar,
                id_admin: data.id_admin,
                nama_tim: data.nama_tim,
                longitude: data.longitude,
                latitude: data.latitude,
                status: data.status,
            })

            toast.success("Berhasil tambah data", {
                position: toast.POSITION.TOP_RIGHT,
            });
        }


        set_modal(false)
        // alert("berhasil disimpan")


        axios.post(window.location.origin + '/ref_tim_ambulan',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_tim_ambulan(response.data)
                set_semua_ambulan_cari(response.data)
                console.log(response)
            })

        set_null_data()
    }

    const oc_cari_username_admin = () => {
        // console.log(data.username_admin)
        axios.post(window.location.origin + '/ref_username_admin',
            {
                username: data.username_admin,
            }).then(function (response) {
                if (response.data == "") {
                    set_data({
                        ...data,
                        ['id_admin']: '',
                        ['username_admin']: '',
                    })
                    toast.error("username tidak ditemukan harap buat akun admin dengan role tim ambulan", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // alert("username tidak ditemukan harap buat akun admin dengan role tim ambulan")
                }
                else {
                    set_data({
                        ...data,
                        ['id_admin']: response.data.id,
                    })
                    toast.success("username berhasil ditemukan", {
                        position: toast.POSITION.TOP_RIGHT,
                    });
                    // alert("username berhasil ditemukan")
                }
                console.log(response)
            })
    }

    const [modal_hapus, set_modal_hapus] = useState(false);

    function set_icon(url) {
        return new L.Icon({
            iconUrl: url,
            iconSize: [35, 37],
        });
    }

    const warna_tim_ambulan = [
        { text2: 'belum diterima', warna: '#ff9292' },
        { text2: 'sudah diterima', warna: '#FDE68A' },
        { text2: 'sampai lokasi', warna: '#c76dfc' },
        { text2: 'batal', warna: '#F43F5E' },
        { text2: 'selesai', warna: '#80fa7c' },
        { text2: 'rujuk', warna: '#37ffde' },
        { text2: 'sampai rujuk', warna: '#00B3FF' },
        { text2: 'selesai penanganan', warna: '#eefa49' },
    ];

    const warna_status = (status) => {
        console.log(status)
        const matchingStatus = warna_tim_ambulan.find(item => item.text2 == status);
        console.log(matchingStatus)
        return matchingStatus ? matchingStatus.warna : '#FFFFFF'; // Default to white if no match
    };

    const createCustomIcon = (imageUrl, warna) =>
        new L.divIcon({
            className: 'custom-marker',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            html: `<div style="position: relative; width: 100%; height: 100%;">
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; overflow: hidden;">
                            <img src="${imageUrl}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
                        </div>
                    </div>
                    <div class="w-[15px] h-[15px]">
                        <div class="w-[15px] h-[15px] rounded-full bg-[${warna}]"></div>
                    </div>`,
        });

    function x() {
        set_modal(false)
        if (edit) {
            set_edit(false)
        }
        if (modal_hapus) {
            set_modal_hapus(false)
        }

        set_null_data()
    }

    function set_null_data() {
        set_data({
            ...data,
            ['id']: '',
            ['id_admin']: '',
            ['gambar']: '',
            ['gambar_baru']: '',
            ['nama_tim']: '',
            ['homebase']: '',
            ['latitude']: '',
            ['longitude']: '',
            ['username_admin']: '',
            ['status']: '',
            ['idk_navara']: '',
            ['id_assets_navara']: '',
            ['jenis_bb']: '',
            ['masa_berlaku_stnk']: '',
            ['merk']: '',
            ['no_mesin']: '',
            ['no_polisi']: '',
            ['no_rangka']: '',
            ['tahun_perolehan']: '',
            ['tipe']: '',
        })
    }

    // console.log(edit);
    // console.log(data)

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            <ToastContainer />

            {/* Header */}
            <div>
                <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight">Tim Ambulan Hebat</h1>
                <p className="text-gray-500 text-sm mt-1">Pantau lokasi tim dan kelola armada</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 overflow-hidden isolate">
                <MapContainer
                    center={[-6.9806919, 110.3962768]}///simpang lima
                    zoom="11"
                    style={{ width: "100%", height: "300px", zIndex: 0, borderRadius: "12px" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {semua_tim_ambulan.map((value, idx) => {
                        if (value.latitude !== null && value.longitude !== null) {
                            return (
                                <Marker key={idx}
                                    position={[value.latitude, value.longitude]}
                                    icon={createCustomIcon("gambar/tim_ambulan/" + value.gambar, value.order ? warna_status(value.order.status) : warna_status("batal"))}>
                                    <Popup>
                                        <div className="font-bold text-gray-800">{value.nama_tim}</div>
                                        <div className="text-xs text-gray-500 capitalize">{value.order ? value.order.status : 'Standby / Batal'}</div>
                                    </Popup>
                                </Marker>
                            );
                        } else {
                            return null;
                        }
                    })}
                </MapContainer>
            </div>
            {/* Action & Filter Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <input type="text" onChange={cari} placeholder="Cari tim ambulan..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm" />
                </div>

                <button type="button" onClick={(e) => set_modal(true)} className="h-[42px] px-5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                    + Tambah Tim
                </button>
            </div>

            {/* DataTable */}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
                <div className="border border-gray-100 rounded-xl overflow-hidden mt-2">
                    <DataTable columns={columns} data={semua_ambulan_cari}
                        pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles}
                        customStyles={{
                            headRow: { style: { backgroundColor: '#f8fafc', color: '#475569', fontWeight: 'bold', fontSize: '13px', borderBottomWidth: '1px', borderBottomColor: '#f1f5f9' } },
                            rows: { style: { fontSize: '14px', color: '#334155', minHeight: '56px', '&:not(:last-of-type)': { borderBottomStyle: 'solid', borderBottomWidth: '1px', borderBottomColor: '#f1f5f9' } } },
                        }}
                    />
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            {modal &&
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden scale-100 animate-scale-up max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50 shrink-0">
                            <h3 className="font-bold text-gray-800 text-lg">{edit ? 'Edit' : 'Tambah'} Tim Ambulan</h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Media & Core Info */}
                                <div className="flex flex-col gap-4">
                                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1 border-gray-100 mb-1">Informasi Dasar</div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Foto Tim</label>
                                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            {edit && data.gambar && (
                                                <img src={"/gambar/tim_ambulan/" + data.gambar} className="w-16 h-16 rounded-lg object-cover shadow-sm border border-white" />
                                            )}
                                            <input type="file" name={edit ? 'gambar_baru' : 'gambar'} onChange={oc_data} className="text-xs text-gray-600 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 transition-all cursor-pointer w-full" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Username Admin</label>
                                        <div className="flex gap-2">
                                            <input type="text" name="username_admin" placeholder="Username admin..." className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm" value={edit ? data.username_admin : ''} onChange={oc_data} />
                                            <button className="px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm active:scale-95" type="button" onClick={oc_cari_username_admin}>Cari</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Tim</label>
                                        <input type="text" name="nama_tim" placeholder="Masukkan nama tim..." className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm" value={data.nama_tim} onChange={oc_data} />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Homebase</label>
                                        <input type="text" name="homebase" placeholder="Lokasi homebase..." className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm" value={data.homebase} onChange={oc_data} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Latitude</label>
                                            <input type="text" name="latitude" placeholder="0.000" className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm" value={data.latitude} onChange={oc_data} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Longitude</label>
                                            <input type="text" name="longitude" placeholder="0.000" className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm" value={data.longitude} onChange={oc_data} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Status Tim</label>
                                        <select name="status" className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all shadow-sm cursor-pointer" value={data.status} onChange={oc_data}>
                                            <option value="-">Pilih Status</option>
                                            <option value="bersiap">Bersiap</option>
                                            <option value="non aktif">Non Aktif</option>
                                            <option value="sedang berjalan">Sedang Berjalan</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Right Column: Asset Specs (Read Only) */}
                                <div className="flex flex-col gap-4">
                                    <div className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b pb-1 border-gray-100 mb-1">Spesifikasi Aset (Navara)</div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">ID Assets Navara</label>
                                        <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.id_assets_navara || '-'} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Merk</label>
                                            <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.merk || '-'} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tipe</label>
                                            <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.tipe || '-'} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">No Mesin</label>
                                            <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.no_mesin || '-'} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">No Polisi</label>
                                            <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.no_polisi || '-'} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">No Rangka</label>
                                            <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.no_rangka || '-'} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Jenis Bensin</label>
                                            <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.jenis_bb || '-'} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">No STNK</label>
                                        <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.no_stnk || '-'} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Masa Berlaku STNK</label>
                                            <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.masa_berlaku_stnk || '-'} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Tahun Perolehan</label>
                                            <input type="text" className="bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed shadow-inner" readOnly value={data.tahun_perolehan || '-'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end bg-slate-50 shrink-0">
                            <button type="button" onClick={() => x()} className="px-5 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                Batal
                            </button>
                            <button type="button" onClick={oc_simpan} className="px-8 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-md shadow-red-200 active:scale-95 transition-all flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {edit ? 'Simpan Perubahan' : 'Tambah Tim'}
                            </button>
                        </div>
                    </div>
                </div>}

            {
                modal_hapus &&
                <div className="flex justify-center fixed top-[25%] left-0 right-0">
                    <div className="bg-white pt-2 pb-7 pl-7 pr-7">
                        <div className="flex justify-end font-bold">
                            <button onClick={(e) => x()}>X</button>
                        </div>
                        <div className="flex justify-center font-bold mt-2">
                            Apakah Anda Yakin Hapus Tim Ambulan
                        </div>
                        <div className="mt-3">
                            <div>Nama Tim: {data.nama_tim}</div>
                        </div>
                        <div className="mt-2 flex justify-center">
                            <button type="button"
                                onClick={() => oc_hapus_simpan(data.id)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Ya</button>
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}

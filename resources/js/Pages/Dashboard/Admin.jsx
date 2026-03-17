import React, { useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";

export default function Admin() {
    const [semua_admin, set_semua_admin] = useState([]);
    const [semua_admin_cari, set_semua_admin_cari] = useState([]);

    const [edit, set_edit] = useState(false);

    useEffect(() => {
        axios.post(window.location.origin + '/ref_admin',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_admin(response.data)
                set_semua_admin_cari(response.data)
                console.log(response)
            })
    }, [])

    const oc_hapus = (id) => {
        axios.post(window.location.origin + '/ref_admin',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['nama']: response.data.name,
                    ['username']: response.data.username,
                    ['role']: response.data.role,
                })
                // console.log(response)
            })

        set_modal_hapus(true)

        // console.log("hapus"+id);
    }

    const oc_hapus_simpan = (id) => {
        // console.log("hpaus id")
        console.log(id)
        router.post('/hapus_admin', {
            id: id,
        })

        axios.post(window.location.origin + '/ref_admin',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_admin(response.data)
                set_semua_admin_cari(response.data)
                console.log(response)
            })

        set_modal_hapus(false)
    }

    const oc_edit = (id) => {
        // console.log("edit")
        set_edit(true);

        set_modal(true)

        axios.post(window.location.origin + '/ref_admin',
            {
                id: id,
            }).then(function (response) {
                set_data({
                    ...data,
                    ['id']: id,
                    ['nama']: response.data.name,
                    ['username']: response.data.username,
                    ['role']: response.data.role,
                })
                console.log(response)
            })
        // console.log("hapus"+id);
    }

    const [page, set_page] = useState([0]);

    const columns = [
        { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        { name: 'Nama', selector: (row) => row.name, width: "250px" },
        { name: 'Username', selector: (row) => row.username, width: "250px" },
        { name: 'Role', selector: (row) => row.role, width: "140px" },
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
        console.log(e.target.value)
        console.log(semua_admin)
        set_semua_admin_cari(semua_admin.filter((item) =>
            item.name.toLowerCase().includes(e.target.value)
            ||
            item.username.toLowerCase().includes(e.target.value)
            // ||
            // item.role.includes(e.target.value)
        ))
    }

    const [modal, set_modal] = useState(false);

    const [modal_hapus, set_modal_hapus] = useState(false);

    const [data, set_data] = useState({
        id: '',
        nama: '',
        username: '',
        password: '',
        role: '',
    });

    const oc_data = (e) => {
        // console.log("oc");
        const value = e.target.value;
        set_data({
            ...data,
            [e.target.name]: value,
        })
    }

    const oc_simpan = (e) => {
        // console.log(data)
        if (edit) {
            router.post('/edit_simpan_admin', {
                id: data.id,
                nama: data.nama,
                username: data.username,
                password: data.password,
                role: data.role,
            })
            set_edit(false)
        }
        else {
            router.post('/tambah_simpan_admin', {
                nama: data.nama,
                username: data.username,
                password: data.password,
                role: data.role,
            })
        }

        set_modal(false)
        alert("berhasil disimpan")

        axios.post(window.location.origin + '/ref_admin',
            {
                // tanggung_jawab:'Dokter',
            }).then(function (response) {
                // set_semua_petugas(response.data)
                set_semua_admin(response.data)
                set_semua_admin_cari(response.data)
                console.log(response)
            })

        set_null_data()
    }

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
            ['nama']: '',
            ['username']: '',
            ['password']: '',
            ['role']: '',
        })
    }
    console.log(edit);
    console.log(data)

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            {/* Header */}
            <div>
                <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight">Admin Ambulan Hebat</h1>
                <p className="text-gray-500 text-sm mt-1">Kelola data admin dan hak akses</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <input type="text" onChange={cari} placeholder="Cari Admin..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-sm" />
                </div>
                <button type="button"
                    onClick={(e) => set_modal(true)}
                    className="h-[42px] px-5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors shadow-sm shadow-red-200 flex items-center justify-center gap-2"> + Tambah</button>
            </div>

            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
                <div className="border border-gray-100 rounded-xl overflow-hidden mt-2">
                    <DataTable columns={columns} data={semua_admin_cari}
                        pagination onChangePage={set_page} highlightOnHover conditionalRowStyles={conditionalRowStyles}
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

            {/* Modal Tambah/Edit */}
            {modal &&
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden scale-100 animate-scale-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-gray-800 text-lg">{edit ? 'Edit' : 'Tambah'} Admin</h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700">Nama Lengkap <span className="text-red-500">*</span></label>
                                <input type="text" name="nama" value={data.nama} onChange={oc_data} placeholder="Masukkan nama" className="bg-gray-50 border border-gray-200 rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 text-sm transition-all shadow-sm" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700">Username <span className="text-red-500">*</span></label>
                                <input type="text" name="username" value={data.username} onChange={oc_data} placeholder="Masukkan username" className="bg-gray-50 border border-gray-200 rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 text-sm transition-all shadow-sm" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700">Password {edit ? <span className="text-xs text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span> : <span className="text-red-500">*</span>}</label>
                                <input type="password" name="password" value={data.password} onChange={oc_data} placeholder="Masukkan password" className="bg-gray-50 border border-gray-200 rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 text-sm transition-all shadow-sm" />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-gray-700">Role Sistem <span className="text-red-500">*</span></label>
                                <select name="role" value={data.role} onChange={oc_data} className="bg-gray-50 border border-gray-200 rounded-xl w-full p-2.5 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 text-sm transition-all shadow-sm font-medium text-gray-700 cursor-pointer">
                                    <option value="-">Pilih Role Akses</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Bidan">Bidan</option>
                                    <option value="Dokter">Dokter</option>
                                    <option value="Driver">Driver</option>
                                    <option value="Operator">Operator</option>
                                    <option value="Perawat">Perawat</option>
                                    <option value="Tim Ambulan">Tim Ambulan</option>
                                </select>
                            </div>

                            <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">
                                    Batal
                                </button>
                                <button type="button" onClick={oc_simpan} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-sm shadow-red-200 active:scale-95 transition-all flex justify-center items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    Simpan Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}

            {/* Modal Hapus */}
            {modal_hapus &&
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-scale-up border-[1px] border-red-50">
                        <div className="px-6 py-4 border-b border-red-100 flex justify-between items-center bg-red-50">
                            <h3 className="font-bold text-red-700 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Hapus Akun
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors bg-white rounded-full p-1 hover:bg-red-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4 font-medium text-center">Apakah Anda yakin ingin menghapus akses akun ini?</p>
                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2 mb-6 border border-gray-100 shadow-inner">
                                <div className="flex justify-between pb-1 border-b border-gray-200">
                                    <span className="text-gray-500 font-semibold">Nama</span>
                                    <span className="font-bold text-gray-800">{data.nama}</span>
                                </div>
                                <div className="flex justify-between pb-1 border-b border-gray-200 pt-1">
                                    <span className="text-gray-500 font-semibold">Username</span>
                                    <span className="font-medium text-gray-800">{data.username}</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span className="text-gray-500 font-semibold">Role</span>
                                    <span className="font-medium px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-xs uppercase tracking-wider">{data.role}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-2">
                                <button type="button" onClick={() => x()} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all active:scale-95">
                                    Batal
                                </button>
                                <button type="button" onClick={() => oc_hapus_simpan(data.id)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-all shadow-sm shadow-red-200 flex items-center justify-center gap-2 active:scale-95">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Ya, Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

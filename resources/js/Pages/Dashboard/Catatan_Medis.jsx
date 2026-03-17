import React, { useState, useEffect } from "react";
import axios from 'axios';
import DataTable from "react-data-table-component";
import { router } from "@inertiajs/react";
import { Link } from "react-router-dom";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Catatan_Medis({ auth }) {
    const [semua_catatan_medis, set_semua_catatan_medis] = useState([]);
    const [semua_catatan_medis_cari, set_semua_catatan_medis_cari] = useState([]);
    const [periode_dari, set_periode_dari] = useState('');
    const [periode_sampai, set_periode_sampai] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);

    const [edit, set_edit] = useState(false);

    const oc_periode = (e) => {
        const { id, value } = e.target;
        if (id === "periode_dari") {
            set_periode_dari(value);
        } else if (id === "periode_sampai") {
            set_periode_sampai(value);
        }
    };


    useEffect(() => {
        const hari_ini = new Date().toISOString().split('T')[0];

        set_periode_dari(hari_ini);
        set_periode_sampai(hari_ini);
        console.log(hari_ini)

        // fetch_ref_catatan_medis()
        // refresh_all_data()
        // axios.post(window.location.origin + '/ref_catatan_medis',
        //     {
        //         // tanggung_jawab:'Dokter',
        //         periode_dari: periode_dari,
        //         periode_sampai: periode_sampai
        //     }).then(function (response) {
        //         // set_semua_petugas(response.data)
        //         set_semua_catatan_medis(response.data)
        //         set_semua_catatan_medis_cari(response.data)
        //         console.log(response)
        //     })
    }, [])

    useEffect(() => {
        if (periode_dari && periode_sampai) {
            setLoading(true); // mulai loading
            axios
                .post(window.location.origin + "/ref_catatan_medis", {
                    periode_dari,
                    periode_sampai,
                    page: currentPage,
                })
                .then((response) => {
                    set_semua_catatan_medis_cari(response.data.data);
                    setTotalRows(response.data.total);
                    setLoading(false); // selesai loading
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false); // selesai loading meskipun error
                });
        }
    }, [periode_dari, periode_sampai, currentPage]);

    // const handlePageChange = (page) => {
    //     console.log("oc page")
    //     console.log(page)
    //     setCurrentPage(page);  // Mengubah halaman aktif
    // };

    const handlePageChange = (page) => {
        console.log("onChangePage triggered, new page:", page);  // Log jika halaman berubah
        setCurrentPage(page);  // Update halaman aktif
    };

    // function fetch_ref_catatan_medis() {
    //     axios.post(window.location.origin + '/ref_catatan_medis',
    //         {
    //             // tanggung_jawab:'Dokter',
    //             periode_dari: periode_dari,
    //             periode_sampai: periode_sampai
    //         }).then(function (response) {
    //             // set_semua_petugas(response.data)
    //             set_semua_catatan_medis(response.data)
    //             set_semua_catatan_medis_cari(response.data)
    //             console.log(response)
    //         })
    // }

    const oc_hapus = (id) => {
        // router.post('/hapus_admin', {
        //     id:id,
        // })
        console.log("hapus id")
        console.log(id)

        axios.post(window.location.origin + '/ref_catatan_medis',
            {
                id: id,
            }).then(function (response) {
                // set_semua_petugas(response.data)
                // set_semua_admin(response.data)
                // set_semua_admin_cari(response.data)
                set_data(prev_data => ({
                    ...prev_data,
                    id: response.data.id,
                    nik_pasien: response.data.pasien.nik,
                    nama_pasien: response.data.nama ? response.data.pasien.nama : '',
                    tgl_penanganan: response.data.tgl_penanganan,
                    jenis_form: response.data.jenis,
                }));
                console.log(response)
            })

        set_modal_hapus(true)
    }

    const oc_hapus_simpan = (id) => {
        console.log("hapus id")
        console.log(id)
        axios.post(window.location.origin + '/form/hapus',
            {
                id: id,
            }).then(function (response) {
                toast.success(response.data, {
                    position: toast.POSITION.TOP_RIGHT,
                });

                // REFRESH DATA SETELAH HAPUS SUKSES
                if (periode_dari && periode_sampai) {
                    setLoading(true);
                    axios.post(window.location.origin + "/ref_catatan_medis", {
                        periode_dari,
                        periode_sampai,
                        page: currentPage,
                    }).then((res) => {
                        set_semua_catatan_medis_cari(res.data.data);
                        setTotalRows(res.data.total);
                        setLoading(false);
                    }).catch((err) => {
                        setLoading(false);
                    });
                } else {
                    refresh_all_data();
                }

            }).catch(function (error) {
                toast.error("Data gagal dihapus", {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });

        set_null_data()
        set_modal_hapus(false)
    }

    const [page, set_page] = useState([0]);

    const columns = [
        // { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        { name: 'No', selector: (row, index) => ((currentPage - 1) * 10) + (index + 1), width: "60px" },
        { name: 'Tanggal', selector: (row) => row.tgl_penanganan.substring(8, 10) + "/" + row.tgl_penanganan.substring(5, 7) + "/" + row.tgl_penanganan.substring(0, 4), width: "140px" },
        { name: 'NIK Pasien', selector: (row) => row.pasien.nik, width: "200px" },
        { name: 'Nama Pasien', selector: (row) => row.pasien.nama, width: "250px" },
        auth.role == "Admin" ? { name: 'Tim Ambulan', selector: (row) => row.tim_ambulan, width: "140px" } : '',
        { name: 'Jenis Form', selector: (row) => row.jenis, width: "190px" },
        {
            name: 'Action', cell: (row) =>
                <div className="flex gap-2">
                    <button type="button"
                        id={row.id}
                        onClick={() => oc_hapus(row.id)}
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-1.5 transition-colors shadow-sm">
                        Hapus
                    </button>
                    <Link to={`/${row.jenis.toLowerCase().replace(/ /g, "_")}/${row.id}`}>
                        <button type="button"
                            id={row.id}
                            className="text-white bg-slate-700 hover:bg-slate-800 focus:ring-4 focus:ring-slate-300 font-medium rounded-lg text-sm px-4 py-1.5 transition-colors shadow-sm">
                            Edit
                        </button>
                    </Link>
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
        nik_pasien: '',
        nama_pasien: '',
        tgl_penanganan: '',
        jenis_form: '',
    });

    function refresh_all_data() {
        axios.post(window.location.origin + '/ref_catatan_medis').then(function (response) {
            set_semua_catatan_medis(response.data)
            set_semua_catatan_medis_cari(response.data)
        })
    }

    function set_null_data() {
        set_data(prev_data => ({
            ...prev_data,
            id: '',
            nama_pasien: '',
            tgl_penanganan: '',
            jenis_form: '',
        }));
    }

    function x() {
        set_modal_hapus(false)

        set_null_data()
    }

    console.log(edit);
    console.log(data)
    console.log("onChangePage triggered, new page:", currentPage);

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">
            <ToastContainer />
            {/* header */}
            <div>
                <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight">Catatan Medis</h1>
                <p className="text-gray-600">Daftar rekam medis dan penanganan pasien</p>
            </div>

            {/* filter card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
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
                            placeholder="Cari..."
                            onChange={cari}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={(e) => set_modal(true)}
                        className="h-[42px] px-5 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors duration-300 shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Tambah Catatan
                    </button>
                </div>

                {/* Date Filter */}
                <div className="flex flex-col md:flex-row gap-4 items-end pt-2 border-t border-gray-100">
                    <div className="flex flex-col flex-1 w-full">
                        <label htmlFor="periode_dari" className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Periode dari</label>
                        <input
                            type="date"
                            id="periode_dari"
                            value={periode_dari}
                            onChange={oc_periode}
                            className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 text-sm"
                        />
                    </div>
                    <div className="flex flex-col flex-1 w-full">
                        <label htmlFor="periode_sampai" className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Sampai</label>
                        <input
                            type="date"
                            id="periode_sampai"
                            value={periode_sampai}
                            onChange={oc_periode}
                            className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 text-sm"
                        />
                    </div>
                </div>
            </div>
            {/* DataTable Card*/}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
                <div className="border border-gray-100 rounded-xl overflow-hidden mt-2">
                    <DataTable
                        columns={columns}
                        data={semua_catatan_medis_cari}
                        pagination
                        paginationPerPage={10}
                        paginationTotalRows={totalRows}
                        onChangePage={handlePageChange}
                        paginationServer
                        highlightOnHover
                        progressPending={loading}
                        progressComponent={
                            <div className="flex justify-center items-center p-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                            </div>
                        }
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

            {/* Modal Pilihan Form */}
            {modal &&
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-gray-800 text-lg">
                                {edit ? 'Edit' : 'Tambah'} Catatan Medis
                            </h3>
                            <button onClick={(e) => set_modal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 flex flex-col gap-3">
                            <Link to="/form_umum" className="w-full flex justify-center py-3 text-white bg-red-700 hover:bg-red-800 font-medium rounded-xl transition-colors duration-300 shadow-sm shadow-red-200">
                                Form Umum
                            </Link>
                            <Link to="/form_maternal" className="w-full flex justify-center py-3 text-white bg-red-700 hover:bg-red-800 font-medium rounded-xl transition-colors duration-300 shadow-sm shadow-red-200">
                                Form Maternal
                            </Link>
                            <button type="button" className="w-full flex justify-center py-3 text-white bg-red-700 hover:bg-red-800 font-medium rounded-xl transition-colors duration-300 shadow-sm shadow-red-200">
                                Form CM Maternal
                            </button>
                            <Link to="/form_neonatal" className="w-full flex justify-center py-3 text-white bg-red-700 hover:bg-red-800 font-medium rounded-xl transition-colors duration-300 shadow-sm shadow-red-200">
                                Form Neonatal
                            </Link>
                            <Link to="/form_surat_keterangan_kematian" className="w-full flex justify-center py-3 text-white bg-red-700 hover:bg-red-800 font-medium rounded-xl transition-colors duration-300 shadow-sm shadow-red-200">
                                Form Surat Keterangan Kematian
                            </Link>
                            <Link to="/form_surat_persetujuan_tindakan_medis" className="w-full flex justify-center py-3 text-white bg-red-700 hover:bg-red-800 font-medium rounded-xl transition-colors duration-300 shadow-sm shadow-red-200 text-center px-4">
                                Form Surat Persetujuan Tindakan Medis
                            </Link>
                        </div>
                    </div>
                </div>
            }

            {/* Modal Hapus */}
            {modal_hapus &&
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-fade-in-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-red-50">
                            <h3 className="font-bold text-red-700 text-lg flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Hapus Form
                            </h3>
                            <button onClick={(e) => x()} className="text-gray-400 hover:text-red-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <p className="text-gray-600 text-sm mb-4">Apakah Anda yakin ingin menghapus data form ini? Tindakan ini tidak dapat dibatalkan.</p>

                            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 space-y-2 mb-6 border border-gray-100">
                                <div><span className="font-medium text-gray-500">Tanggal:</span> {data.tgl_penanganan}</div>
                                <div><span className="font-medium text-gray-500">NIK:</span> {data.nik_pasien}</div>
                                <div><span className="font-medium text-gray-500">Nama:</span> {data.nama_pasien}</div>
                                <div><span className="font-medium text-gray-500">Jenis Form:</span> {data.jenis_form}</div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => x()} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                                    Batal
                                </button>
                                <button type="button" onClick={() => oc_hapus_simpan(data.id)} className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm shadow-red-200">
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
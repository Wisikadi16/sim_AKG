import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

export default function Laporan() {
    const [semua_order, set_semua_order] = useState([]);
    const [semua_order_cari, set_semua_order_cari] = useState([]);
    const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
    const [semua_kecamatan, set_semua_kecamatan] = useState([]);
    const [semua_kelurahan, set_semua_kelurahan] = useState([]);
    const [kode_kecamatan, set_kode_kecamatan] = useState([]);
    const [jenis, set_jenis] = useState([]);

    const [cari_tgl, set_cari_tgl] = useState({
        dari_tanggal: '',
        sampai_tanggal: '',
    });

    const [page, set_page] = useState(1);
    const [perPage, set_perPage] = useState(10);

    console.log(cari_tgl)

    useEffect(() => {
        axios.post(window.location.origin + '/ref_laporan',
            {
                jenis: "jenis pelayanan"
            }).then(function (response) {
                set_semua_order(response.data)
                set_semua_order_cari(response.data)
                set_jenis("jenis pelayanan")
                console.log("orderrr")
                console.log(response)
            })

        // axios.post(window.location.origin+'/ref_kecamatan',
        // {
        //     // kode_kecamatan:kode_kecamatan,
        // }).then(function (response){
        //     set_semua_kecamatan(response.data)
        //     // console.log(response)
        // })

        // axios.post(window.location.origin+'/ref_kelurahan',
        // {
        //     kode_kecamatan:kode_kecamatan,
        //     // kode_kecamatan:"",
        // }).then(function (response){
        //     set_semua_kelurahan(response.data)
        //     // console.log(response)
        // })

        // axios.post(window.location.origin+'/ref_tim_ambulan',
        // {
        //     // tanggung_jawab:'Dokter',
        // }).then(function (response){
        //     // set_semua_petugas(response.data)
        //     set_semua_tim_ambulan(response.data)
        //     // set_semua_ambulan_cari(response.data)
        //     // console.log(response)
        // })

    }, [])

    const columns = [
        { name: 'No', selector: (row, index) => (((page == 0 ? 1 : page) - 1) * 10) + (index + 1), width: "60px" },
        (jenis === 'jenis pelayanan')
            ? { name: 'Cara Order', selector: (row) => row.cara_order, width: '100px' }
            : null,
        (jenis === 'jenis pelayanan')
            ? { name: 'Total', selector: (row) => row.total, width: '130px' }
            : null,
    ].filter(Boolean);



    const oc_cari = (e) => {
        axios.post(window.location.origin + '/ref_laporan',
            {
                jenis: jenis,
                dari_tanggal: cari_tgl.dari_tanggal,
                sampai_tanggal: cari_tgl.sampai_tanggal,
            }).then(function (response) {
                // set_semua_kecamatan(response.data)
                console.log(response)
            })
    }

    return (
        <div className="w-full flex flex-col gap-6 animate-fade-in pb-16">

            {/* Header */}
            <div>
                <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight">Laporan Data</h1>
                <p className="text-gray-500 text-sm mt-1 capitalize">Ringkasan Laporan {jenis || 'Sistem'}</p>
            </div>

            {/* Filter Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col gap-4">
                <h2 className="font-bold text-gray-700 text-md border-b border-gray-100 pb-2">Filter Periode Laporan</h2>

                <form onSubmit={oc_cari} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex flex-col flex-1 w-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Dari Tanggal</label>
                        <input
                            type="date"
                            name="dari_tanggal"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 text-sm"
                            onChange={(e) => set_cari_tgl((prev) => ({ ...prev, dari_tanggal: e.target.value }))}
                            required
                        ></input>
                    </div>
                    <div className="flex flex-col flex-1 w-full">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Sampai Tanggal</label>
                        <input
                            type="date"
                            name="sampai_tanggal"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-all text-gray-700 text-sm"
                            onChange={(e) => set_cari_tgl((prev) => ({ ...prev, sampai_tanggal: e.target.value }))}
                            required
                        ></input>
                    </div>

                    <div className="w-full md:w-auto mt-4 md:mt-0">
                        <label className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Jenis</label>
                        <button
                            type="submit"
                            className="w-full md:w-[120px] h-[46px] bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl transition-colors duration-300 shadow-sm shadow-red-200 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            Cari
                        </button>
                    </div>
                </form>
            </div>

            {/* DataTable Card */}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
                <div className="mb-4 pt-2">
                    <h2 className="font-bold text-lg text-gray-800">Hasil Laporan</h2>
                </div>

                <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={semua_order_cari}
                        pagination
                        onChangePage={(newPage) => set_page(newPage)}
                        onChangeRowsPerPage={(newPerPage, newPage) => {
                            set_perPage(newPerPage);
                            set_page(newPage);
                        }}
                        highlightOnHover
                        responsive
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
            </div >
        </div >
    );
}

import React, { Component, useState, useEffect } from "react";
import axios from 'axios';

import { Chart as ChartJS } from "chart.js/auto"
import { Bar, Line } from 'react-chartjs-2';
import Tim_Ambulan from "./Tim_Ambulan";

import DataTable from "react-data-table-component";


export default function Dashboard() {
  const [semua_order, set_semua_order] = useState([]);
  const [semua_tim_ambulan, set_semua_tim_ambulan] = useState([]);
  const [semua_tim_ambulan_order, set_semua_tim_ambulan_order] = useState([]);
  const [jenis, set_jenis] = useState("");

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const total_hari = new Date(year, currentDate.getMonth() + 1, 0).getDate();

  const formatted_tgl = `${year}-${month}-${day}`;
  console.log(formatted_tgl);
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

  const [ar_hari, set_ar_hari] = useState([]);

  const ubah_ar_hari = (total_hari) => {
    if (!isNaN(total_hari) && total_hari >= 0) {
      const newArray = Array.from({ length: total_hari }, (_, index) => index + 1);

      set_ar_hari(newArray);
    } else {
      set_ar_hari([]);
    }
  };

  useEffect(() => {
    axios.post(window.location.origin + '/ref_tim_ambulan').then(function (response) {
      set_semua_tim_ambulan(response.data)
      // console.log(response)
    })


    axios.post(window.location.origin + '/ref_dashboard', {
      order: true,
      tgl: formatted_tgl,
    }).then(function (response) {
      set_semua_tim_ambulan_order(response.data)
      set_jenis("Jumlah Order")
      console.log(response)
    })

    ubah_ar_hari(total_hari)
  }, [])

  const [page, set_page] = useState(1);
  const [perPage, set_perPage] = useState(10);

  const columns = [
    {
      name: 'No',
      selector: (row, index) => ((page - 1) * perPage) + (index + 1),
      width: "60px",
      sortable: true
    },
    { name: 'Nama Tim', selector: (row) => row.nama_tim, sortable: true },
    { name: 'Hari Ini', selector: (row) => row.total_order_hari_ini, sortable: true, center: true },
    { name: 'Bulan Ini', selector: (row) => row.total_order_per_hari_bulan_ini, sortable: true, center: true },
    { name: 'Tahun Ini', selector: (row) => row.total_order_tahun_ini, sortable: true, center: true },
  ]

  const total_semua_order_hari_ini = {
    total: semua_tim_ambulan_order.reduce((acc, val) => acc + val.total_order_hari_ini, 0)
  };

  const total_semua_order_bulan_ini = {
    total: semua_tim_ambulan_order.reduce((acc, val) => acc + val.total_order_per_hari_bulan_ini, 0)
  };

  const total_semua_order_tahun_ini = {
    total: semua_tim_ambulan_order.reduce((acc, val) => acc + val.total_order_tahun_ini, 0)
  };

  const manualColors = [
    "#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5", // Red shades
    "#991b1b", "#7f1d1d", "#450a0a", // Darker red shades
    "#f59e0b", "#d97706", "#b45309", // Amber/Orange accent
    "#0f766e", "#0e7490", "#1d4ed8", "#4338ca", "#6d28d9", // Cool accents
    "#FF5733", "#33FF57", "#5733FF", "#FF3366", "#33CCFF",
    "#FF9900", "#9900FF", "#00FF99", "#FF0000", "#00FF00",
    "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#CCCCCC",
  ];

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in pb-10">

      {/* Header */}
      <div>
        <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Ringkasan performa dan orderan Tim Ambulan</p>
      </div>

      {jenis == "Jumlah Order" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-red-50 p-3.5 rounded-xl">
              <img src="/./assets/img/ambulan.png" className="w-8 h-8 object-contain opacity-80" alt="Armada" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase">Total Armada</p>
              <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{semua_tim_ambulan_order.length}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-blue-50 p-3.5 rounded-xl">
              {/* Gunakan icon order placeholder, adjust if needed */}
              <img src="/./assets/img/order.png" className="w-8 h-8 object-contain opacity-80" alt="Order Hari Ini" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase">Order Hari Ini</p>
              <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{total_semua_order_hari_ini.total}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-amber-50 p-3.5 rounded-xl">
              <img src="/./assets/img/laporan.png" className="w-8 h-8 object-contain opacity-80" alt="Order Bulan Ini" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase">Order {nama_bulan}</p>
              <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{total_semua_order_bulan_ini.total}</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="bg-indigo-50 p-3.5 rounded-xl">
              <img src="/./assets/img/catatan_medis.png" className="w-8 h-8 object-contain opacity-80" alt="Order Tahun Ini" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold tracking-wider uppercase">Order Thn {year}</p>
              <h3 className="text-3xl font-extrabold text-gray-800 mt-1">{total_semua_order_tahun_ini.total}</h3>
            </div>
          </div>

        </div>
      )}

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-bold text-lg text-gray-800 mb-6">Grafik Order ({nama_bulan} {year})</h2>
        <div className="h-[500px] w-full">
          <Line
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'bottom',
                  labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    padding: 15,
                    font: {
                      size: 11
                    }
                  }
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: '#f1f5f9',
                  }
                },
                x: {
                  grid: {
                    display: false,
                  }
                }
              },
              elements: {
                line: {
                  tension: 0.3 // smooth curves
                },
                point: {
                  radius: 2,
                  hoverRadius: 5
                }
              }
            }}
            data={{
              labels: ar_hari,
              datasets: semua_tim_ambulan_order.map((val, index) => ({
                label: val.nama_tim,
                data: val.order_per_hari_bulan_ini,
                backgroundColor: manualColors[index % manualColors.length],
                borderColor: manualColors[index % manualColors.length],
                borderWidth: 2,
              }))
            }}
          />
        </div>
      </div>

      {/* Table Section */}
      {jenis == "Jumlah Order" && (
        <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-slate-100">
          <div className="mb-4 pt-2">
            <h2 className="font-bold text-lg text-gray-800">Rincian Tim Ambulan</h2>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <DataTable
              columns={columns}
              data={semua_tim_ambulan_order}
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
        </div>
      )}

    </div>
  );
}

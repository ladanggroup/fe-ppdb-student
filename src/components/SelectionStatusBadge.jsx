import React from "react";

const statusMap = {
  verify: {
    label: "Menunggu Verifikasi",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  },
  data_received_awaiting_selection: {
    label: "Menunggu Seleksi",
    className: "bg-blue-100 text-blue-700 border border-blue-300",
  },
  passed_selection: {
    label: "Lulus Seleksi",
    className: "bg-green-100 text-green-700 border border-green-300",
  },
  rejected_data_does_not_match: {
    label: "Data Tidak Sesuai",
    className: "bg-red-100 text-red-700 border border-red-300",
  },
  failed_selection: {
    label: "Gagal Seleksi",
    className: "bg-gray-200 text-gray-700 border border-gray-400",
  },
  waiting_complete_data: {
    label: "Menunggu Kelengkapan Data",
    className: "bg-purple-100 text-purple-700 border border-purple-300",
  },
};

const SelectionStatusBadge = ({ status }) => {
  if (!status) {
    return (
      <span className="px-2 py-1 text-xs rounded-lg bg-gray-100 text-gray-500 border border-gray-300">
        Tidak diketahui
      </span>
    );
  }

  const { label, className } =
    statusMap[status] ||
    statusMap.failed_selection; // default jika status tidak dikenali

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${className}`}>
      {label}
    </span>
  );
};

export default SelectionStatusBadge;

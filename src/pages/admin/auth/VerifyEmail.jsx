// import { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import apiClient from '@/api/apiClient';

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import apiClient from "@/api/apiClient";
import { showSuccess, showError } from "@/components/ui/toastSonner";

const VerifyEmail = () => {
  const { id, hash } = useParams();
  const [message, setMessage] = useState("Memverifikasi email...");
  const [error, setError] = useState(false); // tanda kalau gagal
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const query = window.location.search;
        const res = await apiClient.get(`/api/admin/email/verify/${id}/${hash}${query}`);
        setMessage(res.data.message);
        if (res.status === 200) {
          setTimeout(() => {
            window.location.href = "/admin/login";
          }, 2000);
        }
      } catch (err) {
        setError(true); // gagal → tampilkan tombol resend
        if (err.response) {
          setMessage(err.response.data.message);
        } else {
          setMessage("Terjadi kesalahan saat verifikasi");
        }
      }
    };

    verifyEmail();
  }, [id, hash]);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post("/api/admin/email/resend", { admin_id: id });
      console.log(res);
      
      // asumsi backend menerima id user → kirim email ulang
      showSuccess(res.data.message || "Link verifikasi baru sudah dikirim ke email Anda.");
      setMessage("Link verifikasi baru sudah dikirim. Silakan cek email Anda.");
      setError(false);
    } catch (err) {
      showError(err.response?.data?.message || "Gagal mengirim ulang email.");
      setMessage("Gagal mengirim ulang email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h1 className="text-xl font-bold mb-4">Verifikasi Email</h1>
        <p className="mb-4">{message}</p>

        {error && (
          <button
            onClick={handleResend}
            disabled={loading}
            className="bg-ppdb-orange hover:bg-orange-600 text-white px-4 py-2 rounded-md transition"
          >
            {loading ? "Mengirim..." : "Kirim Ulang Email Verifikasi"}
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;

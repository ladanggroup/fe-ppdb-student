// src/pages/admin/auth/ResendEmail.jsx
import { useState } from "react";
import apiClient from "@/api/apiClient";
import { showSuccess, showError } from "@/components/ui/toastSonner";

const ResendEmail = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await apiClient.post("/api/admin/email/resend", { email: email });
      setMessage(res.data.message || "Link verifikasi baru sudah dikirim.");
      showSuccess("Link verifikasi baru sudah dikirim ke email Anda.");
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Gagal mengirim ulang email.");
        showError(err.response.data.message || "Gagal mengirim ulang email.");
      } else {
        setMessage("Terjadi kesalahan saat mengirim ulang email.");
        showError("Terjadi kesalahan saat mengirim ulang email.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-center">Kirim Ulang Verifikasi Email</h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          Link verifikasi yang Anda gunakan tidak valid atau sudah kadaluarsa.
          Masukkan email Anda untuk menerima link verifikasi baru.
        </p>

        <form onSubmit={handleResend} className="space-y-4">
          <input
            type="email"
            placeholder="Masukkan email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ppdb-orange"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ppdb-orange hover:bg-orange-600 text-white py-2 px-4 rounded-md transition"
          >
            {loading ? "Mengirim..." : "Kirim Ulang"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ResendEmail;

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSubscriptionStore from "@/store/useSubscriptionStore";
import { Loader2 } from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import DashboardLayout from "@/layouts/admin/DashboardLayout";
import RejectDialog from "@/components/RejectDialog";
import { confirmToast } from "@/components/ui/confirmToast";

const Verification = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { showAdmin, verifyAdmin, rejectAdmin, loading, error } =
    useSubscriptionStore();

  const [subscription, setSubscription] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [payments, setPayments] = useState(null);

  const statusSubscriptions = [
    { label: "Semua", value: "" },
    { label: "Verifikasi", value: "verify" },
    { label: "Aktif", value: "active" },
    { label: "Expired", value: "expired" },
    { label: "Ditolak", value: "rejected" },
    { label: "Dibatalkan", value: "canceled" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await showAdmin(id);
        setSubscription(data.subscription);
        setDocuments(data.documents);
        setPayments(data.payments);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id, showAdmin]);

  const handleVerify = async () => {
    confirmToast({
      message: "Apakah Anda yakin?",
      onConfirm: async () => {
        await verifyAdmin(id);
        navigate("/admin/subscription");
      },
      onCancel: () => {
        console.log("cancel");
      },
    })
  };

  const handleReject = async (note) => {
    await rejectAdmin(id, note);
    navigate("/admin/subscription");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-6 h-6" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {typeof error === "string" ? error : JSON.stringify(error)}
      </div>
    );
  }

  if (!subscription) return null;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Detail Subscription</h1>
        <div className="space-x-2">
          {subscription?.status === "verify" && (
            <>
              <Button
                variant="success"
                className="bg-teal-300 dark:bg-[#1f2937] hover:bg-teal-200 dark:hover:bg-white/10 text-teal-800 dark:text-white"
                onClick={handleVerify}
              >
                Verifikasi
              </Button>
              <RejectDialog onConfirm={(note) => handleReject(note)} />
            </>
          )}

          {subscription?.status === "rejected" && (
            <Button
              variant="success"
              className="bg-teal-300 dark:bg-[#1f2937] hover:bg-teal-200 dark:hover:bg-white/10 text-teal-800 dark:text-white"
              onClick={handleVerify}
            >
              Verifikasi
            </Button>
          )}
        </div>
      </div>

      {/* Subscription Info */}
      <Card className="mt-4 border border-teal-100 dark:border-[#1f2937]">
        <CardHeader className="bg-teal-100 dark:bg-[#1f2937]">
          <CardTitle className="border-b pb-2">Informasi Langganan</CardTitle>
        </CardHeader>
        <CardContent className="bg-teal-100 dark:bg-[#1f2937]">
          <div className="flex justify-between">
            <span className="font-semibold">Produk:</span>
            <span>{subscription?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Durasi:</span>
            <span>{subscription?.duration} bulan</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <span>
              {
                statusSubscriptions.find(
                  (s) => s.value === subscription?.status
                )?.label
              }
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Masa Aktif:</span>
            <span>
              {subscription?.start_date || subscription?.end_date
                ? `${subscription?.start_date ?? "-"} → ${
                    subscription?.end_date ?? "-"
                  }`
                : "Belum Aktif"}
            </span>
          </div>
          {/* Fitur */}
          <div className="flex">
            <span className="font-semibold block">Fitur:</span>
            <div className="pl-4 mt-1">
              {subscription?.features?.length > 0 ? (
                subscription.features.length > 2 ? (
                  // Kalau lebih dari 2 → grid 2 kolom
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                    {subscription.features.map((f, idx) => (
                      <p key={idx} className="text-left">
                        - {f.name}
                      </p>
                    ))}
                  </div>
                ) : (
                  // Kalau 2 atau kurang → tampil baris ke bawah
                  <div className="space-y-1">
                    {subscription.features.map((f, idx) => (
                      <p key={idx} className="text-left">
                        - {f.name}
                      </p>
                    ))}
                  </div>
                )
              ) : (
                <p className="text-gray-500">Tidak ada fitur</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* Documents */}
        <Card className="mt-4 border border-teal-100 dark:border-[#1f2937] dark:bg-[#1f2937] bg-teal-100">
          <CardHeader className="bg-teal-100 dark:bg-[#1f2937]">
            <CardTitle className="border-b pb-2">Dokumen</CardTitle>
          </CardHeader>
          <CardContent className="bg-teal-100 dark:bg-[#1f2937]">
            {documents.length === 0 ? (
              <p className="text-gray-500">Tidak ada dokumen</p>
            ) : (
              <ul className="list-disc pl-5 space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between"
                  >
                    <span>{doc.name}</span>
                    {doc.file && (
                      <Link
                        to={doc.file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-500 hover:underline bg-teal-200 rounded-md px-2 py-1"
                      >
                        Lihat File
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Payments */}
        <Card className="mt-4 border border-teal-100 dark:border-[#1f2937]">
          <CardHeader className="bg-teal-100 dark:bg-[#1f2937]">
            <CardTitle className="border-b pb-2">Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="bg-teal-100 dark:bg-[#1f2937]">
            {payments ? (
              <>
                <div className="flex justify-between">
                  <span className="font-medium">Nominal:</span>
                  <span>{formatIdr(payments.price)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-medium">Status:</span>
                  <span>
                    {payments.verified_date ? "Terverifikasi" : "Menunggu"}
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-medium">Bukti:</span>
                  <span>
                    {payments.document ? (
                      <Link
                        to={payments.document.file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-teal-500 hover:underline bg-teal-200 rounded-md px-2 py-1"
                      >
                        Lihat File
                      </Link>
                    ) : (
                      "-"
                    )}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-gray-500">Tidak ada pembayaran</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* School Address */}
      <Card className="mt-4 border border-teal-100 dark:border-[#1f2937]">
        <CardHeader className="bg-teal-100 dark:bg-[#1f2937]">
          <CardTitle className="border-b pb-2">Informasi Sekolah</CardTitle>
        </CardHeader>
        <CardContent className="bg-teal-100 dark:bg-[#1f2937]">
          <div className="flex justify-between">
            <span className="font-semibold">Nama Sekolah:</span>
            <span>{subscription?.school?.name ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Telepon:</span>
            <span>{subscription?.school?.phone ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{subscription?.school?.email ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Jenjang:</span>
            <span>{subscription?.school?.education_level ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Alamat:</span>
            <span>{subscription?.school?.address ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Provinsi:</span>
            <span>{subscription?.school?.provinces?.name ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Kota/Kabupaten:</span>
            <span>{subscription?.school?.cities?.name ?? "-"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Kecamatan:</span>
            <span>{subscription?.school?.districts.name ?? "-"}</span>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Verification;

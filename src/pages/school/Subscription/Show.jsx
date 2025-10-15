import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import { Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import formatIdr from "@/utils/formatIdr";
import BankSelectedCard from "@/components/BankSelectedCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import useSubscriptionStore from "@/store/useSubscriptionStore";
import useProductStore from "@/store/useProductStore";
import usePaymentStore from "@/store/usePaymentStore";
import useDocumentStore from "@/store/useDocumentStore";
import useBankStore from "@/store/useBankStore";
import useAuthStore from "@/store/authStore";
import Payment from "@/components/school/Payment";
import { AlertTriangle } from "lucide-react";
import { showSuccess } from "@/components/ui/toastSonner";

const Show = () => {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    payment_date: "",
    selected_bank_id: "",
    payment_proof_file: "",
  });
  const navigate = useNavigate();
  const { showSubscription, updateVerifySubscription } = useSubscriptionStore();
  const { products, fetchProducts } = useProductStore();
  const { updatePayment, loading: loadingPayment } = usePaymentStore();
  const { updateDocument } = useDocumentStore();
  const { banksAdmin, fetchBanksAdmin, loading: loadingBanks } = useBankStore();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await showSubscription(id);
        setSubscription(res);
        if (res && res.status === "rejected") {
          fetchProducts();
          fetchBanksAdmin();
          setFormData({
            payment_date: res.school.payments[0].payment_date || "",
            selected_bank_id: res.school.payments[0].bank_id || "",
            payment_proof_file: res.school.payments[0].document.path || "",
            status: res.status,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, showSubscription, fetchProducts, fetchBanksAdmin]);

  const [product, setProduct] = useState(null);
  useEffect(() => {
    if (subscription && products.length > 0) {
      const found = products.find((p) => p.name === subscription.name);
      if (found) {
        setProduct(found);
      }
    }
  }, [subscription, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formDocument = new FormData();
      formDocument.append("doc_name", "Bukti Pembayaran " + user.school.name);
      formDocument.append("path", formData.payment_proof_file);
      formDocument.append("school_id", user.school_id);
      formDocument.append("is_payment", true);
      const formPayment = new FormData();
      formPayment.append("payment_date", formData.payment_date);
      formPayment.append("price", product.price);
      formPayment.append("school_id", user.school_id);
      formPayment.append("bank_id", formData.selected_bank_id);
      formPayment.append(
        "document_id",
        subscription.school.payments[0].document.id
      );
      updatePayment(subscription.school.payments[0].id, formPayment);
      updateDocument(subscription.school.payments[0].document.id, formDocument);
      updateVerifySubscription(id);
      showSuccess(
        "Pembayaran berhasil dikonfirmasi, silahkan tunggu verifikasi dari admin."
      );
      navigate("/school/subscription");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (!subscription) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p className="text-red-500">Data tidak ditemukan.</p>
        </div>
      </DashboardLayout>
    );
  }

  const STATUS_MAP = {
    active: {
      label: "Aktif",
      className:
        "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium",
    },
    verify: {
      label: "Menunggu Verifikasi",
      className:
        "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium",
    },
    rejected: {
      label: "Ditolak",
      className:
        "bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium",
    },
    expired: {
      label: "Kadaluarsa",
      className:
        "bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium",
    },
    default: {
      label: "Tidak Diketahui",
      className:
        "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium",
    },
  };

  const getStatus = (status) => {
    return STATUS_MAP[status] || STATUS_MAP.default;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Detail Langganan</h1>
          <Link to="/school/subscription">
            <Button
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white dark:bg-sky-600 dark:hover:bg-sky-700"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Button>
          </Link>
        </div>

        {/* Card utama */}
        <Card className="border-0">
          <CardContent className="p-6 space-y-4 bg-sky-100 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-xl">
            {/* message note */}
            {subscription.status === "rejected" && (
              <div className="flex items-center gap-2 text-red-500 dark:text-red-400 border border-red-500 dark:border-red-400 rounded-md p-2">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-sm">{subscription.school.note}</p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Nama Langganan
                </p>
                <p className="font-medium">{subscription.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Periode
                </p>
                <p className="font-medium">{subscription.duration} Bulan</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Tanggal
                </p>
                <p className="font-medium">
                  {subscription.start_date ?? "-"} s/d{" "}
                  {subscription.end_date ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Harga
                </p>
                <p className="font-medium text-green-700">
                  {formatIdr(subscription.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Status
                </p>
                <p className="font-medium">
                  <span className={getStatus(subscription.status).className}>
                    {getStatus(subscription.status).label}
                  </span>
                </p>
              </div>
              {/* <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Fitur
                </p>
                <p className="font-medium">
                  {subscription.features?.map((f) => f.name).join(", ") || "-"}
                </p>
              </div> */}
            </div>
          </CardContent>
        </Card>

        {/* Info pembayaran */}
        <Card className="border-0">
          <CardContent className="p-6 space-y-4 bg-sky-100 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-xl">
            <h2 className="text-lg font-semibold">Informasi Pembayaran</h2>
            {subscription.school?.payments?.length > 0 &&
              subscription.school.payments.map((p) => (
                <BankSelectedCard
                  key={p.id}
                  className="border-0 shadow-none bg-sky-100 dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-xl"
                  bank={p.bank}
                />
              ))}

            {subscription.school?.payments?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Riwayat Pembayaran
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
                  {subscription.school.payments.map((p) => (
                    <li key={p.id}>
                      {p.payment_date} -{" "}
                      <span className="font-medium">
                        {formatIdr(p.price ?? subscription.price)}
                      </span>
                      <br />
                      {p.document && (
                        <>
                          {p.payment_number} -
                          <Link
                            to={p.document.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sky-600 hover:underline"
                          >
                            Lihat Bukti
                          </Link>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload bukti pembayaran */}
        {subscription.status === "rejected" && (
          <>
            <Payment
              setFormData={setFormData}
              formData={formData}
              handleChange={handleChange}
              getProductPrice={() => product?.price || 0}
              banksAdmin={banksAdmin}
              bankLoading={loadingBanks}
            />

            <Button
              type="submit"
              className="w-full mt-4"
              onClick={handleSubmit}
              loading={loadingPayment}
            >
              Upload Bukti Pembayaran
            </Button>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Show;

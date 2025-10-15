// src/pages/school/Subscription/Expired.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2 } from "lucide-react";
import formatIdr from "@/utils/formatIdr";
import useAuthStore from "@/store/authStore";
import { showSuccess, showError } from "@/components/ui/toastSonner";
import { useNavigate } from "react-router";
import useProductStore from "@/store/useProductStore";
import useSubscriptionStore from "@/store/useSubscriptionStore";
import usePaymentStore from "@/store/usePaymentStore";
import useDocumentStore from "@/store/useDocumentStore";
import useBankStore from "@/store/useBankStore";
import Payment from "@/components/school/Payment";
import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";

const Expired = () => {
  const { user } = useAuthStore();
  const {
    products,
    fetchProducts,
    loading: loadingProducts,
  } = useProductStore();
  const { createSubscription, loading: loadingSubscription } =
    useSubscriptionStore();
  const {
    addPayment,
    payments,
    fetchPayments,
    loading: loadingPayment,
  } = usePaymentStore();
  const { addDocument } = useDocumentStore();
  const { banksAdmin, fetchBanksAdmin, loading: loadingBanks } = useBankStore();
  const lastSubscription =
    user.school?.subscriptions[user.school.subscriptions.length - 1];
  const lastPayment = payments[payments.length - 1];
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({
    payment_date: "",
    selected_bank_id: "",
    payment_proof_file: "",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProducts();
    fetchBanksAdmin();
    if (lastSubscription) {
      fetchPayments(user.school.id);
    }
  }, [
    fetchProducts,
    fetchBanksAdmin,
    fetchPayments,
    lastSubscription,
    user.school.id,
  ]);

  useEffect(() => {
    if (lastSubscription) {
      setSelected(products.find((p) => p.name === lastSubscription.name));
      setFormData({
        payment_date: lastPayment?.payment_date || "",
        selected_bank_id: lastPayment?.bank_id || "",
        payment_proof_file: lastPayment?.document.file || "",
      });
    }
  }, [lastSubscription, lastPayment, products]);
  console.log(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validate = () => {
    const errors = {};
    if (!formData.payment_date)
      errors.payment_date = "Tanggal pembayaran wajib diisi.";
    if (!formData.selected_bank_id)
      errors.selected_bank_id = "Bank tujuan wajib dipilih.";
    if (!formData.payment_proof_file)
      errors.payment_proof_file = "Bukti pembayaran wajib diunggah.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelect = (product) => setSelected(product);

  const handleSubmit = async () => {
    if (!selected || !validate()) return;

    try {
      await createSubscription({
        product_id: selected.id,
        school_id: user.school_id,
        product_name: selected.name,
        duration: selected.duration,
        price: selected.price,
        features: selected.features.map((f) => ({ name: f.name })),
      });

      let documentId = null;
      if (formData.payment_proof_file) {
        const document = await addDocument({
          doc_name: "Bukti Pembayaran " + user.school.name,
          path: formData.payment_proof_file,
          school_id: user.school_id,
          is_payment: true,
        });
        documentId = document?.data?.id;
      }

      await addPayment({
        payment_date: formData.payment_date,
        price: selected.price,
        payer_id: user.school_id,
        bank_id: formData.selected_bank_id,
        document_id: documentId,
      });

      showSuccess(
        "Langganan & pembayaran berhasil ditambahkan, menunggu verifikasi."
      );
      navigate("/school/subscription/expired");
    } catch (err) {
      console.error(err);
      showError("Gagal menambahkan langganan/pembayaran.");
    }
  };

  return (
    <LandingPageLayout>
      <div className="px-4 md:px-6 py-10 md:py-12">
        <div className="max-w-5xl mx-auto bg-white/80 dark:bg-gray-500 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
            Pilih Paket Langganan Sekolah
          </h1>
          {lastSubscription?.status === "verify" ? (
            <div className="flex justify-center py-10">
              <p className="text-gray-600 dark:text-gray-100 bg-yellow-100 dark:bg-yellow-700 py-2 px-4 rounded-md text-center">
                Langganan sedang dalam proses verifikasi.
              </p>
            </div>
          ) : lastSubscription?.status === "rejected" ? (
            <div className="flex justify-center py-10">
              <p className="text-gray-600 dark:text-gray-300 bg-red-100 dark:bg-red-900 py-2 px-4 rounded-md text-center">
                Catatan: {user.school?.note}
              </p>
            </div>
          ) : null}

          {loadingProducts ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Belum ada produk tersedia.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className={`cursor-pointer transition-all transform hover:scale-[1.02] ${
                    selected?.id === product.id
                      ? "border-sky-500 ring-2 ring-sky-400 bg-sky-100 dark:bg-sky-900"
                      : "border-gray-300 dark:border-gray-700 hover:bg-sky-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <CardContent className="p-5 flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Durasi: {product.duration} bulan
                      </p>
                      <p className="text-lg font-semibold text-sky-600 dark:text-sky-400 mb-3">
                        {formatIdr(product.price)}
                      </p>

                      {/* <div className="text-sm text-gray-700 dark:text-gray-300 border-t pt-2">
                        <p className="font-semibold mb-1">Fitur:</p>
                        {product.features?.length ? (
                          <ul className="list-disc list-inside space-y-1">
                            {product.features.map((f) => (
                              <li key={f.id}>{f.name}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="italic text-gray-400">Tidak ada fitur.</p>
                        )}
                      </div> */}
                    </div>

                    {selected?.id === product.id && (
                      <div className="flex justify-end mt-4 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selected && (
            <div className="mt-10 border-t border-gray-300 dark:border-gray-700 pt-6">
              <Payment
                setFormData={setFormData}
                formData={formData}
                formErrors={formErrors}
                handleChange={handleChange}
                getProductPrice={() => selected?.price || 0}
                banksAdmin={banksAdmin}
                bankLoading={loadingBanks}
              />
            </div>
          )}

          <div className="mt-8 flex justify-end">
            {formData.payment_proof_file &&
              lastSubscription?.status !== "verify" &&
              lastPayment?.status !== "rejected" && (
                <Button
                  onClick={handleSubmit}
                  disabled={!selected || loadingSubscription || loadingPayment}
                  className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-md"
                >
                  {loadingSubscription || loadingPayment ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />{" "}
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Langganan & Bayar"
                  )}
                </Button>
              )}
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
};

export default Expired;

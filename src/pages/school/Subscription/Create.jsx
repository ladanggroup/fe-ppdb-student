// src/pages/school/SubscriptionCreate.jsx
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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

const Create = () => {
  const { user } = useAuthStore();
  const {
    products,
    fetchProducts,
    loading: loadingProducts,
  } = useProductStore();
  const { createSubscription, loading: loadingSubscription } =
    useSubscriptionStore();
  const { addPayment, loading: loadingPayment } = usePaymentStore();
  const { addDocument } = useDocumentStore();
  const { banksAdmin, fetchBanksAdmin, loading: loadingBanks } = useBankStore();
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
  }, [fetchProducts, fetchBanksAdmin]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let errors = {};
    if (!formData.payment_date)
      errors.payment_date = "Tanggal pembayaran wajib diisi";
    if (!formData.selected_bank_id)
      errors.selected_bank_id = "Bank tujuan wajib dipilih";
    if (!formData.payment_proof_file)
      errors.payment_proof_file = "Bukti pembayaran wajib diunggah";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelect = (product) => {
    setSelected(product);
  };

  const handleSubmit = async () => {
    if (!selected || !validate()) return;

    try {
      // 1. Buat subscription
      await createSubscription({
        product_id: selected.id,
        school_id: user.school_id,
        product_name: selected.name,
        duration: selected.duration,
        price: selected.price,
        features: selected.features.map((f) => ({ name: f.name })),
      });

      // 2. Simpan dokumen bukti pembayaran
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

      // 3. Simpan payment
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
      navigate("/school/subscription");
    } catch (err) {
      console.error(err);
      showError("Gagal menambahkan langganan/pembayaran.");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Tambah Langganan</h1>

        {loadingProducts ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-600 dark:text-white">
            Belum ada produk tersedia.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`cursor-pointer transition-all ${
                  selected?.id === product.id
                    ? "border-sky-500 bg-sky-100 dark:bg-gray-800 shadow-lg"
                    : "border-gray-300 dark:border-gray-700 bg-sky-50 dark:bg-gray-800 hover:bg-sky-100 dark:hover:bg-gray-700 hover:shadow-lg"
                }`}
                onClick={() => handleSelect(product)}
              >
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Durasi: {product.duration} bulan
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Harga: {formatIdr(product.price)}
                  </p>
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Fitur:</span>{" "}
                    {product.features?.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {product.features.map((f) => (
                          <li key={f.id}>{f.name}</li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Upload bukti pembayaran */}
        <div className="mt-6">
          {selected && (
            <Payment
              setFormData={setFormData}
              formData={formData}
              formErrors={formErrors}
              handleChange={handleChange}
              getProductPrice={() => selected?.price || 0}
              banksAdmin={banksAdmin}
              bankLoading={loadingBanks}
            />
          )}
        </div>

        <div className="mt-6 flex justify-end">
          {formData.payment_proof_file && (
            <Button
              onClick={handleSubmit}
              disabled={!selected || loadingSubscription || loadingPayment}
              className="bg-sky-500 hover:bg-sky-600 text-white"
            >
              {loadingSubscription || loadingPayment ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" /> Menyimpan...
                </>
              ) : (
                "Simpan Langganan & Bayar"
              )}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Create;

// src/pages/school/auth/CompleteRegistration.jsx
import React, { useState, useEffect, useCallback } from "react";
import useSchoolStore from "@/store/useSchoolStore";
import useRegionStore from "@/store/regionStore";
import useProductStore from "@/store/useProductStore";
import useBankStore from "@/store/useBankStore";
import useSubscriptionStore from "@/store/useSubscriptionStore";
import usePaymentStore from "@/store/usePaymentStore";
import useDocumentStore from "@/store/useDocumentStore";
import useAuthStore from "@/store/authStore";

// Import Step Components
import SchoolDetails from "@/components/school/Register/SchoolDetails";
import SubscriptionPackage from "@/components/school/Register/SubscriptionPackage";
import PaymentInfo from "@/components/school/Register/PaymentInfo";
import FormNavigation from "@/components/FormNavigation";
import { Link } from "react-router";

const CompleteRegistration = () => {
  // Stores
  const updateSchoolProfile = useSchoolStore(
    (state) => state.updateSchoolProfile
  );
  const schoolLoading = useSchoolStore((state) => state.loading);
  const schoolErrors = useSchoolStore((state) => state.errors);

  const { user, meSchool } = useAuthStore();

  const {
    provinces,
    cities,
    districts,
    fetchProvinces,
    fetchCities,
    fetchDistricts,
  } = useRegionStore();

  const {
    products,
    fetchProducts,
    loading: productLoading,
  } = useProductStore();

  const { banksAdmin, fetchBanksAdmin, loading: bankLoading } = useBankStore();

  const {
    subscriptions,
    fetchSubscriptions,
    loading: subscriptionLoading,
    createSubscription,
  } = useSubscriptionStore((state) => state);

  const {
    payments,
    fetchPayments,
    loading: paymentLoading,
    addPayment,
  } = usePaymentStore((state) => state);

  const {
    addDocument,
    loading: documentLoading,
    documents,
    fetchDocuments,
  } = useDocumentStore((state) => state);

  const documentSchool = useCallback(
    async (schoolId) => {
      await fetchDocuments(schoolId, false);
    },
    [fetchDocuments]
  );

  const paymentSchool = useCallback(
    async (schoolId) => {
      await fetchPayments(schoolId);
    },
    [fetchPayments]
  );

  const subscriptionSchool = useCallback(
    async (schoolId) => {
      await fetchSubscriptions(schoolId);
    },
    [fetchSubscriptions]
  );

  // Form Data State
  const [formData, setFormData] = useState({
    // Bagian 1: Informasi Detail Sekolah
    npsn: "",
    school_name: "",
    school_email: "",
    phone: "",
    address: "",
    education_level: "",
    province_id: "",
    city_id: "",
    district_id: "",
    postal_code: "",
    school_document_file: null,
    school_logo: null,
    school_logo_url: null,
    // Bagian 2: Produk/Paket Langganan
    selected_product_id: "",

    // Bagian 3: Informasi Pembayaran & Bukti
    payment_date: null,
    selected_bank_id: null,
    payment_proof_file: null,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        npsn: user?.school?.npsn || "",
        school_name: user?.school?.name || "",
        school_email: user?.school?.email || "",
        phone: user?.school?.phone || "",
        address: user?.school?.address || "",
        education_level: user?.school?.education_level || "",
        province_id: user?.school?.province_id || "",
        city_id: user?.school?.city_id || "",
        district_id: user?.school?.district_id || "",
        postal_code: user?.school?.postal_code || "",
        school_document_file: documents?.[0]?.file || null,
        school_logo: user?.school?.logo || null,
        school_logo_url: user?.school?.logo_url || null,
        selected_product_id:
          products?.find(
            (p) =>
              p.name === subscriptions?.data?.[0]?.name &&
              p.duration === subscriptions?.data?.[0]?.duration
          )?.id || null,
        selected_bank_id: payments?.[0]?.bank_id || null,
        payment_date: payments?.[0]?.payment_date || null,
        payment_proof_file: payments?.[0]?.document?.file || null,
      }));
    }
  }, [user, documents, payments, subscriptions, products]);

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch initial data
  useEffect(() => {
    fetchProvinces();
    fetchProducts();
    fetchBanksAdmin();
    documentSchool(user.school.id);
    paymentSchool(user.school.id);
    subscriptionSchool(user.school.id);
  }, [
    fetchProvinces,
    fetchProducts,
    fetchBanksAdmin,
    paymentSchool,
    documentSchool,
    subscriptionSchool,
    user,
  ]);

  // Handle region changes
  useEffect(() => {
    if (formData.province_id) {
      fetchCities(formData.province_id);
      setFormData((prev) => ({ ...prev, city_id: "", district_id: "" }));
    }
  }, [formData.province_id, fetchCities]);

  useEffect(() => {
    if (formData.city_id) {
      fetchDistricts(formData.city_id);
      setFormData((prev) => ({ ...prev, district_id: "" }));
    }
  }, [formData.city_id, fetchDistricts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const getProductPrice = () => {
    const product = products.find(
      (p) => p.id === parseInt(formData.selected_product_id)
    );
    return product ? product.price : 0;
  };

  const validateStep = (step) => {
    let newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.npsn) newErrors.npsn = "NPSN wajib diisi.";
      if (!formData.school_name)
        newErrors.school_name = "Nama sekolah wajib diisi.";
      if (!formData.school_email)
        newErrors.school_email = "Email sekolah wajib diisi.";
      if (!formData.phone)
        newErrors.phone = "Nomor telepon sekolah wajib diisi.";
      if (!formData.address) newErrors.address = "Alamat sekolah wajib diisi.";
      if (!formData.education_level)
        newErrors.education_level = "Jenjang pendidikan wajib dipilih.";
      if (!formData.province_id)
        newErrors.province_id = "Provinsi wajib dipilih.";
      if (!formData.city_id)
        newErrors.city_id = "Kota/Kabupaten wajib dipilih.";
      if (!formData.district_id)
        newErrors.district_id = "Kecamatan wajib dipilih.";
      if (!formData.school_document_file)
        newErrors.school_document_file =
          "Dokumen bukti sekolah wajib diunggah."; // Ganti validasi
    } else if (step === 2) {
      if (!formData.selected_product_id)
        newErrors.selected_product_id = "Produk/Paket langganan wajib dipilih.";
    } else if (step === 3) {
      // Payment details and proof
      if (!formData.payment_date)
        newErrors.payment_date = "Tanggal pembayaran wajib diisi.";
      if (!formData.selected_bank_id)
        newErrors.selected_bank_id = "Bank tujuan wajib dipilih.";
      if (!formData.payment_proof_file)
        newErrors.payment_proof_file = "Bukti pembayaran wajib diunggah.";
    }

    setFormErrors(newErrors);
    isValid = Object.keys(newErrors).length === 0;
    return isValid;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSuccessMessage("");

    if (!validateStep(currentStep)) {
      // Validate final step
      return;
    }

    try {
      // 1. Register School
      const registrationData = {
        logo: formData.school_logo,
        name: user?.name,
        email: user?.email,
        npsn: formData.npsn,
        school_name: formData.school_name,
        school_email: formData.school_email,
        phone: formData.phone,
        address: formData.address,
        education_level: formData.education_level,
        province_id: formData.province_id,
        city_id: formData.city_id,
        district_id: formData.district_id,
        postal_code: formData.postal_code,
        roles: user?.roles || [],
      };
      const schoolRegistrationResponse = await updateSchoolProfile(
        user.id,
        registrationData
      );
      if (!schoolRegistrationResponse) {
        throw new Error(schoolErrors || "Gagal mendaftarkan sekolah.");
      }

      // 2. Upload School Document and Link to School
      if (formData.school_document_file) {
        // Add document record to database for the school
        const documentDataSchool = {
          doc_name: `Dokumen Sekolah ${formData.school_name}`, // Nama dokumen
          path: formData.school_document_file,
          school_id: user?.school?.id, // Link ke sekolah yang baru terdaftar
          is_payment: false,
        };

        try {
          const documentResponse = await addDocument(documentDataSchool);
          // schoolDocumentId = documentResponse.data?.id;
          if (!documentResponse) {
            throw new Error("Gagal menyimpan data dokumen sekolah.");
          }
        } catch (error) {
          console.error("Error adding document:", error);
          throw new Error("Gagal menyimpan data dokumen sekolah.");
        }
      }

      // 3. Upload Payment Proof Document
      let paymentProofDocumentId = null;
      if (formData.payment_proof_file) {
        // Add document record to database for payment proof
        const documentDataPayment = {
          doc_name: `Bukti Pembayaran ${formData.school_name} - ${formData.payment_date}`,
          path: formData.payment_proof_file,
          school_id: user?.school?.id, // Link ke sekolah yang baru terdaftar
          is_payment: true,
        };
        try {
          const documentResponse = await addDocument(documentDataPayment);
          paymentProofDocumentId = documentResponse.data?.id;
          if (!documentResponse) {
            throw new Error("Gagal menyimpan data dokumen bukti pembayaran.");
          }
        } catch (error) {
          console.error("Error adding document:", error);
          throw new Error("Gagal menyimpan data dokumen bukti pembayaran.");
        }
      }

      // 4. Create Subscription
      const subscriptionData = {
        product_id: formData.selected_product_id,
        school_id: user?.school?.id,
      };
      const subscriptionResponse = await createSubscription(subscriptionData);
      if (!subscriptionResponse) {
        throw new Error("Gagal membuat langganan.");
      }

      // 5. Add Payment Record
      const paymentData = {
        payment_date: formData.payment_date,
        price: getProductPrice(),
        payer_id: user?.school?.id,
        bank_id: formData.selected_bank_id,
        document_id: paymentProofDocumentId,
      };
      const paymentResponse = await addPayment(paymentData);
      if (!paymentResponse) {
        throw new Error("Gagal menyimpan data pembayaran.");
      }

      await meSchool();
      setSuccessMessage(
        "Pendaftaran sekolah, dokumen, langganan, dan pembayaran berhasil diproses! Silakan tunggu verifikasi."
      );
      setFormErrors({});
      setCurrentStep(1);
    } catch (error) {
      console.error("Full registration process failed:", error);
      setFormErrors({
        general:
          error.message ||
          "Terjadi kesalahan saat pendaftaran. Silakan coba lagi.",
      });
    }
  };
  useEffect(() => {
    if (user?.school?.subscriptions?.length > 0) {
      const subscription = user?.school?.subscriptions[0];
      if (subscription.status === "rejected") {
        setErrorMessage(
          "Pendaftaran sekolah, dokumen, langganan, dan pembayaran gagal diproses. Silakan cek kembali formulir pendaftaran."
        );
        setSuccessMessage("");
      } else {
        setSuccessMessage(
          "Pendaftaran sekolah, dokumen, langganan, dan pembayaran berhasil diproses! Silakan tunggu verifikasi."
        );
        setErrorMessage("");
      }
    }
  }, [user?.school?.subscriptions]);
  const isLoading =
    schoolLoading ||
    productLoading ||
    bankLoading ||
    subscriptionLoading ||
    paymentLoading ||
    documentLoading;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex flex-col mb-4">
          <Link to="/">
            <img
              src="/src/assets/logo ppdb.png"
              alt="Logo PPDB"
              className="w-24 rounded-full mb-2"
            />
          </Link>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Form Pendaftaran PPDB Online
          </h2>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div
              className={`flex-1 text-center py-2 border-b-2 ${
                currentStep == 1
                  ? "border-ppdb-orange text-ppdb-orange"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              1. Detail Sekolah
            </div>
            <div
              className={`flex-1 text-center py-2 border-b-2 ${
                currentStep == 2
                  ? "border-ppdb-orange text-ppdb-orange"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              2. Paket Langganan
            </div>
            <div
              className={`flex-1 text-center py-2 border-b-2 ${
                currentStep == 3
                  ? "border-ppdb-orange text-ppdb-orange"
                  : "border-gray-300 text-gray-500"
              }`}
            >
              3. Pembayaran
            </div>
          </div>
        </div>

        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Berhasil!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        {(schoolErrors || formErrors.general) && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">
              {" "}
              {schoolErrors || formErrors.general}
            </span>
          </div>
        )}

        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline">
              {" "}
              {errorMessage}
              <br />
              {user?.school?.subscriptions?.[0]?.note}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <SchoolDetails
              setFormData={setFormData}
              formData={formData}
              formErrors={formErrors}
              handleChange={handleChange}
              provinces={provinces}
              cities={cities}
              districts={districts}
            />
          )}
          {currentStep === 2 && (
            <SubscriptionPackage
              formData={formData}
              formErrors={formErrors}
              handleChange={handleChange}
              products={products}
              productLoading={productLoading}
            />
          )}
          {currentStep === 3 && (
            <PaymentInfo
              setFormData={setFormData}
              formData={formData}
              formErrors={formErrors}
              handleChange={handleChange}
              getProductPrice={getProductPrice}
              banksAdmin={banksAdmin}
              bankLoading={bankLoading}
            />
          )}

          <FormNavigation
            currentStep={currentStep}
            totalSteps={3}
            handlePrevStep={handlePrevStep}
            handleNextStep={handleNextStep}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            subscriptions={subscriptions?.data}
          />
        </form>
      </div>
    </div>
  );
};

export default CompleteRegistration;

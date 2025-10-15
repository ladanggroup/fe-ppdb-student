// src/pages/school/Student/Edit.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import DashboardLayout from "@/layouts/school/DashboardLayout";
import useSchoolStudent from "@/store/useSchoolStudent";
import useDocumentStore from "@/store/useDocumentStore";
import usePaymentStore from "@/store/usePaymentStore";
import useAuthStore from "@/store/authStore";
import useBankStore from "@/store/useBankStore";
import useRegionStore from "@/store/regionStore";
import LoadingOverlay from "@/components/LoadingOverlay";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import DocumentUpload from "@/components/school/DocumentUpload";
import PersonalInfoStudent from "@/components/school/PersonalInfoStudent";
import FormNavigation from "@/components/FormNavigation";
import Payment from "@/components/school/Payment";
import { User2 } from "lucide-react";
import { FileText } from "lucide-react";
import { CreditCard } from "lucide-react";

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBanks, banks, loading: bankLoading } = useBankStore();
  const {
    detailStudent,
    completeRegistration,
    loading: studentLoading,
  } = useSchoolStudent();
  const {
    deleteDocument,
    addStudentDocumentBySchool,
    updateDocument,
    loading: docLoading,
  } = useDocumentStore();
  const { addStudentPaymentBySchool, loading: paymentLoading } =
    usePaymentStore();
  const { user } = useAuthStore();
  const {
    fetchProvinces,
    provinces,
    fetchCities,
    cities,
    fetchDistricts,
    districts,
  } = useRegionStore();
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { id: 1, label: "Detail Siswa", icon: <User2 size={18} /> },
    { id: 2, label: "Upload Dokumen", icon: <FileText size={18} /> },
    { id: 3, label: "Pembayaran", icon: <CreditCard size={18} /> },
  ];

  // Prefill data untuk edit
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [formData, setFormData] = useState({
    avatar: null,
    name: "",
    email: "",
    nisn: "",
    registration_type: "new",
    school_origin: "",
    phone: "",
    birth_date: "",
    birth_place: "",
    gender: "",
    religion: "",
    address: "",
    province_id: "",
    city_id: "",
    district_id: "",
    postal_code: "",
    uploaded_documents: [],
    waves: "",
    payment_date: "",
    selected_bank_id: "",
    payment_proof_file: "",
  });

  // validasi step berdasarkan kondisi steps
  const validateStep = (step) => {
    let errors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.avatar) errors.avatar = "Foto wajib diisi.";
      if (!formData.name) errors.name = "Nama wajib diisi.";
      if (!formData.email) errors.email = "Email wajib diisi.";
      if (!formData.nisn) errors.nisn = "NISN wajib diisi.";
      if (!formData.school_origin)
        errors.school_origin = "Asal sekolah wajib diisi.";
      if (!formData.phone) errors.phone = "Nomor telepon wajib diisi.";
      if (!formData.birth_date)
        errors.birth_date = "Tanggal lahir wajib diisi.";
      if (!formData.birth_place)
        errors.birth_place = "Tempat lahir wajib diisi.";
      if (!formData.gender) errors.gender = "Jenis kelamin wajib diisi.";
      if (!formData.religion) errors.religion = "Agama wajib diisi.";
      if (!formData.address) errors.address = "Alamat wajib diisi.";
      if (!formData.province_id) errors.province_id = "Provinsi wajib dipilih.";
      if (!formData.city_id) errors.city_id = "Kota/Kabupaten wajib dipilih.";
      if (!formData.district_id)
        errors.district_id = "Kecamatan wajib dipilih.";
      if (!formData.postal_code) errors.postal_code = "Kode pos wajib diisi.";
    }

    setFormErrors(errors);
    isValid = Object.keys(errors).length === 0;
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

  // Fetch initial data
  useEffect(() => {
    fetchProvinces();
  }, [fetchProvinces]);

  // Fetch cities when province_id changes
  useEffect(() => {
    if (formData.province_id) {
      fetchCities(formData.province_id);

      if (!isPrefilled) {
        setFormData((prev) => ({ ...prev, city_id: null, district_id: null }));
      }
    }
  }, [formData.province_id, fetchCities, isPrefilled]);

  // Fetch districts when city_id changes
  useEffect(() => {
    if (formData.city_id) {
      fetchDistricts(formData.city_id);

      if (!isPrefilled) {
        setFormData((prev) => ({ ...prev, district_id: null }));
      }
    }
  }, [formData.city_id, fetchDistricts, isPrefilled]);

  useEffect(() => {
    const loadData = async () => {
      const data = await detailStudent(id, user.school_id);
      if (data) {
        setFormData({
          avatar: data.avatar || null,
          image: data.image || null,
          name: data.name || "",
          email: data.email || "",
          nisn: data.nisn || "",
          registration_type: data.registration_type || "new",
          school_origin: data.school_origin || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          birth_place: data.birth_place || "",
          gender: data.gender || "",
          religion: data.religion || "",
          address: data.address || "",
          province_id: data.province_id || "",
          city_id: data.city_id || "",
          district_id: data.district_id || "",
          postal_code: data.postal_code || "",
          uploaded_documents: {
            doc_id: data.documents.id,
            doc_name: data.documents.name,
            path: data.documents.path,
            is_payment: data.documents.is_payment,
            file: data.documents.file,
          },
          waves: data.school_students?.[0]?.wave || "",
        });
        setIsPrefilled(true); // kasih tanda
      }
    };
    loadData();
  }, [id, detailStudent, user.school_id]);

  useEffect(() => {
    fetchBanks(user.school_id);
  }, [fetchBanks, user.school_id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setFormErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const handleDocumentUploadChange = (updatedDocuments) => {
    setFormData((prev) => ({
      ...prev,
      uploaded_documents: updatedDocuments,
    }));
    setFormErrors((prev) => ({ ...prev, uploaded_documents: null }));
  };

  const handleDocumentDelete = async (docId) => {
    if (!docId) return;
    await deleteDocument(id, docId); // backend handle hapus
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await completeRegistration(id, { ...formData, school_id: user.school_id });

    if (formData.uploaded_documents?.length > 0) {
      for (const doc of formData.uploaded_documents) {
        if (doc.doc_id) {
          await updateDocument(doc.doc_id, {
            doc_name: doc.doc_name,
            path: doc.path,
            student_id: id,
            is_payment: false,
          });
        } else {
          await addStudentDocumentBySchool({
            doc_name: doc.doc_name,
            doc_requirement_id: doc.doc_requirement_id,
            school_id: user.school_id,
            path: doc.path,
            student_id: id,
            is_payment: false,
          });
        }
      }
    }

    let documentId = null;
    if (formData.payment_proof_file) {
      const document = await addStudentDocumentBySchool({
        doc_name: "Bukti Pembayaran " + user.school.name,
        path: formData.payment_proof_file,
        school_id: user.school_id,
        student_id: id,
        is_payment: true,
      });
      documentId = document?.data?.id;
    }

    await addStudentPaymentBySchool({
      payment_date: formData.payment_date,
      price: formData.waves.price,
      payer_id: id,
      bank_id: formData.selected_bank_id,
      document_id: documentId,
    });
    navigate(`/school/student/${id}/show`);
  };

  const isLoading =
    studentLoading || docLoading || bankLoading || paymentLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingOverlay isLoading />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          📝 Edit Data Siswa
        </h1>
        <Button
          className="bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Kembali
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-sky-100 dark:bg-gray-800 p-6 rounded-lg shadow space-y-4"
      >
        {/* STEP INDICATOR */}
        <div className="flex items-center justify-between mb-10 relative">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="flex-1 flex flex-col items-center relative"
            >
              {/* Garis penghubung kiri */}
              {index > 0 && (
                <div
                  className={`absolute top-5 left-0 w-1/2 h-[3px] transition-all duration-500 ${
                    currentStep > step.id
                      ? "bg-ppdb-orange"
                      : currentStep === step.id
                      ? "bg-ppdb-orange"
                      : "bg-gray-300"
                  }`}
                />
              )}

              {/* Garis penghubung kanan */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 right-0 w-1/2 h-[3px] transition-all duration-500 ${
                    currentStep > step.id ? "bg-ppdb-orange" : "bg-gray-300"
                  }`}
                />
              )}

              {/* Icon dan Label */}
              <div
                className={`flex flex-col items-center z-10 ${
                  currentStep === step.id
                    ? "text-ppdb-orange"
                    : currentStep > step.id
                    ? "text-ppdb-orange"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 font-semibold transition-all duration-300 ${
                    currentStep === step.id
                      ? "border-ppdb-orange bg-orange-soft-100"
                      : currentStep > step.id
                      ? "border-ppdb-orange bg-orange-soft-100"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {step.icon}
                </div>
                <span className="text-sm font-medium text-center">
                  {step.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {currentStep === 1 && (
          <PersonalInfoStudent
            formData={formData}
            handleChange={handleChange}
            formErrors={formErrors}
            provinces={provinces}
            cities={cities}
            districts={districts}
            setFormData={setFormData}
          />
        )}
        {currentStep === 2 && (
          <DocumentUpload
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            schoolId={user?.school_id}
            onDocumentDelete={handleDocumentDelete}
            onDocumentUploadChange={handleDocumentUploadChange}
          />
        )}
        {currentStep === 3 && (
          <Payment
            setFormData={setFormData}
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
            getProductPrice={() => formData.waves.price}
            banksAdmin={banks}
            bankLoading={bankLoading}
          />
        )}
        <FormNavigation
          currentStep={currentStep}
          totalSteps={3}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
        />
      </form>
    </DashboardLayout>
  );
};

export default Edit;

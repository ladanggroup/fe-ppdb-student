// src/pages/student/CompleteRegister.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import LoadingOverlay from "@/components/LoadingOverlay";
import FormNavigation from "@/components/FormNavigation";
import { showError, showSuccess } from "@/components/ui/toastSonner";
import useAuthStore from "@/store/authStore";
import useWaveStore from "@/store/useWaveStore";

import DashboardLayout from "@/layouts/student/DashboardLayout";
import useSchoolStudent from "@/store/useSchoolStudent";
import usePaymentStore from "@/store/usePaymentStore";
import useDocumentStore from "@/store/useDocumentStore";
import useStudentStore from "@/store/useStudentStore";
import PersonalInfo from "@/components/student/register/PersonalInfo";
import UploadDocuments from "@/components/student/register/UploadDocuments";
import VerifyReview from "@/components/student/register/VerifyReview";
import PaymentStep from "@/components/student/register/PaymentStep";
import SelectionStatusBadge from "@/components/SelectionStatusBadge";
import ParentsInfoStudent from "@/components/student/register/ParentsInfoStudent";

const DEFAULT_STEPS = [
  "Informasi Pribadi",
  "Upload Dokumen",
  "Cek Data",
  "Pembayaran",
];

export default function CompleteRegister() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user: student, isAuthenticated, meStudent } = useAuthStore();
  const { completeRegistration } = useStudentStore();
  const { fetchStudentWaves, waves } = useWaveStore();
  const {
    store: registerStudentToSchool,
    fetchSchoolStudents,
    updateVerify,
  } = useSchoolStudent();
  const { addStudentDocument, updateStudentDocument, fetchStudentDocument } =
    useDocumentStore();
  const { addStudentPayment, updateStudentPayment } = usePaymentStore();

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const steps = DEFAULT_STEPS;

  useEffect(() => {
    const checkWaves = async () => {
      try {
        const res = await fetchStudentWaves(slug);
        if (!res) {
          showError("Tidak ada gelombang pendaftaran yang aktif saat ini.");
          navigate(`/${slug}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkWaves();
  }, [fetchStudentWaves, navigate, slug]);

  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    student_id: "",
    avatar: null,
    image: null,
    name: "",
    phone: "",
    nisn: "",
    school_origin: "",
    birth_date: "",
    birth_place: "",
    gender: "",
    religion: "",
    address: "",
    province_id: "",
    city_id: "",
    district_id: "",
    postal_code: "",
    wave_id: null,
    uploaded_documents: [],
    payments_info: {},
  });

  useEffect(() => {
    if (waves.length > 0 && !formData.wave_id) {
      const parents = JSON.parse(student.parents);
      setFormData((prev) => ({
        ...prev,
        student_id: student.id,
        avatar: student.avatar,
        image: student.image,
        name: student.name,
        phone: student.phone,
        nisn: student.nisn,
        school_origin: student.school_origin,
        birth_date: student.birth_date,
        birth_place: student.birth_place,
        gender: student.gender,
        religion: student.religion,
        address: student.address,
        province_id: student.province_id,
        province_name: student.provinces?.name,
        city_id: student.city_id,
        city_name: student.cities?.name,
        district_id: student.district_id,
        district_name: student.districts?.name,
        postal_code: student.postal_code,
        wave_id: waves[0].id,
        father_name: parents?.father?.name || "",
        father_phone: parents?.father?.phone || "",
        father_job: parents?.father?.job || "",
        father_education: parents?.father?.education || "",
        father_income: parents?.father?.income || "",
        father_address: parents?.father?.address || "",
        mother_name: parents?.mother?.name || "",
        mother_phone: parents?.mother?.phone || "",
        mother_job: parents?.mother?.job || "",
        mother_education: parents?.mother?.education || "",
        mother_income: parents?.mother?.income || "",
        mother_address: parents?.mother?.address || "",
        guardian_name: parents?.guardian?.name || "",
        guardian_phone: parents?.guardian?.phone || "",
        guardian_job: parents?.guardian?.job || "",
        guardian_education: parents?.guardian?.education || "",
        guardian_income: parents?.guardian?.income || "",
        guardian_address: parents?.guardian?.address || "",
      }));
    }
  }, [student, waves, formData.wave_id]);

  useEffect(() => {
    if (student?.phone !== null) {
      const fetchStudentSchoolData = async () => {
        try {
          const res = await fetchSchoolStudents(student.id, slug);
          if (res) {
            setFormData((prev) => ({
              ...prev,
              wave_id: res[0]?.wave_id || null,
            }));
          }
        } catch (err) {
          console.error(err);
        }
      };
      const documentFetch = async () => {
        try {
          const res = await fetchStudentDocument(student.id, false, slug);
          if (res) {
            for (let doc of res.data) {
              setFormData((prev) => ({
                ...prev,
                uploaded_documents: [
                  ...(prev.uploaded_documents || []).filter(
                    (d) =>
                      d.document_requirement_id !== doc.document_requirement_id
                  ),
                  {
                    doc_id: doc.id,
                    doc_name: doc.name,
                    path: doc.path,
                    document_requirement_id: doc.document_requirement_id,
                    school_id: doc.school_id,
                    student_id: doc.student_id,
                    is_payment: doc.is_payment,
                    file_url: doc.file || "",
                  },
                ],
              }));
            }
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchStudentSchoolData();
      documentFetch();
    }
  }, [fetchSchoolStudents, student, slug, fetchStudentDocument]);

  const hasSlug = student?.school_students?.length
    ? student.school_students.find((ss) => ss.school?.slug === slug)
    : undefined;
  const hasNoNote =
    hasSlug && student?.school_students?.length !== 0
      ? student.school_students.find((ss) => ss.school?.slug !== slug)?.note
      : null;

  useEffect(() => {
    if (!student) return;

    const phoneFilled = student.phone && student.phone !== "";
    const addressFilled = student.address && student.address !== "";

    if (
      hasSlug === undefined &&
      phoneFilled &&
      addressFilled &&
      hasNoNote === null &&
      formData.uploaded_documents.length === 0
    ) {
      setCurrentStep(2);
    }
  }, [student, hasSlug, formData.uploaded_documents, hasNoNote]);

  const validateStep = useCallback(() => {
    const errors = {};
    const stepName = steps[currentStep - 1];

    if (stepName === "Informasi Pribadi") {
      if (!formData.avatar) errors.avatar = "Foto harus diisi.";
      if (!formData.name) errors.name = "Nama harus diisi.";
      if (!formData.school_origin)
        errors.school_origin = "Asal sekolah harus diisi.";
      if (!formData.phone) errors.phone = "Nomor telepon harus diisi.";
      if (!formData.birth_date)
        errors.birth_date = "Tanggal lahir harus diisi.";
      if (!formData.birth_place)
        errors.birth_place = "Tempat lahir harus diisi.";
      if (!formData.gender) errors.gender = "Jenis kelamin harus diisi.";
      if (!formData.religion) errors.religion = "Agama harus diisi.";
      if (!formData.address) errors.address = "Alamat harus diisi.";
      if (!formData.province_id) errors.province_id = "Provinsi harus diisi.";
      if (!formData.city_id) errors.city_id = "Kota/Kabupaten harus diisi.";
      if (!formData.district_id) errors.district_id = "Kecamatan harus diisi.";
      if (!formData.postal_code) errors.postal_code = "Kode pos harus diisi.";
    }

    if (stepName === "Upload Dokumen") {
      const requiredDocs = formData?.document_requirements || [];
      const uploadedDocs = formData?.uploaded_documents || [];

      if (requiredDocs.length === 0) {
        errors.uploaded_documents = "Tidak ada dokumen yang wajib diunggah.";
      } else {
        let missingDocs = [];

        requiredDocs.forEach((req) => {
          const uploaded = uploadedDocs.some(
            (u) => u.document_requirement_id === req.id && !!u.path
          );
          if (!uploaded) {
            errors[
              `uploaded_documents_${req.name}`
            ] = `Dokumen "${req.name}" wajib diunggah.`;
            missingDocs.push(req.name);
          }
        });

        if (missingDocs.length > 0) {
          errors.uploaded_documents = `Masih ada dokumen wajib yang belum diunggah: ${missingDocs.join(
            ", "
          )}.`;
        }
      }
    }

    if (stepName === "Pembayaran") {
      if (
        !formData.payments_info ||
        Object.keys(formData.payments_info).length === 0
      ) {
        errors.payments_info = "Informasi pembayaran harus diisi.";
      }
      if (!formData.payments_info.payment_proof_file) {
        errors.payment_proof_file =
          "Untuk melanjutkan, unggah bukti pembayaran.";
      }
      if (!formData.payments_info.bank_id) {
        errors.bank_id = "Bank harus dipilih.";
      }
      if (!formData.payments_info.payment_date) {
        errors.payment_date = "Tanggal pembayaran harus diisi.";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [currentStep, formData, steps]);

  const stepName = steps[currentStep - 1];
  const schoolStudentStatus = student?.school_students?.length
    ? student.school_students.find((ss) => ss.school?.slug === slug)
        ?.selection_status
    : null;

  const isDisable =
    schoolStudentStatus === "verify" ||
    schoolStudentStatus === "data_received_awaiting_selection";

  const handleNext = async () => {
    if (!validateStep()) {
      showError("Lengkapi kolom yang wajib diisi.");
      return;
    }

    if (stepName === "Informasi Pribadi") {
      if (!isAuthenticated || !student?.id) {
        showError("Siswa belum login atau data siswa tidak ditemukan.");
        return;
      }
      setIsLoading(true);
      try {
        await completeRegistration({
          ...formData,
          student_id: student.id,
        });
      } catch (err) {
        console.error(err);
        showError("Gagal menyimpan informasi pribadi.");
      } finally {
        setIsLoading(false);
      }
    } else if (stepName === "Upload Dokumen") {
      if (formData.uploaded_documents?.length > 0) {
        for (const doc of formData.uploaded_documents) {
          if (doc.doc_id) {
            await updateStudentDocument(doc.doc_id, {
              doc_name: doc.doc_name,
              path: doc.path,
              document_requirement_id: doc.document_requirement_id,
              school_id: doc.school_id,
              student_id: student.id,
              is_payment: false,
            });
          } else {
            await addStudentDocument({
              doc_name: doc.doc_name,
              path: doc.path,
              document_requirement_id: doc.document_requirement_id,
              school_id: doc.school_id,
              student_id: student.id,
              is_payment: false,
            });
          }
        }
      }
    }
    setCurrentStep((s) => Math.min(s + 1, steps.length));
  };

  const handlePrev = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      showError("Lengkapi kolom yang wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      if (!isAuthenticated || !student?.id) {
        showError("Siswa belum login atau data siswa tidak ditemukan.");
        return;
      }
      let paymentProofDocId = formData.payments_info?.doc_id;
      if (!paymentProofDocId) {
        const paymentDocResponse = await addStudentDocument({
          doc_name: `Bukti Pembayaran - ${student.name}`,
          path: formData.payments_info?.payment_proof_file,
          school_id: waves?.[0]?.school?.id,
          student_id: student.id,
          is_payment: true,
        });
        paymentProofDocId = paymentDocResponse?.data?.id;
      } else {
        await updateStudentDocument(formData.payments_info?.doc_id, {
          doc_name: `Bukti Pembayaran - ${student.name}`,
          path: formData.payments_info?.payment_proof_file,
          is_payment: true,
        });
      }
      const paymentData = {
        payment_date: formData.payments_info?.payment_date,
        price: formData.payments_info?.price,
        payer_id: student.id,
        bank_id: formData.payments_info?.bank_id,
        payment_method_id: formData.payments_info?.payment_method_id,
        document_id: paymentProofDocId,
      };
      if (formData.payments_info?.id) {
        await updateStudentPayment(formData.payments_info?.id, paymentData);
      } else {
        await addStudentPayment(paymentData);
      }
      if (
        student?.school_students?.some(
          (ss) =>
            ss.selection_status === "rejected_data_does_not_match" &&
            ss.school?.slug === slug
        )
      ) {
        await updateVerify(
          student.school_students.find((ss) => ss.school?.slug === slug).id
        );
      } else {
        await registerStudentToSchool({
          slug: slug,
          student_id: student.id,
          wave_id: formData.wave_id,
        });
      }
      await meStudent();
      showSuccess("Pendaftaran berhasil diselesaikan!");
      navigate(`/${slug}`);
    } catch (err) {
      console.error(err);
      showError("Gagal menyelesaikan pendaftaran.");
    } finally {
      setIsLoading(false);
    }
  };

  const commonProps = {
    formData,
    setFormData,
    setFormErrors,
    formErrors,
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <PersonalInfo {...commonProps} waves={waves} disabled={isDisable} />
            <ParentsInfoStudent
              {...commonProps}
              disabled={isDisable}
            />
          </>
        );
      case 2:
        return (
          <UploadDocuments
            {...commonProps}
            school={waves?.[0]?.school}
            waves={waves}
          />
        );
      case 3:
        return <VerifyReview formData={formData} setFormData={setFormData} />;
      case 4:
        return <PaymentStep {...commonProps} waves={waves} />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="md:px-28 md:py-14 px-12 py-8">
        <LoadingOverlay isLoading={isLoading} />
        <div className="mb-6">
          {/* stepper */}
          <div className="hidden md:flex  items-center justify-between mb-8 w-full">
            {steps.map((step, index) => {
              const isActive = currentStep === index + 1;
              const isCompleted = currentStep > index + 1;

              return (
                <div key={index} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center relative w-full">
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white z-10
              ${
                isActive
                  ? "border-[#0090D4] text-[#0090D4]"
                  : isCompleted
                  ? "border-[#0090D4] bg-[#0090D4] text-[#0090D4]"
                  : "border-gray-300 text-gray-400"
              }`}
                    >
                      {index + 1}
                    </div>

                    <div
                      className={`mt-2 text-sm font-semibold
              ${isActive ? "text-[#0090D4]" : "text-gray-600"}`}
                    >
                      {step}
                    </div>

                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-3 left-1/2 w-full h-0.5 -translate-y-1/2 
                ${isCompleted ? "bg-[#0090D4]" : isActive ? "border-[#0090D4] border-2 border-dashed" : "bg-gray-300"}`}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        {/* STEP INDICATOR MOBILE */}
        <div className="md:hidden mb-8">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-sky-500 transition-all duration-500"
              style={{
                width: `${(currentStep / steps.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Current Step Info */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-300 ${"border-sky-500 bg-sky-100 text-sky-600"}`}
            >
              {currentStep}
            </div>

            <div>
              <p className="text-xs text-gray-700 mb-1">
                Step {currentStep} dari {steps.length}
              </p>
              <p className="text-sm font-semibold">
                {steps[currentStep - 1]}
              </p>
            </div>
          </div>
        </div>

          {hasSlug && student?.school_students?.some((ss) => ss.note) && (
            <div className="mt-4 mb-8 border border-red-200 rounded-md p-3">
              <h2 className="text-xl font-semibold">Catatan Verifikasi:</h2>
              <ul className="mt-2 space-y-2">
                {student.school_students.map((ss) =>
                  ss.note ? (
                    <li
                      key={ss.id}
                      className="p-3 rounded-md border bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    >
                      <p className="font-medium">
                        Sekolah {ss.school?.name || "Sekolah"}: {ss.note}
                      </p>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          )}

          {hasSlug &&
            student?.school_students?.some(
              (ss) =>
                ss.selection_status === "verify" ||
                ss.selection_status === "waiting_complete_data"
            ) && (
              <div className="mt-4 mb-8 border border-[#0090D4] rounded-md p-3">
                <h2 className="text-xl font-semibold">Status Seleksi:</h2>
                <ul className="mt-2 space-y-2">
                  {hasSlug &&
                    student.school_students.map((ss) =>
                      ss.selection_status === "verify" ||
                      ss.selection_status === "waiting_complete_data" ||
                      ss.selection_status ===
                        "data_received_awaiting_selection" ? (
                        <li
                          key={ss.id}
                          className="p-3 rounded-md border bg-[#0090D4] dark:bg-[#0090D4] text-white dark:text-white"
                        >
                          <p className="font-medium">
                            Sekolah {ss.school?.name || "Sekolah"}:{" "}
                            <SelectionStatusBadge
                              status={ss.selection_status}
                            />
                          </p>
                        </li>
                      ) : null
                    )}
                </ul>
              </div>
            )}
        </div>

        <div className="border rounded-lg p-6 bg-white">{renderStep()}</div>

        <FormNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          handlePrevStep={handlePrev}
          handleNextStep={handleNext}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={isDisable}
        />
      </div>
    </DashboardLayout>
  );
}

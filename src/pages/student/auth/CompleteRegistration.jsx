// src/pages/student/auth/CompleteRegistration.jsx
import React, { useState, useEffect, useCallback } from "react";
import PersonalInfo from "@/components/student/PersonalInfo";
import SchoolSelection from "@/components/student/SchoolSelection";
import DocumentUpload from "@/components/student/DocumentUpload";
import PaymentInfo from "@/components/student/PaymentInfo";
import FormNavigation from "@/components/FormNavigation";
import LoadingOverlay from "@/components/LoadingOverlay";
import DashboardLayout from "@/layouts/student/DashboardLayout";
import { showSuccess, showError } from "@/components/ui/toastSonner";
import { useNavigate } from "react-router";

// Zustand Stores
import useStudentStore from "@/store/useStudentStore";
import useRegionStore from "@/store/regionStore";
import useBankStore from "@/store/useBankStore";
import useDocumentStore from "@/store/useDocumentStore";
import usePaymentStore from "@/store/usePaymentStore";
import useAuthStore from "@/store/authStore"; // To get student_id
import useSchoolStudent from "@/store/useSchoolStudent"; // Import the new store
import useWaveStore from "@/store/useWaveStore";

const CompleteRegistration = () => {
  const { user: student, isAuthenticated, meStudent } = useAuthStore();
  const { completeRegistration } = useStudentStore();
  const {
    fetchProvinces,
    provinces,
    fetchCities,
    cities,
    fetchDistricts,
    districts,
  } = useRegionStore();
  const { fetchBanks, banks } = useBankStore(); // Banks for admin, used as destination banks
  const {
    addStudentDocument,
    fetchStudentDocument,
    deleteStudentDocument,
    updateStudentDocument,
  } = useDocumentStore();
  const { addStudentPayment, fetchStudentPayments, updateStudentPayment } =
    usePaymentStore();
  const {
    store: registerStudentToSchool,
    fetchSchoolStudents,
    updateVerify,
  } = useSchoolStudent();

  const { fetchPublicWaves } = useWaveStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkWaves = async () => {
      const res = await fetchPublicWaves();
      if (!res || !res.data || res.data.length === 0) {
        showError("Tidak ada gelombang pendaftaran yang aktif saat ini.");
        navigate("/student/dashboard"); // arahkan ke dashboard / halaman lain
      }
    };
    checkWaves();
  }, [fetchPublicWaves, navigate]);

  // Tentukan step berdasarkan kondisi user
  const determineSteps = () => {
    const hasNoteFromSchool = student?.school_students?.some((ss) => ss.note);

    if (hasNoteFromSchool) {
      // Kalau ada note dari sekolah mana pun → wajib semua step
      return [
        "Informasi Pribadi",
        "Pilih Sekolah",
        "Upload Dokumen",
        "Pembayaran",
      ];
    }

    if (student?.note === null && student?.phone === null) {
      // Case 1: Biodata kosong
      return [
        "Informasi Pribadi",
        "Pilih Sekolah",
        "Upload Dokumen",
        "Pembayaran",
      ];
    }

    if (student?.note !== null && student?.phone !== null) {
      // Case 3: Sudah isi biodata, tapi belum ada note
      return ["Pilih Sekolah", "Pembayaran"];
    }

    // Default fallback
    return [
      "Informasi Pribadi",
      "Pilih Sekolah",
      "Upload Dokumen",
      "Pembayaran",
    ];
  };

  const handlePaymentInfoChange = (schoolId, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      payments_info: {
        ...prev.payments_info,
        [schoolId]: {
          ...prev.payments_info[schoolId],
          [fieldName]: value,
        },
      },
    }));
  };

  const schoolStudentFetch = useCallback(async () => {
    if (student?.id) {
      try {
        const schoolStudentResponse = await fetchSchoolStudents(student.id);
        if (schoolStudentResponse) {
          const mappedSchoolStudents = schoolStudentResponse.map((student) => ({
            school_id: student.school.id,
            logo_url: student.school.logo_url,
            school_name: student.school.name,
            school_npsn: student.school.npsn,
            address: student.school.address,
            province: student.school.provinces?.name || "",
            city: student.school.cities?.name || "",
            district: student.school.districts?.name || "",
            wave_id: student.wave.id,
            wave_name: student.wave.name,
            start_date: student.wave.start_date,
            end_date: student.wave.end_date,
            quota: student.wave.quota,
            product_price: student.wave.price,
          }));

          // Update the form data with the fetched school students
          setFormData((prev) => ({
            ...prev,
            selected_schools: [...mappedSchoolStudents],
          }));
          // fetch banks untuk sekolah itu
          mappedSchoolStudents.forEach((school) => {
            fetchBanks(school.school_id).then((result) => {
              setFormData((prev2) => ({
                ...prev2,
                banks_per_school: {
                  ...prev2.banks_per_school,
                  [school.school_id]: result || [],
                },
              }));
            });
          });
        }
      } catch (error) {
        console.error("Error fetching school students:", error);
      }
    }
  }, [student?.id, fetchSchoolStudents, fetchBanks]);

  const documentFetch = useCallback(async () => {
    if (student?.id) {
      try {
        const documentResponse = await fetchStudentDocument(student.id, false);
        if (documentResponse && documentResponse.data) {
          // Map general documents to the expected format
          const mappedGeneralDocs = documentResponse.data
            .filter((doc) => doc.is_payment === false)
            .map((doc) => ({
              doc_id: doc.id,
              doc_name: doc.name,
              path: doc.path,
              doc_requirement_id: doc.document_requirement_id,
              school_id: doc.school_id,
              is_payment: false, // Ensure is_payment is false for general docs
              file: doc.file || "", // Include file if available
            }));

          // Update the form data with the fetched documents
          setFormData((prev) => ({
            ...prev,
            uploaded_documents: [...mappedGeneralDocs],
          }));
        }
      } catch (error) {
        console.error("Error fetching student documents:", error);
      }
    }
  }, [student?.id, fetchStudentDocument]);

  const paymentFetch = useCallback(async () => {
    if (student?.id) {
      try {
        const paymentResponse = await fetchStudentPayments(student.id);
        if (paymentResponse && paymentResponse.data) {
          const mappedPayments = paymentResponse?.data?.reduce(
            (acc, payment) => {
              acc[payment.bank.school_id] = {
                id: payment.id,
                payment_date: payment.payment_date,
                selected_bank_id: payment.bank_id,
                payment_proof_file: payment.document?.file || "",
                document_id: payment.document_id,
                school_id: payment.bank.school_id,
              };
              return acc;
            },
            {}
          );

          // fetch banks untuk sekolah itu
          const schoolIds = Object.keys(mappedPayments);
          schoolIds.forEach((schoolId) => {
            fetchBanks(schoolId).then((result) => {
              setFormData((prev2) => ({
                ...prev2,
                banks_per_school: {
                  ...prev2.banks_per_school,
                  [schoolId]: result || [],
                },
              }));
            });
          });
          // Update the form data with the fetched payments
          setFormData((prev) => ({
            ...prev,
            payments_info: {
              ...prev.payments_info,
              ...mappedPayments,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching student payments:", error);
      }
    }
  }, [student?.id, fetchStudentPayments, fetchBanks]);

  useEffect(() => {
    documentFetch();
    paymentFetch();
    schoolStudentFetch();
  }, [documentFetch, paymentFetch, schoolStudentFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: null })); // Clear error on change
  };

  const handleDocumentUploadChange = (updatedDocuments) => {
    setFormData((prev) => ({ ...prev, uploaded_documents: updatedDocuments }));
  };

  // This function is called when a school is selected/deselected in Step2
  const handleSchoolSelectionChange = (wave, isSelected) => {
    const schoolId = wave.school.id;
    const waveId = wave.id;

    const newSelectedSchool = {
      school_id: schoolId,
      logo_url: wave.school.logo_url,
      school_name: wave.school.name,
      school_npsn: wave.school.npsn,
      address: wave.school.address,
      province: wave.school.provinces?.name || "",
      city: wave.school.cities?.name || "",
      district: wave.school.districts?.name || "",
      wave_id: waveId,
      wave_name: wave.name,
      start_date: wave.start_date,
      end_date: wave.end_date,
      quota: wave.quota,
      product_price: wave.price,
    };

    setFormData((prev) => {
      let updatedSchools;
      let newPaymentsInfo = { ...prev.payments_info };
      let newBanks = { ...prev.banks_per_school };

      if (isSelected) {
        updatedSchools = [...prev.selected_schools, newSelectedSchool];

        // inisialisasi banks kosong, nanti diisi setelah fetch
        newBanks[schoolId] = [];

        // fetch banks untuk sekolah itu
        fetchBanks(schoolId).then((result) => {
          setFormData((prev2) => ({
            ...prev2,
            banks_per_school: {
              ...prev2.banks_per_school,
              [schoolId]: result || [],
            },
          }));
        });

        newPaymentsInfo[schoolId] = {
          payment_date: "",
          selected_bank_id: formData.banks_per_school[schoolId]?.length
            ? formData.banks_per_school[schoolId]?.[0].id
            : null,
          payment_proof_file: "",
          document_id: null,
        };
      } else {
        updatedSchools = prev.selected_schools.filter(
          (s) => s.school_id !== schoolId
        );
        delete newPaymentsInfo[schoolId];
        delete newBanks[schoolId];
      }

      return {
        ...prev,
        selected_schools: updatedSchools,
        payments_info: newPaymentsInfo,
        banks_per_school: newBanks,
      };
    });
  };

  const steps = determineSteps();
  const totalSteps = steps.length;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    student_id: "",
    avatar: null,
    name: "",
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
    banks_per_school: {},
    selected_schools: [], // Array of { school_id: number, school_name: string, wave_id: number, wave_name: string, product_price: number, quota: number, start_date: string, end_date: string, logo_url: string, address: string, province: string, city: string, district: string }
    uploaded_documents: [], // Array of { doc_name: string, path: string, is_payment: boolean (false for general docs), doc_requirement_id: number|null, school_id: number|null, doc_id: number|null }
    payments_info: {}, // { [school_id]: { payment_date: string, selected_bank_id: number, payment_proof_file: string, document_id: number, school_id: number } }
  });

  // Prefill data untuk edit
  const [isPrefilled, setIsPrefilled] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData((prev) => ({
        ...prev,
        student_id: student.id,
        avatar: student.avatar,
        image: student.image,
        name: student.name,
        school_origin: student.school_origin,
        phone: student.phone,
        birth_date: student.birth_date,
        birth_place: student.birth_place,
        gender: student.gender,
        religion: student.religion,
        address: student.address,
        province_id: student.province_id,
        city_id: student.city_id,
        district_id: student.district_id,
        postal_code: student.postal_code,
      }));
      setIsPrefilled(true); // kasih tanda
    }
  }, [student]);

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

  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // validasi step berdasarkan kondisi steps
  const validateStep = () => {
    let errors = {};
    let isValid = true;

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

    if (stepName === "Pilih Sekolah") {
      if (formData.selected_schools.length === 0) {
        errors.selected_schools = "Minimal pilih satu sekolah.";
      }
    }

    if (stepName === "Upload Dokumen") {
      if (formData.uploaded_documents.length === 0) {
        errors.uploaded_documents = "Minimal unggah satu dokumen.";
      }
    }

    if (stepName === "Pembayaran") {
      if (formData.selected_schools.length === 0) {
        errors.payments_info =
          "Tidak ada sekolah yang dipilih untuk pembayaran.";
      } else {
        formData.selected_schools.forEach((school) => {
          const paymentInfo = formData.payments_info[school.school_id];
          if (!paymentInfo?.payment_date)
            errors[`payment_date_${school.school_id}`] =
              "Tanggal pembayaran harus diisi.";
          if (!paymentInfo?.selected_bank_id)
            errors[`selected_bank_id_${school.school_id}`] =
              "Bank tujuan harus dipilih.";
          if (!paymentInfo?.payment_proof_file)
            errors[`payment_proof_file_${school.school_id}`] =
              "Bukti pembayaran harus diunggah.";
        });
      }
    }

    setFormErrors(errors);
    isValid = Object.keys(errors).length === 0;
    return isValid;
  };

  const handleNextStep = async () => {
    if (!validateStep()) {
      showError("Harap lengkapi semua kolom yang wajib diisi.");
      return;
    }

    const stepName = steps[currentStep - 1];

    if (stepName === "Informasi Pribadi") {
      if (!isAuthenticated || !student?.id) {
        showError("Siswa belum login atau data siswa tidak ditemukan.");
        return;
      }
      setIsLoading(true);
      try {
        // Simpan baru
        if (student?.note === null && student?.phone === null) {
          const response = await completeRegistration({
            ...formData,
            student_id: student.id,
          });
          showSuccess(response.message || "Data pribadi berhasil disimpan.");
        }
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      } catch (error) {
        console.error("Gagal menyimpan data pribadi:", error);
        showError("Gagal menyimpan data pribadi.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      showError("Harap lengkapi semua kolom yang wajib diisi.");
      return;
    }

    if (!isAuthenticated || !student?.id) {
      showError("Siswa belum login atau data siswa tidak ditemukan.");
      return;
    }

    setIsLoading(true);

    try {
      // === update data diri ===
      if (student?.note !== null && student?.phone !== null) {
        await completeRegistration({
          ...formData,
          student_id: student.id,
        });
      }

      // === Upload Dokumen Umum (kalau ada) ===
      if (formData.uploaded_documents?.length > 0) {
        for (const doc of formData.uploaded_documents) {
          if (doc.doc_id) {
            await updateStudentDocument(doc.doc_id, {
              doc_name: doc.doc_name,
              path: doc.path,
              document_requirement_id: doc.doc_requirement_id,
              school_id: doc.school_id,
              student_id: student.id,
              is_payment: false,
            });
          } else {
            await addStudentDocument({
              doc_name: doc.doc_name,
              path: doc.path,
              document_requirement_id: doc.doc_requirement_id,
              school_id: doc.school_id,
              student_id: student.id,
              is_payment: false,
            });
          }
        }
      }

      // === Proses Pembayaran + Daftar Sekolah ===
      for (const school of formData.selected_schools) {
        const paymentInfo = formData.payments_info[school.school_id];
        const productPrice = school.product_price;

        let paymentProofDocId = paymentInfo?.document_id; // simpan id dokumen kalau sudah ada

        // === 1. Simpan bukti pembayaran (hanya kalau belum ada) ===
        if (!paymentProofDocId && paymentInfo?.payment_proof_file) {
          const paymentProofDocResponse = await addStudentDocument({
            doc_name: `Bukti Pembayaran ${school.school_name}`,
            path: paymentInfo.payment_proof_file,
            document_requirement_id: null,
            school_id: school.school_id,
            student_id: student.id,
            is_payment: true,
          });
          paymentProofDocId = paymentProofDocResponse.data.id;
        }

        // === 2. Simpan atau update pembayaran ===
        const dataPayment = {
          payment_date: paymentInfo.payment_date,
          price: productPrice,
          payer_id: student.id,
          bank_id: paymentInfo.selected_bank_id,
          document_id: paymentProofDocId,
        };

        if (paymentInfo?.id) {
          await updateStudentPayment(paymentInfo.id, dataPayment);
        } else {
          const paymentResponse = await addStudentPayment(dataPayment);
          paymentInfo.id = paymentResponse.data.id;
          paymentInfo.document_id = paymentProofDocId;
        }

        // === 3. Daftarkan ke sekolah ===
        if (
          student?.school_students?.some(
            (ss) =>
              ss.selection_status === "rejected_data_does_not_match" &&
              ss.school_id === school.school_id
          )
        ) {
          // kalau sebelumnya ditolak karena data tidak sesuai, update status jadi verify
          await updateVerify(
            student.school_students.find(
              (ss) => ss.school_id === school.school_id
            ).id
          );
        } else {
          // daftar baru
          await registerStudentToSchool({
            student_id: student.id,
            school_id: school.school_id,
            wave_id: school.wave_id,
          });
        }
      }

      await fetchSchoolStudents(student.id);
      await fetchStudentDocument(student.id, false);
      await fetchStudentPayments(student.id);
      await meStudent();

      showSuccess("Pendaftaran berhasil diselesaikan!");
      navigate("/student/dashboard"); // kalau mau redirect
    } catch (error) {
      console.error("Error during registration:", error);
      showError(
        "Pendaftaran gagal: " + (error.message || "Terjadi kesalahan.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const commonProps = {
    formData,
    setFormData,
    handleChange,
    formErrors,
  };
console.log(formData);
  return (
    <DashboardLayout>
      <div className="bg-ppdb-soft dark:bg-ppdb-gray-dark py-10 px-8">
        <LoadingOverlay isLoading={isLoading} />
        {/* Step Header */}
        <div className="flex items-center justify-between mb-8 w-full">
          {steps.map((step, index) => {
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;

            return (
              <div key={index} className="flex-1 flex items-center">
                {/* Step Item */}
                <div className="flex flex-col items-center relative w-full">
                  {/* Circle */}
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full border-2 bg-white z-10
              ${
                isActive
                  ? "border-ppdb-orange text-ppdb-orange"
                  : isCompleted
                  ? "border-ppdb-orange bg-ppdb-orange text-ppdb-orange"
                  : "border-gray-300 text-gray-400"
              }`}
                  >
                    {index + 1}
                  </div>

                  {/* Label */}
                  <div
                    className={`mt-2 text-sm font-semibold
              ${isActive ? "text-ppdb-orange" : "text-gray-600"}`}
                  >
                    {step}
                  </div>

                  {/* Connector line (hanya kalau bukan step terakhir) */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-3 left-1/2 w-full h-0.5 -translate-y-1/2 
                ${isCompleted ? "bg-ppdb-orange" : "bg-gray-300"}`}
                    ></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {student?.school_students?.some((ss) => ss.note) && (
          <div className="mt-4 mb-8 border border-red-200 rounded-md p-3">
            <h2 className="text-xl font-semibold dark:text-white">
              Catatan Verifikasi:
            </h2>
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

        {/* Step Content */}
        {steps[currentStep - 1] === "Informasi Pribadi" && (
          <PersonalInfo
            {...commonProps}
            provinces={provinces}
            cities={cities}
            districts={districts}
          />
        )}
        {steps[currentStep - 1] === "Pilih Sekolah" && (
          <SchoolSelection
            {...commonProps}
            provinces={provinces}
            cities={cities}
            districts={districts}
            onSchoolSelectionChange={handleSchoolSelectionChange}
          />
        )}
        {steps[currentStep - 1] === "Upload Dokumen" && (
          <DocumentUpload
            {...commonProps}
            onDocumentDelete={deleteStudentDocument}
            onDocumentUploadChange={handleDocumentUploadChange}
          />
        )}
        {steps[currentStep - 1] === "Pembayaran" && (
          <PaymentInfo
            {...commonProps}
            banks={banks}
            onPaymentInfoChange={handlePaymentInfoChange}
          />
        )}

        {/* Navigation */}
        <FormNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          handlePrevStep={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
          handleNextStep={handleNextStep}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default CompleteRegistration;

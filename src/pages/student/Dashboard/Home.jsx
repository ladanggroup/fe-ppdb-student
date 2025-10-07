import DashboardLayout from "@/layouts/student/DashboardLayout";
import Hero from "@/layouts/student/Hero";
import useAuthStore from "@/store/authStore";
import useSchoolStudent from "@/store/useSchoolStudent";
import { useState, useEffect } from "react";

export default function Home() {
  const { user: student } = useAuthStore();
  const { fetchSchoolStudents, schoolStudents } = useSchoolStudent();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (student?.id) {
        await fetchSchoolStudents(student.id);
      }
    };
    fetchData();
  }, [student?.id, fetchSchoolStudents]);

  useEffect(() => {
    if (schoolStudents?.length > 0) {
      const mappedMessages = schoolStudents.map((ss) => {
        const statusMsg = getMessageFromStatus(ss.selection_status);
        return {
          schoolName: ss.school?.name || "Sekolah tidak diketahui",
          ...statusMsg,
        };
      });
      setMessages(mappedMessages);
    }
  }, [schoolStudents]);

  return (
    <DashboardLayout>
      {/* {messages.length > 0 &&
        messages.map((msg, i) => (
          <div key={i} className="mb-3">
            <p
              className={`${msg.color} font-semibold text-lg p-4 inline-block text-center w-full rounded-md`}
            >
              <span className="block font-bold">{msg.schoolName}</span>
              {msg.text}
            </p>
          </div>
        ))} */}
        <Hero />
    </DashboardLayout>
  );
}

// helper
const getMessageFromStatus = (status) => {
  switch (status) {
    case "verify":
      return {
        text: "Menunggu verifikasi data dari sekolah",
        color: "text-blue-500 bg-blue-100",
      };
    case "data_received_awaiting_selection":
      return {
        text: "Data anda diterima dan menunggu proses seleksi",
        color: "text-green-500 bg-green-100",
      };
    case "passed_selection":
      return {
        text: "Selamat! Anda lulus seleksi",
        color: "text-green-700 bg-green-200",
      };
    case "failed_selection":
      return {
        text: "Maaf, anda tidak lulus seleksi",
        color: "text-red-500 bg-red-100",
      };
    case "rejected_data_does_not_match":
      return {
        text: "Data anda ditolak, silahkan cek kembali",
        color: "text-red-600 bg-red-100",
      };
    default:
      return {
        text: "Status belum diketahui",
        color: "text-gray-500 bg-gray-100",
      };
  }
};

import { useState } from "react";
import apiClient from "@/api/apiClient";
import { Toast } from "radix-ui";

export function useUsers(apiBaseUrl = "/api/school") {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  // const { meSchool } = useAuthStore();
  
  // Mendapatkan siswa yang mendaftar ke sekolah
  const fetchRegisteredStudents = async () => {
    try {
      const response = await apiClient.get(`${apiBaseUrl}/students`);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Failed to fetch registered students:", error);
    }
  };

    return { loading, errors, users, user, fetchRegisteredStudents };
}

// hooks/useSchoolStudents.js
import { useState, useEffect } from 'react';
import useSchoolStore from '../store/useSchoolStore';

export default function useSchoolStudents() {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    perPage: 10
  });
  
  const {
    students,
    fetchRegisteredStudents,
    verifyStudentRegistration,
    loading,
    errors
  } = useSchoolStore();
  
  useEffect(() => {
    fetchRegisteredStudents();
  }, [fetchRegisteredStudents]);

  const handleVerify = async (studentId, status) => {
    await verifyStudentRegistration(studentId, status);
  };

  const filteredStudents = students.filter(student => {
    if (filters.status !== 'all' && student.selection_status !== filters.status) {
      return false;
    }
    if (filters.search && !student.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return {
    students: filteredStudents,
    filters,
    setFilters,
    handleVerify,
    loading,
    errors
  };
}
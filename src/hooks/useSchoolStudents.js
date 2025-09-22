// hooks/useSchoolStudents.js
import { useState, useEffect } from 'react';
import useSchoolStudent from '@/store/useSchoolStudent';

export default function useSchoolStudents() {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    perPage: 10
  });
  
  const {
    students,
    fetchStudents,
    verifyRegistration,
    loading,
    errors
  } = useSchoolStudent();
  
  useEffect(() => {
    fetchStudents(filters?.page, filters?.search);
  }, [fetchStudents, filters?.page, filters?.search]);

  const handleVerify = async (studentId, status) => {
    await verifyRegistration(studentId, status);
  };

  const filteredStudents = students?.filter(student => {
    if (filters.status !== 'all' && student.status !== filters.status) {
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
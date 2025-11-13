import { useEffect } from "react";
import useSchoolStore from "@/store/useSchoolStore";
import SchoolDetail from "@/components/student/SchoolDetail";
import { useParams } from "react-router";

export default function Announcement() {
  const { slug } = useParams();
  const { schools, fetchSchoolsAnnouncement} = useSchoolStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSchoolsAnnouncement(
          slug,
        );
      } catch (error) {
        console.error("Error fetching waves:", error);
      }
    };
    
    fetchData();
  }, [fetchSchoolsAnnouncement, slug]);
  
  if (schools) {
    return (
      <SchoolDetail
        school={schools}
      />
    );
  }
}

import SchoolList from "@/pages/student/Dashboard/SchoolList";
import { Link } from "react-router";

export default function Hero() {
  return (
    <div className="overflow-y-auto">
      <section className="py-16 px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-orange-50">
        <div className="text-left items-center self-center">
          <h1 className="text-3xl font-bold">
            Sistem Informasi Pendaftaran Siswa
          </h1>
          <p className="text-lg mt-4">
            Sekolah yang sesuai dengan minat dan bakat akan membawa anda pada
            pengalaman belajar terbaik serta membuka peluang masa depan
            gemilang.
          </p>
          <Link
            to="/student/complete-registration"
            className="px-6 py-2 mt-8 inline-block bg-orange-soft-700 hover:bg-white hover:text-orange-soft-700 hover:border-orange-soft-700 text-white dark:text-black border border-orange-soft rounded-2xl"
          >
            Daftar Sekarang
          </Link>
          <Link
            to="/student/profile"
            className="px-6 py-2 border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-2xl mt-4 inline-block ml-4"
          >
            Cek Profile
          </Link>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="/src/assets/PPD Online 1.png"
            alt="PPDB Online"
            className="max-w-200px max-h-200px"
          />
        </div>
      </section>
      <SchoolList
        detail={true}
      />
    </div>
  );
}

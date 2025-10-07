import LandingPageLayout from "@/layouts/LandingPage/LandingPageLayout";

const Feature = () => {
  return (
    <LandingPageLayout>
      <section className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Fitur Unggulan</h1>
        <p>
          Dirancang fleksibel untuk berbagai jenjang pendidikan dan jumlah
          pendaftar.
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>Kelola profil sekolah & dokumen</li>
          <li>Atur peran dan akses pengguna</li>
          <li>Pendaftaran mandiri atau via sekolah</li>
          <li>Verifikasi berkas otomatis</li>
          <li>Pengelolaan pembayaran</li>
        </ul>
      </section>
    </LandingPageLayout>
  );
};

export default Feature;

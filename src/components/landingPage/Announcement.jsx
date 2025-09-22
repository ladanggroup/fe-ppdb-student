import LandingPageLayout from "@/layouts/LandingPageLayout";

const Announcement = () => {
  const data = [
    {
      nama: "Ririn Salindri Zhen",
      nisn: "12039123872136",
      peserta: "342498653584563876",
      jalur: "Zona",
      status: "Diterima",
    },
    {
      nama: "Ririn Salindri Zhen",
      nisn: "12039123872136",
      peserta: "342498653584563876",
      jalur: "Prestasi",
      status: "Tidak Diterima",
    },
  ];

  return (
    <LandingPageLayout>
      <section className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">Pengumuman Hasil Seleksi</h1>
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>Nama</th>
              <th>NISN</th>
              <th>No. Peserta</th>
              <th>Jalur</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i} className="border-b text-center">
                <td>{d.nama}</td>
                <td>{d.nisn}</td>
                <td>{d.peserta}</td>
                <td>{d.jalur}</td>
                <td>{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </LandingPageLayout>
  );
};

export default Announcement;

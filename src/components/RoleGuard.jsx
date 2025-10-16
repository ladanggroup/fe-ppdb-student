import useAuthStore from "@/store/authStore";

/**
 * RoleGuard
 * Komponen pembungkus untuk menampilkan konten hanya jika user punya role tertentu.
 *
 * @param {Array|string} roles - Role atau array of role yang diizinkan
 * @param {ReactNode} children - Elemen anak yang akan ditampilkan jika lolos
 */
export default function RoleGuard({ roles, children }) {
  const { user } = useAuthStore((state) => state);

  // Jika roles dikirim sebagai string tunggal, ubah jadi array
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!user || !user.roles) return null;

  // Jika role user cocok dengan salah satu yang diizinkan
  if (allowedRoles.includes(user.roles)) {
    return children;
  }

  return null; // sembunyikan kalau tidak cocok
}

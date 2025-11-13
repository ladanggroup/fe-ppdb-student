import Footer from "./Footer";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow bg-white">{children}</main>
      <Footer />
    </div>
  );
}

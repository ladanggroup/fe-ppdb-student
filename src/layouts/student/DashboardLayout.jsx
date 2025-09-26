import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      {/* <Hero /> */}
      <main className="flex-grow bg-white">{children}</main>
      <Footer />
    </div>
  );
}

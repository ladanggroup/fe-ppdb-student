import Hero from "./Hero";
import Navbar from "./Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col bg-white">
      <Navbar />
      {/* <Hero /> */}
      <main className="flex-grow bg-white">{children}</main>
    </div>
  );
}

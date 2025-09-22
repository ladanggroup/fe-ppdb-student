import React from 'react';
import Navbar from '@/components/landingPage/Navbar';
import Footer from '@/components/landingPage/Footer';

export default function LandingPageLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow bg-white">{children}</main>
      <Footer />
    </div>
  );
}

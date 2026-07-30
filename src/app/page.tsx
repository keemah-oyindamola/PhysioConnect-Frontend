import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Roles } from "@/components/landing/Roles";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonial } from "@/components/landing/Testimonial";
import { TrustSection } from "@/components/landing/TrustSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-paper text-ink overflow-x-hidden">
      <div className="fixed inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="relative">
        <Navbar />
        <Hero />
        <Roles />
        <HowItWorks />
        <Testimonial />
        <TrustSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
"use client";

import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { SearchConsole } from "./components/SearchConsole";
import { AboutSection } from "./components/AboutSection";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { PopularResidences } from "./components/PopularResidences";
import { PropertyWorthCTA } from "./components/PropertyWorthCTA";
import { Testimonials } from "./components/Testimonials";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

export function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-ember/20 selection:text-ember">
      <Navbar />
      <HeroSection />
      <SearchConsole />
      <AboutSection />
      <WhyChooseUs />
      <PopularResidences />
      <PropertyWorthCTA />
      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  );
}

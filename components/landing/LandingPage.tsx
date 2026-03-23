"use client";
import { useState, useEffect, Suspense } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

import AbgemeldeteToast from "@/components/landing/AbgemeldeteToast";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import PainSection from "@/components/landing/PainSection";
import BranchenSection from "@/components/landing/BranchenSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import MusterrechnungSection from "@/components/landing/MusterrechnungSection";
import BeforeAfterSection from "@/components/landing/BeforeAfterSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import PricingSection from "@/components/landing/PricingSection";
import FaqSection from "@/components/landing/FaqSection";
import TrustTechSection from "@/components/landing/TrustTechSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";
import LoginModal from "@/components/landing/LoginModal";
import MusterrechnungModal from "@/components/landing/MusterrechnungModal";
import StickyMobileCta from "@/components/landing/StickyMobileCta";

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [activeStep, setActiveStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMusterrechnung, setShowMusterrechnung] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPasswort, setLoginPasswort] = useState("");
  const [loginLaden, setLoginLaden] = useState(false);
  const [loginFehler, setLoginFehler] = useState("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (showMusterrechnung) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowMusterrechnung(false); };
      window.addEventListener("keydown", onKey);
      return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
    } else {
      document.body.style.overflow = "";
    }
  }, [showMusterrechnung]);

  useEffect(() => {
    if (showLoginModal) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowLoginModal(false); };
      window.addEventListener("keydown", onKey);
      return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
    } else {
      document.body.style.overflow = "";
    }
  }, [showLoginModal]);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((s) => (s + 1) % 4), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = () => {
    if (email.includes("@")) {
      router.push(`/registrieren?email=${encodeURIComponent(email)}`);
    } else {
      router.push("/registrieren");
    }
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginFehler("");
    setLoginLaden(true);
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPasswort });
    if (error) {
      setLoginFehler("E-Mail oder Passwort falsch.");
      setLoginLaden(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <LandingNav
        scrolled={scrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onLoginClick={() => setShowLoginModal(true)}
      />

      <HeroSection
        email={email}
        setEmail={setEmail}
        submitted={submitted}
        handleSubmit={handleSubmit}
        onOpenMusterrechnung={() => setShowMusterrechnung(true)}
        onOpenLogin={() => setShowLoginModal(true)}
      />

      <SocialProofBar />

      <PainSection />

      <BranchenSection />

      <HowItWorksSection activeStep={activeStep} setActiveStep={setActiveStep} />

      <FeaturesSection />

      <MusterrechnungSection onOpenModal={() => setShowMusterrechnung(true)} />

      <BeforeAfterSection />

      <TestimonialsSection />

      <ComparisonSection />

      <PricingSection billing={billing} setBilling={setBilling} />

      <FaqSection openFaq={openFaq} setOpenFaq={setOpenFaq} />

      <TrustTechSection />

      <CtaSection />

      <LandingFooter />

      {/* Abgemeldet Toast */}
      <Suspense>
        <AbgemeldeteToast />
      </Suspense>

      <LoginModal
        show={showLoginModal}
        onClose={() => { setShowLoginModal(false); setLoginEmail(""); setLoginPasswort(""); setLoginFehler(""); }}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPasswort={loginPasswort}
        setLoginPasswort={setLoginPasswort}
        loginLaden={loginLaden}
        loginFehler={loginFehler}
        handleLogin={handleLogin}
      />

      <MusterrechnungModal
        show={showMusterrechnung}
        onClose={() => setShowMusterrechnung(false)}
      />

      <StickyMobileCta />
    </div>
  );
}

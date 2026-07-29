"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useInView } from "framer-motion";

import MagicBento, { BentoButton } from "@/components/MagicBento";
import ElectricBorder from "@/components/ElectricBorder";
import BorderGlow from "@/components/BorderGlow";
import GooeyNav from "@/components/GooeyNav";
import ContactModal from "@/components/ContactModal";
import WhatsAppModal from "@/components/WhatsAppModal";
import EnquiryModal from "@/components/EnquiryModal";
import { ArrowUpRight, MessageCircle } from "lucide-react";

const ThreeCanvas = dynamic(() => import("@/components/ThreeCanvas"), { ssr: false });
const CircularGallery = dynamic(() => import("@/components/CircularGallery"), { ssr: false });
const Lanyard = dynamic(() => import("@/components/Lanyard"), { ssr: false });

// Animated counter component for statistic number count-up
function AnimatedCounter({
  end,
  duration = 2,
  suffix = "",
  decimals = 0,
}: {
  end: number;
  duration?: number;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Easing: easeOutQuad
      const easedProgress = progress * (2 - progress);
      const current = easedProgress * end;
      setCount(current);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, isInView]);

  return (
    <span ref={nodeRef}>
      {decimals === 0 ? Math.round(count) : count.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isActive = isHovered || isOpen;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-target"
      style={{
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        background: "rgba(10, 10, 10, 0.75)",
        backdropFilter: "blur(12px)",
        border: isActive 
          ? "1px solid rgba(255, 255, 255, 0.95)" 
          : "1px solid rgba(255, 255, 255, 0.06)",
        boxShadow: isActive 
          ? "0 0 18px rgba(255, 255, 255, 0.35), 0 0 35px rgba(255, 255, 255, 0.15), inset 0 0 10px rgba(255, 255, 255, 0.05)" 
          : "none",
        transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.8rem",
          color: "#ffffff",
          textAlign: "left",
          cursor: "pointer",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.45rem",
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{
            fontSize: "1.65rem",
            fontWeight: 300,
            color: "rgba(255, 255, 255, 0.75)",
            lineHeight: 1,
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              style={{
                padding: "0 1.8rem 1.8rem",
                fontSize: "1.05rem",
                lineHeight: 1.6,
                color: "rgba(255, 255, 255, 0.65)",
                borderTop: "1px solid rgba(255, 255, 255, 0.03)",
                paddingTop: "1.2rem",
              }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (isPortfolioOpen) {
      document.body.style.overflow = "hidden";
      if (lenisRef.current) lenisRef.current.stop();
    } else {
      document.body.style.overflow = "";
      if (lenisRef.current) lenisRef.current.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (lenisRef.current) lenisRef.current.start();
    };
  }, [isPortfolioOpen]);

  const [activeNavIndex, setActiveNavIndex] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    setMounted(true);

    // Initialize smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    const handleScrollSpy = () => {
      const sectionIds = ["#hero", "#services", "#portfolio", "#contact"];
      const scrollPos = window.scrollY + 220;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.querySelector(sectionIds[i]) as HTMLElement;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPos >= top) {
            setActiveNavIndex(i);
            break;
          }
        }
      }
    };

    lenis.on('scroll', handleScrollSpy);
    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const animId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", handleScrollSpy);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollToSection = (href: string) => {
    const target = document.querySelector(href) as HTMLElement;
    if (target) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(target, { offset: 0, immediate: true });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: "auto" });
      }
    }
  };

  if (!mounted) return null;

  const servicesData = [
    {
      color: "rgba(10, 10, 10, 0.85)",
      title: "Video Production",
      description: "Cinematic films, brand stories, commercials, and motion content engineered to move people.",
      label: "01",
    },
    {
      color: "rgba(10, 10, 10, 0.85)",
      title: "Photography",
      description: "Editorial campaigns, products, portraits and events shot with editorial precision.",
      label: "02",
    },
    {
      color: "rgba(10, 10, 10, 0.85)",
      title: "Content Creation",
      description: "Scroll-stopping reels, shorts, and social content built for reach and retention.",
      label: "03",
    },
    {
      color: "rgba(10, 10, 10, 0.85)",
      title: "Digital Marketing & Social Media",
      description: "Strategy, paid media, and full-funnel growth that turns attention into outcomes.",
      label: "04",
    },
    {
      color: "rgba(10, 10, 10, 0.85)",
      title: "Event Production & Coverage",
      description: "End-to-end production for launches, concerts, weddings, and large-scale moments.",
      label: "05",
    },
    {
      color: "rgba(10, 10, 10, 0.85)",
      title: "Brig Haus",
      description: "Instant reel studio — we shoot, edit, and deliver ready-to-post content on location.",
      label: "06",
      href: "/brighaus",
    },
  ];

  return (
    <main
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "transparent",
      }}
    >
      {/* 3D Canvas Background */}
      <ThreeCanvas activeProject={null} activeService={null} />

      {/* Centered Navigation Row at the top */}
      <header
        style={{
          position: "fixed",
          top: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "90%",
          maxWidth: "1100px",
          zIndex: 100,
          pointerEvents: "auto",
        }}
      >
        <div
          className="header-border-glow"
          style={{
            width: "100%",
            borderRadius: "50px",
            backgroundColor: "rgba(10, 10, 10, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            cursor: "default",
            position: "relative",
          }}
        >
          <div className="border-glow-inner">
            {/* Logo */}
            <div
              className="cursor-target header-logo-text"
              onClick={() => scrollToSection("#hero")}
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 700,
                fontSize: "1.25rem",
                color: "#ffffff",
                letterSpacing: "-0.02em",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span>Brig</span>
              <span style={{ color: "#f79882", marginLeft: "1px" }}>Media</span>
            </div>

            {/* Middle Nav Links using GooeyNav */}
            <div style={{ pointerEvents: "auto" }}>
              <GooeyNav
                items={[
                  { label: "Home", href: "#hero" },
                  { label: "Services", href: "#services" },
                  { label: "Work", href: "#portfolio" },
                  { label: "Contact", href: "#contact" }
                ]}
                activeIndex={activeNavIndex}
                particleCount={3}
                animationTime={350}
                timeVariance={150}
                onItemClick={(href) => {
                  scrollToSection(href);
                }}
              />
            </div>

            {/* CTA Button using BentoButton style */}
            <BentoButton
              enableStars={false}
              enableTilt={false}
              enableMagnetism={true}
              glowColor="247, 152, 130"
              className="cursor-target header-cta-btn"
              onClick={() => setIsContactOpen(true)}
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                fontSize: "1.02rem",
                fontWeight: 400,
                padding: "0.45rem 1.3rem",
                borderRadius: "50px",
                cursor: "pointer",
                color: "#ffffff",
                textTransform: "none",
                background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.15)",
              }}
            >
              Book a Call
            </BentoButton>
          </div>
        </div>
      </header>

      {/* Main Content Layout - Split Screen Grid/Flex */}
      <div
        id="hero"
        style={{
          display: "flex",
          width: "100%",
          height: "100vh",
          paddingTop: "6.5rem",
          boxSizing: "border-box",
          zIndex: 10,
          position: "relative",
        }}
      >
        {/* Left Half: Logo Image (centered with premium shadow and layout) */}
        <div
          className="hero-left-wrapper"
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <img 
            src="/assets/logo.png" 
            alt="Brig Media Logo"
            style={{
              width: "90%",
              maxWidth: "580px",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 25px rgba(247, 152, 130, 0.65)) drop-shadow(0 0 50px rgba(247, 152, 130, 0.35))",
            }}
          />
        </div>

        {/* Right Half: Copy Text and Bento Buttons */}
        <div
          className="hero-right-wrapper"
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "0 4rem 0 2rem",
            boxSizing: "border-box",
          }}
        >
          {/* Eyebrow Agency Label */}
          <span
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#f79882",
            }}
          >
            Creative Media Agency
          </span>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              fontSize: "4.5rem",
              fontWeight: 400,
              color: "#ffffff",
              textTransform: "none",
              margin: "0.8rem 0 0",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            We Create
          </h1>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "4.5rem",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#f79882",
              margin: "0 0 1.5rem",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              textTransform: "none",
            }}
          >
            Attention.
          </h1>

          {/* Body Paragraph */}
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "1rem",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: 1.6,
              maxWidth: "520px",
              margin: "0 0 2.5rem 0",
            }}
          >
            From brands and businesses to weddings, events, restaurants, creators, and special occasions — we create content that captures attention and drives results.
          </p>

          {/* Buttons Row with Bento Effects */}
          <div
            className="hero-buttons-container"
            style={{
              display: "flex",
              gap: "1.5rem",
              alignItems: "center",
              pointerEvents: "auto",
            }}
          >
            {/* Book A Strategy Call Bento Button */}
            <BentoButton
              enableStars={false}
              enableTilt={true}
              enableMagnetism={true}
              glowColor="247, 152, 130"
              className="cursor-target light-emit-border"
              onClick={() => setIsContactOpen(true)}
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                fontSize: "1.12rem",
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: "0",
                padding: "0.68rem 1.75rem",
                color: "#ffffff",
              }}
            >
              Book a Strategy Call
            </BentoButton>

            {/* View Our Work Bento Button */}
            <BentoButton
              enableStars={false}
              enableTilt={true}
              enableMagnetism={true}
              glowColor="247, 152, 130"
              className="cursor-target light-emit-border"
              onClick={() => scrollToSection("#portfolio")}
              style={{
                fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                fontSize: "1.12rem",
                fontWeight: 400,
                textTransform: "none",
                letterSpacing: "0",
                padding: "0.68rem 1.75rem",
                color: "#ffffff",
              }}
            >
              View Our Work
            </BentoButton>
          </div>
        </div>
      </div>

      {/* Services Section with MagicBento Grid */}
      <section
        id="services"
        style={{
          width: "100%",
          padding: "9rem 10% 8rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {/* Eyebrow Label */}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "1rem",
            alignSelf: "flex-start",
          }}
        >
          SERVICES
        </span>

        {/* Section Heading */}
        <h2
          style={{
            fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
            fontSize: "3.5rem",
            fontWeight: 400,
            color: "#ffffff",
            textTransform: "none",
            margin: "0 0 5rem 0",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            maxWidth: "900px",
            alignSelf: "flex-start",
            textAlign: "left",
          }}
        >
          Every craft we offer, built to{" "}
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              color: "#f79882",
              textTransform: "none",
              textShadow: "0 0 30px rgba(247, 152, 130, 0.2)",
            }}
          >
            create attention.
          </span>
        </h2>

        <MagicBento
          cards={servicesData}
          textAutoHide={true}
          enableStars={false}
          enableSpotlight={true}
          enableBorderGlow={true}
          enableTilt={true}
          enableMagnetism={true}
          clickEffect={true}
          spotlightRadius={350}
          particleCount={12}
          glowColor="247, 152, 130"
        />
      </section>

      {/* Brig Haus Highlight Section */}
      <section
        style={{
          width: "100%",
          padding: "0 10% 8rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        <BorderGlow
          edgeSensitivity={30}
          glowColor="11 87 74"
          backgroundColor="#0A0A0A"
          borderRadius={28}
          glowRadius={60}
          glowIntensity={1.3}
          coneSpread={22}
          animated={true}
          colors={["#ff1d1d", "#800000", "#f79882"]}
          fillOpacity={0.6}
          style={{ width: "100%" } as any}
        >
          <div
            style={{
              padding: "3.5rem 3rem",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "3rem",
              width: "100%",
              boxSizing: "border-box",
              flexWrap: "wrap",
            }}
          >
            {/* Left Side: Copy and Button */}
            <div
              style={{
                flex: "1 1 350px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              {/* Eyebrow */}
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "rgba(255, 255, 255, 0.45)",
                  marginBottom: "1rem",
                }}
              >
                BRIG HAUS
              </span>

              {/* Heading */}
              <h2
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2rem, 4vw, 3.2rem)",
                  fontWeight: 400,
                  color: "#ffffff",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: "1.5rem",
                  textTransform: "none",
                }}
              >
                Instant Reel{" "}
                <span
                  style={{
                    fontStyle: "italic",
                    color: "#f79882",
                    textShadow: "0 0 30px rgba(247, 152, 130, 0.15)",
                  }}
                >
                  Studio.
                </span>
              </h2>

              {/* Description */}
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.95rem",
                  fontWeight: 300,
                  color: "rgba(255, 255, 255, 0.7)",
                  lineHeight: 1.6,
                  maxWidth: "460px",
                  marginBottom: "2rem",
                }}
              >
                We shoot, edit, and deliver ready-to-post content on location for weddings, brands, events, launches, concerts, restaurants and much more.
              </p>

              {/* Pill Button */}
              <BentoButton
                enableStars={false}
                enableTilt={true}
                enableMagnetism={true}
                glowColor="247, 152, 130"
                className="cursor-target"
                onClick={() => alert("Explore Brig Haus Services Portfolio")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.4rem",
                  borderRadius: "100px",
                  fontWeight: 400,
                  fontSize: "1.05rem",
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                  textTransform: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.15)",
                }}
              >
                <span>Explore Brig Haus</span>
              </BentoButton>
            </div>

            {/* Right Side: Step Cards Layout */}
            <div
              className="step-cards-container"
              style={{
                flex: "1 1 300px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: "1rem",
                flexWrap: "nowrap",
                width: "auto",
              }}
            >
              {[
                { number: "01", name: "Shoot" },
                { number: "02", name: "Edit" },
                { number: "03", name: "Deliver" },
              ].map((step) => (
                <div
                  key={step.number}
                  style={{
                    width: "145px",
                    height: "200px",
                    borderRadius: "24px",
                    background: "linear-gradient(180deg, rgba(35, 12, 12, 0.4) 0%, rgba(15, 6, 6, 0.7) 100%)",
                    border: "1px solid rgba(247, 152, 130, 0.08)",
                    padding: "1.4rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.25)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.background = "linear-gradient(180deg, rgba(50, 15, 15, 0.5) 0%, rgba(25, 8, 8, 0.8) 100%)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.background = "linear-gradient(180deg, rgba(35, 12, 12, 0.4) 0%, rgba(15, 6, 6, 0.7) 100%)";
                  }}
                >
                  {/* Card Step Number (Top-Left) */}
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "rgba(247, 152, 130, 0.75)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {step.number}
                  </span>
                  {/* Card Title (Bottom-Left) */}
                  <span
                    style={{
                      fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                      fontSize: "1.9rem",
                      fontWeight: 400,
                      color: "#ffffff",
                      lineHeight: 1.1,
                      textAlign: "left",
                      textTransform: "none",
                    }}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </BorderGlow>
      </section>

      {/* Selected Work Section with Circular Gallery */}
      <section
        id="portfolio"
        style={{
          width: "100%",
          padding: "9rem 10% 8rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pointerEvents: "auto",
        }}
      >
        {/* Header container: Flex Row (Space Between) */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "4.5rem",
          }}
        >
          {/* Left Column: Headings */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Eyebrow Label */}
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "rgba(255, 255, 255, 0.4)",
                marginBottom: "1rem",
              }}
            >
              SELECTED WORK
            </span>

            {/* Section Heading - All Caps */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "3rem",
                fontWeight: 400,
                color: "#ffffff",
                textTransform: "none",
                margin: 0,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                maxWidth: "750px",
              }}
            >
              Stories that{" "}
              <span
                style={{
                  fontStyle: "italic",
                  color: "#f79882",
                  textShadow: "0 0 30px rgba(247, 152, 130, 0.15)",
                }}
              >
                stop the scroll.
              </span>
            </h2>
          </div>

          {/* Right Column: See Works Button */}
          <button
            className="cursor-target"
            style={{
              padding: "0.68rem 1.7rem",
              borderRadius: "50px",
              background: "linear-gradient(90deg, rgba(80, 15, 15, 0.5) 0%, rgba(130, 25, 25, 0.5) 100%)",
              border: "1px solid rgba(247, 152, 130, 0.25)",
              color: "#ffffff",
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              fontSize: "1.08rem",
              fontWeight: 400,
              textTransform: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 0 25px rgba(130, 25, 25, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.55)";
              e.currentTarget.style.background = "linear-gradient(90deg, rgba(100, 20, 20, 0.75) 0%, rgba(160, 35, 35, 0.75) 100%)";
              e.currentTarget.style.boxShadow = "0 0 35px rgba(247, 152, 130, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.25)";
              e.currentTarget.style.background = "linear-gradient(90deg, rgba(80, 15, 15, 0.5) 0%, rgba(130, 25, 25, 0.5) 100%)";
              e.currentTarget.style.boxShadow = "0 0 25px rgba(130, 25, 25, 0.2)";
            }}
            onClick={() => setIsPortfolioOpen(true)}
          >
            See Works
          </button>
        </div>

        {/* Video Cards Grid */}
        <div
          id="works-grid"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
            boxSizing: "border-box",
            pointerEvents: "auto",
          }}
        >
          {[
            { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785262440/Mehroon_-_Event_xjnrdv.mp4", title: "Mehroon - Event", subtitle: "MEHROON", tag: "BRAND FILM", type: "arrow-up" },
            { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785263414/Island_Cafe_xjx7y2.mp4", title: "Island Cafe", subtitle: "ISLAND CAFE", tag: "BRAND FILM", type: "arrow-right" },
            { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785263756/HOD_Pub_g1lxsa.mp4", title: "HOD Pub", subtitle: "HOD PUB", tag: "BRAND FILM", type: "arrow-up" }
          ].map((card, index) => (
            <div
              key={index}
              className="cursor-target"
              style={{
                position: "relative",
                height: "530px",
                borderRadius: "24px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                background: "#0a0a0c",
                cursor: "pointer",
                transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.35)";
                const playBtn = e.currentTarget.querySelector('.play-btn') as HTMLElement;
                if (playBtn) {
                  playBtn.style.transform = "translate(-50%, -50%) scale(1.1)";
                  playBtn.style.background = "rgba(180, 20, 20, 0.85)";
                  playBtn.style.boxShadow = "0 0 25px rgba(247, 152, 130, 0.45)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                const playBtn = e.currentTarget.querySelector('.play-btn') as HTMLElement;
                if (playBtn) {
                  playBtn.style.transform = "translate(-50%, -50%) scale(1)";
                  playBtn.style.background = "rgba(100, 15, 15, 0.65)";
                  playBtn.style.boxShadow = "none";
                }
              }}
              onClick={() => setActiveVideoModal(card.src)}
            >
              {/* Cover Video loop */}
              <video
                src={card.src}
                muted
                loop
                playsInline
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />

              {/* Bottom Vignette Gradient */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "50%",
                  background: "linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, transparent 100%)",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />

              {/* Top Row: Tag and Arrow */}
              <div
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "1.5rem",
                  right: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 2,
                }}
              >
                {/* Tag */}
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.35)",
                    padding: "0.35rem 0.8rem",
                    borderRadius: "100px",
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  {card.tag}
                </span>

                {/* Arrow indicator */}
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid rgba(255, 255, 255, 0.25)",
                    background: "rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(4px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: "1.1rem",
                  }}
                >
                  {card.type === "arrow-right" ? "→" : "↗"}
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div
                className="play-btn"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "58px",
                  height: "58px",
                  borderRadius: "50%",
                  background: "rgba(100, 15, 15, 0.65)",
                  border: "1px solid rgba(247, 152, 130, 0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* SVG play icon */}
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="#ffffff"
                  style={{ marginLeft: "2px" }}
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>

              {/* Bottom text */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1.8rem",
                  left: "1.8rem",
                  zIndex: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "1.95rem",
                    fontWeight: 400,
                    color: "#ffffff",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {card.title}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: "rgba(255, 255, 255, 0.45)",
                    textTransform: "uppercase",
                    marginTop: "0.3rem",
                  }}
                >
                  {card.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section
        id="impact"
        style={{
          width: "100%",
          padding: "6rem 10% 8rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pointerEvents: "auto",
        }}
      >
        {/* Eyebrow Label */}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "1rem",
          }}
        >
          IMPACT
        </span>

        {/* Section Heading */}
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "3.2rem",
            fontWeight: 400,
            color: "#ffffff",
            margin: "0 0 4rem 0",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            textTransform: "none",
          }}
        >
          Numbers that{" "}
          <span
            style={{
              fontStyle: "italic",
              color: "#f79882",
              textShadow: "0 0 30px rgba(247, 152, 130, 0.15)",
            }}
          >
            speak
          </span>{" "}
          for the craft.
        </h2>

        {/* Statistics Cards Row */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
            boxSizing: "border-box",
          }}
        >
          {/* Card 1: 150K+ Views */}
          <div
            className="cursor-target stat-card-white-glow"
            style={{
              position: "relative",
              height: "230px",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(5, 5, 5, 0.9) 100%)",
              backdropFilter: "blur(12px)",
              padding: "2.5rem 2.5rem 2.2rem 2.5rem",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            {/* Stat Number */}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "4rem",
                fontWeight: 400,
                color: "#f79882",
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              <AnimatedCounter end={150} suffix="K+" />
            </span>

            {/* Subtitle */}
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "rgba(255, 255, 255, 0.45)",
                textTransform: "uppercase",
              }}
            >
              Views Generated
            </span>
          </div>

          {/* Card 2: 4.9/5 Satisfaction */}
          <div
            className="cursor-target stat-card-white-glow"
            style={{
              position: "relative",
              height: "230px",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(5, 5, 5, 0.9) 100%)",
              backdropFilter: "blur(12px)",
              padding: "2.5rem 2.5rem 2.2rem 2.5rem",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            {/* Stat Number */}
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "4rem",
                fontWeight: 400,
                color: "#f79882",
                lineHeight: 1,
                letterSpacing: "-0.01em",
              }}
            >
              <AnimatedCounter end={4.9} decimals={1} suffix="/5" />
            </span>

            {/* Subtitle */}
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "rgba(255, 255, 255, 0.45)",
                textTransform: "uppercase",
              }}
            >
              Client Satisfaction
            </span>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        style={{
          width: "100%",
          padding: "6rem 10% 8rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pointerEvents: "auto",
        }}
      >
        {/* Eyebrow Label */}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "1rem",
          }}
        >
          FAQ
        </span>

        {/* Section Heading */}
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "3.2rem",
            fontWeight: 400,
            color: "#ffffff",
            margin: "0 0 4rem 0",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            textTransform: "none",
          }}
        >
          Questions,{" "}
          <span
            style={{
              fontStyle: "italic",
              color: "#f79882",
              textShadow: "0 0 30px rgba(247, 152, 130, 0.15)",
            }}
          >
            answered.
          </span>
        </h2>

        {/* FAQ Accordion List */}
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          {[
            {
              question: "How does pricing work?",
              answer: "Every brand is different. We scope each project around your goals, scale, and timeline, then send a clean, itemised proposal — no surprises."
            },
            {
              question: "Do you offer monthly retainers?",
              answer: "Yes. Most of our long-term partners run on monthly retainers covering production, content, and social — built around your calendar."
            },
            {
              question: "What is Brig Haus?",
              answer: "Brig Haus is our instant reel studio. We arrive on location, shoot, edit, and hand you ready-to-post content the same day."
            },
            {
              question: "Do you travel for shoots?",
              answer: "We travel anywhere in India and globally. Travel and stay are quoted transparently as part of the project."
            },
            {
              question: "How quickly can projects start?",
              answer: "For most projects we can kick off within a week. Brig Haus and rapid social work can start in 24–48 hours."
            },
            {
              question: "How do we get started?",
              answer: "Book a strategy call or send an enquiry. We'll align on goals, share a proposal, lock dates, and start production."
            }
          ].map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>

        {/* Centered Start Enquiry Button after FAQs */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "3.5rem",
            pointerEvents: "auto",
          }}
        >
          <BentoButton
            enableStars={false}
            enableTilt={true}
            enableMagnetism={true}
            glowColor="247, 152, 130"
            className="cursor-target"
            onClick={() => setIsEnquiryOpen(true)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.68rem 1.9rem",
              borderRadius: "100px",
              fontWeight: 400,
              fontSize: "1.08rem",
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              textTransform: "none",
              color: "#ffffff",
              cursor: "pointer",
              background: "linear-gradient(135deg, #7a1c1c 0%, #4a0e0e 100%)",
              border: "1px solid rgba(247, 152, 130, 0.35)",
              boxShadow: "0 0 25px rgba(120, 20, 20, 0.45)",
            }}
          >
            <span>Start Enquiry</span>
            <ArrowUpRight size={18} />
          </BentoButton>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="cta"
        style={{
          width: "100%",
          padding: "2rem 10% 8rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        <BorderGlow
          edgeSensitivity={30}
          glowColor="11 87 74"
          backgroundColor="#0A0A0A"
          borderRadius={28}
          glowRadius={60}
          glowIntensity={1.3}
          coneSpread={22}
          animated={true}
          colors={["#ff1d1d", "#800000", "#f79882"]}
          fillOpacity={0.6}
          style={{ width: "100%" } as any}
        >
          <div
            style={{
              padding: "5.5rem 3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Heading */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2.2rem, 5vw, 4rem)",
                fontWeight: 400,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                marginBottom: "3rem",
                textTransform: "none",
                maxWidth: "850px",
              }}
            >
              Ready to become the brand<br />
              <span
                style={{
                  fontStyle: "italic",
                  color: "#f79882",
                  textShadow: "0 0 30px rgba(247, 152, 130, 0.15)",
                }}
              >
                people remember?
              </span>
            </h2>

            {/* Buttons Row */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "center",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {/* Book Strategy Call Button */}
              <BentoButton
                enableStars={false}
                enableTilt={true}
                enableMagnetism={true}
                glowColor="247, 152, 130"
                className="cursor-target"
                onClick={() => setIsContactOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.68rem 1.75rem",
                  borderRadius: "100px",
                  fontWeight: 400,
                  fontSize: "1.08rem",
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                  textTransform: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 0 15px rgba(255, 255, 255, 0.15)",
                }}
              >
                <span>Book a Strategy Call</span>
                <ArrowUpRight size={18} />
              </BentoButton>

              {/* WhatsApp Us Button */}
              <BentoButton
                enableStars={false}
                enableTilt={true}
                enableMagnetism={true}
                glowColor="247, 152, 130"
                className="cursor-target"
                onClick={() => setIsWhatsAppOpen(true)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.68rem 1.75rem",
                  borderRadius: "100px",
                  fontWeight: 400,
                  fontSize: "1.08rem",
                  fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
                  textTransform: "none",
                  color: "#ffffff",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, rgba(80, 0, 0, 0.75) 0%, rgba(45, 0, 0, 0.75) 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  boxShadow: "0 0 15px rgba(128, 0, 0, 0.3)",
                }}
              >
                <span>WhatsApp Us</span>
                <MessageCircle size={18} />
              </BentoButton>
            </div>
          </div>
        </BorderGlow>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        style={{
          width: "100%",
          padding: "6rem 10% 8rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          pointerEvents: "auto",
        }}
      >
        {/* Eyebrow Label */}
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.25em",
            color: "rgba(255, 255, 255, 0.4)",
            marginBottom: "1rem",
          }}
        >
          CONTACT
        </span>

        {/* Section Heading */}
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "3.2rem",
            fontWeight: 400,
            color: "#ffffff",
            margin: "0 0 4rem 0",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            textTransform: "none",
          }}
        >
          Let's{" "}
          <span
            style={{
              fontStyle: "italic",
              color: "#f79882",
              textShadow: "0 0 30px rgba(247, 152, 130, 0.15)",
            }}
          >
            talk.
          </span>
        </h2>

        {/* Contact Cards Row */}
        <div
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
            boxSizing: "border-box",
          }}
        >
          {/* Card 1: Instagram */}
          <div
            onClick={() => window.open("https://instagram.com/brigmedia", "_blank")}
            className="cursor-target stat-card-white-glow"
            style={{
              position: "relative",
              height: "230px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(5, 5, 5, 0.9) 100%)",
              backdropFilter: "blur(12px)",
              padding: "2.5rem 1.6rem 2.2rem 1.6rem",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              cursor: "pointer",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Instagram Icon */}
            <div style={{ color: "#f79882" }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </div>
            
            {/* Content Group */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "rgba(255, 255, 255, 0.45)",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                INSTAGRAM
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
                  fontWeight: 400,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                }}
              >
                @brigmedia
              </span>
            </div>
          </div>

          {/* Card 2: Email */}
          <div
            onClick={() => window.open("mailto:growwithbrig@gmail.com", "_blank")}
            className="cursor-target stat-card-white-glow"
            style={{
              position: "relative",
              height: "230px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(5, 5, 5, 0.9) 100%)",
              backdropFilter: "blur(12px)",
              padding: "2.5rem 1.6rem 2.2rem 1.6rem",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              cursor: "pointer",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Mail Icon */}
            <div style={{ color: "#f79882" }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            
            {/* Content Group */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "rgba(255, 255, 255, 0.45)",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                EMAIL
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
                  fontWeight: 400,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                }}
              >
                growwithbrig@gmail.com
              </span>
            </div>
          </div>

          {/* Card 3: WhatsApp */}
          <div
            onClick={() => setIsWhatsAppOpen(true)}
            className="cursor-target stat-card-white-glow"
            style={{
              position: "relative",
              height: "230px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(5, 5, 5, 0.9) 100%)",
              backdropFilter: "blur(12px)",
              padding: "2.5rem 1.6rem 2.2rem 1.6rem",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-start",
              cursor: "pointer",
              transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* MessageCircle Icon */}
            <div style={{ color: "#f79882" }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
              </svg>
            </div>
            
            {/* Content Group */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "rgba(255, 255, 255, 0.45)",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                WHATSAPP
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
                  fontWeight: 400,
                  color: "#ffffff",
                  letterSpacing: "-0.01em",
                }}
              >
                Send a message
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Gallery Overlay Modal */}
      <div
        data-lenis-prevent
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#060608",
          zIndex: 9999,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          display: isPortfolioOpen ? "flex" : "none",
          flexDirection: "column",
          padding: "6rem 10% 6rem",
          boxSizing: "border-box",
          pointerEvents: isPortfolioOpen ? "auto" : "none",
        }}
      >
            {/* Close Button */}
            <button
              onClick={() => setIsPortfolioOpen(false)}
              className="cursor-target"
              style={{
                position: "absolute",
                top: "2.5rem",
                right: "4rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#ffffff",
                padding: "0.8rem 1.6rem",
                borderRadius: "50px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ✕ CLOSE
            </button>

            {/* Header: Eyebrow */}
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.25em",
                color: "rgba(255, 255, 255, 0.4)",
                marginBottom: "1rem",
              }}
            >
              SELECTED WORK
            </span>

            {/* Header: Title */}
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "2.25rem",
                fontWeight: 400,
                color: "#ffffff",
                margin: "0 0 1rem 0",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                maxWidth: "800px",
              }}
            >
              Films, reels,{" "}
              <span
                style={{
                  fontStyle: "italic",
                  color: "#f79882",
                  textShadow: "0 0 30px rgba(247, 152, 130, 0.15)",
                }}
              >
                moments.
              </span>
            </h2>

            {/* Header: Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1.1rem",
                fontWeight: 300,
                color: "rgba(255, 255, 255, 0.6)",
                lineHeight: 1.6,
                maxWidth: "680px",
                margin: "0 0 3rem 0",
              }}
            >
              A living archive of brand films, weddings, events and editorial work built to create attention.
            </p>

            {/* Header: Filter Tags Category Selector */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.8rem",
                marginBottom: "4rem",
              }}
            >
              {["All", "Brand Film", "Wedding", "Event", "Photography", "Reels"].map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className="cursor-target"
                    style={{
                      padding: "0.7rem 1.6rem",
                      borderRadius: "50px",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      fontFamily: "var(--font-sans)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      background: isActive
                        ? "linear-gradient(135deg, #800000 0%, #4a0000 100%)"
                        : "rgba(255, 255, 255, 0.03)",
                      border: isActive
                        ? "1px solid rgba(247, 152, 130, 0.4)"
                        : "1px solid rgba(255, 255, 255, 0.08)",
                      boxShadow: isActive
                        ? "0 0 15px rgba(128, 0, 0, 0.4)"
                        : "none",
                      color: isActive ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.color = "#ffffff";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                        e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                      }
                    }}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Extended Portfolio Grid in Modal */}
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "2.5rem",
                boxSizing: "border-box",
              }}
            >
              {[
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785263414/Island_Cafe_xjx7y2.mp4", title: "Island Cafe", subtitle: "ISLAND CAFE", tag: "BRAND FILM", category: "Brand Film" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785263756/HOD_Pub_g1lxsa.mp4", title: "HOD Pub", subtitle: "HOD PUB", tag: "BRAND FILM", category: "Brand Film" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785262122/Posture_Gym_ysyw0j.mp4", title: "Posture Gym", subtitle: "POSTURE GYM", tag: "BRAND FILM", category: "Brand Film" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785262208/Saloon_xrfeqr.mp4", title: "Saloon", subtitle: "SALOON", tag: "BRAND FILM", category: "Brand Film" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785262440/Mehroon_-_Event_xjnrdv.mp4", title: "Mehroon - Event", subtitle: "MEHROON", tag: "EVENT", category: "Event" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785260832/Band_Performance_-_Event_bzpcib.mp4", title: "Band Performance - Event", subtitle: "BAND PERFORMANCE", tag: "EVENT", category: "Event" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785261550/DSU_Event_l6d1fj.mp4", title: "DSU Event", subtitle: "DSU EVENT", tag: "EVENT", category: "Event" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785262105/Swift_-_Reel_r24btg.mp4", title: "Swift - Reel", subtitle: "SWIFT", tag: "REELS", category: "Reels" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785262407/Saloon_-_Reel_uqbvhg.mp4", title: "Saloon - Reel", subtitle: "SALOON", tag: "REELS", category: "Reels" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785261973/Spin_Doctor_-_Event_Promo_cocdga.mp4", title: "Spin Doctor - Event Promo", subtitle: "EVENT PROMO", tag: "REELS", category: "Reels" },
                { src: "https://res.cloudinary.com/awcihqfr/video/upload/v1785261626/Kushi_Influencer_tsdtly.mp4", title: "Kushi Influencer", subtitle: "INFLUENCER REEL", tag: "REELS", category: "Reels" },
              ]
                .filter(
                  (item) =>
                    activeCategory === "All" ||
                    item.category === activeCategory ||
                    (activeCategory === "Reels" && item.tag === "REELS") ||
                    (activeCategory === "Brand Film" && item.tag === "BRAND FILM") ||
                    (activeCategory === "Event" && item.tag === "EVENT")
                )
                .map((card, index) => {
                  const isVideo = card.src.endsWith(".mp4");
                  return (
                    <div
                      key={index}
                      className="cursor-target"
                      style={{
                        position: "relative",
                        height: "420px",
                        borderRadius: "20px",
                        overflow: "hidden",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "#0a0a0c",
                        cursor: "pointer",
                        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.35)";
                        const playBtn = e.currentTarget.querySelector(".modal-play-btn") as HTMLElement;
                        if (playBtn) {
                          playBtn.style.transform = "translate(-50%, -50%) scale(1.1)";
                          playBtn.style.background = "rgba(180, 20, 20, 0.85)";
                          playBtn.style.boxShadow = "0 0 20px rgba(247, 152, 130, 0.45)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                        const playBtn = e.currentTarget.querySelector(".modal-play-btn") as HTMLElement;
                        if (playBtn) {
                          playBtn.style.transform = "translate(-50%, -50%) scale(1)";
                          playBtn.style.background = "rgba(100, 15, 15, 0.65)";
                          playBtn.style.boxShadow = "none";
                        }
                      }}
                      onClick={() => {
                        if (isVideo) {
                          setActiveVideoModal(card.src);
                        }
                      }}
                    >
                      {isVideo ? (
                        <video
                          src={card.src}
                          muted
                          loop
                          playsInline
                          autoPlay
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                        />
                      ) : (
                        <img
                          src={card.src}
                          alt={card.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                        />
                      )}

                      {/* Vignette */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          width: "100%",
                          height: "50%",
                          background: "linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%)",
                          zIndex: 1,
                          pointerEvents: "none",
                        }}
                      />

                      {/* Tag Badge */}
                      <div
                        style={{
                          position: "absolute",
                          top: "1.2rem",
                          left: "1.2rem",
                          zIndex: 2,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            letterSpacing: "0.08em",
                            color: "rgba(255, 255, 255, 0.8)",
                            border: "1px solid rgba(255, 255, 255, 0.25)",
                            padding: "0.3rem 0.7rem",
                            borderRadius: "100px",
                            background: "rgba(0, 0, 0, 0.4)",
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          {card.tag}
                        </span>
                      </div>

                      {/* Play Button Overlay (Videos only) */}
                      {isVideo && (
                        <div
                          className="modal-play-btn"
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "rgba(100, 15, 15, 0.65)",
                            border: "1px solid rgba(247, 152, 130, 0.45)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 2,
                            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                          }}
                        >
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="#ffffff" style={{ marginLeft: "2px" }}>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}

                      {/* Bottom Text metadata */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "1.5rem",
                          left: "1.5rem",
                          zIndex: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--font-serif)",
                            fontSize: "1.5rem",
                            fontWeight: 400,
                            color: "#ffffff",
                            letterSpacing: "-0.01em",
                            lineHeight: 1.2,
                          }}
                        >
                          {card.title}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            color: "rgba(255, 255, 255, 0.45)",
                            textTransform: "uppercase",
                            marginTop: "0.2rem",
                          }}
                        >
                          {card.subtitle}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
      </div>

      {/* Fullscreen Video Player Modal */}
      <AnimatePresence>
        {activeVideoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.98)",
              backdropFilter: "blur(15px)",
              zIndex: 10000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              boxSizing: "border-box",
            }}
            onClick={() => setActiveVideoModal(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveVideoModal(null)}
              className="cursor-target"
              style={{
                position: "absolute",
                top: "2rem",
                right: "2rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                padding: "0.7rem 1.4rem",
                borderRadius: "50px",
                fontFamily: "var(--font-sans)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                zIndex: 10002,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ✕ CLOSE
            </button>

            {/* Video container */}
            <div
              style={{
                width: "90%",
                maxWidth: "1100px",
                aspectRatio: "16/9",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 0 50px rgba(0, 0, 0, 0.8)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()} // prevent close when clicking video
            >
              <video
                src={activeVideoModal}
                controls
                autoPlay
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* WhatsApp Modal */}
      <WhatsAppModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} />

      {/* Start Enquiry Modal */}
      <EnquiryModal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </main>
  );
}

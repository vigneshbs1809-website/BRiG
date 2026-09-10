"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onContactClick: () => void;
  activeProduct: "camera" | "lens";
}

export default function Navbar({ onContactClick, activeProduct }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Overview", offset: 0 },
    { name: "Technology", offset: 1.5 },
    { name: "Optics", offset: 3 },
    { name: "Specs", offset: 4 },
  ];

  const handleLinkClick = (offsetMultiplier: number) => {
    setMenuOpen(false);
    window.scrollTo({
      top: offsetMultiplier * window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: scrolled ? "0" : "0.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: scrolled ? "100%" : "calc(100% - 2.5rem)",
          zIndex: 50,
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          background: scrolled ? "rgba(5, 5, 5, 0.75)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid transparent",
          padding: "0.8rem 0",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "0 1.5rem",
            display: "flex",
            justifyContent: "between",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Logo container */}
          <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(0);
              }}
              style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "#ffffff",
                textDecoration: "none",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              Sony
            </a>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.4)",
                marginLeft: "0.6rem",
                borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
                paddingLeft: "0.6rem",
                letterSpacing: "0.05em",
              }}
            >
              {activeProduct === "camera" ? "FX6 Cine" : "G-Master"}
            </span>
          </div>

          {/* Centered nav links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2.2rem",
            }}
            className="hidden-mobile"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.name.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.offset);
                }}
                className="hover-target"
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  color: "rgba(255, 255, 255, 0.55)",
                  textDecoration: "none",
                  letterSpacing: "0.05em",
                  transition: "color 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.55)")}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right CTA Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flex: 1 }}>
            <button
              onClick={onContactClick}
              className="hover-target hidden-mobile"
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "0.45rem 1.1rem",
                borderRadius: "50px",
                cursor: "pointer",
                color: "#ffffff",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "0 0 12px rgba(255, 255, 255, 0.02)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#00D6FF";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(0, 214, 255, 0.2)";
                e.currentTarget.style.background = "rgba(0, 214, 255, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                e.currentTarget.style.boxShadow = "0 0 12px rgba(255, 255, 255, 0.02)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              }}
            >
              {activeProduct === "camera" ? "Buy FX6" : "Buy GM Lens"}
            </button>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="show-mobile-flex hover-target"
              style={{
                background: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                padding: "0.2rem",
                display: "none", // will toggle in responsive CSS styles
              }}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 45,
              background: "#050505",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "2rem",
            }}
          >
            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.2rem",
                textAlign: "center",
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`#${link.name.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.offset);
                  }}
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    textDecoration: "none",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {link.name}
                </a>
              ))}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onContactClick();
                }}
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "0.8rem 2rem",
                  borderRadius: "50px",
                  border: "1px solid #00D6FF",
                  background: "rgba(0, 214, 255, 0.05)",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
              >
                Experience Cine
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .hidden-mobile {
          display: flex;
        }
        .show-mobile-flex {
          display: none;
        }
        @media (max-width: 768px) {
          .hidden-mobile {
            display: none !important;
          }
          .show-mobile-flex {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}

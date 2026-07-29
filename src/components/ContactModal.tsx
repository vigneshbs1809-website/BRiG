"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+91 ",
    brand: "",
    project: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Brig Media! I'd like to book a strategy call.\n\n*Name:* ${formData.name}\n*Email:* ${formData.email}\n*Phone:* ${formData.phone}\n*Brand/Company:* ${formData.brand || "N/A"}\n*Project Details:* ${formData.project || "N/A"}`;
    const whatsappUrl = `https://wa.me/919999999999?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      data-lenis-prevent
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.5rem",
        boxSizing: "border-box",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Form Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "linear-gradient(160deg, #0d0909 0%, #060404 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "2.5rem 2.2rem",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(120, 20, 20, 0.2)",
          position: "relative",
          zIndex: 10,
          boxSizing: "border-box",
        }}
      >
        {/* Header Title & Close */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              fontSize: "2.1rem",
              fontWeight: 400,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-0.01em",
              textTransform: "none",
            }}
          >
            Book a Strategy Call
          </h2>
          <button
            onClick={onClose}
            className="cursor-target"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "50%",
              color: "#ffffff",
              cursor: "pointer",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            aria-label="Close"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
          {/* Field: NAME */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.45)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontFamily: "var(--font-sans, sans-serif)",
              }}
            >
              NAME
            </label>
            <input
              type="text"
              required
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: "0.9rem 1.1rem",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.5)";
                e.currentTarget.style.boxShadow = "0 0 12px rgba(247, 152, 130, 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Row: EMAIL & PHONE */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "rgba(255, 255, 255, 0.45)",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontFamily: "var(--font-sans, sans-serif)",
                }}
              >
                EMAIL
              </label>
              <input
                type="email"
                required
                placeholder="you@brand.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.5)";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(247, 152, 130, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "rgba(255, 255, 255, 0.45)",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  fontFamily: "var(--font-sans, sans-serif)",
                }}
              >
                PHONE
              </label>
              <input
                type="tel"
                placeholder="+91"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.5)";
                  e.currentTarget.style.boxShadow = "0 0 12px rgba(247, 152, 130, 0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Field: BRAND / COMPANY */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.45)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontFamily: "var(--font-sans, sans-serif)",
              }}
            >
              BRAND / COMPANY
            </label>
            <input
              type="text"
              placeholder="Brand name"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              style={{
                width: "100%",
                padding: "0.9rem 1.1rem",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                fontSize: "0.95rem",
                outline: "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.5)";
                e.currentTarget.style.boxShadow = "0 0 12px rgba(247, 152, 130, 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Field: WHAT DO YOU NEED? */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.45)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontFamily: "var(--font-sans, sans-serif)",
              }}
            >
              WHAT DO YOU NEED?
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about your project"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              style={{
                width: "100%",
                padding: "0.9rem 1.1rem",
                borderRadius: "12px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                fontSize: "0.95rem",
                outline: "none",
                resize: "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(247, 152, 130, 0.5)";
                e.currentTarget.style.boxShadow = "0 0 12px rgba(247, 152, 130, 0.15)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Submit Button: Send via WhatsApp */}
          <button
            type="submit"
            className="cursor-target"
            style={{
              width: "100%",
              marginTop: "0.6rem",
              padding: "0.85rem",
              borderRadius: "100px",
              fontWeight: 400,
              fontSize: "1.2rem",
              fontFamily: "var(--font-serif, 'Cormorant Garamond', Georgia, serif)",
              textTransform: "none",
              color: "#ffffff",
              background: "linear-gradient(135deg, #7a1c1c 0%, #4a0e0e 100%)",
              border: "1px solid rgba(247, 152, 130, 0.3)",
              boxShadow: "0 0 20px rgba(120, 20, 20, 0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 0 28px rgba(247, 152, 130, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(120, 20, 20, 0.4)";
            }}
          >
            Send via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}

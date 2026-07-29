"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    companyName: "",
    instagramHandle: "",
    companyCategory: "",
    budgetRange: "",
    shootDate: "",
    shootDuration: "",
    numberOfDays: "",
    shootLocation: "",
    additionalDetails: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const servicesList = [
    "VIDEO PRODUCTION",
    "PHOTOGRAPHY",
    "CONTENT CREATION",
    "DIGITAL MARKETING",
    "SOCIAL MEDIA MANAGEMENT",
    "EVENT PRODUCTION & COVERAGE",
    "BRIG HAUS",
  ];

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Brig Media! I'd like to reach out via WhatsApp.

*Full Name:* ${formData.fullName}
*Phone:* ${formData.phone}
*Company Name:* ${formData.companyName || "N/A"}
*Instagram:* ${formData.instagramHandle || "N/A"}
*Company Category:* ${formData.companyCategory || "N/A"}
*Budget Range:* ${formData.budgetRange || "N/A"}
*Services Needed:* ${selectedServices.length > 0 ? selectedServices.join(", ") : "None selected"}
*Shoot Date:* ${formData.shootDate || "N/A"}
*Shoot Duration:* ${formData.shootDuration || "N/A"}
*Number of Days:* ${formData.numberOfDays || "N/A"}
*Shoot Location:* ${formData.shootLocation || "N/A"}
*Additional Details:* ${formData.additionalDetails || "N/A"}`;

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
        data-lenis-prevent
        style={{
          width: "100%",
          maxWidth: "680px",
          maxHeight: "88vh",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
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
        {/* Header Title & Close Button */}
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
            WhatsApp Us
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
          {/* Row 1: FULL NAME & PHONE NUMBER */}
          <div className="modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                FULL NAME *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
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
                PHONE NUMBER *
              </label>
              <input
                type="tel"
                required
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
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Row 2: COMPANY NAME & INSTAGRAM HANDLE */}
          <div className="modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                COMPANY NAME
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
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
                INSTAGRAM HANDLE
              </label>
              <input
                type="text"
                placeholder="@yourhandle"
                value={formData.instagramHandle}
                onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Row 3: COMPANY CATEGORY & BUDGET RANGE */}
          <div className="modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                COMPANY CATEGORY
              </label>
              <select
                value={formData.companyCategory}
                onChange={(e) => setFormData({ ...formData, companyCategory: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "#0d0909",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select...</option>
                <option value="Brand / Business">Brand / Business</option>
                <option value="Restaurant / Cafe">Restaurant / Cafe</option>
                <option value="Wedding / Personal Event">Wedding / Personal Event</option>
                <option value="Creator / Influencer">Creator / Influencer</option>
                <option value="Startup / Tech">Startup / Tech</option>
                <option value="Other">Other</option>
              </select>
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
                BUDGET RANGE
              </label>
              <select
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "#0d0909",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select...</option>
                <option value="Under Rs. 25,000">Under Rs. 25,000</option>
                <option value="Rs. 25,000 - Rs. 50,000">Rs. 25,000 - Rs. 50,000</option>
                <option value="Rs. 50,000 - Rs. 1,00,000">Rs. 50,000 - Rs. 1,00,000</option>
                <option value="Rs. 1,00,000+">Rs. 1,00,000+</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>
          </div>

          {/* Section: SERVICES NEEDED */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "rgba(255, 255, 255, 0.45)",
                marginBottom: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                fontFamily: "var(--font-sans, sans-serif)",
              }}
            >
              SERVICES NEEDED
            </label>
            <div className="modal-form-grid-services" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {servicesList.map((service) => {
                const isSelected = selectedServices.includes(service);
                return (
                  <div
                    key={service}
                    onClick={() => toggleService(service)}
                    className="cursor-target"
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "12px",
                      background: isSelected ? "rgba(120, 20, 20, 0.35)" : "rgba(255, 255, 255, 0.03)",
                      border: isSelected ? "1px solid rgba(247, 152, 130, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // Handled by div click
                      style={{ cursor: "pointer", accentColor: "#f79882" }}
                    />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.7)",
                        fontFamily: "var(--font-sans, sans-serif)",
                      }}
                    >
                      {service}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 4: SHOOT DATE & SHOOT DURATION */}
          <div className="modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                SHOOT DATE
              </label>
              <input
                type="date"
                value={formData.shootDate}
                onChange={(e) => setFormData({ ...formData, shootDate: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
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
                SHOOT DURATION
              </label>
              <select
                value={formData.shootDuration}
                onChange={(e) => setFormData({ ...formData, shootDuration: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "#0d0909",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Select...</option>
                <option value="Half day">Half day</option>
                <option value="Full day">Full day</option>
                <option value="2-3 days">2-3 days</option>
                <option value="1 week+">1 week+</option>
                <option value="Not sure yet">Not sure yet</option>
              </select>
            </div>
          </div>

          {/* Row 5: NUMBER OF DAYS & SHOOT LOCATION */}
          <div className="modal-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                NUMBER OF DAYS
              </label>
              <input
                type="number"
                min="1"
                placeholder="1"
                value={formData.numberOfDays}
                onChange={(e) => setFormData({ ...formData, numberOfDays: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
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
                SHOOT LOCATION
              </label>
              <input
                type="text"
                placeholder="City / Venue"
                value={formData.shootLocation}
                onChange={(e) => setFormData({ ...formData, shootLocation: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.9rem 1.1rem",
                  borderRadius: "12px",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Field: ADDITIONAL DETAILS */}
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
              ADDITIONAL DETAILS
            </label>
            <textarea
              rows={3}
              placeholder="Tell us anything useful for the project"
              value={formData.additionalDetails}
              onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
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
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Submit Button: Open WhatsApp */}
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
            Open WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}

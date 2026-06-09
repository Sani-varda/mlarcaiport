"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function LeadFormPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus("error");
      setErrorMessage("Please fill out all required fields (Name, Email, and Message).");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus("error");
      setErrorMessage("Could not connect to the server. Please check your connection.");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#ffffff] text-[#0f172a] font-sans flex flex-col justify-between p-6 md:p-12 z-10">
      
      {/* Header Navigation */}
      <header className="w-full flex justify-between items-center text-[10px] font-mono tracking-[0.2em] uppercase">
        <Link 
          href="/" 
          className="flex items-center gap-2 font-bold hover:text-blue-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO DOSSIER</span>
        </Link>
        <div className="font-bold opacity-65">
          ML ARC // INTAKE ENGINE
        </div>
      </header>

      {/* Main Form Area */}
      <main className="max-w-4xl w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-12 pb-12">
        
        {/* Left Side: Contact Information and Title */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="font-mono text-xs text-blue-600 tracking-widest block mb-2">&mdash; INTAKE PORTAL</span>
            <h1 className="font-serif text-[clamp(2.2rem,5vw,4.5rem)] font-light leading-none tracking-tight uppercase text-slate-900 select-none">
              Initiate<br />Project
            </h1>
            <p className="font-mono text-[9px] text-blue-600 uppercase tracking-widest mt-3">
              AI Solutions &bull; Quantitative Strategy &bull; Systems Design
            </p>
          </div>

          <div className="h-[1px] w-20 bg-blue-600/30" />

          <p className="text-sm text-slate-600 leading-relaxed font-light">
            Fill out the dossier request form to submit your parameters. Your information will be directly routed to Sani Varada for architectural review.
          </p>

          <div className="space-y-4 pt-4 font-mono text-xs">
            <h4 className="text-slate-400 text-[9px] uppercase tracking-wider">Direct Directives</h4>
            
            <a 
              href="mailto:founder@mlarcai.com"
              className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors w-max"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>founder@mlarcai.com</span>
            </a>
            
            <a 
              href="tel:+917021628334" 
              className="flex items-center gap-3 text-slate-700 hover:text-blue-600 transition-colors w-max"
            >
              <Phone className="w-4 h-4 text-blue-600" />
              <span>+91 70216 28334</span>
            </a>
          </div>
        </div>

        {/* Right Side: Lead Intake Form */}
        <div className="lg:col-span-7 bg-[#f8fafc]/50 backdrop-blur-sm border border-slate-200/50 p-6 sm:p-8 rounded-2xl shadow-xl">
          {status === "success" ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle className="w-16 h-16 text-blue-600 mx-auto animate-bounce" />
              <h2 className="font-serif text-2xl font-semibold tracking-tight text-slate-900">Transmission Complete</h2>
              <p className="text-sm text-slate-600 max-w-sm mx-auto font-light leading-relaxed">
                Your lead credentials have been successfully formatted and routed to Sani Varada. Expect a response window within 24 hours.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 px-6 py-2.5 border border-blue-600 rounded-full font-mono text-[10px] uppercase tracking-widest text-[#0f172a] hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
              >
                Send Another Transmission
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                    Your Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    disabled={status === "submitting"}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 rounded-lg text-sm text-slate-800 outline-none transition-all"
                    placeholder="e.g. Sani Varada"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                    Email Address <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    disabled={status === "submitting"}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 rounded-lg text-sm text-slate-800 outline-none transition-all"
                    placeholder="e.g. founder@mlarcai.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                    Phone Parameter
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    disabled={status === "submitting"}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 rounded-lg text-sm text-slate-800 outline-none transition-all"
                    placeholder="e.g. +91 70216 28334"
                  />
                </div>

                {/* Company */}
                <div className="space-y-1.5">
                  <label htmlFor="company" className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                    Organization / Entity
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    disabled={status === "submitting"}
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 rounded-lg text-sm text-slate-800 outline-none transition-all"
                    placeholder="e.g. ML Arc"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="block font-mono text-[9px] uppercase tracking-wider text-slate-400">
                  Project Directives & Scope <span className="text-blue-600">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  disabled={status === "submitting"}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 rounded-lg text-sm text-slate-800 outline-none transition-all resize-none"
                  placeholder="Detail your system constraints, budget targets, or quantitative directives..."
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-650 bg-red-50 border border-red-200/50 p-3 rounded-lg text-xs font-mono">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-750 text-white rounded-lg font-mono text-xs uppercase tracking-widest shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Transmission...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Transmission</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full flex justify-between items-center text-[9px] font-mono tracking-[0.25em] text-slate-400 uppercase select-none">
        <div>
          ML ARC // LEAD INGESTION
        </div>
        <div>
          &copy; 2026
        </div>
      </footer>
    </div>
  );
}

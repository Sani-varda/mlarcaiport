"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, FileText, Mail, Shield, Zap, Sparkles, 
  Cpu, TrendingUp, ChevronRight, Moon, Sun, ArrowLeftRight, Download, Phone
} from "lucide-react";
import { 
  FaFacebook, FaInstagram, FaXTwitter, FaLinkedin, FaGlobe, FaCalendar, FaGithub 
} from "react-icons/fa6";
import ImageSequenceCanvas from "@/components/ImageSequenceCanvas";

const socialLinks = [
  { href: "https://www.facebook.com/MLArc", title: "Facebook", icon: FaFacebook },
  { href: "https://www.instagram.com/mlarc.ai/", title: "Instagram", icon: FaInstagram },
  { href: "https://x.com/mlarc_ai", title: "X (Twitter)", icon: FaXTwitter },
  { href: "https://www.linkedin.com/company/mlarc/", title: "LinkedIn", icon: FaLinkedin },
  { href: "https://github.com/Sani-varda", title: "GitHub", icon: FaGithub },
  { href: "https://www.mlarcai.com", title: "Website", icon: FaGlobe },
  { href: "https://calendly.com/imsunnystark/30min", title: "Schedule a Call", icon: FaCalendar },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Interactive states
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollProgress2, setScrollProgress2] = useState(0);
  const [activeCaseStudy, setActiveCaseStudy] = useState(0);
  const [activePersonalCaseStudy, setActivePersonalCaseStudy] = useState(0);
  const [p1ScrollProgress, setP1ScrollProgress] = useState(0);
  const [p2ScrollProgress, setP2ScrollProgress] = useState(0);
  const [p3ScrollProgress, setP3ScrollProgress] = useState(0);
  const [p4ScrollProgress, setP4ScrollProgress] = useState(0);
  const [entered, setEntered] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const [timeStr, setTimeStr] = useState("");

  // Clock for the landing overlay
  useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    const clockTimer = setInterval(() => {
      setTimeStr(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    }, 60000);
    return () => clearInterval(clockTimer);
  }, []);

  const scrollToVH = (vh: number) => {
    window.scrollTo({
      top: window.innerHeight * vh,
      behavior: "smooth",
    });
  };
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "VARADANAVNIT:quant-engine$ ./run_backtest.py --instrument XAU/USD",
    "Loading 10-year OHLCV dataset...",
    "Fitting GARCH(1,1) volatility regime estimator...",
    "Loading LSTM sequence forecast weights...",
    "Initial Sharpe Ratio: 1.82 | Sortino: 2.41",
    "Simulating live signals...",
  ]);

  // Helper for word-reveal animation
  const renderRevealText = (text: string, progress: number, highlightWords: string[] = []) => {
    const words = text.split(" ");
    return words.map((word, i) => {
      // Words reveal sequentially between progress 0.1 and 0.9
      const wordStart = 0.1 + (i / words.length) * 0.7;
      const factor = (progress - wordStart) / 0.08;
      const opacity = Math.min(Math.max(factor, 0.12), 1.0);
      
      const shouldHighlight = highlightWords.some(h => word.toLowerCase().includes(h.toLowerCase()));
      const textColor = shouldHighlight && opacity >= 1.0 ? "text-blue-600 font-bold" : "";
      
      return (
        <span 
          key={i} 
          className={`inline-block mr-1.5 transition-colors duration-150 ${textColor}`}
          style={{
            opacity: opacity,
            fontWeight: 700
          }}
        >
          {word}
        </span>
      );
    });
  };

  // Terminal emulation effect
  useEffect(() => {
    const timer = setInterval(() => {
      const logs = [
        `[SIGNAL] XAU/USD: BUY entry at ${1800 + Math.random() * 600} (Regime: LOW_VOL, ATR Multiplier: 1.2x)`,
        `[P&L] Current Cumulative Return: +${34 + Math.random() * 2}% (Max DD: 11.3%)`,
        `[SYSTEM] Reallocating assets using Kelly Criterion (VaR limit: 5%)`,
        `[AI] Agent voice call containment: 81% (Aria active)`,
        `[MLflow] Logging run metrics to workspace... OK`,
        `[Grafana] Metric push: latency_p95=180ms, error_rate=0.0%`,
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setTerminalOutput((prev) => [...prev.slice(-8), randomLog]);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Listen to standard vertical window scrolling
  useEffect(() => {
    if (!entered) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          
          // 1. The first image sequence is driven by the scroll in the first 250vh of the page
          const scrubZoneHeight = viewportHeight * 2.5; 
          const progress = Math.min(Math.max(scrollY / scrubZoneHeight, 0), 1);
          setScrollProgress(progress);

          // 2. The second image sequence is driven by the scroll in the next 250vh of the page (from 250vh to 500vh)
          const scrubZoneHeight2 = viewportHeight * 2.5;
          const scrollDelta2 = Math.max(scrollY - scrubZoneHeight, 0);
          const progress2 = Math.min(Math.max(scrollDelta2 / scrubZoneHeight2, 0), 1);
          setScrollProgress2(progress2);

          // Calculate overlay opacity (fades out between 4.5vh and 5.0vh)
          const currentVH = scrollY / (viewportHeight || 1);
          let opacity = 1;
          if (currentVH > 4.5) {
            opacity = Math.max(0, 1 - (currentVH - 4.5) / 0.5);
          } else {
            opacity = 1;
          }
          setOverlayOpacity(opacity);

          // 3. Horizontal slider translation (driven by scroll from 500vh onwards)
          if (sliderRef.current) {
            const startScroll = scrubZoneHeight + scrubZoneHeight2; // 500vh (5.0 * viewportHeight)
            
            // Calculate panel 1 scroll progress (500vh to 600vh)
            const p1Progress = Math.min(Math.max((scrollY - startScroll) / viewportHeight, 0), 1);
            setP1ScrollProgress(p1Progress);

            // Calculate panel 2 scroll progress (600vh to 700vh)
            const p2Progress = Math.min(Math.max((scrollY - (startScroll + viewportHeight)) / viewportHeight, 0), 1);
            setP2ScrollProgress(p2Progress);

            // Calculate panel 3 scroll progress (700vh to 800vh)
            const p3Progress = Math.min(Math.max((scrollY - (startScroll + 2 * viewportHeight)) / viewportHeight, 0), 1);
            setP3ScrollProgress(p3Progress);

            // Calculate panel 4 scroll progress (800vh to 900vh)
            const p4Progress = Math.min(Math.max((scrollY - (startScroll + 3 * viewportHeight)) / viewportHeight, 0), 1);
            setP4ScrollProgress(p4Progress);

            if (scrollY <= startScroll) {
              sliderRef.current.style.transform = `translateX(${viewportWidth}px)`;
            } else {
              // Slide 100vw for every 100vh of vertical scroll (500vh total scroll)
              const scrollDelta = scrollY - startScroll;
              const xOffset = viewportWidth - scrollDelta * (viewportWidth / viewportHeight);
              
              // There are 5 panels, so max translation is -400vw (-4 * viewportWidth)
              const maxSlide = -4 * viewportWidth;
              const clampedXOffset = Math.max(xOffset, maxSlide);
              
              sliderRef.current.style.transform = `translateX(${clampedXOffset}px)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial calculation
    handleScroll();

    // Resize event to handle viewport updates on transform
    const handleResize = () => {
      handleScroll();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [entered]);

  const handleEnter = () => {
    setEntered(true);
    // Automatically scroll down slightly to nudge user to scroll
    setTimeout(() => {
      window.scrollTo({ top: 10, behavior: "smooth" });
    }, 100);
  };

  const personalCaseStudies = [
    {
      id: "pcs-01",
      title: "Enterprise RAG Knowledge Management Platform",
      category: "AI & LLM",
      tech: "Python · LangChain · Azure OpenAI · Pinecone · FastAPI · React · Grafana",
      challenge: "A 200-employee professional services firm had critical knowledge siloed across 400+ PDFs, Confluence pages, and SQL reports, causing consultants to spend 3-4 hours daily searching and resulting in $10,000 in annual productivity loss.",
      solution: "Designed a multi-source RAG ingestion pipeline normalizing documents into a unified embedding space with hybrid dense-sparse retrieval (OpenAI + BM25) and cross-encoder re-ranking. Built a streaming FastAPI backend deployed on Azure AKS.",
      metricBefore: "3.5 hours",
      metricAfter: "10 mins",
      metricLabel: "Knowledge Lookup Time",
      metricChange: "-95.2%",
      impact: "Reduced knowledge lookup time by 95%. Saved $9,000 in estimated annual productivity. sustained 50 concurrent users with 99.9% uptime."
    },
    {
      id: "pcs-02",
      title: "Automated ML Feature Engineering Pipeline",
      category: "Cloud & MLOps",
      tech: "Python · Databricks · Apache Spark · Delta Lake · Azure ML · MLflow · ADF",
      challenge: "Manual credit risk feature engineering for Credit risk models with no lineage tracking caused feature inconsistencies and 12% model performance drift month-over-month.",
      solution: "Designed a reusable PySpark feature library on Databricks with Delta Lake time-travel and ACID guarantees. Built Azure Data Factory pipelines with auto-retraining triggers, and data quality checks with Great Expectations.",
      metricBefore: "3 weeks",
      metricAfter: "3 days",
      metricLabel: "Feature Dev Time",
      metricChange: "-85.7%",
      impact: "Reduced feature development time by 80%. Eliminated model performance drift, with accuracy variance dropping to 1.4% month-over-month."
    },
    {
      id: "pcs-03",
      title: "Gold (XAU/USD) Volatility Forecasting Model",
      category: "Quant & Finance",
      tech: "Python · GARCH/EGARCH · LSTM · Scikit-learn · Pandas · TA-Lib",
      challenge: "Gold price volatility clustering makes fixed stop-losses ineffective: tight stops get hunted during high-volatility sessions, while wide stops over-risk capital in low-volatility periods.",
      solution: "Assembled 10-year daily and hourly OHLCV dataset. Fitted EGARCH models for asymmetric volatility conditional estimation and trained an LSTM model on 60-bar rolling windows predicting next-session ATR.",
      metricBefore: "Fixed ATR Stops",
      metricAfter: "Dynamic Stops",
      metricLabel: "Stop-Out Rate Reduction",
      metricChange: "-29%",
      impact: "Dynamic stop system reduced stop-out rate by 29% on winning trades and improved risk-adjusted returns by 0.4 Sharpe points."
    },
    {
      id: "pcs-04",
      title: "BankNifty Options Strategy & Regime Detection",
      category: "Quant & Finance",
      tech: "Python · Scikit-learn · Hidden Markov Models · TA-Lib · NSE API",
      challenge: "Indian index options exhibit strong intraday regime patterns, but retail strategies applying uniform rules suffer poor risk-adjusted returns.",
      solution: "Labeled 3 years of 5-minute data into 3 regimes (trend, range, breakout) using Hidden Markov Models. Developed regime-conditional strategy modules and strike selection via NSE API.",
      metricBefore: "-8% Return",
      metricAfter: "34% Return",
      metricLabel: "Annualized Return",
      metricChange: "+34% Net",
      impact: "Achieved 34% annualized return with 15.8% max drawdown. HMM regime classifier achieved 71% out-of-sample accuracy."
    }
  ];

  const caseStudies = [
    {
      id: "cs-01",
      title: "AI Voice Agent & Lead Qualification",
      client: "Meridian Realty Group",
      sector: "Real Estate (Mumbai & Pune)",
      challenge: "Losing qualified leads due to average response times of 4.7 hours. Weekend/after-hours leads went completely unattended.",
      solution: "Deployed 'Aria', a 24/7 natural Hindi-English voice agent calling leads in under 90 seconds, qualifying on budget/timelines, and syncing transcripts to Salesforce.",
      metricBefore: "4.7 hours",
      metricAfter: "68 seconds",
      metricLabel: "Lead Response Time",
      metricChange: "-97.6%",
      impact: "₹2.3 crore in attributable additional bookings in Q1 post-deployment. Lead-to-site-visit rate improved by 180%.",
      testimonial: "Aria felt natural and professional, and never missed a lead. The ROI was visible within the first month.",
      speaker: "Rohan Mehta, Head of Sales"
    },
    {
      id: "cs-02",
      title: "Paid Ads & AI-Optimized Landing Pages",
      client: "VeloFit",
      sector: "D2C Fitness (Pan-India)",
      challenge: "A low 1.4x ROAS on ₹5L/month budget, high CAC, and lack of audience segmentation on landing pages.",
      solution: "Created 6 persona-segmented landing pages with server-side pixel tracking, built a 3-tier Meta marketing funnel, and ran AI-scripted ad testing cycles.",
      metricBefore: "1.4x ROAS",
      metricAfter: "7.2x ROAS",
      metricLabel: "Blended Return on Ads",
      metricChange: "+414%",
      impact: "Scaled monthly revenue from ₹18L to ₹61L in 5 months. Reduced Customer Acquisition Cost (CAC) by 58%.",
      testimonial: "ML Arc rebuilt our entire growth engine. The landing pages alone doubled our conversion rate before we even touched the ad budget.",
      speaker: "Priya Sharma, Co-Founder"
    },
    {
      id: "cs-03",
      title: "Support Chatbot & Workflow Automation",
      client: "NovaCare Health",
      sector: "Diagnostic Chain (Hyderabad)",
      challenge: "Support team overwhelmed with 900+ daily WhatsApp and web messages. Wait times reached 22 minutes.",
      solution: "Built a multi-channel AI chatbot trained on 480+ tests, automated PDF report delivery via WhatsApp/email, and set up automated appointment reminders.",
      metricBefore: "0%",
      metricAfter: "74%",
      metricLabel: "Bot-Resolved Queries",
      metricChange: "74% New",
      impact: "Saved ₹4.2L/month in avoided headcount. Daily human support tickets reduced by 71%, and patient satisfaction rose to 4.7/5.",
      testimonial: "Patients actually compliment our 'quick response' not knowing it's AI. The bot handles queries better than we expected.",
      speaker: "Dr. Kavitha Rao, Operations Director"
    },
    {
      id: "cs-04",
      title: "B2B SaaS AI Operations Dashboard",
      client: "FreightEdge Logistics",
      sector: "Logistics (Bengaluru)",
      challenge: "Managing 340 vehicles and 1200+ monthly shipments via spreadsheets. Invoice generation took 3-4 days post-delivery.",
      solution: "Developed a custom SaaS dashboard with real-time GPS tracking, automated billing/invoice generation, compliance checks, and a client portal.",
      metricBefore: "3-4 days",
      metricAfter: "4 minutes",
      metricLabel: "Invoice Gen Time",
      metricChange: "-99.8%",
      impact: "Reduced operational overhead by 60%. Saved 204 hours per week. Secured 2 new enterprise client contracts.",
      testimonial: "What ML Arc built in 14 weeks replaced four different systems. The invoice automation alone recovered its cost in 2 months.",
      speaker: "Arjun Nair, CEO"
    },
    {
      id: "cs-05",
      title: "AI Document Processing Agent",
      client: "Pinnacle Wealth Advisors",
      sector: "Finance (Delhi NCR)",
      challenge: "Operations team spending 60% of their time manually reviewing and entering data from 6-12 financial docs per client.",
      solution: "Deployed secure document classification and OCR extraction agents for ITR, bank statements, and CIBIL docs, with auto risk-profiling.",
      metricBefore: "6.2 hours",
      metricAfter: "58 minutes",
      metricLabel: "Onboarding Processing",
      metricChange: "-84%",
      impact: "Zero manual data entry errors. Operations team now handles 3x the client volume with the same headcount.",
      testimonial: "The AI agent reads documents faster than our best analyst and never makes data entry mistakes.",
      speaker: "Vikram Luthra, Managing Director"
    },
    {
      id: "cs-06",
      title: "High-Conversion Landing Page Suite",
      client: "Aurumé Skincare",
      sector: "D2C Skincare (Mumbai)",
      challenge: "Premium brand converting at only 0.8% on Shopify, leading to wasted ad spend and high bounce rates.",
      solution: "Designed 8 audience-matched landing pages with social proof elements above the fold, trust badges, and sub-2s mobile loading speeds.",
      metricBefore: "0.8%",
      metricAfter: "3.3%",
      metricLabel: "Landing Page CVR",
      metricChange: "+313%",
      impact: "Increased conversion rate 4.1x, generating ₹43L in incremental revenue in Q1. Bounce rate decreased by 49%.",
      testimonial: "The difference between 0.8% and 3.3% conversion is the difference between a struggling brand and a thriving one.",
      speaker: "Ananya Kapoor, Founder"
    }
  ];

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-[#ffffff]">
      
      {/* Fixed Full-Screen Image Sequence Background */}
      <div className="fixed inset-0 w-full h-full bg-[#ffffff] select-none pointer-events-none" style={{ zIndex: 1 }}>
        {/* Sequence 1 (Active during initial vertical scroll) - Positioned on top */}
        <div 
          className="absolute inset-0 w-full h-full transition-opacity duration-300 ease-in-out"
          style={{ 
            opacity: scrollProgress < 1.0 ? 1 : 0,
            zIndex: scrollProgress < 1.0 ? 2 : 1
          }}
        >
          <ImageSequenceCanvas 
            scrollProgress={scrollProgress} 
            totalFrames={240}
            startFrame={1}
            folder="/images/sequence2"
            prefix="ezgif-frame-"
            digits={3}
            extension="png"
            isActive={scrollProgress < 1.0}
          />
        </div>

        {/* Sequence 2 (Active during horizontal dossier scroll) - Positioned underneath */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            opacity: 1,
            zIndex: 1
          }}
        >
          <ImageSequenceCanvas 
            scrollProgress={scrollProgress2} 
            totalFrames={240}
            startFrame={1}
            folder="/images/sequence1"
            prefix="ezgif-frame-"
            digits={3}
            extension="png"
            isActive={scrollProgress >= 1.0}
          />
        </div>
      </div>

      {/* INTRO SCREEN OVERLAY */}
      {!entered && (
        <main className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-[#ffffff] overflow-hidden text-center p-8 select-none">
          {/* Background Portrait Image */}
          <div className="absolute inset-0 w-full h-full opacity-40">
            <Image 
              src="/images/Cinematic_portrait_with_high-contrast_dual-tone_202606090312.jpeg" 
              alt="Sani Varada Cinematic Background" 
              fill
              priority
              className="object-cover"
            />
          </div>
          
          {/* Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff] via-[#ffffff]/40 to-[#ffffff]" />

          <div className="relative z-10 max-w-4xl flex flex-col items-center">
            {/* Logo */}
            <div className="w-16 h-16 mb-8 animate-pulse">
              <Image src="/logo.svg" alt="SV Monogram" width={64} height={64} priority className="w-full h-full" />
            </div>

            <h1 className="font-serif text-[clamp(2.5rem,6vw,5.5rem)] font-light tracking-[0.25em] text-slate-900 leading-none mb-4 uppercase">
              SANI VARADA
            </h1>
            
            <div className="h-[1px] w-24 bg-blue-600 mb-6" />
            
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-blue-600 mb-12 max-w-md leading-relaxed">
              AI/ML Architect &bull; Quant Analyst &bull; Founder of ML Arc
            </p>

            <button
              onClick={handleEnter}
              className="group relative px-10 py-4 border border-blue-600 hover:border-blue-700 rounded-full font-mono text-xs uppercase tracking-widest text-[#0f172a] hover:text-white transition-all bg-transparent hover:bg-blue-600 shadow-md overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 flex items-center gap-3">
                Enter The Experience <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>

          <div className="absolute bottom-12 font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500">
            &copy; 2026
          </div>
        </main>
      )}

      {/* SCROLLABLE DOSSIER LAYOUT */}
      {entered && (
        <div className="relative w-full h-[1000vh] z-10">
          
          {/* SECTION 1 OVERLAYS (visible during vertical canvas scroll, fades out as Panel 1 enters) */}
          {overlayOpacity > 0 && (
            <div 
              className="fixed inset-0 z-20 pointer-events-none transition-opacity duration-75 flex flex-col justify-between p-6 md:p-12"
              style={{ opacity: overlayOpacity }}
            >
              {/* Header */}
              <header className="w-full flex justify-between items-center text-[10px] font-mono tracking-[0.2em] text-slate-800 uppercase pointer-events-auto">
                <div className="font-bold cursor-pointer hover:text-blue-600 transition-colors" onClick={() => scrollToVH(0)}>
                  ML ARC // ARCHITECT
                </div>
                <div className="hidden sm:block opacity-65 font-bold">
                  {timeStr || "10:37 AM"}
                </div>
                <nav className="flex gap-4 sm:gap-6 md:gap-8 font-semibold">
                  <button onClick={() => scrollToVH(5.0)} className="hover:text-blue-600 transition-colors cursor-pointer">ABOUT</button>
                  <button onClick={() => scrollToVH(6.0)} className="hover:text-blue-600 transition-colors cursor-pointer">CASES</button>
                  <button onClick={() => scrollToVH(8.0)} className="hover:text-blue-600 transition-colors cursor-pointer">QUANT</button>
                  <button onClick={() => scrollToVH(9.0)} className="hover:text-blue-600 transition-colors cursor-pointer">CONTACT</button>
                </nav>
                <a 
                  href="https://calendly.com/imsunnystark/30min" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="border border-slate-800 hover:bg-slate-800 hover:text-white px-3 py-1.5 md:px-4 rounded-full transition-all text-[9px] font-bold tracking-widest"
                >
                  BOOK A CALL
                </a>
              </header>

              {/* Middle Section (Body Content) */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-end my-auto pt-16 pb-8">
                {/* Left Content (Socials & Big Name) */}
                <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-12">
                  {/* Vertical Socials List */}
                  <div className="flex flex-col gap-3 text-[10px] font-mono tracking-widest uppercase pointer-events-auto">
                    <a href="https://www.facebook.com/MLArc" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors w-max">FACEBOOK</a>
                    <a href="https://www.instagram.com/mlarc.ai/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors w-max">INSTAGRAM</a>
                    <a href="https://x.com/mlarc_ai" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors w-max">X (TWITTER)</a>
                    <a href="https://www.linkedin.com/company/mlarc/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors w-max">LINKEDIN</a>
                    <a href="https://github.com/Sani-varda" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-600 transition-colors w-max">GITHUB</a>
                  </div>

                  {/* Big Name */}
                  <div className="space-y-1">
                    <span className="font-mono text-xs text-slate-400 block tracking-wider">(26)</span>
                    <h2 className="font-serif text-[clamp(3rem,8vw,7.5rem)] font-light leading-[0.85] tracking-tight uppercase text-slate-900 select-none">
                      SANI<br />VARADA
                    </h2>
                  </div>
                </div>

                {/* Right Content (Description Columns) */}
                <div className="lg:col-span-6 space-y-6 lg:space-y-8 text-slate-800 pointer-events-auto">
                  <p className="font-sans font-bold text-base sm:text-lg lg:text-[20px] tracking-tight leading-snug text-slate-900 border-l-2 border-blue-600/30 pl-5">
                    ML Arc® is the design & engineering work of Sani Varada, AI/ML Architect delivering advanced generative systems, custom RAG pipelines, and systematic volatility strategies globally.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 font-mono text-[10px] leading-relaxed">
                    <div className="space-y-2">
                      <span className="text-blue-600 font-bold block uppercase tracking-wider">Sani Varada Studio</span>
                      <p className="text-slate-600">
                        Applying 7+ years of experience in system architecture, LLM agent pipelines, and database tuning to enable enterprise-scale automation and cost efficiency.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-blue-600 font-bold block uppercase tracking-wider">Quant Systems</span>
                      <p className="text-slate-600">
                        Implementing GARCH volatility clustering forecast models, LSTM regime estimation, and autonomous SMS/Telegram execution triggers (Hermes Agent).
                      </p>
                    </div>
                  </div>

                  {/* Cursive Design Sign-off & Episode info */}
                  <div className="flex justify-between items-center pt-4 text-[10px] font-mono tracking-widest text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>A Design by</span>
                      <span className="font-serif italic font-semibold text-slate-800 text-xs">Sani Varada</span>
                    </div>
                    <div>
                      <span>EP. 01</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer (bottom bar) */}
              <footer className="w-full flex justify-between items-center text-[9px] font-mono tracking-[0.25em] text-slate-400 uppercase select-none">
                <div>
                  AI/ML ARCHITECT &bull; QUANT ANALYST
                </div>
                <div>
                  // 2026
                </div>
              </footer>
            </div>
          )}

          {/* Floating Vertical Social Sidebar */}
          <div 
            className="fixed right-6 top-1/2 z-40 hidden md:flex flex-col items-center bg-white/80 backdrop-blur-md border border-slate-200/50 py-6 px-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover-pause w-12" 
            aria-label="Social Links Sidebar"
            style={{ 
              opacity: 1 - overlayOpacity, 
              pointerEvents: overlayOpacity < 0.5 ? 'auto' : 'none',
              transform: `translateY(-50%) scale(${overlayOpacity < 0.5 ? 1 : 0.95})`
            }}
          >
            <div className="h-[220px] overflow-hidden mask-gradient-vertical flex flex-col items-center py-2 w-full">
              <div className="flex flex-col gap-6 items-center animate-marquee-vertical-down">
                {/* First Set */}
                {socialLinks.map(({ href, title, icon: Icon }, idx) => (
                  <a 
                    key={`set1-${idx}`}
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-500 hover:text-blue-700 hover:scale-110 transition-all duration-200 py-1"
                    title={title}
                    aria-label={title}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
                {/* Second Set (Duplicate for seamless loop) */}
                {socialLinks.map(({ href, title, icon: Icon }, idx) => (
                  <a 
                    key={`set2-${idx}`}
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-slate-500 hover:text-blue-700 hover:scale-110 transition-all duration-200 py-1"
                    title={title}
                    aria-label={title}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* SECTION 1: SCROLL-DRIVEN SEQUENCE SCENE (CLEAN VIEW WITH DYNAMIC SCROLLER SPACE) */}
          <div className="h-[500vh] w-full relative">
          </div>

          {/* SECTION 2: THE CONTENT PACK (STAYS STICKY AND SLIDES HORIZONTALLY) */}
          <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-transparent z-10">
            <div 
              ref={sliderRef}
              className="flex h-full w-[500vw] transition-transform duration-75 ease-out"
              style={{ transform: "translateX(100vw)" }}
            >

              {/* PANEL 1: PROFILE & CREDENTIALS */}
              <div className="w-screen h-screen flex-shrink-0 flex justify-center items-center px-6 md:px-16 py-8 lg:py-16 bg-white border-r border-slate-100 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full max-w-6xl">
                  {/* Portrait Display */}
                  <div className="lg:col-span-5 relative flex justify-center items-center py-4 lg:py-0">
                    <div className="relative w-48 h-64 sm:w-64 sm:h-80 lg:w-76 lg:h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-2xl z-20 hover:scale-[1.02] transition-transform duration-500 bg-slate-50">
                      <Image 
                        src="/images/Cinematic_portrait_with_high-contrast_dual-tone_202606090312.jpeg" 
                        alt="Sani Varada Cinematic Portrait"
                        fill
                        priority
                        sizes="(max-w-768px) 100vw, 320px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Profile competencies */}
                  <div className="lg:col-span-7 space-y-4 lg:space-y-6">
                    <div>
                      <span className="font-mono text-xs text-blue-600 tracking-widest block mb-2">&mdash; Architect Profile</span>
                      <h2 className="font-sans font-extrabold text-3xl lg:text-4xl tracking-tight text-slate-900 leading-none uppercase">SANI VARADA</h2>
                      <p className="font-mono text-[10px] text-blue-600 uppercase tracking-widest mt-2">
                        AI/ML Engineer &bull; Quantitative Analyst &bull; Founder of ML Arc
                      </p>
                    </div>

                    <div className="relative pl-6 border-l-2 border-blue-600/30 py-1">
                      <span className="text-blue-600 font-serif text-5xl leading-none absolute left-0 top-0 select-none">“</span>
                      <p className="font-sans font-bold text-base sm:text-lg lg:text-xl tracking-tight leading-snug text-slate-900">
                        {renderRevealText(
                          "AI/ML Engineer, Quantitative Analyst, and Entrepreneur combining deep technical expertise with financial markets acumen. Founded ML Arc, an AI software agency delivering LLM-powered SaaS platforms, hybrid RAG pipelines, conversational AI agents, and intelligent workflow automation to global clients. Applies time-series volatility models and algorithmic execution strategies across major assets (XAU/USD, options, indexes).",
                          p1ScrollProgress,
                          ["ML", "Arc"]
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono text-xs border-t border-slate-100 pt-6">
                      <div>
                        <h4 className="text-blue-600 font-semibold mb-2 uppercase tracking-wider">AI & LLM</h4>
                        <ul className="space-y-1 text-slate-600">
                          <li>&bull; LangChain / LangGraph</li>
                          <li>&bull; Custom RAG & Vector DBs</li>
                          <li>&bull; Fine-tuning / Agents</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-600 font-semibold mb-2 uppercase tracking-wider">Quant & Finance</h4>
                        <ul className="space-y-1 text-slate-600">
                          <li>&bull; Systematic Algorithmic Trading</li>
                          <li>&bull; EGARCH & LSTM Volatility</li>
                          <li>&bull; Risk (Kelly / VaR)</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-600 font-semibold mb-2 uppercase tracking-wider">Cloud & MLOps</h4>
                        <ul className="space-y-1 text-slate-600">
                          <li>&bull; Databricks / PySpark</li>
                          <li>&bull; AKS / Kubernetes</li>
                          <li>&bull; Grafana / Prometheus</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-blue-600 font-semibold mb-2 uppercase tracking-wider">Web & SaaS</h4>
                        <ul className="space-y-1 text-slate-600">
                          <li>&bull; Next.js / React</li>
                          <li>&bull; FastAPI / Node.js</li>
                          <li>&bull; Supabase / APIs</li>
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4 text-[11px] text-slate-500 font-mono">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-400">Education</span>
                        <span className="text-slate-700">B.E. in CS/IT (2016-2020)</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-slate-400">Certifications</span>
                        <span className="text-slate-700">Azure Data Eng &bull; Databricks Spark</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 2: PERSONAL CASE STUDIES */}
              <div className="w-screen h-screen flex-shrink-0 flex flex-col justify-center items-center px-6 md:px-24 py-16 bg-slate-50 border-r border-slate-100 overflow-y-auto no-scrollbar">
                <div className="w-full max-w-6xl">
                  <div className="flex justify-between items-baseline mb-8 border-b border-slate-200 pb-4">
                    <div>
                      <span className="font-mono text-xs text-blue-600 uppercase tracking-widest block">&mdash; Engineering & Quant Projects</span>
                      <h2 className="font-sans font-bold text-3xl tracking-tight text-slate-900">Personal Case Studies</h2>
                    </div>
                    
                    <div className="flex gap-2">
                      {personalCaseStudies.map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setActivePersonalCaseStudy(i)}
                          className={`w-8 h-8 rounded-full border text-[10px] font-mono flex items-center justify-center transition-all cursor-pointer ${
                            activePersonalCaseStudy === i 
                            ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                            : 'border-slate-300 text-slate-500 hover:border-blue-600/50 hover:text-blue-600'
                          }`}
                          aria-label={`View personal case study ${i + 1}: ${personalCaseStudies[i].title}`}
                          aria-selected={activePersonalCaseStudy === i}
                        >
                          0{i+1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[50vh]">
                    <div className="lg:col-span-4 flex flex-col gap-2 overflow-y-auto no-scrollbar pr-2">
                      {personalCaseStudies.map((pcs, i) => (
                        <button
                          key={pcs.id}
                          onClick={() => setActivePersonalCaseStudy(i)}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                            activePersonalCaseStudy === i 
                            ? 'bg-white border-blue-600/30 shadow-sm' 
                            : 'bg-transparent border-transparent hover:bg-slate-100'
                          }`}
                          aria-label={`Select case study ${i + 1}: ${pcs.title}`}
                          aria-selected={activePersonalCaseStudy === i}
                        >
                          <span className="font-mono text-[9px] text-blue-600 uppercase tracking-widest block mb-1">0{i+1} &bull; {pcs.category}</span>
                          <h4 className="font-sans text-sm font-bold tracking-tight text-slate-900">{pcs.title}</h4>
                        </button>
                      ))}
                    </div>

                    <div className="lg:col-span-8 flex flex-col justify-between overflow-y-auto no-scrollbar relative">
                      <div>
                        <div className="flex flex-wrap justify-between items-baseline gap-4 mb-4">
                          <h3 className="font-sans text-xl font-extrabold tracking-tight text-slate-900">
                            {personalCaseStudies[activePersonalCaseStudy].title}
                          </h3>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full font-mono text-[9px] uppercase tracking-wider text-blue-600">
                            {personalCaseStudies[activePersonalCaseStudy].category}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                          <div className="md:col-span-8 space-y-4">
                            <div className="border-l-2 border-blue-600/30 pl-5 py-1">
                              <strong className="text-slate-900 block font-mono uppercase text-[9px] tracking-wider mb-1">The Challenge:</strong>
                              <p className="font-sans font-bold text-base md:text-lg tracking-tight leading-snug text-slate-900">
                                {renderRevealText(personalCaseStudies[activePersonalCaseStudy].challenge, p2ScrollProgress)}
                              </p>
                            </div>
                            <div className="border-l-2 border-blue-600/30 pl-5 py-1">
                              <strong className="text-slate-900 block font-mono uppercase text-[9px] tracking-wider mb-1">The Solution:</strong>
                              <p className="font-sans font-bold text-base md:text-lg tracking-tight leading-snug text-slate-900">
                                {renderRevealText(personalCaseStudies[activePersonalCaseStudy].solution, p2ScrollProgress)}
                              </p>
                            </div>
                            <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                              Tech Stack: {personalCaseStudies[activePersonalCaseStudy].tech}
                            </div>
                          </div>

                          <div className="md:col-span-4 bg-white border border-slate-200 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                            <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                              {personalCaseStudies[activePersonalCaseStudy].metricLabel}
                            </span>
                            <span className="text-[28px] font-sans font-black text-blue-600 leading-none my-1 tracking-tight">
                              {personalCaseStudies[activePersonalCaseStudy].metricAfter}
                            </span>
                            <span className="font-mono text-[10px] text-blue-600 font-bold">
                              {personalCaseStudies[activePersonalCaseStudy].metricChange}
                            </span>
                            <span className="font-mono text-[9px] text-slate-400 line-through mt-1">
                              Before: {personalCaseStudies[activePersonalCaseStudy].metricBefore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-4 flex items-center font-mono text-[10px] text-slate-500 tracking-wider">
                        <span className="text-blue-600 font-bold mr-2">Impact:</span>
                        {personalCaseStudies[activePersonalCaseStudy].impact}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 3: CASE STUDIES */}
              <div className="w-screen h-screen flex-shrink-0 flex flex-col justify-center items-center px-6 md:px-24 py-16 bg-white border-r border-slate-100 overflow-y-auto no-scrollbar">
                <div className="w-full max-w-6xl">
                  <div className="flex justify-between items-baseline mb-8 border-b border-slate-200 pb-4">
                    <div>
                      <span className="font-mono text-xs text-blue-600 uppercase tracking-widest block">&mdash; Performance Case Studies</span>
                      <h2 className="font-sans font-bold text-3xl tracking-tight text-slate-900">ML Arc Agency</h2>
                    </div>
                    
                    <div className="flex gap-2">
                      {caseStudies.map((_, i) => (
                        <button 
                          key={i}
                          onClick={() => setActiveCaseStudy(i)}
                          className={`w-8 h-8 rounded-full border text-[10px] font-mono flex items-center justify-center transition-all cursor-pointer ${
                            activeCaseStudy === i 
                            ? 'bg-blue-600 text-white border-blue-600 font-bold' 
                            : 'border-slate-200 text-slate-500 hover:border-blue-600/50 hover:text-blue-600'
                          }`}
                          aria-label={`View agency case study ${i + 1}: ${caseStudies[i].title}`}
                          aria-selected={activeCaseStudy === i}
                        >
                          0{i+1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch h-[50vh]">
                    <div className="lg:col-span-4 flex flex-col gap-2 overflow-y-auto no-scrollbar pr-2">
                      {caseStudies.map((cs, i) => (
                        <button
                          key={cs.id}
                          onClick={() => setActiveCaseStudy(i)}
                          className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                            activeCaseStudy === i 
                            ? 'bg-slate-50 border-blue-600/30 shadow-sm' 
                            : 'bg-transparent border-transparent hover:bg-slate-100'
                          }`}
                          aria-label={`Select agency case study ${i + 1}: ${cs.title}`}
                          aria-selected={activeCaseStudy === i}
                        >
                          <span className="font-mono text-[9px] text-blue-600 uppercase tracking-widest block mb-1">0{i+1} &bull; {cs.client}</span>
                          <h4 className="font-sans text-sm font-bold tracking-tight text-slate-900">{cs.title}</h4>
                        </button>
                      ))}
                    </div>

                    <div className="lg:col-span-8 flex flex-col justify-between overflow-y-auto no-scrollbar relative">
                      <div>
                        <div className="flex flex-wrap justify-between items-baseline gap-4 mb-4">
                          <h3 className="font-sans text-xl font-extrabold tracking-tight text-slate-900">
                            {caseStudies[activeCaseStudy].title}
                          </h3>
                          <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full font-mono text-[9px] uppercase tracking-wider text-blue-600">
                            {caseStudies[activeCaseStudy].sector}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                          <div className="md:col-span-8 space-y-4">
                            <div className="border-l-2 border-blue-600/30 pl-5 py-1">
                              <strong className="text-slate-900 block font-mono uppercase text-[9px] tracking-wider mb-1">The Challenge:</strong>
                              <p className="font-sans font-bold text-base md:text-lg tracking-tight leading-snug text-slate-900">
                                {renderRevealText(caseStudies[activeCaseStudy].challenge, p3ScrollProgress)}
                              </p>
                            </div>
                            <div className="border-l-2 border-blue-600/30 pl-5 py-1">
                              <strong className="text-slate-900 block font-mono uppercase text-[9px] tracking-wider mb-1">The Solution:</strong>
                              <p className="font-sans font-bold text-base md:text-lg tracking-tight leading-snug text-slate-900">
                                {renderRevealText(caseStudies[activeCaseStudy].solution, p3ScrollProgress)}
                              </p>
                            </div>
                          </div>

                          <div className="md:col-span-4 bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                            <span className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">
                              {caseStudies[activeCaseStudy].metricLabel}
                            </span>
                            <span className="text-[28px] font-sans font-black text-blue-600 leading-none my-1 tracking-tight">
                              {caseStudies[activeCaseStudy].metricAfter}
                            </span>
                            <span className="font-mono text-[10px] text-blue-600 font-bold">
                              {caseStudies[activeCaseStudy].metricChange}
                            </span>
                            <span className="font-mono text-[9px] text-slate-400 line-through mt-1">
                              Before: {caseStudies[activeCaseStudy].metricBefore}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-200 pt-4 flex flex-col md:flex-row justify-between gap-4">
                        <div className="max-w-md italic text-xs text-slate-600 relative pl-4 border-l border-blue-600/50">
                          &ldquo;{caseStudies[activeCaseStudy].testimonial}&rdquo;
                          <span className="block not-italic font-mono text-[9px] text-slate-400 uppercase tracking-widest mt-1.5">
                            &mdash; {caseStudies[activeCaseStudy].speaker}
                          </span>
                        </div>
                        <div className="flex items-end font-mono text-[10px] text-slate-600 tracking-wider">
                          {caseStudies[activeCaseStudy].impact}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 4: QUANT TRADING */}
              <div className="w-screen h-screen flex-shrink-0 flex justify-center items-center px-6 md:px-24 py-16 bg-slate-50 border-r border-slate-100 overflow-y-auto no-scrollbar">
                <div className="w-full max-w-4xl space-y-8">
                  {/* Hermes Agent Banner */}
                  <div className="w-full aspect-[1000/150] relative rounded-xl overflow-hidden border border-slate-200/50 shadow-md bg-[#121212] hover:scale-[1.01] transition-transform duration-500">
                    <Image 
                      src="/image.png" 
                      alt="Hermes Agent Banner" 
                      fill 
                      priority 
                      sizes="(max-w-768px) 100vw, 800px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <span className="font-mono text-xs text-blue-600 uppercase tracking-widest block mb-2">&mdash; Algorithmic Strategies</span>
                    <h2 className="font-sans font-bold text-3xl tracking-tight text-slate-900 leading-tight">Quantitative Trading</h2>
                  </div>
                  
                  <div className="relative pl-6 border-l-2 border-blue-600/30 py-1">
                    <span className="text-blue-600 font-serif text-5xl leading-none absolute left-0 top-0 select-none">“</span>
                    <p className="font-sans font-bold text-xl md:text-2xl tracking-tight leading-snug text-slate-900">
                      {renderRevealText(
                        "Developing systematic, backtested alpha models across futures, commodities, and index options. Utilizing time-series statistical models (ARIMA, GARCH) and deep sequence models (LSTM) to forecast volatility regimes. Integrates the Hermes Agent, an autonomous 24/7 personal assistant delivering live signal execution, risk-limit notifications, and portfolio monitoring directly to messaging platforms.",
                        p4ScrollProgress,
                        ["GARCH", "LSTM", "Hermes"]
                      )}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                    <div className="space-y-2 font-mono text-xs text-slate-650">
                      <div className="flex items-start gap-3">
                        <Zap className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Multi-Instrument Signal Engine:</strong> Combines momentum, mean-reversion, and Kelly Criterion sizing. Sharpe Ratio of 1.82+ in live trading.</span>
                      </div>
                    </div>
                    <div className="space-y-2 font-mono text-xs text-slate-650">
                      <div className="flex items-start gap-3">
                        <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Regime Detection:</strong> Leverages Hidden Markov Models (HMM) to classify intraday index option regimes, achieving 71% out-of-sample accuracy.</span>
                      </div>
                    </div>
                    <div className="space-y-2 font-mono text-xs text-slate-650">
                      <div className="flex items-start gap-3">
                        <Cpu className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Hermes Autonomous Agent:</strong> A 24/7 personal assistant integrating LLM logic with broker APIs to monitor portfolios, manage stop-losses, and execute SMS/Telegram override commands.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PANEL 5: DOWNLOADS & CONTACT */}
              <div className="w-screen h-screen flex-shrink-0 flex justify-center items-center px-6 md:px-24 py-16 bg-white overflow-y-auto no-scrollbar">
                <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <span className="font-mono text-xs text-blue-600 uppercase tracking-widest block mb-1">Architect dossiers</span>
                      <h3 className="font-sans font-bold text-2xl tracking-tight text-slate-900">Download Publications</h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      Acquire comprehensive offline literature containing detailed performance case studies and engineering summaries.
                    </p>

                    <div className="space-y-4">
                      <a 
                        href="/Sani_V.pdf" 
                        download 
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-blue-600/60 rounded-xl group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <span className="block text-xs font-mono font-medium text-slate-800">Sani_V.pdf</span>
                            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Curriculum Vitae // 201 KB</span>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </a>

                      <a 
                        href="/ML_Arc_Case_Studies.pdf" 
                        download 
                        className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 hover:border-blue-600/60 rounded-xl group transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <span className="block text-xs font-mono font-medium text-slate-800">ML_Arc_Case_Studies.pdf</span>
                            <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-wider">Agency Dossier // 242 KB</span>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between space-y-8">
                    <div>
                      <span className="font-mono text-xs text-blue-600 uppercase tracking-widest block mb-1">Let's talk</span>
                      <h3 className="font-sans font-bold text-2xl tracking-tight text-slate-900">Initiate Contact</h3>
                    </div>

                    <div className="space-y-3 font-mono text-xs">
                      <a 
                        href="mailto:founder@mlarcai.com"
                        className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>founder@mlarcai.com</span>
                      </a>

                      <a 
                        href="tel:+917021628334"
                        className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span>+91 70216 28334</span>
                      </a>
                      
                      <a 
                        href="https://linkedin.com/in/sani-varada-845869176" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <FaLinkedin className="w-4 h-4 text-blue-600" />
                        <span>linkedin.com/in/sani-varada-845869176</span>
                      </a>
                      
                      <a 
                        href="https://github.com/Sani-varda" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <FaGithub className="w-4 h-4 text-blue-600" />
                        <span>github.com/Sani-varda</span>
                      </a>
                    </div>

                    <Link 
                      href="/leadform"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-mono text-[9px] uppercase tracking-widest shadow-md transition-all w-max cursor-pointer"
                    >
                      Fill Intake Form <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <div className="border-t border-slate-200 pt-6 flex justify-between items-center text-slate-400 font-mono text-[9px] uppercase tracking-widest">
                      <div>
                        <span className="block text-slate-800 font-semibold">SANI VARADA</span>
                        <span>AI ARCHITECT // QUANT</span>
                      </div>
                      
                      <div className="w-8 h-8 opacity-60">
                        <Image src="/logo.svg" alt="SV" width={32} height={32} className="w-full h-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Structured SEO JSON-LD Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Sani Varada",
            "jobTitle": "AI/ML Engineer & Quantitative Analyst",
            "url": "https://www.mlarcai.com",
            "sameAs": [
              "https://www.linkedin.com/company/mlarc/",
              "https://x.com/mlarc_ai",
              "https://www.instagram.com/mlarc.ai/",
              "https://www.facebook.com/MLArc",
              "https://github.com/Sani-varda"
            ],
            "worksFor": {
              "@type": "Organization",
              "name": "ML Arc",
              "url": "https://www.mlarcai.com"
            },
            "alumniOf": {
              "@type": "EducationalOrganization",
              "name": "Computer Science & IT Graduate"
            }
          })
        }}
      />
    </div>
  );
}

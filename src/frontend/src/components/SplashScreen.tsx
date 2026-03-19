import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // If already shown this session, skip immediately
    if (sessionStorage.getItem("jf_splash_shown") === "true") {
      onComplete();
      return;
    }

    // Trigger fade-out after 2.5s
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    // Call onComplete after fade-out animation (2.5s + 0.6s)
    const completeTimer = setTimeout(() => {
      sessionStorage.setItem("jf_splash_shown", "true");
      onComplete();
    }, 3100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');

        @keyframes splashFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes logoZoomIn {
          from {
            opacity: 0;
            transform: scale(0.7);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes textSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes splashFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .splash-screen {
          animation: splashFadeIn 0.8s ease-out forwards;
        }

        .splash-screen.fade-out {
          animation: splashFadeOut 0.6s ease-in forwards;
        }

        .splash-logo {
          animation: logoZoomIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .splash-text {
          opacity: 0;
          animation: textSlideUp 0.7s ease-out 0.4s forwards;
        }

        .splash-tagline {
          opacity: 0;
          animation: textSlideUp 0.7s ease-out 0.65s forwards;
        }
      `}</style>

      <div
        className={`splash-screen${fadeOut ? " fade-out" : ""}`}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(160deg, #0a1628 0%, #0D47A1 55%, #1a237e 100%)",
          fontFamily: "'Poppins', system-ui, sans-serif",
          overflow: "hidden",
        }}
        data-ocid="splash.modal"
      >
        {/* Ambient glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(66, 153, 225, 0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "25%",
            right: "15%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99, 179, 237, 0.15) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Logo */}
        <div
          className="splash-logo"
          style={{
            width: "160px",
            height: "160px",
            borderRadius: "36px",
            overflow: "hidden",
            filter:
              "drop-shadow(0 0 24px rgba(147, 197, 253, 0.6)) drop-shadow(0 8px 32px rgba(0, 0, 0, 0.5))",
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/uploads/1773855575468-1.png"
            alt="SA Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* Spacing */}
        <div style={{ height: "28px" }} />

        {/* Brand name */}
        <h1
          className="splash-text"
          style={{
            fontSize: "clamp(1.4rem, 5vw, 2rem)",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "#ffffff",
            margin: 0,
            textShadow:
              "0 0 20px rgba(147, 197, 253, 0.8), 0 0 40px rgba(99, 153, 230, 0.5), 0 2px 8px rgba(0,0,0,0.4)",
            fontFamily: "'Poppins', system-ui, sans-serif",
          }}
        >
          Saurabh_Anshul_
        </h1>

        {/* Tagline */}
        <p
          className="splash-tagline"
          style={{
            fontSize: "0.75rem",
            fontWeight: 300,
            letterSpacing: "0.3em",
            color: "rgba(147, 197, 253, 0.75)",
            margin: "10px 0 0 0",
            textTransform: "uppercase",
            textShadow: "0 0 12px rgba(147, 197, 253, 0.4)",
            fontFamily: "'Poppins', system-ui, sans-serif",
          }}
        >
          Job Finder
        </p>
      </div>
    </>
  );
}

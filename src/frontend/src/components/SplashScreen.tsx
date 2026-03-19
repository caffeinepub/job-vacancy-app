import { useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

// Remove the native HTML splash (injected in index.html) smoothly
function hideNativeSplash(cb: () => void) {
  const el = document.getElementById("native-splash");
  if (!el) {
    cb();
    return;
  }
  let done = false;
  function finish() {
    if (done) return;
    done = true;
    el?.remove();
    cb();
  }
  el.classList.add("hiding");
  el.addEventListener("animationend", finish, { once: true });
  // Fallback in case animationend doesn't fire
  setTimeout(finish, 600);
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const complete = onComplete;

    // If already shown this session, hide the native splash immediately and skip
    if (sessionStorage.getItem("jf_splash_shown") === "true") {
      hideNativeSplash(complete);
      return;
    }

    // Trigger fade-out of the native splash after 2.5s total
    const fadeTimer = setTimeout(() => {
      sessionStorage.setItem("jf_splash_shown", "true");
      hideNativeSplash(complete);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
    };
  }, [onComplete]);

  // Return nothing -- the native splash in index.html is already visible
  return null;
}

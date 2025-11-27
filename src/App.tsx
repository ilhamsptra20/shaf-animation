// App.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import LiquidBackground from "./components/LiquidBackground";
import SplashScreen from "./components/SplashScreen";
import Carousel from "./components/carousel/Carousel";

type Screen = "splash" | "home" | "chapters" | "detail";

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const isTransitioningRef = useRef(false);
  const transitionLayerRef = useRef<HTMLDivElement | null>(null);
  const screenRef = useRef<Screen>(screen);

  // keep ref synced with state so callbacks have latest
  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  useEffect(() => {
    // fallback: kalau SplashScreen nggak auto trigger, pindah setelah 4s
    const t = setTimeout(() => {
      if (screenRef.current === "splash") {
        navigate("home", "bubble");
      }
    }, 4000);
    return () => clearTimeout(t);
  }, []);

  const bubbleTransition = useCallback((to: Screen) => {
    return new Promise<void>((resolve) => {
      if (!transitionLayerRef.current) {
        setScreen(to);
        resolve();
        return;
      }

      // prevent stacking bubbles
      transitionLayerRef.current.innerHTML = "";

      const bubble = document.createElement("div");
      bubble.className = "bubble-transition";
      Object.assign(bubble.style, {
        position: "fixed",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "#7c3aed",
        zIndex: "9999",
        pointerEvents: "none",
      });

      transitionLayerRef.current.appendChild(bubble);

      const size = Math.max(window.innerWidth, window.innerHeight) * 2;

      gsap.set(bubble, { scale: 0 });

      gsap.to(bubble, {
        scale: size / 50,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          // swap screen (mount new screen)
          setScreen(to);

          gsap.to(bubble, {
            scale: 0,
            duration: 0.45,
            ease: "power2.in",
            onComplete: () => {
              // cleanup
              bubble.remove();
              resolve();
            },
          });
        },
      });
    });
  }, []);

  const slideUpTransition = useCallback((to: Screen) => {
    return new Promise<void>((resolve) => {
      // For slide, we mount target offscreen then animate it up.
      // To keep it simple & avoid DOM queries, we set screen, then animate a short fade in.
      setScreen(to);
      // small visual entrance so user sees the change
      // since new screen mounts, we can animate its root via a short timeout to ensure it's in DOM
      setTimeout(() => {
        const root = document.querySelector(".screen-root") as HTMLElement | null;
        if (!root) {
          resolve();
          return;
        }
        gsap.fromTo(
          root,
          { y: "10%", autoAlpha: 0 },
          {
            y: "0%",
            autoAlpha: 1,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => resolve(),
          }
        );
      }, 30);
    });
  }, []);

  // public navigate: prevents re-entrancy
  const navigate = useCallback(
    async (to: Screen, method: "bubble" | "slide" = "bubble") => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      try {
        if (method === "bubble") {
          await bubbleTransition(to);
        } else {
          await slideUpTransition(to);
        }
      } finally {
        isTransitioningRef.current = false;
      }
    },
    [bubbleTransition, slideUpTransition]
  );

  const cards = [
    { img: "/1.png", title: "Chapter I", subtitle: "The Beginning", href: "" },
    { img: "/2.png", title: "Chapter II", subtitle: "Deep Woods", href: "" },
    { img: "/3.png", title: "Chapter III", subtitle: "Lost Path", href: "" },
    { img: "/4.png", title: "Chapter IV", subtitle: "Revelation", href: "" },
  ];

  return (
    <div id="App" className="h-screen w-screen overflow-hidden relative">
      <LiquidBackground />

      {/* transition layer (bubble live here) */}
      <div ref={transitionLayerRef} className="pointer-events-none absolute inset-0" />

      {/* screens: only the active one is mounted */}
      {screen === "splash" && (
        <div className="screen-root screen" aria-hidden={false}>
          <SplashScreen onComplete={() => navigate("home", "bubble")} />
        </div>
      )}

      {screen === "home" && (
        <div className="screen-root screen" aria-hidden={false}>
          <div className="m-auto flex flex-col items-center">
            <h1 className="text-white text-3xl mb-6">Home</h1>
            <div className="flex gap-3">
              <button className="btn" onClick={() => navigate("chapters", "bubble")}>Enter</button>
            </div>
          </div>
        </div>
      )}

      {screen === "chapters" && (
        <div className="screen-root screen" aria-hidden={false}>
          <Carousel cards={cards} navigate={navigate} />
          <div className="flex justify-center mt-6">
            <button className="btn" onClick={() => navigate("detail", "slide")}>Go detail</button>
          </div>
        </div>
      )}

      {screen === "detail" && (
        <div className="screen-root screen" aria-hidden={false}>
          <div className="m-auto text-white">
            <h1 className="text-3xl">Detail</h1>
            <button className="btn mt-4" onClick={() => navigate("home", "bubble")}>Back home</button>
          </div>
        </div>
      )}
    </div>
  );
}

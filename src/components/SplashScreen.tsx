// components/SplashScreen.tsx
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const barRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLHeadingElement | null>(null);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!barRef.current || !textRef.current) return;

    const tl = gsap.timeline({
      onUpdate: () => {
        // update persen
        if (barRef.current) {
          const currentWidth = barRef.current.offsetWidth;
          const parentWidth = barRef.current.parentElement?.offsetWidth || 1;
          const newPercent = Math.round((currentWidth / parentWidth) * 100);
          setPercent(newPercent);
        }
      }
    });

    // progress bar: cepat → lambat → cepat
    tl.to(barRef.current, { width: "50%", duration: 0.8, ease: "power2.out" });
    tl.to(barRef.current, { width: "70%", duration: 1.0, ease: "power1.inOut" });
    tl.to(barRef.current, { width: "100%", duration: 0.5, ease: "power2.in" });

    // setelah full: teks LOADING nge-scale dulu kecil
    tl.to(textRef.current, {
      scale: 0.5,
      duration: 0.3,
      ease: "power2.inOut",
    });

    // warp/zoom keluar sebelum trigger pindah halaman
    tl.to(textRef.current, {
      scale: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        if (onComplete) onComplete(); // callback ke App untuk pindah screen
      }
    });
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 w-full h-full">
      <h1
        ref={textRef}
        className="position-relative z-10 text-4xl font-semibold text-white"
      >
        LOADING
      </h1>
      <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden relative">
        <div
          ref={barRef}
          className="h-full bg-purple-500 rounded-full w-0"
        />
      </div>
      <p className="text-lg text-white">{percent}%</p>
    </div>
  );
}

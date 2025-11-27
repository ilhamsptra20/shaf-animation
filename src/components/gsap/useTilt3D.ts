// useTilt3D.ts
import { useEffect } from "react";
import gsap from "gsap";

export function useTilt3D(ref: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 12;   // mendekat
      const rotateX = -((y - centerY) / centerY) * 12;  // mendekat

      gsap.to(el, {
        rotateX,
        rotateY,
        scale: 1.06,
        transformPerspective: 900,
        ease: "power3.out",
        duration: 0.35,
      });
    };

    const reset = () => {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      });
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);
}

// Carousel.tsx
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CarouselCard from "./CarouselCard";

gsap.registerPlugin(ScrollTrigger, Draggable);

type Screen = "splash" | "home" | "detail";
type Props = {
  cards: {
    img: string;
    title: string;
    subtitle: string;
    href?: string;
  }[];
  // navigate: (to: string, method: "slide" | "bubble") => void;
  navigate: (to: Screen, method: "slide" | "bubble") => void | Promise<void>;
};

export default function Carousel({ cards, navigate }: Props) {
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggableRef = useRef<InstanceType<typeof Draggable> | null>(null);
  const centerIndexRef = useRef<number>(0); // indeks card tengah

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const cardEls = Array.from(track.querySelectorAll(".carousel-card")) as HTMLDivElement[];
    const gapRatio = 0.05;

    const update = () => {
      if (!cardEls.length) return;

      const windowWidth = window.innerWidth;
      const centerX = windowWidth / 2;
      const gap = windowWidth * gapRatio;
      const cardWidth = Math.min(512, windowWidth * 0.6);
      const cardHeight = cardWidth;
      const totalWidth = cardEls.length * cardWidth + (cardEls.length - 1) * gap;

      // Set ukuran card
      cardEls.forEach((card) => gsap.set(card, { width: cardWidth, height: cardHeight }));

      // Floating animation
      cardEls.forEach((card, i) => {
        const floatY = gsap.utils.random(5, 10);
        const duration = gsap.utils.random(1.5, 3);
        gsap.to(card, {
          y: `+=${floatY}`,
          duration,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });

      const updateCardTilt = () => {
        const trackX = gsap.getProperty(track, "x") as number || 0;
        cardEls.forEach((card, i) => {
          const cardCenter = i * (cardWidth + gap) + cardWidth / 2 + trackX;
          const distance = cardCenter - centerX;

          const rotateY = gsap.utils.clamp(-20, 20, (-distance / centerX) * 20);
          const maxScale = 1.1;
          const minScale = 0.7;
          const distanceRatio = Math.min(Math.abs(distance) / centerX, 1);
          const scale = gsap.utils.clamp(minScale, maxScale, maxScale - (maxScale - minScale) * distanceRatio);

          gsap.to(card, {
            rotateY,
            scale,
            transformPerspective: 1000,
            transformOrigin: "center center",
            duration: 0.3,
            ease: "power3.out",
          });
        });
      };

      const maxX = centerX - cardWidth / 2;
      const minX = -(totalWidth - cardWidth - centerX + cardWidth / 2);
      gsap.set(track, { x: maxX });

      // ScrollTrigger horizontal
      gsap.to(track, {
        x: () => minX,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: totalWidth - windowWidth + "px",
          scrub: 1,
          pin: true,
          onUpdate: updateCardTilt,
          invalidateOnRefresh: true,
        },
      });

      // Draggable
      draggableRef.current?.kill();
      draggableRef.current = Draggable.create(track, {
        type: "x",
        edgeResistance: 0.9,
        inertia: true,
        bounds: { minX, maxX },
        onDrag: updateCardTilt,
        onThrowUpdate: updateCardTilt,
      })[0];

      // Klik → snap ke tengah dulu
      cardEls.forEach((card, i) => {
        card.onclick = (e) => {
          e.preventDefault();
          const currentCenter = centerIndexRef.current;

          if (currentCenter === i) {
            // Sudah di tengah → buka link
            // window.open(cards[i].href, "_blank");
            // console.log("Buka link");
            navigate("detail", "slide")
            return;
          }

          // Hitung targetX
          const targetX = Math.max(minX, Math.min(maxX, -(i * (cardWidth + gap)) + centerX - cardWidth / 2));

          gsap.to(track, {
            x: targetX,
            duration: 0.5,
            ease: "power3.out",
            onUpdate: updateCardTilt,
            onComplete: () => {
              draggableRef.current?.update();
              centerIndexRef.current = i; // update indeks tengah
            },
          });
        };
      });

      updateCardTilt();
    };

    update();

    const onResize = () => {
      ScrollTrigger.refresh();
      update();
    };
    window.addEventListener("resize", onResize);

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      draggableRef.current?.kill();
      window.removeEventListener("resize", onResize);
    };
  }, [cards]);

  return (
    <section ref={containerRef} className="w-full h-[80vh] overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center h-full cursor-grab w-full"
        style={{ padding: 0, gap: "5%" }}
      >
        {cards.map((c, i) => (
          <div key={i} className="carousel-card shrink-0 transform-gpu">
            <CarouselCard 
              img={c.img}
              title={c.title}
              subtitle={c.subtitle}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
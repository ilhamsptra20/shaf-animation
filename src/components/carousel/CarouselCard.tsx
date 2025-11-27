// CarouselCard.tsx
import { useRef } from "react";
import { useTilt3D } from "../gsap/useTilt3D";

type CardProps = { 
  img: string;
  title: string;
  subtitle: string;
};

export default function CarouselCard({ img, title, subtitle }: CardProps) {
  const ref = useRef<HTMLDivElement>(null!);
  useTilt3D(ref);

  return (
    <div className="group relative w-full h-full">
      <div
        ref={ref}
        className="shadow-xl rounded-xl transform-gpu bg-blue-800"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "512px",
          maxHeight: "512px",
          minWidth: "250px", // minimal card size di mobile
          minHeight: "250px",
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="px-6 py-2 bg-black/20 group-hover:bg-black/80 rounded-full transition absolute -bottom-24 md:-bottom-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full flex flex-col">
          <h1 className="text-nowrap font-semibold">{title}</h1>
          <small className="text-nowrap text-xs">{subtitle}</small>
        </div>
      </div>
    </div>

  );
}
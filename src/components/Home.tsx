import WebGLMask from "../components/webgl/WebGLMask";

export function Home({ onEnter }: { onEnter?: () => void }) {
  return (
    <div className="screen-root screen flex flex-col items-center justify-center text-white relative">

      <h1 className="text-3xl mb-6 relative z-10">Home</h1>

      <button
        className="relative z-99 bg-slate-950 hover:bg-black px-6 py-2 rounded-full scale-100 hover:scale-105 transition hover:cursor-pointer"
        onClick={onEnter}
      >
        ENTER
      </button>

      {/* Mask di belakang */}
      <WebGLMask
        color="#2B2B2B"
        opacity={0.95}
        borderColor="#000"
        borderWidth={0.010}
      />
    </div>
  );
}

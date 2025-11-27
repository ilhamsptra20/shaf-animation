import WebGLMask from "../components/webgl/WebGLMask";

export function Home({ onEnter }: { onEnter?: () => void }) {
  return (
    <div className="screen-root screen flex flex-col items-center justify-center text-white relative">
      <h1 className="text-3xl mb-6">Home</h1>

      <button
        className="bg-slate-950 hover:bg-black px-6 py-2 rounded-full scale-100 hover:scale-105 transition hover:cursor-pointer"
        onClick={onEnter}
      >
        ENTER
      </button>

      {/* WebGL mask: center hole default in viewport center */}
      <WebGLMask
        color="#2B2B2B"      // warna overlay
        opacity={95}       // transparansi overlay
        borderColor="#000"   // warna border U
        borderWidth={0.010}  // tebal border
      />
    </div>
  );
}

import { useEffect } from "react";
import gsap from "gsap";

function App() {

  useEffect(() => {
    showScreen("splashScreen");

    setTimeout(() => {
      bubbleTransition("splashScreen", "homeScreen");
    }, 10000);
  }, []);

  const showScreen = (id: string) => {
    document.querySelectorAll(".screen").forEach((sec) => {
      (sec as HTMLElement).style.display = "none";
    });
    const el = document.getElementById(id) as HTMLElement;
    el.style.display = "flex";
  };

  const bubbleTransition = (fromId: string, toId: string) => {
    const app = document.getElementById("App") as HTMLElement;

    const bubble = document.createElement("div");
    bubble.className = "bubble-transition";
    app.appendChild(bubble);

    const size = Math.max(window.innerWidth, window.innerHeight) * 2;

    gsap.set(bubble, {
      width: 50,
      height: 50,
      x: window.innerWidth / 2 - 25,
      y: window.innerHeight / 2 - 25,
      scale: 0,
    });

    gsap.to(bubble, {
      scale: size / 50,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => {
        showScreen(toId);

        gsap.to(bubble, {
          scale: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => bubble.remove(),
        });
      },
    });
  };

  const slideUpTransition = (fromId: string, toId: string) => {
    const from = document.getElementById(fromId) as HTMLElement;
    const to = document.getElementById(toId) as HTMLElement;

    gsap.set(to, {
      display: "flex",
      y: "100%"  // start dari bawah
    });

    gsap.to(to, {
      y: "0%",
      duration: 0.7,
      ease: "power3.out"
    });

    gsap.to(from, {
      autoAlpha: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        from.style.display = "none";
        gsap.set(from, { autoAlpha: 1 });
      }
    });
  };


  return (
    <div id="App" className="h-screen w-screen overflow-hidden relative">

      <section className="screen" id="splashScreen">
        <h1>Splash</h1>
      </section>

      <section className="screen" id="homeScreen">
        <h1>Home</h1>
        <button onClick={() => bubbleTransition("homeScreen", "chaptersScreen")}>Next</button>
      </section>

      <section className="screen" id="chaptersScreen">
        <h1>Chapters</h1>
        <button onClick={() => slideUpTransition("chaptersScreen", "detailScreen")}>Detail</button>
      </section>

      <section className="screen" id="detailScreen">
        <h1>Detail</h1>
      </section>

    </div>
  );
}

export default App;

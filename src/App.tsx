import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Portfolio from "./routes/index";

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <Portfolio />;
}

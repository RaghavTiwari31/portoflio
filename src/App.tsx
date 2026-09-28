import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import Portfolio from "./routes/index";
import { registerLenis } from "./lib/nav";

export default function App() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    registerLenis(lenis);

    return () => {
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <Portfolio />;
}

import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, useState, Suspense, useEffect } from "react";
import DarkVeil from "./components/DarkVeil";
import SmoothFollower from "./components/SmoothFollower";
import Preloader from "./components/Preloader";
import NavBar from "./components/NavBar";
import Projects from "./components/Projects.jsx";
import Home from "./components/Home.jsx";
const TechStack = lazy(() => import("./components/TechStack.jsx"));
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Fast Hex Stream Title Logic
  useEffect(() => {
    // Only run the animation once the site has loaded
    if (loading) return;

    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let i = 0;

    const updateTitle = () => {
      // Generate random 4-digit Hex values
      const rHex = Math.floor(Math.random() * 0xFFFF)
        .toString(16)
        .toUpperCase()
        .padStart(4, "0");
      document.title = `${frames[i]} R:0x${rHex}`;
      // Cycle through the spinner frames
      i = (i + 1) % frames.length;
    };

    // 80ms for a high-speed, high-throughput system feel
    const interval = setInterval(updateTitle, 10);
    updateTitle();

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [loading]);

  if (loading) return <Preloader onComplete={() => setLoading(false)} />;

  return (
    <>
      <DarkVeil speed={1} warpAmount={0.1} />
      <SmoothFollower />
      <div className="fixed inset-0 flex flex-col sm:flex-row text-white font-bold">
        <NavBar />
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <Suspense fallback={null}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" index element={<Home />} />
                <Route path="projects" element={<Projects />} />
                <Route path="techstack" element={<TechStack />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default App;
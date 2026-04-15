import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, useState, Suspense } from "react";
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

  if (loading) return <Preloader onComplete={() => setLoading(false)} />;

  return (
    <>
      <DarkVeil speed={2} warpAmount={4} />
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
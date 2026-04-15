import { motion } from "framer-motion";
import React from "react";

export default function Projects() {
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.9, x: "20%" }}
      animate={{ opacity: 1, scale: 1, x: "0%" }}
      exit={{ opacity: 0, scale: 0.9, x: "-20%", filter: "blur(10px)" }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <div 
        className="w-full h-full flex flex-col justify-center"
        style={{ 
          paddingLeft: window.innerWidth < 640 ? "2rem" : "6rem", 
          paddingRight: "2rem"
        }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Projects
        </h1>
        <p className="text-white/40 mt-2 text-sm sm:text-base">
          Selected works coming soon...
        </p>
      </div>
    </motion.div>
  );
}
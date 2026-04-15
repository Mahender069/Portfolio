import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Github, Linkedin, Mail } from "lucide-react";
import React from "react";

export default function Home() {
  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.9, x: "20%" }}
      animate={{ opacity: 1, scale: 1, x: "0%" }}
      exit={{ opacity: 0, scale: 0.9, x: "-20%", filter: "blur(10px)" }}
      transition={{ duration: 0.42, ease: "easeOut" }}
    >
      <div 
        className="w-full h-full flex flex-col justify-center gap-y-4 sm:gap-y-5"
        style={{ 
          paddingLeft: window.innerWidth < 640 ? "2rem" : "6rem", 
          paddingRight: "2rem"
        }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          Mahender
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-xs sm:max-w-md lg:max-w-xl leading-relaxed font-normal">
          Backend developer &amp; full-stack builder. I create web applications
          and solve complex problems with clean, efficient code.
        </p>

        <div className="flex items-center gap-3">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: "#4ade80", boxShadow: "0 0 10px #4ade80" }}
          />
          <span className="text-xs text-white/50 font-medium uppercase tracking-widest">
            Available for freelance &amp; opportunities
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-x-6 sm:gap-x-8 gap-y-3 pt-2">
          <Button variant="link" className="p-0 h-auto group">
            <a href="https://github.com/Mahender069/" target="_blank" rel="noreferrer" className="flex items-center gap-x-2 text-white/70 group-hover:text-white transition-all text-sm sm:text-base">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" /> Github
            </a>
          </Button>
          <Button variant="link" className="p-0 h-auto group">
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-x-2 text-white/70 group-hover:text-white transition-all text-sm sm:text-base">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" /> Linkedin
            </a>
          </Button>
          <Button variant="link" className="p-0 h-auto group">
            <a href="mailto:you@email.com" target="_blank" rel="noreferrer" className="flex items-center gap-x-2 text-white/70 group-hover:text-white transition-all text-sm sm:text-base">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" /> Mail
            </a>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
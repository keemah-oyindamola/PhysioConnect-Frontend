"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Activity } from "lucide-react";

export function HeroArc() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-coral/20 blur-3xl" />
      <div className="absolute -bottom-8 -left-10 w-64 h-64 rounded-full bg-teal/15 blur-3xl" />

      <div className="relative bg-parchment rounded-[28px] border border-ink/8 shadow-[0_30px_60px_-25px_rgba(22,48,43,0.35)] p-8 pt-10">
        <svg viewBox="0 0 280 300" className="w-full">
          <path
            d="M40 260 A140 140 0 0 1 240 260"
            fill="none"
            stroke="#E4DED2"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <motion.path
            d="M40 260 A140 140 0 0 1 240 260"
            fill="none"
            stroke="#1F6F5C"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray="345"
            initial={{ strokeDashoffset: shouldReduceMotion ? 52 : 345 }}
            animate={{ strokeDashoffset: 52 }}
            transition={{ duration: shouldReduceMotion ? 0 : 2.2, ease: "easeOut" }}
          />
          <circle cx="240" cy="260" r="7" fill="#E8734A" />
          <text
            x="140"
            y="70"
            textAnchor="middle"
            className="font-display"
            fontSize="54"
            fontWeight="600"
            fill="#16302B"
          >
            82°
          </text>
          <text x="140" y="96" textAnchor="middle" className="font-body" fontSize="13" fill="#16302B" opacity="0.5">
            shoulder flexion — week 4
          </text>
        </svg>
      </div>

      <div className="absolute -bottom-6 -left-6 bg-ink text-paper rounded-2xl px-5 py-3.5 shadow-xl flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-coral/20 flex items-center justify-center shrink-0">
          <Activity size={16} className="text-coral" />
        </div>
        <div>
          <p className="font-display text-[17px] leading-none font-medium">+34%</p>
          <p className="text-[10.5px] text-paper/50 mt-0.5">range of motion, 4 wks</p>
        </div>
      </div>

      <div className="hidden sm:flex absolute top-6 -left-8 bg-coral-wash rounded-full pl-1.5 pr-4 py-1.5 items-center gap-2 shadow-lg border border-ink/8">
        <div className="w-7 h-7 rounded-full bg-sand flex items-center justify-center font-display text-[11px]">SL</div>
        <div className="leading-tight">
          <p className="text-[11px] font-medium">Sarah Lin</p>
          <p className="text-[9.5px] text-ink/45">ACL rehab · session 6</p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { motion } from 'framer-motion';

const ECGWaveform = ({ color = "text-emerald-400", speed = 1.5, type = "normal" }) => {
    const pathNormal = "M 0 50 L 10 50 L 15 40 L 20 60 L 25 50 L 35 50 L 40 20 L 45 80 L 50 50 L 60 50 L 65 45 L 70 55 L 75 50 L 100 50";
    const pathCritical = "M 0 50 L 10 50 L 15 20 L 20 80 L 25 50 L 30 10 L 35 90 L 40 50 L 50 50 L 60 30 L 70 70 L 80 50 L 100 50";
    
    const path = type === "critical" ? pathCritical : pathNormal;

    return (
        <div className="relative w-full h-24 bg-slate-950/50 rounded-lg overflow-hidden border border-slate-800/50 flex items-center">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-10" 
                style={{ 
                    backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }} 
            />
            
            {/* Moving Waveform */}
            <div className="flex w-[200%]" style={{ animation: `scroll ${5 / speed}s linear infinite` }}>
                {[...Array(20)].map((_, i) => (
                   <svg key={i} viewBox="0 0 100 100" className={`h-24 w-auto flex-shrink-0 ${color}`} preserveAspectRatio="none">
                        <motion.path
                            d={path}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                   </svg>
                ))}
            </div>

            {/* Gradient Overlay for Fade on Edges */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-slate-900 pointer-events-none" />
            
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
};

export default ECGWaveform;

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Target, X, Zap, BrainCircuit } from "lucide-react";

function FocusFlowGame({ onComplete }) {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([]);
  const maxScore = 5;

  useEffect(() => {
    if (score < maxScore) {
      const interval = setInterval(() => {
        setTargets((prev) => [
          ...prev,
          {
            id: Math.random(),
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 15,
            size: Math.random() * 20 + 30,
            color: ["bg-[#d63384]", "bg-[#FFD700]", "bg-orange-500", "bg-pink-400"][Math.floor(Math.random() * 4)],
          },
        ]);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [score]);

  const popTarget = (id) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setScore((s) => s + 1);
    if (score + 1 >= maxScore) {
      setTimeout(onComplete, 1200);
    }
  };

  return (
    <div className="relative h-72 w-full bg-black/40 rounded-2xl overflow-hidden border border-white/5 p-4">
      <div className="flex justify-between items-center mb-4 z-10 relative">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-[#FFD700] animate-pulse" size={18} />
          <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">NEURAL SYNC: {score}/{maxScore}</span>
        </div>
        <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#d63384] to-[#FFD700]"
            initial={{ width: 0 }}
            animate={{ width: `${(score / maxScore) * 100}%` }}
          />
        </div>
      </div>

      <div className="absolute inset-0">
        <AnimatePresence>
          {targets.map((target) => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0, filter: "blur(5px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 2, opacity: 0, filter: "blur(10px)" }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => popTarget(target.id)}
              className={`absolute p-3 ${target.color} rounded-full shadow-[0_0_20px_rgba(214,51,132,0.4)] cursor-pointer text-white flex items-center justify-center`}
              style={{ left: `${target.x}%`, top: `${target.y}%` }}
            >
              <Sparkles size={target.size / 2} />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {score >= maxScore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-[#0f0f13]/90 backdrop-blur-md z-20"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="bg-[#d63384]/10 p-4 rounded-full inline-block mb-4 border border-[#d63384]/30 shadow-[0_0_30px_rgba(214,51,132,0.2)]">
              <Target className="text-[#d63384]" size={48} />
            </div>
            <h3 className="text-2xl font-black text-white mb-1 tracking-tight">SYNC COMPLETE</h3>
            <p className="text-[#FFD700] font-bold text-xs tracking-widest">FOCUS RESTORED</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default function MicroSurvey({ isVisible, onResponse, predictedState }) {
  const [showGame, setShowGame] = useState(false);
  const options = ["mastery", "focused", "distracted", "frustrated", "overwhelmed"];

  useEffect(() => {
    if (!isVisible) {
      setShowGame(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleOptionClick = (option) => {
    if (option === "distracted") {
      setShowGame(true);
    } else {
      onResponse(option);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={showGame ? "game" : "survey"}
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="glass-panel rounded-[2rem] p-10 shadow-2xl max-w-md w-full border border-white/10 relative overflow-hidden"
          style={{ background: 'rgba(15, 15, 19, 0.85)' }}
        >
          {/* Theme-matching Orange/Brown Nebula Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(184,115,51,0.15)_0%,transparent_70%)] pointer-events-none" />

          {!showGame ? (
            <div className="relative z-10">
              <h2 className="text-3xl font-black text-white mb-2 text-center tracking-tight">
                Micro <span className="text-[#d63384]">Check-in</span>
              </h2>
              <p className="text-gray-400 text-center mb-10 font-medium text-sm">
                {predictedState ? (
                  <>Model suggested you might be <span className="text-[#FFD700] font-bold text-lg uppercase">{predictedState}</span>. Are you {predictedState}?</>
                ) : (
                  "How is your learning journey going?"
                )}
              </p>

              <div className="grid grid-cols-1 gap-3">
                {options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    className="group relative px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all active:scale-[0.98] font-bold capitalize border border-white/5 hover:border-[#FFD700]/40 text-left flex justify-between items-center"
                  >
                    <span className="group-hover:text-[#FFD700] transition-colors">{option}</span>
                    <Zap size={14} className="text-gray-500 group-hover:text-[#FFD700] transition-all" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-white leading-none mb-2">Focus <span className="text-[#d63384]">Flow</span></h2>
                  <p className="text-gray-400 font-medium text-sm">Catch the neural sparks to reset.</p>
                </div>
                <button
                  onClick={() => onResponse("distracted")}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-500 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <FocusFlowGame onComplete={() => onResponse("distracted")} />


            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

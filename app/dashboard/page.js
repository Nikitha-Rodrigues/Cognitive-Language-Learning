"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Pause, RotateCcw } from "lucide-react";

export default function Dashboard() {
  const [content, setContent] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [lines, setLines] = useState([]);
  const [wordTimings, setWordTimings] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const contentRef = useRef(null);
  const timerRef = useRef(null);

  const sampleContent = `The quick brown fox jumps over the lazy dog. 
This is a beautiful day to learn a new language.
Technology helps us connect with people across the globe.
Every word you read brings you closer to fluency.`;

  useEffect(() => {
    if (content && content.trim()) {
      const parsedLines = content.split("\n").filter(line => line.trim());
      setLines(parsedLines);
      setHasContent(true);
      resetProgress();
    } else {
      setHasContent(false);
      setLines([]);
    }
  }, [content]);

  const resetProgress = () => {
    setCurrentLineIndex(0);
    setCurrentWordIndex(0);
    setWordTimings([]);
    setStartTime(null);
  };

  const startTranslating = () => {
    if (isEditing) {
      setIsEditing(false);
    }
    
    if (!content || !content.trim()) {
      alert("Please add content first using the Edit button");
      return;
    }
    
    document.querySelector('.content-viewport')?.classList.remove('blur-sm');
    setIsTranslating(true);
    setStartTime(Date.now());
  };

  const pauseTranslating = () => {
    setIsTranslating(false);
    if (startTime && lines[currentLineIndex] && currentWordIndex < lines[currentLineIndex].split(" ").length) {
      const timeSpent = Date.now() - startTime;
      const currentLine = lines[currentLineIndex];
      const words = currentLine.split(" ");
      setWordTimings(prev => [
        ...prev,
        {
          line: currentLineIndex,
          word: currentWordIndex,
          word: words[currentWordIndex],
          timeMs: timeSpent
        }
      ]);
    }
    document.querySelector('.content-viewport')?.classList.add('blur-sm');
  };

  const resetTranslating = () => {
    setIsTranslating(false);
    setIsEditing(false);
    resetProgress();
    setWordTimings([]);
    if (timerRef.current) clearTimeout(timerRef.current);
    document.querySelector('.content-viewport')?.classList.remove('blur-sm');
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && isTranslating && lines.length > 0) {
        e.preventDefault();
        
        const currentLine = lines[currentLineIndex];
        if (!currentLine) return;
        
        const words = currentLine.split(" ");
        
        if (startTime) {
          const timeSpent = Date.now() - startTime;
          setWordTimings(prev => [
            ...prev,
            {
              line: currentLineIndex,
              word: currentWordIndex,
              word: words[currentWordIndex],
              timeMs: timeSpent
            }
          ]);
        }
        
        if (currentWordIndex + 1 < words.length) {
          setCurrentWordIndex(currentWordIndex + 1);
          setStartTime(Date.now());
        } 
        else if (currentLineIndex + 1 < lines.length) {
          setCurrentLineIndex(currentLineIndex + 1);
          setCurrentWordIndex(0);
          setStartTime(Date.now());
        } 
        else {
          setIsTranslating(false);
          const finalTimings = [...wordTimings, {
            line: currentLineIndex,
            word: currentWordIndex,
            word: words[currentWordIndex],
            timeMs: Date.now() - startTime
          }];
          console.log("Word Timings:", finalTimings);
          alert(`🎉 Complete! Tracked ${finalTimings.length} words. Check console for detailed timings.`);
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isTranslating, currentLineIndex, currentWordIndex, lines, startTime, wordTimings]);

  const renderLine = (line, lineIdx) => {
    if (!isTranslating || lineIdx !== currentLineIndex) {
      return <span className="text-textPrimary">{line}</span>;
    }
    
    const words = line.split(" ");
    return (
      <span className="inline-block">
        {words.map((word, wordIdx) => {
          const isCurrentWord = wordIdx === currentWordIndex;
          return (
            <span
              key={wordIdx}
              style={{
                color: isCurrentWord ? "var(--accent-text)" : "var(--text-primary)",
                fontWeight: isCurrentWord ? "bold" : "normal",
                transition: "all 0.2s ease"
              }}
            >
              {word}{" "}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-5xl w-full mb-6 flex justify-between items-center">
        <Link href="/" className="text-textSecondary hover:text-accent-primary transition-colors">
          ← Back to Home
        </Link>
        <div className="flex gap-3">
          <button
            onClick={startTranslating}
            disabled={isTranslating || !hasContent}
            className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-bg-primary font-bold rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={18} /> Start Translating
          </button>
          <button
            onClick={pauseTranslating}
            disabled={!isTranslating}
            className="flex items-center gap-2 px-4 py-2 border border-accent-primary rounded-lg hover:bg-accent-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pause size={18} />
          </button>
          <button
            onClick={resetTranslating}
            className="flex items-center gap-2 px-4 py-2 border border-accent-primary/50 rounded-lg hover:bg-accent-primary/10 transition-all"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isTranslating}
            className="flex items-center gap-2 px-4 py-2 border border-accent-primary rounded-lg hover:bg-accent-primary/10 transition-all disabled:opacity-50"
          >
             Edit
          </button>
        </div>
      </div>

      <div className="max-w-5xl w-full">
        <div className="glass-panel rounded-2xl p-8 border border-accent-primary/20 shadow-2xl">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here...&#10;&#10;Example: The quick brown fox jumps over the lazy dog."
              className="w-full h-96 p-4 bg-bg-secondary text-textPrimary rounded-lg border border-accent-primary/20 focus:border-accent-primary focus:outline-none resize-none"
            />
          ) : !hasContent ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <p className="text-textSecondary/60 text-lg mb-2">No content yet</p>
              <p className="text-textSecondary/40 text-sm">Click the Edit button above to paste your content</p>
            </div>
          ) : (
            <div 
              ref={contentRef}
              className={`content-viewport space-y-4 min-h-[400px] max-h-[60vh] overflow-y-auto transition-all duration-300 ${!isTranslating ? 'blur-sm' : ''}`}
              style={{
                fontFamily: "var(--font-sans)",
                lineHeight: "1.8"
              }}
            >
              {lines.map((line, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-300 ${
                    idx === currentLineIndex && isTranslating
                      ? "text-xl md:text-2xl font-medium"
                      : idx < currentLineIndex
                      ? "text-textSecondary/30"
                      : "text-textSecondary/50"
                  }`}
                >
                  {renderLine(line, idx)}
                </div>
              ))}
            </div>
          )}
        </div>

        {isTranslating && hasContent && (
          <div className="mt-4 text-center text-textSecondary text-sm">
            <p>Press <kbd className="px-2 py-1 bg-bg-secondary rounded border border-accent-primary/30">Enter</kbd> to move to the next word</p>
            <p className="text-xs mt-1">The ochre word shows your current position. Timings are being recorded!</p>
          </div>
        )}
      </div>
    </div>
  );
}
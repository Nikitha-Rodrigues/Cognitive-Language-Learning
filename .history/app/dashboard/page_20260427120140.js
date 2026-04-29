"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Pause, RotateCcw, Languages, Loader2 } from "lucide-react";
import MicroSurvey from "./microsurveys";

export default function Dashboard() {
  const [content, setContent] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [lines, setLines] = useState([]);
  //const [wordTimings, setWordTimings] = useState([]);---------------------------------------------------------------------------------------------
  const [startTime, setStartTime] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const [targetLang, setTargetLang] = useState("hi-IN");
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);
  const [translationError, setTranslationError] = useState("");
  const contentRef = useRef(null);
  const timerRef = useRef(null);
  const microSurveyTimerRef = useRef(null);
  const [showMicroSurvey, setShowMicroSurvey] = useState(false);
  const [microSurveyResponses, setMicroSurveyResponses] = useState([]);
  const [isPausedManually, setIsPausedManually] = useState(false);

//----------------------------------------------------------------------------------------------------------------------------
const [events, setEvents] = useState([]); // replaces wordTimings for ML
const [isDemoMode, setIsDemoMode] = useState(false);
const [isFinished, setIsFinished] = useState(false);
//-----------------------------------------------------------------------------------------------------------------------------

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
    //setWordTimings([]);---------------------------------------------------------------------------------------------------------------
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
    setIsPausedManually(false);
    setStartTime(Date.now());
  };
//----------------------------------------------------------------------------------------------------------------------------------------------------------------
  // const recordCurrentWordTiming = () => {
  //   if (!startTime || !lines[currentLineIndex]) return null;
  //   const words = lines[currentLineIndex].split(" ").filter(Boolean);
  //   const currentWord = words[currentWordIndex] ?? "";
  //   const timeMs = Date.now() - startTime;
  //   const entry = {
  //     line: currentLineIndex,
  //     word: currentWordIndex,
  //     word: currentWord,
  //     timeMs,
  //   };
  //   return entry;
  // };
  //--------------------------------------------------------------------------------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------

  const recordEvent = (direction) => {
  if (!startTime || !lines[currentLineIndex]) return null;

  const words = lines[currentLineIndex].trim().split(/\s+/);
  const currentWord = words[currentWordIndex] ?? "";

  const wordId = `${currentLineIndex}-${currentWordIndex}`;
  const endTime = Date.now();
  const duration = endTime - startTime;

  return {
    wordId,
    word: currentWord,
    startTime,
    endTime,
    duration,
    direction,
  };
};
//-----------------------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------------------
  // const updateWordTimings = (entry) => {
  //   if (!entry) return;
  //   setWordTimings(prev => {
  //     const existingIndex = prev.findIndex(
  //       (item) => item.line === entry.line && item.word === entry.word
  //     );
  //     if (existingIndex !== -1) {
  //       // Update existing entry
  //       const updated = [...prev];
  //       updated[existingIndex] = entry;
  //       return updated;
  //     } else {
  //       // Add new entry
  //       return [...prev, entry];
  //     }
  //   });
  // };
  //------------------------------------------------------------------------------------------------------------------------------------------------------------

  //--------------------------------------------------------------------------------------------------------------------------------------------------------
  const pushEvent = (event) => {
  if (!event) return;
  setEvents(prev => [...prev, event]);
};
  //--------------------------------------------------------------------------------------------------------------------------------------------------------

  const completeTranslating = () => {
    const currentLine = lines[currentLineIndex];
    if (!currentLine) {
      setIsTranslating(false);
      return;
    }

    const entry = recordCurrentWordTiming();
    updateWordTimings(entry);
    setIsTranslating(false);
    setStartTime(null);
    console.log("Word Timings:", [...wordTimings, entry].filter(e => e)); // approximate
    alert(`🎉 Complete! Check console for detailed timings.`);
  };

  const advanceWord = () => {
    if (!isTranslating || !lines.length) return;
    const currentLine = lines[currentLineIndex];
    const words = currentLine.trim().split(/\s+/);

    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    // const entry = recordCurrentWordTiming();
    // updateWordTimings(entry);
    //--------------------------------------------------------------------------------------------------------------------------------------------------------
    
    //------------------------------------------------------------------------------------------------------------------------------
    const event = recordEvent("forward");
    pushEvent(event);
    //-----------------------------------------------------------------------------------------------------------------------

    if (currentWordIndex + 1 < words.length) {
      setCurrentWordIndex(currentWordIndex + 1);
      setStartTime(Date.now());
    } else if (currentLineIndex + 1 < lines.length) {
      setCurrentLineIndex(currentLineIndex + 1);
      setCurrentWordIndex(0);
      setStartTime(Date.now());
    } else {
      //--------------------------------------------------------------------------------------------------------------------------------
      //completeTranslating();
      if (isDemoMode && !isFinished) {
      // loop back to start
        setCurrentLineIndex(0);
        setCurrentWordIndex(0);
        setStartTime(Date.now());
      } else {
        completeTranslating();
      }
      //----------------------------------------------------------------------------------------------------------------------------------------------
    }
  };

  const goBackWord = () => {
    if (!isTranslating || !lines.length) return;

    //-------------------------------------------------------------------------------------------------------------------
    // const entry = recordCurrentWordTiming();
    // updateWordTimings(entry);
    const event = recordEvent("backward");
    pushEvent(event);
    //--------------------------------------------------------------------------------------------------------------------------------

    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setStartTime(Date.now());
    } else if (currentLineIndex > 0) {
      const previousLineWords = lines[currentLineIndex - 1].trim().split(/\s+/);
      setCurrentLineIndex(currentLineIndex - 1);
      setCurrentWordIndex(previousLineWords.length - 1);
      setStartTime(Date.now());
    }
  };

  const startDemo = () => {
    // #for temporary demo only
    if (isEditing) {
      setIsEditing(false);
    }

    //-----------------------------------------------------------------------------------------------------------------------------
    setIsDemoMode(true);
    setIsFinished(false);
    setEvents([]);
    //--------------------------------------------------------------------------------------------------------------------------------------

    const demoText = content && content.trim() ? content : sampleContent;
    setContent(demoText);
    const parsedLines = demoText.split("\n").filter(line => line.trim());
    setLines(parsedLines);
    setHasContent(true);
    resetProgress();
    document.querySelector('.content-viewport')?.classList.remove('blur-sm');
    setIsTranslating(true);
    setStartTime(Date.now());
  };

  const pauseTranslating = () => {
    setIsTranslating(false);
    setIsPausedManually(true);
    document.querySelector('.content-viewport')?.classList.add('blur-sm');
  };

  const resetTranslating = () => {
    setIsTranslating(false);
    setIsEditing(false);
    resetProgress();
    //setWordTimings([]);-------------------------------------------------------------------------------------------------------------------------------
    setTranslationError("");

    //------------------------------------------------------------------------------------------------------------------------------------------
    setEvents([]);
    setIsDemoMode(false);
    setIsFinished(false);
    setMicroSurveyResponses([]);
    setShowMicroSurvey(false);
    setIsPausedManually(false);
        //-------------------------------------------------------------------------------------------------------------------------------------------

    if (timerRef.current) clearTimeout(timerRef.current);
    document.querySelector('.content-viewport')?.classList.remove('blur-sm');
  };

  const translateContent = async () => {
    if (!content || !content.trim()) {
      alert("Please add content first using the Edit button");
      return;
    }

    setIsTranslatingContent(true);
    setTranslationError("");

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: content,
          target_lang: targetLang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Translation failed");
      }

      if (data.translatedText) {
        setContent(data.translatedText);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslationError(error.message);
      alert(`Translation Error: ${error.message}`);
    } finally {
      setIsTranslatingContent(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isTranslating || lines.length === 0) return;
      if (e.key === "Enter" || e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        if (e.key === "ArrowLeft") {
          goBackWord();
          return;
        }
        advanceWord();
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isTranslating, currentLineIndex, currentWordIndex, lines, startTime]);

  useEffect(() => {
    if (isTranslating && !isFinished && !showMicroSurvey && !isPausedManually) {
      microSurveyTimerRef.current = setInterval(() => {
        setShowMicroSurvey(true);
        setIsTranslating(false);
        document.querySelector('.content-viewport')?.classList.add('blur-sm');
      }, 10000);
    } else {
      if (microSurveyTimerRef.current) {
        clearInterval(microSurveyTimerRef.current);
      }
    }
    return () => {
      if (microSurveyTimerRef.current) {
        clearInterval(microSurveyTimerRef.current);
      }
    };
  }, [isTranslating, isFinished, showMicroSurvey, isPausedManually]);

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

  const handleMicroSurveyResponse = (response) => {
    setMicroSurveyResponses(prev => [...prev, { response, timestamp: Date.now() }]);
    setShowMicroSurvey(false);
    document.querySelector('.content-viewport')?.classList.remove('blur-sm');
    if (!isPausedManually) {
      setIsTranslating(true);
      setStartTime(Date.now());
    }
  };
  const currentWordPosition = isTranslating
    ? lines.slice(0, currentLineIndex).reduce((sum, line) => sum + line.trim().split(/\s+/).length, 0) + currentWordIndex + 1
    : 0;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-stars overflow-hidden">
      <img 
        src="/hero_blob.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-screen pointer-events-none z-0" 
      />
      <div className="max-w-5xl w-full mb-6 flex justify-between items-center relative z-10">
        <Link href="/" className="text-textSecondary hover:text-accent-primary transition-colors">
          ← Back to Home
        </Link>
        <div className="flex gap-3 flex-wrap items-center">
          <button
            onClick={startTranslating}
            disabled={isTranslating || !hasContent}
            className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-bg-primary font-bold rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={18} /> Start Translating
          </button>
          {/* #for temporary demo only */}
          <button
            onClick={startDemo}
            disabled={isTranslating}
            className="flex items-center gap-2 px-6 py-2 bg-accent-primary/80 text-bg-primary font-bold rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={18} /> Start Demo
          </button>
          <button
            onClick={() => {
              setIsFinished(true);
              setIsTranslating(false);
              setIsPausedManually(false);
              console.log("Final Events:", events);
              console.log("Microsurvey Responses:", microSurveyResponses);
            }}
            disabled={!isDemoMode || isFinished}
            className="flex items-center gap-2 px-4 py-2 border border-green-500 rounded-lg hover:bg-green-500/10 transition-all disabled:opacity-50"
          >
            Finish Demo
          </button>
          <button
            onClick={isTranslating ? pauseTranslating : startTranslating}
            disabled={!hasContent}
            className="flex items-center gap-2 px-4 py-2 border border-accent-primary rounded-lg hover:bg-accent-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTranslating ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={resetTranslating}
            className="flex items-center gap-2 px-4 py-2 border border-accent-primary/50 rounded-lg hover:bg-accent-primary/10 transition-all"
          >
            <RotateCcw size={18} />
          </button>
          <div className="flex items-center gap-2 px-1 bg-bg-secondary/50 border border-accent-primary/20 rounded-lg backdrop-blur-sm">
            <Languages size={18} className="ml-2 text-accent-primary" />
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="bg-transparent text-textPrimary py-2 px-1 outline-none cursor-pointer text-sm"
            disabled={isTranslating || isTranslatingContent}
          >
            <option value="hi-IN" className="bg-[#1a1a1a]">Hindi</option>
            <option value="kn-IN" className="bg-[#1a1a1a]">Kannada</option>
          </select>
          </div>
          <button
            onClick={translateContent}
            disabled={isTranslating || !hasContent || isTranslatingContent}
            className="flex items-center gap-2 px-4 py-2 border border-accent-primary rounded-lg hover:bg-accent-primary/10 transition-all disabled:opacity-50"
          >
            {isTranslatingContent ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Translating...
              </>
            ) : (
              <>
                <Languages size={18} /> Translate
              </>
            )}
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isTranslating || isTranslatingContent}
            className="flex items-center gap-2 px-4 py-2 border border-accent-primary rounded-lg hover:bg-accent-primary/10 transition-all disabled:opacity-50"
          >
             Edit
          </button>
        </div>
      </div>
      <div className="max-w-5xl w-full mb-4 text-sm text-textSecondary flex flex-wrap justify-end gap-4 relative z-10">
        {hasContent && (
          <>
            <span>Total words: <strong>{totalWords}</strong></span>
            {isTranslating && <span>Current word: <strong>{currentWordPosition}/{totalWords}</strong></span>}
          </>
        )}
      </div>

      <div className="max-w-5xl w-full relative z-10">
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
            <p>
              Press <kbd className="px-2 py-1 bg-bg-secondary rounded border border-accent-primary/30">Enter</kbd> or <kbd className="px-2 py-1 bg-bg-secondary rounded border border-accent-primary/30">Arrow Right</kbd> to move forward, and <kbd className="px-2 py-1 bg-bg-secondary rounded border border-accent-primary/30">Arrow Left</kbd> to move back.
            </p>
            <p className="text-xs mt-1">The highlighted word shows your current position. Timings are being recorded!</p>
          </div>
        )}
      </div>
      <MicroSurvey isVisible={showMicroSurvey} onResponse={handleMicroSurveyResponse} />
    </div>
  );
}
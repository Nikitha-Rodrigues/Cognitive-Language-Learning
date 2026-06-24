"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Play, Pause, RotateCcw, Languages, Loader2, BrainCircuit } from "lucide-react";
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
  const [selectedWords, setSelectedWords] = useState([]);
  const [translationCache, setTranslationCache] = useState({});
  const [fullTranslatedText, setFullTranslatedText] = useState("");
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(1);
  const [isSelectingWords, setIsSelectingWords] = useState(false);
  const [selectionMessage, setSelectionMessage] = useState("");
  const contentRef = useRef(null);
  const timerRef = useRef(null);
  const microSurveyTimerRef = useRef(null);
  const [showMicroSurvey, setShowMicroSurvey] = useState(false);
  const [predictedState, setPredictedState] = useState(null);
  const [selectedModel, setSelectedModel] = useState("randomforest");
  const [microSurveyResponses, setMicroSurveyResponses] = useState([]);
  const [isPausedManually, setIsPausedManually] = useState(false);
  const [events, setEvents] = useState([]); // replaces wordTimings for ML
  const percentageLevels = [5, 10, 20, 35, 50, 75, 85, 100];
  const currentPercentage = percentageLevels[selectedLevelIndex] || 10;
  const isTextBlurred = isSelectingWords || showMicroSurvey || isPausedManually || !isTranslating;
  const [isFinished, setIsFinished] = useState(false);
  const [semanticGroups, setSemanticGroups] = useState({});
  const [precomputedLevels, setPrecomputedLevels] = useState({});
  const [username, setUsername] = useState("anonymous");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const showNotification = (title, message) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body: message, icon: "/favicon.ico" });
    } else {
      alert(`${title}\n\n${message}`);
    }
  };

  const ensureErrorString = (err) => {
    if (!err) return "";
    if (typeof err === "string") return err;
    if (typeof err === "object") {
      return err.message || JSON.stringify(err);
    }
    return String(err);
  };

  const normalizeToken = (token) =>
    token
      .replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, "")
      .trim()
      .toLowerCase();

  const buildSelectedWordSet = () => {
    return new Set(selectedWords.map(w => normalizeToken(w)));
  };


  const getNextLevelIndex = (response) => {
    if (response === "mastery") {
      return Math.min(selectedLevelIndex + 1, percentageLevels.length - 1);
    }
    if (response === "focused") {
      return selectedLevelIndex;
    }
    if (response === "frustrated") {
      return Math.max(selectedLevelIndex - 1, 0);
    }
    if (response === "overwhelmed") {
      return Math.max(selectedLevelIndex - 2, 0);
    }
    return selectedLevelIndex;
  };

  const resumeFromFunGame = () => {
    setIsPausedManually(false);
    setIsTranslating(true);
    setStartTime(Date.now());
  };

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
    setStartTime(null);
  };



  const startTranslating = async () => {
    if (isEditing) {
      setIsEditing(false);
    }

    if (!content || !content.trim()) {
      alert("Please add content first using the Edit button");
      return;
    }

    try {
      if (
        Object.keys(precomputedLevels).length === 0
      ) {
        await prepareMutationSystem();
      }

      setIsTranslating(true);
      setIsPausedManually(false);
      setStartTime(Date.now());

    } catch (error) {
      console.error("Translation error:", error);
      setTranslationError(error.message);
      alert(`Translation Error: ${error.message}`);
    } finally {
      setIsTranslatingContent(false);
    }
  };

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
      percentage: currentPercentage,
    };
  };

  const pushEvent = (event) => {
    if (!event) return;
    setEvents(prev => [...prev, event]);
  };

  const saveSessionData = async (finalEvents = events) => {
    if (finalEvents.length === 0) return;
    try {
      const response = await fetch("/api/save-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: finalEvents,
          microSurveyResponses,
          username
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log("Session saved successfully on backend:", data.filePath);
      }
    } catch (error) {
      console.error("Failed to save session on backend:", error);
    }
  };

  const completeTranslating = () => {
    const currentLine = lines[currentLineIndex];
    if (!currentLine) {
      setIsTranslating(false);
      return;
    }

    const entry = recordEvent("complete");
    const updatedEvents = [...events, entry];
    setEvents(updatedEvents);

    setIsFinished(false);
    setCurrentLineIndex(0);
    setCurrentWordIndex(0);
    setStartTime(Date.now());
  };

  const advanceWord = () => {
    if (!isTranslating || !lines.length) return;
    const currentLine = lines[currentLineIndex];
    const words = currentLine.trim().split(/\s+/);

    const event = recordEvent("forward");
    pushEvent(event);

    if (currentWordIndex + 1 < words.length) {
      setCurrentWordIndex(currentWordIndex + 1);
      setStartTime(Date.now());
    } else if (currentLineIndex + 1 < lines.length) {
      setCurrentLineIndex(currentLineIndex + 1);
      setCurrentWordIndex(0);
      setStartTime(Date.now());
    } else {
      completeTranslating();
    }
  };

  const goBackWord = () => {
    if (!isTranslating || !lines.length) return;
    const event = recordEvent("backward");
    pushEvent(event);

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



  const pauseTranslating = () => {
    setIsTranslating(false);
    setIsPausedManually(true);
  };

  const resetTranslating = () => {
    setIsTranslating(false);
    setIsEditing(false);
    resetProgress();
    setTranslationError("");

    setEvents([]);
    setIsFinished(false);
    setMicroSurveyResponses([]);
    setShowMicroSurvey(false);
    setIsPausedManually(false);
    setIsSelectingWords(false);
    setSelectedWords([]);
    setTranslationCache({});
    setPrecomputedLevels({});
    setSemanticGroups({});
    setSelectionMessage("");

    if (timerRef.current) clearTimeout(timerRef.current);
  };
  const unique = (arr) => [...new Set(arr)];

  const prepareMutationSystem = async () => {
    try {
      setIsSelectingWords(true);

      setSelectionMessage(
        <>
          Preparing adaptive translations.. <br /><br />
          Mastery - level difficulty increased <br />
          Focused - level difficulty same <br />
          Distracted - A small game <br />
          Frustrated - level difficulty decreased <br />
          Overwhelmed - level difficulty decreased more
        </>
      );

      // STEP 1 — extract semantics

      const semanticResponse = await fetch(
        "/api/extract-semantics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: content,
          }),
        }
      );

      const semantics = await semanticResponse.json();

      if (!semanticResponse.ok) {
        const errorMsg = ensureErrorString(semantics.error);
        if (semantics.isQuotaExceeded) {
          showNotification("API Credits Exhausted", "Your Groq API credits have been used up. Please check your billing dashboard.");
          const err = new Error(errorMsg || "Quota exceeded");
          err.isQuota = true;
          throw err;
        }
        throw new Error(errorMsg || "Failed to extract semantics");
      }

      setSemanticGroups(semantics);

      // STEP 2 — build stages
      const levels = {
        5: unique([
          ...(semantics.nouns ? semantics.nouns.slice(0, Math.ceil(semantics.nouns.length / 2)) : []),
        ]),

        10: unique([
          ...semantics.nouns,
        ]),

        20: unique([
          ...semantics.nouns,
          ...semantics.proper_nouns,
        ]),

        35: unique([
          ...semantics.nouns,
          ...semantics.proper_nouns,
          ...semantics.adjectives,
        ]),

        50: unique([
          ...semantics.nouns,
          ...semantics.proper_nouns,
          ...semantics.adjectives,
          ...semantics.verbs,
        ]),

        75: unique([
          ...semantics.nouns,
          ...semantics.proper_nouns,
          ...semantics.adjectives,
          ...semantics.verbs,
          ...semantics.verb_phrases,
        ]),

        85: unique([
          ...semantics.nouns,
          ...semantics.proper_nouns,
          ...semantics.adjectives,
          ...semantics.verbs,
          ...semantics.verb_phrases,
          ...semantics.clauses,
        ]),

        100: ["__FULL_TEXT__"],
      };

      setPrecomputedLevels(levels);

      // STEP 3 — collect all unique chunks

      const allChunks = unique([
        ...levels[10],
        ...levels[20],
        ...levels[35],
        ...levels[50],
        ...levels[75],
        ...levels[85],
      ]).filter(Boolean);

      // STEP 4 — translate everything once

      const translationResponse = await fetch(
        "/api/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            texts: allChunks,
            target_lang: targetLang,
          }),
        }
      );

      const translationData = await translationResponse.json();

      if (!translationResponse.ok) {
        const errorMsg = ensureErrorString(translationData.error);
        if (translationData.isQuotaExceeded) {
          showNotification("API Credits Exhausted", "Your Sarvam AI translation credits have been used up. Please check your billing dashboard.");
          const err = new Error(errorMsg || "Quota exceeded");
          err.isQuota = true;
          throw err;
        }
        throw new Error(errorMsg || "Failed to translate chunks");
      }

      setTranslationCache(
        translationData.translations || {}
      );
      const fullTranslationResponse =
        await fetch("/api/translate", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            texts: [content],
            target_lang: targetLang,
          }),
        });

      const fullTranslationData = await fullTranslationResponse.json();

      if (!fullTranslationResponse.ok) {
        const errorMsg = ensureErrorString(fullTranslationData.error);
        if (fullTranslationData.isQuotaExceeded) {
          showNotification("API Credits Exhausted", "Your Sarvam AI translation credits have been used up. Please check your billing dashboard.");
          const err = new Error(errorMsg || "Quota exceeded");
          err.isQuota = true;
          throw err;
        }
        throw new Error(errorMsg || "Failed to translate full text");
      }

      const fullTranslated =
        fullTranslationData.translations?.[
        content.trim().toLowerCase()
        ];

      setFullTranslatedText(
        fullTranslated || content
      );

      // initial level

      setSelectedWords(
        levels[currentPercentage] || []
      );

    } catch (error) {
      console.error(error);
      if (!error.isQuota) {
        alert(error.message);
      }
    } finally {
      setIsSelectingWords(false);

      setSelectionMessage("");
    }
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
          texts: [content],
          target_lang: targetLang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = ensureErrorString(data.error);
        if (data.isQuotaExceeded) {
          showNotification("API Credits Exhausted", "Your Sarvam AI translation credits have been used up. Please check your billing dashboard.");
          const err = new Error(errorMsg || "Quota exceeded");
          err.isQuota = true;
          throw err;
        }
        throw new Error(errorMsg || "Translation failed");
      }

      if (data.translatedText) {
        setContent(data.translatedText);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Translation error:", error);
      setTranslationError(error.message);
      if (!error.isQuota) {
        alert(`Translation Error: ${error.message}`);
      }
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
    let timer;
    if (isTranslating && !isFinished && !showMicroSurvey && !isPausedManually) {
      timer = setTimeout(async () => {
        setIsTranslating(false);
        try {
          // Fetch prediction from backend using the current session events
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://backend-cognitive.onrender.com";
          const response = await fetch(`${backendUrl}/predict`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ events, modelType: selectedModel }),
          });
          const data = await response.json();
          setPredictedState(data.predictedState || "focused");
        } catch (error) {
          console.error("Failed to predict cognitive state:", error);
          setPredictedState("focused"); // Fallback
        }
        setShowMicroSurvey(true);
      }, 10000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTranslating, isFinished, showMicroSurvey, isPausedManually, events]);

  const translatedLines = fullTranslatedText ? fullTranslatedText.split("\n").filter(l => l.trim()) : [];

  const renderLine = (line, lineIdx) => {
    if (currentPercentage === 100) {
      const translatedLine = translatedLines[lineIdx] || line;
      const words = translatedLine.split(/\s+/);
      return (
        <span className="inline-block">
          {words.map((word, wordIdx) => {
            const isCurrentWord = isTranslating && lineIdx === currentLineIndex && wordIdx === currentWordIndex;
            return (
              <span
                key={wordIdx}
                style={{
                  color: isCurrentWord ? "#FFD700" : "#d63384",
                  fontWeight: "700",
                  transition: "all 0.2s ease"
                }}
              >
                {word}{" "}
              </span>
            );
          })}
        </span>
      );
    }
    const selectedWordSet = buildSelectedWordSet();
    const words = line.split(" ");

    return (
      <span className="inline-block">
        {words.map((word, wordIdx) => {
          const normalized = normalizeToken(word);
          const isSelected = normalized && selectedWordSet.has(normalized);
          const isCurrentWord = isTranslating && lineIdx === currentLineIndex && wordIdx === currentWordIndex;

          const displayContent = (isSelected && translationCache[normalized])
            ? word.replace(new RegExp(`\\b${normalized}\\b`, 'i'), translationCache[normalized])
            : word;

          return (
            <span
              key={wordIdx}
              style={{
                color: isCurrentWord && isSelected ? "#FFD700" : isSelected ? "#d63384" : isCurrentWord ? "var(--accent-text)" : "var(--text-primary)",
                fontWeight: isCurrentWord || isSelected ? "700" : "400",
                transition: "all 0.2s ease"
              }}
            >
              {displayContent}{" "}
            </span>
          );
        })}
      </span>
    );
  };

  const handleMicroSurveyResponse = async (response) => {
    setMicroSurveyResponses(prev => [...prev, { response, timestamp: Date.now() }]);
    setShowMicroSurvey(false);

    if (response === "distracted") {
      setIsPausedManually(false);
      setIsTranslating(true);
      setStartTime(Date.now());
      return;
    }

    const nextLevel = getNextLevelIndex(response);
    if (nextLevel !== selectedLevelIndex) {
      setIsTranslating(false);
      setIsPausedManually(true);
      setIsSelectingWords(true);
      setSelectionMessage("Adjusting translation percentage. This might take some time");

      try {
        const nextPercentage = percentageLevels[nextLevel];

        setSelectedWords(precomputedLevels[nextPercentage] || []);

        setSelectedLevelIndex(nextLevel);
      } catch (error) {
        console.error("Level adjustment error:", error);
        alert(`Unable to adjust level: ${error.message}`);
      } finally {
        setIsSelectingWords(false);
        setSelectionMessage("");
        setIsPausedManually(false);
        setIsTranslating(true);
        setStartTime(Date.now());
      }
      return;
    }

    setIsPausedManually(false);
    setIsTranslating(true);
    setStartTime(Date.now());
  };

  const totalWords = lines.reduce((sum, line) => sum + line.trim().split(/\s+/).length, 0);
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
      <div className="max-w-6xl w-full mb-6 flex justify-between items-center relative z-10">
        <Link href="/" className="text-textSecondary hover:text-accent-primary transition-colors whitespace-nowrap">
          ← Back to Home
        </Link>
        <div className="flex gap-2 flex-wrap items-center justify-end">
          <button
            onClick={startTranslating}
            disabled={isTranslating || !hasContent || isTranslatingContent}
            className="flex items-center gap-2 px-6 py-2 bg-accent-primary text-bg-primary font-bold rounded-lg hover:bg-accent-hover transition-all disabled:opacity-50"
          >
            {isTranslatingContent ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Translating...
              </>
            ) : (
              <>
                <Play size={18} /> Start Translating
              </>
            )}
          </button>
          <button
            onClick={async () => {
              // Save to backend
              await saveSessionData();
              alert("Session finished! Data saved to backend.");

              // Clear content and reset state
              setContent("");
              resetTranslating();
            }}
            disabled={!hasContent && events.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-green-500 rounded-lg hover:bg-green-500/10 transition-all disabled:opacity-50"
          >
            Finish Session
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
          <div className="flex items-center gap-2 px-1 bg-bg-secondary/50 border border-accent-primary/20 rounded-lg backdrop-blur-sm">
            <BrainCircuit size={18} className="ml-2 text-accent-primary" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-textPrimary py-2 px-1 outline-none cursor-pointer text-sm"
              disabled={isTranslating || isTranslatingContent}
            >
              <option value="randomforest" className="bg-[#1a1a1a]">Random Forest</option>
              <option value="xgboost" className="bg-[#1a1a1a]">XGBoost</option>
              <option value="lightgbm" className="bg-[#1a1a1a]">LightGBM</option>
              <option value="logisticregression" className="bg-[#1a1a1a]">Logistic Regression</option>
              <option value="mlp" className="bg-[#1a1a1a]">MLP</option>
              <option value="gru" className="bg-[#1a1a1a]">GRU</option>
            </select>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={isTranslating || isTranslatingContent}
            className="flex items-center gap-2 px-4 py-2 border border-accent-primary rounded-lg hover:bg-accent-primary/10 transition-all disabled:opacity-50"
          >
            Edit
          </button>
        </div>
      </div>
      <div className="max-w-6xl w-full mb-4 text-sm text-textSecondary flex flex-wrap justify-end gap-4 relative z-10">
        {hasContent && (
          <>
            <span>Total words: <strong>{totalWords}</strong></span>
            <span>Current selection: <strong>{currentPercentage}%</strong></span>
            {isTranslating && <span>Current word: <strong>{currentWordPosition}/{totalWords}</strong></span>}
          </>
        )}
      </div>

      <div className="max-w-6xl w-full relative z-10">
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
            <div className="relative">
              <div
                ref={contentRef}
                className={`content-viewport space-y-4 min-h-[400px] max-h-[60vh] overflow-y-auto transition-all duration-300 ${isTextBlurred ? 'blur-sm' : ''}`}
                style={{
                  fontFamily: "var(--font-sans)",
                  lineHeight: "1.8"
                }}
              >
                {lines.map((line, idx) => (
                  <div
                    key={idx}
                    className={`transition-all duration-300 ${idx === currentLineIndex && isTranslating
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
              {isSelectingWords && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 text-white text-lg font-semibold text-center p-6">
                  {selectionMessage || "Adjusting translation percentage. This might take some time"}
                </div>
              )}
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


      <MicroSurvey isVisible={showMicroSurvey} onResponse={handleMicroSurveyResponse} predictedState={predictedState} />
    </div>
  );
}
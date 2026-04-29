// import Groq from "groq-sdk";
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// export async function POST(request) {
//   try {
//     const { text, percentage } = await request.json();
//     const selectedPercentage = Number(percentage) || 10;

//     if (!text || !text.trim()) {
//       throw new Error("Text is required to select words.");
//     }

//     const prompt = `Select the exact words from the following English text that correspond to approximately ${selectedPercentage}% of the total word count. Prioritize nouns first, then verbs, then pronouns. Return only a valid JSON array of strings in order of appearance. Do not add any extra explanation.

// Text:
// """${text}"""`;

//     const chatCompletion = await groq.chat.completions.create({
//       messages: [{ role: "user", content: prompt }],
//       model: "llama-3.3-70b-versatile",
//     });

//     const rawText = chatCompletion.choices?.[0]?.message?.content || "";

//     const selectedWords = parseGroqResponse(rawText);

//     console.log("RAW TEXT:", rawText);
//     console.log("SELECTED WORDS:", selectedWords);

//     return Response.json({ selectedWords });

//   } catch (error) {
//     console.error("Groq selectWord error:", error);
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }

// function parseGroqResponse(text) {
//   const cleaned = String(text).trim();

//   if (!cleaned) {
//     return [];
//   }

//   try {
//     return JSON.parse(cleaned);
//   } catch {
//     const jsonMatch = cleaned.match(/\[[^\]]*\]/s);
//     if (jsonMatch) {
//       try {
//         return JSON.parse(jsonMatch[0]);
//       } catch {
//         // continue to fallback
//       }
//     }

//     const normalized = cleaned
//       .replace(/\n/g, " ")
//       .replace(/["]+/g, "\"")
//       .replace(/^\[/, "")
//       .replace(/\]$/, "")
//       .trim();

//     if (!normalized) {
//       return [];
//     }

//     return normalized
//       .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
//       .map((item) => item.trim().replace(/^"|"$/g, ""))
//       .filter(Boolean);
//   }
// }

import nlp from "compromise";

export default function selectWords(text, percentage) {
  if (percentage >= 100) {
  console.log("100% selected → returning all words");
  return text.split(/\b/).filter(t => /\w/.test(t));  
  }

  const doc = nlp(text);

  // Step 1: Get clean words only
  const allWords = doc
    .terms()
    .out("array")
    .map(w => w.toLowerCase())
    .filter(w => /^[a-z]+('[a-z]+)?$/.test(w) && w.length > 2); // remove punctuation + tiny words

  if (allWords.length === 0) return [];

  // Step 2: Unique words (important!)
  const uniqueWords = [...new Set(allWords)];

  const target = Math.round((percentage / 100) * uniqueWords.length);

  const nouns = new Set(doc.nouns().out("array").map(w => w.toLowerCase()));
  const verbs = new Set(doc.verbs().out("array").map(w => w.toLowerCase()));
  const pronouns = new Set(doc.pronouns().out("array").map(w => w.toLowerCase()));

  console.log("Nouns:", [...nouns]);
  console.log("Verbs:", [...verbs]);
  console.log("Pronouns:", [...pronouns]);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const selected = new Set();

  const tryAdd = (list, label) => {
    for (const word of shuffle(list)) {
      if (selected.size >= target) break;
      if (!selected.has(word)) {
        console.log(`Selected (${label}):`, word);
        selected.add(word);
      }
    }
  };

  // Only select from meaningful pool
  const meaningfulPool = uniqueWords;

  // Priority but not greedy
  tryAdd(meaningfulPool.filter(w => nouns.has(w)), "noun");
  tryAdd(meaningfulPool.filter(w => verbs.has(w)), "verb");
  tryAdd(meaningfulPool.filter(w => pronouns.has(w)), "pronoun");

  // Fill remaining
  if (selected.size < target) {
    tryAdd(meaningfulPool, "fallback");
  }

  // Step 3: Apply back to original text (this is key)
  return text
    .split(/\b/)
    .map(token => {
      const clean = token.toLowerCase();
      return selected.has(clean) ? token : null;
    })
    .filter(Boolean);
}
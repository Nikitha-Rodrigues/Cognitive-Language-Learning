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
  const doc = nlp(text);

  const allWords = doc.terms().out("array");
  const total = allWords.length;

  if (total === 0) return [];

  const target = Math.round((percentage / 100) * total);

  const nouns = new Set(doc.nouns().out("array"));
  const verbs = new Set(doc.verbs().out("array"));
  const pronouns = new Set(doc.pronouns().out("array"));

  const selected = new Set();

  // Priority pass
  for (const word of allWords) {
    if (selected.size >= target) break;
    if (nouns.has(word)) selected.add(word);
  }

  for (const word of allWords) {
    if (selected.size >= target) break;
    if (!selected.has(word) && verbs.has(word)) selected.add(word);
  }

  for (const word of allWords) {
    if (selected.size >= target) break;
    if (!selected.has(word) && pronouns.has(word)) selected.add(word);
  }

  // Fill remaining (critical for high %)
  for (const word of allWords) {
    if (selected.size >= target) break;
    if (!selected.has(word)) selected.add(word);
  }

  // Return in original order
  return allWords.filter(word => selected.has(word));
}
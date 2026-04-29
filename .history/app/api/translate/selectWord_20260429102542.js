import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { text, percentage } = await request.json();
    const selectedPercentage = Number(percentage) || 10;

    if (!text || !text.trim()) {
      throw new Error("Text is required to select words.");
    }

    const prompt = `Select the exact words from the following English text that correspond to approximately ${selectedPercentage}% of the total word count. Prioritize nouns first, then verbs, then pronouns. Return only a valid JSON array of strings in order of appearance. Do not add any extra explanation.

Text:
"""${text}"""`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const rawText = chatCompletion.choices?.[0]?.message?.content || "";

    const selectedWords = parseGroqResponse(rawText);

    console.log("RAW TEXT:", rawText);
    console.log("SELECTED WORDS:", selectedWords);

    return Response.json({ selectedWords });

  } catch (error) {
    console.error("Groq selectWord error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

function parseGroqResponse(text) {
  const cleaned = String(text).trim();

  if (!cleaned) {
    return [];
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/\[[^\]]*\]/s);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // continue to fallback
      }
    }

    const normalized = cleaned
      .replace(/\n/g, " ")
      .replace(/["]+/g, "\"")
      .replace(/^\[/, "")
      .replace(/\]$/, "")
      .trim();

    if (!normalized) {
      return [];
    }

    return normalized
      .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
      .map((item) => item.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  }
}

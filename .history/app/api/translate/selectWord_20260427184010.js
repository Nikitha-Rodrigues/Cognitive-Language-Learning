export async function POST(request) {
  try {
    const { text, percentage } = await request.json();
    const selectedPercentage = Number(percentage) || 10;

    if (!text || !text.trim()) {
      throw new Error("Text is required to select words.");
    }

    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ_API_KEY in environment.");
    }

    const prompt = `Select the exact words from the following English text that correspond to approximately ${selectedPercentage}% of the total word count. Prioritize nouns first, then verbs, then pronouns. Return only a valid JSON array of strings in order of appearance. Do not add any extra explanation. Text:\n\n"""${text}"""`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
            { role: "user", content: prompt }
            ],
            max_tokens: 400,
            temperature: 0.0,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || JSON.stringify(data));
    }

    const rawText = data?.output?.[0]?.content?.[0]?.text || data?.choices?.[0]?.text || data?.result || "";
    const selectedWords = parseGroqResponse(rawText);

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

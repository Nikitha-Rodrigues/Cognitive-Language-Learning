import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
    try {
        const { text } = await request.json();

        if (!text || !text.trim()) {
            return Response.json(
                { error: "Text is required" },
                { status: 400 }
            );
        }

        const prompt = `
Analyze the following English text.

Extract:
1. nouns
2. proper_nouns
3. adjectives
4. verbs
5. verb_phrases
6. clauses

Return ONLY valid JSON.

Format:
{
  "nouns": [],
  "proper_nouns": [],
  "adjectives": [],
  "verbs": [],
  "verb_phrases": [],
  "clauses": []
}

Text:
"""${text}"""
`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.2,
        });

        const raw =
            completion.choices?.[0]?.message?.content || "{}";

        const cleaned = raw
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = JSON.parse(cleaned);

        return Response.json(parsed);

    } catch (error) {
        console.error("Groq semantic extraction error:", error);

        return Response.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
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
Analyze the English text below for an adaptive language learning system. Your goal is to extract key semantic units that, when translated, allow a learner to gradually understand the text without losing its core meaning (essence).

Extract the following categories, prioritizing words and phrases that are thematically central or high-impact:
1. "nouns": Concrete objects, people, and core concepts that define the subject matter.
2. "proper_nouns": Specific names of people, places, or unique organizations.
3. "adjectives": Descriptive words that add significant detail, emotion, or essential context.
4. "verbs": Primary action words that drive the narrative or logic of the sentences.
5. "verb_phrases": Meaningful multi-word actions or phrasal verbs (e.g., "broke down", "looked into").
6. "clauses": Self-contained phrases or short segments that represent a complete sub-thought or contextual setting (e.g., "in the dark of night", "despite the weather").

CRITICAL INSTRUCTIONS:
- Capture words and phrases EXACTLY as they appear in the text (preserving casing and spelling).
- Focus on words that are essential to understanding the "essence" of each sentence.
- Ensure "clauses" are natural units of meaning, not just random fragments.
- Return ONLY valid JSON.

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
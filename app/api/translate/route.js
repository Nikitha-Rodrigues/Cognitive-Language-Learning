export async function POST(request) {
  try {
    const { texts, target_lang } = await request.json();

    if (!texts || !Array.isArray(texts)) {
      throw new Error("texts array required");
    }

    const BATCH_SEPARATOR = " ||| ";

    const inputText = texts.join(BATCH_SEPARATOR);

    const response = await fetch(
      "https://api.sarvam.ai/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-subscription-key":
            process.env.SARVAM_API_KEY,
        },
        body: JSON.stringify({
          input: inputText,
          source_language_code: "en-IN",
          target_language_code: target_lang,
          speaker_gender: "Female",
          mode: "formal",
          model: "sarvam-translate:v1",
          enable_preprocessing: true,
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      const errorMsg = typeof data.error === 'object' 
        ? (data.error.message || JSON.stringify(data.error)) 
        : (data.error || "Translation API error");
        
      return Response.json(
        { 
          error: errorMsg, 
          details: data,
          isQuotaExceeded: response.status === 403 || response.status === 402
        },
        { status: response.status }
      );
    }

    const translated =
      data.translated_text
        ?.split(BATCH_SEPARATOR)
        .map((t) => t.trim()) || [];

    const translationMap = {};

    texts.forEach((text, idx) => {
      translationMap[text.trim().toLowerCase()] = translated[idx] || text;
    });

    return Response.json({
      translations: translationMap,
    });

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
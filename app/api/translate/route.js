export async function POST(request) {
  try {
    const { text, target_lang } = await request.json();

    const response = await fetch("https://api.sarvam.ai/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": process.env.SARVAM_API_KEY,
      },
      body: JSON.stringify({
        input: text,
        source_language_code: "en-IN",
        target_language_code: target_lang,
        speaker_gender: "Female",
        mode: "formal",
        model: "sarvam-translate:v1",
        enable_preprocessing: true,
      }),
    });

    const data = await response.json();

    console.log("Sarvam raw response:", data);

    if (!response.ok) {
      throw new Error(JSON.stringify(data));
    }

    return Response.json({
      translatedText: data.translated_text ?? "",
    });

  } catch (error) {
    console.error("Sarvam API error:", error.message);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
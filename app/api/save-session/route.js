import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { events, microSurveyResponses } = await request.json();

    if (!events || events.length === 0) {
      return NextResponse.json({ error: "No events to save" }, { status: 400 });
    }

    // Prepare CSV content
    let csvContent = "Word,WordID,Duration,Direction,StartTime,EndTime,CognitiveState,Percentage\n";

    events.forEach(event => {
      // Find the first survey response that occurred AFTER this event
      // This response reflects the user's state during the reading section that just occurred.
      const stateResponse = microSurveyResponses.find(r => r.timestamp > event.startTime);

      const state = stateResponse ? stateResponse.response : "ending";

      const row = [
        `"${event.word.replace(/"/g, '""')}"`,
        event.wordId,
        event.duration,
        event.direction,
        event.startTime,
        event.endTime,
        state,
        event.percentage || ""
      ].join(",");

      csvContent += row + "\n";
    });

    // Create a data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), "cognitive_data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save to file
    const fileName = `session_${Date.now()}.csv`;
    const filePath = path.join(dataDir, fileName);
    fs.writeFileSync(filePath, csvContent);

    console.log(`Session saved to ${filePath}`);

    return NextResponse.json({
      success: true,
      message: "Session saved on backend",
      filePath: fileName
    });
  } catch (error) {
    console.error("Error saving session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

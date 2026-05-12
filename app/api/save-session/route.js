import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { events, microSurveyResponses, username = "anonymous" } = await request.json();

    if (!events || events.length === 0) {
      return NextResponse.json({ error: "No events to save" }, { status: 400 });
    }

    // Prepare CSV content
    let csvContent = "Word,WordID,Duration,Direction,StartTime,EndTime,CognitiveState,Percentage\n";

    events.forEach(event => {
      // Find the first survey response that occurred AFTER this event
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

    const fileName = `${username}_${Date.now()}.csv`;
    let blobUrl = null;

    console.log(`Preparing to save session: ${fileName}`);
    console.log(`Events received: ${events.length}`);
    console.log(`CSV Length: ${csvContent.length} characters`);

    // 1. Attempt to save to Vercel Blob (if token is present)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      if (csvContent.length < 10) {
        console.error("Aborting Blob upload: csvContent is too short!");
      } else {
        try {
          // Convert to Buffer to ensure correct byte encoding on Vercel's runtime
          const csvBuffer = Buffer.from(csvContent, 'utf-8');
          console.log(`Buffer size before upload: ${csvBuffer.length} bytes`);

          const blob = await put(`cognitive_data/${fileName}`, csvBuffer, {
            access: 'public',
            contentType: 'text/csv',
            addRandomSuffix: false,
          });
          blobUrl = blob.url;
          console.log(`Session saved to Vercel Blob: ${blobUrl}`);
        } catch (blobError) {
          console.error("Vercel Blob upload failed:", blobError);
        }
      }
    }

    // 2. Always attempt local save as fallback/redundancy (will fail on Vercel read-only FS but works locally)
    let localSaved = false;
    try {
      const dataDir = path.join(process.cwd(), "cognitive_data");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const filePath = path.join(dataDir, fileName);
      fs.writeFileSync(filePath, csvContent);
      localSaved = true;
      console.log(`Session saved locally to ${filePath}`);
    } catch (fsError) {
      console.warn("Local filesystem save failed (expected on Vercel):", fsError.message);
    }

    return NextResponse.json({
      success: true,
      message: blobUrl ? "Session saved to cloud" : "Session saved locally",
      url: blobUrl,
      fileName: fileName,
      localSaved: localSaved
    });
  } catch (error) {
    console.error("Error saving session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
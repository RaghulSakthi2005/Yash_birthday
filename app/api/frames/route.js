import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the absolute paths
const FRAMES_JSON_PATH = path.join(process.cwd(), "data", "frames.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "frames");

export async function POST(request) {
  try {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"), 10);
    const objectPosition = formData.get("objectPosition");
    const file = formData.get("file");

    if (!id) {
      return NextResponse.json({ error: "Frame ID is required" }, { status: 400 });
    }

    // 1. Read existing config
    const fileContents = fs.readFileSync(FRAMES_JSON_PATH, "utf8");
    const frames = JSON.parse(fileContents);
    const frameIndex = frames.findIndex((f) => f.id === id);

    if (frameIndex === -1) {
      return NextResponse.json({ error: "Frame not found" }, { status: 404 });
    }

    const frame = frames[frameIndex];

    // 2. Handle file upload if present
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      // We will standardize the name based on the ID and keep the original extension
      const ext = path.extname(file.name) || '.jpeg';
      const fileName = `${id}${ext}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Ensure directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      // Write the file
      fs.writeFileSync(filePath, buffer);

      // Update the frame src
      frame.src = `/frames/${fileName}`;
    }

    // 3. Handle object position update if present
    if (objectPosition) {
      frame.objectPosition = objectPosition;
    }

    // 4. Save the updated JSON
    fs.writeFileSync(FRAMES_JSON_PATH, JSON.stringify(frames, null, 2), "utf8");

    return NextResponse.json({ success: true, frame });

  } catch (error) {
    console.error("Error updating frame:", error);
    return NextResponse.json({ error: "Failed to update frame" }, { status: 500 });
  }
}

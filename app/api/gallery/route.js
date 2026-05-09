import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the absolute paths
const JSON_PATH = path.join(process.cwd(), "data", "gallery_photos.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "gallery", "photos");

export async function POST(request) {
  try {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"), 10);
    const objectPosition = formData.get("objectPosition");
    const file = formData.get("file");

    if (!id) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
    }

    // 1. Read existing config
    const fileContents = fs.readFileSync(JSON_PATH, "utf8");
    const photos = JSON.parse(fileContents);
    const photoIndex = photos.findIndex((p) => p.id === id);

    if (photoIndex === -1) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    const photo = photos[photoIndex];

    // 2. Handle file upload if present
    if (file && typeof file !== 'string') {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || '.jpeg';
      const fileName = `${id}${ext}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      
      // Ensure directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      }

      // Write the file
      fs.writeFileSync(filePath, buffer);

      // Update the photo src
      photo.src = `/gallery/photos/${fileName}`;
    }

    // 3. Handle object position update if present
    if (objectPosition) {
      photo.objectPosition = objectPosition;
    }

    // 3b. Handle caption/alt update if present
    const alt = formData.get("alt");
    if (alt !== null && alt !== undefined && alt !== '') {
      photo.alt = alt;
    }

    // 4. Save the updated JSON
    fs.writeFileSync(JSON_PATH, JSON.stringify(photos, null, 2), "utf8");

    return NextResponse.json({ success: true, photo });

  } catch (error) {
    console.error("Error updating photo:", error);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}

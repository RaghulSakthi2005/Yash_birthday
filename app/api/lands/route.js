import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the absolute paths
const JSON_PATH = path.join(process.cwd(), "data", "lands.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "lands");

export async function POST(request) {
  try {
    const formData = await request.formData();
    const id = parseInt(formData.get("id"), 10);
    const objectPosition = formData.get("objectPosition");
    const file = formData.get("file");

    if (!id) {
      return NextResponse.json({ error: "Land ID is required" }, { status: 400 });
    }

    // 1. Read existing config
    const fileContents = fs.readFileSync(JSON_PATH, "utf8");
    const lands = JSON.parse(fileContents);
    const landIndex = lands.findIndex((l) => l.id === id);

    if (landIndex === -1) {
      return NextResponse.json({ error: "Land not found" }, { status: 404 });
    }

    const land = lands[landIndex];

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

      // Update the land img src
      land.img = `/lands/${fileName}`;
    }

    // 3. Handle object position update if present
    if (objectPosition) {
      land.objectPosition = objectPosition;
    }

    // 4. Save the updated JSON
    fs.writeFileSync(JSON_PATH, JSON.stringify(lands, null, 2), "utf8");

    return NextResponse.json({ success: true, land });

  } catch (error) {
    console.error("Error updating land:", error);
    return NextResponse.json({ error: "Failed to update land" }, { status: 500 });
  }
}

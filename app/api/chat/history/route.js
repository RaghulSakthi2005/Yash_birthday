import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'chat_history.json');

// Helper to ensure file exists and read it
async function getHistory() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    // If file doesn't exist, return empty history
    return [];
  }
}

async function saveHistory(history) {
  // Ensure the directory exists
  const dir = path.dirname(DATA_PATH);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {}
  
  await fs.writeFile(DATA_PATH, JSON.stringify(history, null, 2));
}

export async function GET() {
  const history = await getHistory();
  return new Response(JSON.stringify(history), { status: 200 });
}

export async function POST(req) {
  try {
    const { message, from } = await req.json();
    const history = await getHistory();
    
    const newEntry = {
      id: Date.now(),
      from, // 'them' (Yashika) or 'me' (AI/Raghul)
      text: message,
      timestamp: new Date().toISOString(),
      isManual: false
    };
    
    history.push(newEntry);
    await saveHistory(history);
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// For manual replies from the dashboard
export async function PUT(req) {
  try {
    const { text } = await req.json();
    const history = await getHistory();
    
    const manualReply = {
      id: Date.now(),
      from: 'me',
      text,
      timestamp: new Date().toISOString(),
      isManual: true // Flags this as a human-made reply
    };
    
    history.push(manualReply);
    await saveHistory(history);
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

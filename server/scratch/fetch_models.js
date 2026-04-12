import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function checkModels() {
  const key = process.env.GEMINI_API_KEY;
  console.log("Using Key:", key.substring(0, 5) + "...");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.models) {
      console.log("Total models found:", data.models.length);
      data.models.forEach(m => {
        if (m.supportedGenerationMethods.includes('generateContent')) {
          console.log(" -", m.name);
        }
      });
    } else {
      console.log("No models found. Error detail:", JSON.stringify(data));
    }
  } catch (e) {
    console.error("Fetch failed:", e.message);
  }
}

checkModels();

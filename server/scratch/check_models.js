import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // Note: listModels is not on genAI directly in some versions, 
    // it's a separate client usually, but let's try fetching a dummy 
    // or searching for supported models.
    console.log("Checking API Key:", process.env.GEMINI_API_KEY?.substring(0, 5) + "...");
    
    // In @google/generative-ai, there is no direct listModels. 
    // We have to use the REST API or we can just try 'gemini-pro' as a safe bet.
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("test");
    console.log("Gemini 1.5 Flash Test Success:", result.response.text().substring(0, 20));
  } catch (e) {
    console.error("Gemini 1.5 Flash Test Failed:", e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    console.log("Gemini Pro Test Success:", result.response.text().substring(0, 20));
  } catch (e) {
    console.error("Gemini Pro Test Failed:", e.message);
  }
}

listModels();

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const key = process.env.GEMINI_API_KEY;

try {
  const genAI = new GoogleGenerativeAI(key);
  console.log('Fetching available models...');
  
  // Actually getGenerativeModel doesn't fetch list. We have to fetch https://generativelanguage.googleapis.com/v1beta/models?key=KEY
  import('axios').then(async (axios) => {
    try {
      const res = await axios.default.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
      const models = res.data.models.map(m => m.name);
      console.log('Models available:', models.filter(m => m.includes('gemini')));
    } catch(e) {
      console.log('Error fetching models:', e.message);
    }
  });

} catch (e) {
  console.log('❌ ERROR:', e.message?.substring(0, 300));
}

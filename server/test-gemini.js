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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  console.log('Testing gemini-2.5-flash-lite...');
  const result = await model.generateContent('Say hello in one word.');
  console.log('✅ SUCCESS:', result.response.text().trim());
} catch (e) {
  console.log('❌ ERROR:', e.message?.substring(0, 300));
}

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBDSuEUZ91kZXlb4ADfE-77PUp5f19nWi0';
const genAI = new GoogleGenerativeAI(API_KEY);

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-2.0-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite-preview',
  'gemma-3-4b-it',
  'gemma-3-1b-it',
  'gemma-3-12b-it',
  'gemma-3-27b-it',
];

async function testAll() {
  for (const m of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const r = await model.generateContent('Say hi in one sentence as a wellness coach.');
      console.log(`✅ WORKS: ${m} -> ${r.response.text().substring(0, 60)}`);
    } catch (e) {
      const msg = e.message.includes('429') ? '429 QUOTA_EXCEEDED' : e.message.substring(0, 80);
      console.log(`❌ FAIL: ${m} -> ${msg}`);
    }
  }
}

testAll();

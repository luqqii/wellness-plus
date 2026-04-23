import fs from 'fs';
import { analyzeFoodImage } from './src/services/ai.service.js';

async function test() {
  const buf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
  const res = await analyzeFoodImage(buf, 'image/png');
  console.log("Result:", res);
}
test();

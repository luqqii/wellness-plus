import fs from 'fs';
import path from 'path';

async function testUpload() {
  try {
    const fileData = fs.readFileSync(path.join(process.cwd(), 'package.json'));
    const formData = new FormData();
    formData.append('image', new Blob([fileData], { type: 'image/jpeg' }), 'dummy.jpg');

    const res = await fetch('http://localhost:5001/api/v1/nutrition/scan-photo', {
      method: 'POST',
      body: formData,
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Test error:', err.message);
  }
}

testUpload();

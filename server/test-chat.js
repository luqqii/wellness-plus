import { replyToConversation } from './src/services/ai.service.js';

const res = await replyToConversation(
  { name: 'Alex', goals: ['Fitness'] },
  [],
  'What is one tip to improve my sleep?'
);

console.log('\n✅ FINAL RESPONSE:', JSON.stringify(res, null, 2));

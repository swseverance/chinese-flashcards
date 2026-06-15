// Usage: node seed.js <uid>
// Get your uid from the Firebase Auth Emulator UI at http://localhost:4000/auth
const uid = process.argv[2];

if (!uid) {
  console.error('Usage: node seed.js <uid>');
  process.exit(1);
}

process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';

const { initializeApp } = require('./functions/node_modules/firebase-admin/lib/app');
const { getFirestore, FieldValue } = require('./functions/node_modules/firebase-admin/lib/firestore');

initializeApp({ projectId: 'chineseflashcards-4aea7' });

const db = getFirestore();

const ts = () => FieldValue.serverTimestamp();

const flashcards = [
  { chinese: '你好', pinyin: 'nǐ hǎo', translation: 'Hello', notes: 'Standard greeting', type: 'word', confidence: 3 },
  { chinese: '谢谢', pinyin: 'xiè xiè', translation: 'Thank you', notes: '', type: 'word', confidence: 3 },
  { chinese: '再见', pinyin: 'zài jiàn', translation: 'Goodbye', notes: '', type: 'word', confidence: 2 },
  { chinese: '我爱你', pinyin: 'wǒ ài nǐ', translation: 'I love you', notes: '', type: 'sentence', confidence: 2 },
  { chinese: '水', pinyin: 'shuǐ', translation: 'Water', notes: '', type: 'word', confidence: 2 },
  { chinese: '我不明白', pinyin: 'wǒ bù míng bái', translation: "I don't understand", notes: '', type: 'sentence', confidence: 1 },
  { chinese: '吃饭', pinyin: 'chī fàn', translation: 'To eat (a meal)', notes: '', type: 'word', confidence: 1 },
  { chinese: '朋友', pinyin: 'péng yǒu', translation: 'Friend', notes: '', type: 'word', confidence: 1 },
  { chinese: '今天天气怎么样？', pinyin: 'jīn tiān tiān qì zěn me yàng', translation: "What's the weather like today?", notes: '', type: 'sentence', confidence: 0 },
  { chinese: '我听不懂', pinyin: 'wǒ tīng bù dǒng', translation: "I can't understand (by listening)", notes: 'Different from 不明白 — specifically about hearing', type: 'sentence', confidence: 0 },
  { chinese: '学习', pinyin: 'xué xí', translation: 'To study / to learn', notes: '', type: 'word', confidence: 0 },
  { chinese: '对不起', pinyin: 'duì bu qǐ', translation: 'Sorry', notes: '', type: 'word', confidence: 0 },
].map((card) => ({ ...card, uid, created: ts(), lastUpdated: ts() }));

async function seed() {
  const col = db.collection('flashcards');
  await Promise.all(flashcards.map((card) => col.add(card)));
  console.log(`Seeded ${flashcards.length} flashcards for uid: ${uid}`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

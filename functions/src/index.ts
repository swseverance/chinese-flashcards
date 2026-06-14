import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import {
  CreateFlashcardArgs,
  DeleteFlashcardArgs,
  Flashcard,
  ReadFlashcard,
  UpdateFlashcard,
  UpdateFlashcardArgs,
  WriteFlashcard
} from './models';

initializeApp();

const toneMap: Record<string, string> = {
  ā: 'a',
  á: 'a',
  ǎ: 'a',
  à: 'a',
  ē: 'e',
  é: 'e',
  ě: 'e',
  è: 'e',
  ī: 'i',
  í: 'i',
  ǐ: 'i',
  ì: 'i',
  ō: 'o',
  ó: 'o',
  ǒ: 'o',
  ò: 'o',
  ū: 'u',
  ú: 'u',
  ǔ: 'u',
  ù: 'u',
  ǖ: 'u',
  ǘ: 'u',
  ǚ: 'u',
  ǜ: 'u',
  ü: 'u',
  Ā: 'A',
  Á: 'A',
  Ǎ: 'A',
  À: 'A',
  Ē: 'E',
  É: 'E',
  Ě: 'E',
  È: 'E',
  Ī: 'I',
  Í: 'I',
  Ǐ: 'I',
  Ì: 'I',
  Ō: 'O',
  Ó: 'O',
  Ǒ: 'O',
  Ò: 'O',
  Ū: 'U',
  Ú: 'U',
  Ǔ: 'U',
  Ù: 'U',
  Ǖ: 'U',
  Ǘ: 'U',
  Ǚ: 'U',
  Ǜ: 'U',
  Ü: 'U'
};

const toSearch = (pinyin: string) =>
  pinyin
    .toLocaleLowerCase()
    .split('')
    .map((char) => toneMap[char] ?? char)
    .join('');

const toFlashcard = (id: string, data: ReadFlashcard): Flashcard => {
  const { uid, ...rest } = data;
  return {
    ...rest,
    id,
    created: data.created.toDate().toISOString(),
    lastUpdated: data.lastUpdated.toDate().toISOString(),
    search: toSearch(data.pinyin)
  };
};

exports.create = onCall<CreateFlashcardArgs>(
  { enforceAppCheck: true, maxInstances: 1 },
  async (req): Promise<{ flashcard: Flashcard }> => {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    const { chinese, pinyin, translation, notes, type } = req.data;

    const db = getFirestore();
    const ref = await db.collection('flashcards').add({
      chinese,
      pinyin,
      translation,
      notes,
      type,
      uid: req.auth.uid,
      confidence: 0,
      created: FieldValue.serverTimestamp(),
      lastUpdated: FieldValue.serverTimestamp()
    } satisfies WriteFlashcard);

    const snap = await ref.get();

    logger.info('flashcard created', { id: ref.id, uid: req.auth.uid });

    return { flashcard: toFlashcard(ref.id, snap.data() as ReadFlashcard) };
  }
);

exports.get = onCall(
  { enforceAppCheck: true, maxInstances: 1 },
  async (req): Promise<{ flashcards: Flashcard[] }> => {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    const db = getFirestore();
    const snap = await db
      .collection('flashcards')
      .where('uid', '==', req.auth.uid)
      .get();

    logger.info('flashcards fetched', { uid: req.auth.uid, count: snap.size });

    return {
      flashcards: snap.docs.map((doc) =>
        toFlashcard(doc.id, doc.data() as ReadFlashcard)
      )
    };
  }
);

exports.update = onCall<UpdateFlashcardArgs>(
  { enforceAppCheck: true, maxInstances: 1 },
  async (req): Promise<{ flashcard: Flashcard }> => {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    const { id, updates } = req.data;
    const db = getFirestore();
    const ref = db.collection('flashcards').doc(id);

    const snap = await ref.get();

    if (!snap.exists) {
      throw new HttpsError('not-found', 'Flashcard not found');
    }

    if ((snap.data() as ReadFlashcard).uid !== req.auth.uid) {
      throw new HttpsError('permission-denied', 'Not your flashcard');
    }

    await ref.set(
      {
        ...updates,
        lastUpdated: FieldValue.serverTimestamp()
      } satisfies UpdateFlashcard,
      { merge: true }
    );

    const updated = await ref.get();

    logger.info('flashcard updated', { id, uid: req.auth.uid });

    return { flashcard: toFlashcard(id, updated.data() as ReadFlashcard) };
  }
);

exports.remove = onCall<DeleteFlashcardArgs>(
  { enforceAppCheck: true, maxInstances: 1 },
  async (req): Promise<void> => {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'Must be signed in');
    }

    const { id } = req.data;
    const db = getFirestore();
    const ref = db.collection('flashcards').doc(id);

    const snap = await ref.get();

    if (!snap.exists) {
      throw new HttpsError('not-found', 'Flashcard not found');
    }

    if ((snap.data() as ReadFlashcard).uid !== req.auth.uid) {
      throw new HttpsError('permission-denied', 'Not your flashcard');
    }

    await ref.delete();

    logger.info('flashcard deleted', { id, uid: req.auth.uid });
  }
);

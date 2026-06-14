import { FieldValue, Timestamp } from 'firebase-admin/firestore';

export enum FlashcardType {
  WORD = 'word',
  SENTENCE = 'sentence'
}

export enum SortStrategy {
  CONFIDENCE = 'confidence',
  RANDOM = 'random'
}

export type CreateFlashcardArgs = {
  chinese: string;
  pinyin: string;
  translation: string;
  notes: string;
  type: FlashcardType;
};

export type UpdateFlashcardArgs = {
  id: string;
  updates: {
    chinese?: string;
    pinyin?: string;
    translation?: string;
    notes?: string;
    type?: FlashcardType;
    confidence?: number;
  };
};

export type DeleteFlashcardArgs = {
  id: string;
};

export type WriteFlashcard = {
  chinese: string;
  pinyin: string;
  translation: string;
  notes: string;
  type: FlashcardType;
  uid: string;
  confidence: number;
  created: FieldValue;
  lastUpdated: FieldValue;
};

export type UpdateFlashcard = {
  chinese?: string;
  pinyin?: string;
  translation?: string;
  notes?: string;
  type?: FlashcardType;
  uid?: string;
  confidence?: number;
  lastUpdated: FieldValue;
};

export type ReadFlashcard = {
  chinese: string;
  pinyin: string;
  translation: string;
  notes: string;
  type: FlashcardType;
  uid: string;
  confidence: number;
  created: Timestamp;
  lastUpdated: Timestamp;
};

export type Flashcard = {
  chinese: string;
  pinyin: string;
  search: string;
  translation: string;
  notes: string;
  type: FlashcardType;
  confidence: number;
  created: string;
  lastUpdated: string;
  id: string;
};

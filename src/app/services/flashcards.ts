import { inject, Injectable } from '@angular/core';
import { httpsCallable } from 'firebase/functions';
import { CreateFlashcardArgs, Flashcard, FlashcardType, GetFlashcardsArgs, UpdateFlashcardArgs } from '../models';
import { FIREBASE_FUNCTIONS } from '../tokens/firebase';

@Injectable({
  providedIn: 'root',
})
export class Flashcards {
  private functions = inject(FIREBASE_FUNCTIONS);

  addFlashcard(args: CreateFlashcardArgs) {
    const fn = httpsCallable<CreateFlashcardArgs, { flashcard: Flashcard }>(
      this.functions,
      'create',
    );
    return fn(args).then(({ data: { flashcard } }) => flashcard);
  }

  getGroups(type: FlashcardType) {
    const fn = httpsCallable<{ type: FlashcardType }, { flashcards: [number, number][] }>(
      this.functions,
      'groups',
    );
    return fn({ type }).then(({ data: { flashcards } }) => flashcards);
  }

  getFlashcards(args: GetFlashcardsArgs) {
    const fn = httpsCallable<GetFlashcardsArgs, { flashcards: Flashcard[] }>(
      this.functions,
      'get',
    );
    return fn(args).then(({ data: { flashcards } }) => flashcards);
  }

  updateFlashcard(args: UpdateFlashcardArgs) {
    const fn = httpsCallable<UpdateFlashcardArgs, { flashcard: Flashcard }>(
      this.functions,
      'update',
    );
    return fn(args).then(({ data: { flashcard } }) => flashcard);
  }

  deleteFlashcard(id: string) {
    const fn = httpsCallable<{ id: string }, void>(this.functions, 'remove');
    return fn({ id }).then(() => undefined);
  }
}

import { TestBed } from '@angular/core/testing';

import { Flashcards } from './flashcards';

describe('Flashcards', () => {
  let service: Flashcards;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Flashcards);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

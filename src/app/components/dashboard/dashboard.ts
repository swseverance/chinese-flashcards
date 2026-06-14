import { Component, inject, OnInit } from '@angular/core';
import { Flashcards } from '../../services/flashcards';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private flashcards = inject(Flashcards);

  async ngOnInit(): Promise<void> {
    try {
      await this.flashcards.getFlashcards();
    } catch (error) {
      console.error('getFlashcards()', error);
    }
  }
}

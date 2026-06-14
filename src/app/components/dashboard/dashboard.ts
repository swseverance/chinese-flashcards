import { Component, inject, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Flashcards } from '../../services/flashcards';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private flashcards = inject(Flashcards);
  private message = inject(NzMessageService);

  async ngOnInit(): Promise<void> {
    try {
      console.log(await this.flashcards.getFlashcards());

      this.message.success('Flashcards loaded');
    } catch (error) {
      console.error('getFlashcards()', error);

      this.message.error('Failed to load flashcards');
    }
  }
}

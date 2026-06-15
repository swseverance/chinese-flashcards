import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { Flashcard, FlashcardType } from '../../models';
import { Flashcards } from '../../services/flashcards';

@Component({
  selector: 'app-edit',
  imports: [NzButtonModule, ReactiveFormsModule, NzFormModule, NzInputModule, NzRadioModule],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit {
  private flashcards = inject(Flashcards);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);
  private data = inject<{ flashcard: Flashcard }>(NZ_MODAL_DATA);
  private fb = inject(NonNullableFormBuilder);

  FlashcardType = FlashcardType;
  loading = false;

  form = this.fb.group({
    chinese: [this.data.flashcard.chinese, Validators.required],
    pinyin: [this.data.flashcard.pinyin],
    translation: [this.data.flashcard.translation],
    notes: [this.data.flashcard.notes],
    type: [this.data.flashcard.type],
  });

  cancel(): void {
    this.modalRef.destroy();
  }

  async onSubmit(): Promise<void> {
    if (this.loading || this.form.invalid) return;

    this.loading = true;

    const { chinese, pinyin, translation, notes, type } = this.form.getRawValue();

    try {
      const updated = await this.flashcards.updateFlashcard({
        id: this.data.flashcard.id,
        updates: {
          chinese: chinese.trim(),
          pinyin: pinyin.trim(),
          translation: translation.trim(),
          notes: notes.trim(),
          type,
        },
      });

      this.modalRef.destroy(updated);
    } catch (error) {
      console.error('updateFlashcard()', error);
      this.message.error('Failed to update flashcard');
      this.loading = false;
    }
  }
}

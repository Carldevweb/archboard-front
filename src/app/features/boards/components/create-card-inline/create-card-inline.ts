import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CreateCardPayload {
  title: string;
  description?: string;
}

@Component({
  selector: 'app-create-card-inline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-card-inline.html',
  styleUrl: './create-card-inline.scss',
})
export class CreateCardInlineComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly isSubmitting = input<boolean>(false);

  readonly createCard = output<CreateCardPayload>();
  readonly cancel = output<void>();

  readonly titleInput = viewChild<ElementRef<HTMLInputElement>>('titleInput');

  draftTitle = '';
  draftDescription = '';

  constructor() {
    afterNextRender(() => {
      const input = this.titleInput()?.nativeElement;

      if (input && this.host.nativeElement.isConnected) {
        input.focus();
        input.select();
      }
    });
  }

  onTitleChange(value: string): void {
    this.draftTitle = value;
  }

  onDescriptionChange(value: string): void {
    this.draftDescription = value;
  }

  onSubmit(): void {
    const trimmedTitle = this.draftTitle.trim();
    const trimmedDescription = this.draftDescription.trim();

    if (!trimmedTitle || this.isSubmitting()) {
      return;
    }

    this.createCard.emit({
      title: trimmedTitle,
      description: trimmedDescription || undefined,
    });
  }

  onCancel(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.cancel.emit();
  }
}
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface EditCardPayload {
  title: string;
  description?: string;
}

@Component({
  selector: 'app-edit-card-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-card-modal.html',
  styleUrl: './edit-card-modal.scss',
})
export class EditCardModalComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly isSubmitting = input<boolean>(false);
  readonly initialTitle = input<string>('');
  readonly initialDescription = input<string>('');

  readonly save = output<EditCardPayload>();
  readonly deleteCard = output<void>();
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

  ngOnInit(): void {
    this.draftTitle = this.initialTitle();
    this.draftDescription = this.initialDescription();
  }

  onTitleChange(value: string): void {
    this.draftTitle = value;
  }

  onDescriptionChange(value: string): void {
    this.draftDescription = value;
  }

  onSave(): void {
    const trimmedTitle = this.draftTitle.trim();
    const trimmedDescription = this.draftDescription.trim();

    if (!trimmedTitle || this.isSubmitting()) {
      return;
    }

    this.save.emit({
      title: trimmedTitle,
      description: trimmedDescription || undefined,
    });
  }

  onDelete(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.deleteCard.emit();
  }

  onCancel(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.cancel.emit();
  }

  onBackdropClick(): void {
    this.onCancel();
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }
} 
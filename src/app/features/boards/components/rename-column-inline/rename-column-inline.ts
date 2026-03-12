import {
  CommonModule,
} from '@angular/common';
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

@Component({
  selector: 'app-rename-column-inline',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rename-column-inline.html',
  styleUrl: './rename-column-inline.scss',
})
export class RenameColumnInlineComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly initialName = input<string>('');
  readonly isSubmitting = input<boolean>(false);

  readonly save = output<string>();
  readonly cancel = output<void>();

  readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

  draftName = '';

  constructor() {
    afterNextRender(() => {
      this.draftName = this.initialName();

      const input = this.nameInput()?.nativeElement;
      if (input && this.host.nativeElement.isConnected) {
        input.focus();
        input.select();
      }
    });
  }

  onNameChange(value: string): void {
    this.draftName = value;
  }

  onSave(): void {
    const trimmedName = this.draftName.trim();

    if (!trimmedName || this.isSubmitting()) {
      return;
    }

    this.save.emit(trimmedName);
  }

  onCancel(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.cancel.emit();
  }
}
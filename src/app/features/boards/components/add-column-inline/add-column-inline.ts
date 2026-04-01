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

  @Component({
    selector: 'app-add-column-inline',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './add-column-inline.html',
    styleUrl: './add-column-inline.scss',
  })
  export class AddColumnInlineComponent {
    private readonly host = inject(ElementRef<HTMLElement>);

    readonly isSubmitting = input<boolean>(false);

    readonly createColumn = output<string>();
    readonly cancel = output<void>();

    readonly nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');

    draftName = '';

    constructor() {
      afterNextRender(() => {
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

    onSubmit(): void {
      const trimmedName = this.draftName.trim();

      if (!trimmedName || this.isSubmitting()) {
        return;
      }

      this.createColumn.emit(trimmedName);
    }

    onCancel(): void {
      if (this.isSubmitting()) {
        return;
      }

      this.cancel.emit();
    }
  }
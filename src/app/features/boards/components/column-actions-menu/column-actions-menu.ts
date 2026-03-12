import { CommonModule } from '@angular/common';
import { Component, HostListener, signal, output } from '@angular/core';

@Component({
  selector: 'app-column-actions-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './column-actions-menu.html',
  styleUrl: './column-actions-menu.scss',
})
export class ColumnActionsMenuComponent {
  readonly rename = output<void>();
  readonly deleteColumn = output<void>();

  readonly isOpen = signal(false);

  toggleMenu(): void {
    this.isOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }

  onRename(): void {
    this.closeMenu();
    this.rename.emit();
  }

  onDelete(): void {
    this.closeMenu();
    this.deleteColumn.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenu();
  }
}
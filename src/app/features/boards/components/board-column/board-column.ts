import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { BoardColumn } from '../../models/board-column.model';
import { ColumnActionsMenuComponent } from '../column-actions-menu/column-actions-menu';
import { RenameColumnInlineComponent } from '../rename-column-inline/rename-column-inline';

@Component({
  selector: 'app-board-column',
  standalone: true,
  imports: [
    CommonModule,
    ColumnActionsMenuComponent,
    RenameColumnInlineComponent,
  ],
  templateUrl: './board-column.html',
  styleUrl: './board-column.scss',
})
export class BoardColumnComponent {
  readonly column = input.required<BoardColumn>();
  readonly isRenaming = input<boolean>(false);
  readonly isUpdating = input<boolean>(false);

  readonly startRename = output<void>();
  readonly saveRename = output<string>();
  readonly cancelRename = output<void>();
  readonly deleteColumn = output<void>();
}
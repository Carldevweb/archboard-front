import { Component, computed, input } from '@angular/core';
import { BoardColumn } from '../../models/board-column.model';

@Component({
  selector: 'app-board-column',
  standalone: true,
  templateUrl: './board-column.html',
  styleUrl: './board-column.scss',
})
export class BoardColumnComponent {
  readonly column = input.required<BoardColumn>();

  readonly cardsCount = computed(() => this.column().cards?.length ?? 0);
}
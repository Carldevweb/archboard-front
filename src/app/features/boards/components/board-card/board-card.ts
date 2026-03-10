import { Component, input } from '@angular/core';
import { BoardCard } from '../../models/board-card.model';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.html',
  styleUrl: './board-card.scss',
})
export class BoardCardComponent {
  readonly card = input.required<BoardCard>();
}
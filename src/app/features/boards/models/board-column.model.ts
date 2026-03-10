import { BoardCard } from "./board-card.model";

export interface BoardColumn {
  id: number;
  name: string;
  position: number;
  boardId: number;
  cards: BoardCard[];
}
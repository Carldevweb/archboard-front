export interface BoardActivity {
  id: number;
  boardId: number;
  type: string;
  entityType: string;
  entityId: number;
  message: string;
  createdAt: string;
}
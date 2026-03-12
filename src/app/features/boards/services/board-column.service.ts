import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BoardColumn } from '../models/board-column.model';

@Injectable({
  providedIn: 'root',
})
export class BoardColumnService {
  private readonly http = inject(HttpClient);

  getByBoard(boardId: number): Observable<BoardColumn[]> {
    return this.http.get<BoardColumn[]>(
      `${environment.apiUrl}/boards/${boardId}/columns`
    );
  }

  createColumn(
    boardId: number,
    payload: { name: string }
  ): Observable<BoardColumn> {
    return this.http.post<BoardColumn>(
      `${environment.apiUrl}/boards/${boardId}/columns`,
      payload
    );
  }

  updateColumn(
    columnId: number,
    payload: { name: string }
  ): Observable<BoardColumn> {
    return this.http.patch<BoardColumn>(
      `${environment.apiUrl}/columns/${columnId}`,
      payload
    );
  }

  deleteColumn(columnId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/columns/${columnId}`);
  }

  moveColumn(
    columnId: number,
    payload: { position: number }
  ): Observable<void> {
    return this.http.patch<void>(
      `${environment.apiUrl}/columns/${columnId}/move`,
      payload
    );
  }
}
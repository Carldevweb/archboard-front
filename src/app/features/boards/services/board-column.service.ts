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
}
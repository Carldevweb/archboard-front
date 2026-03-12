import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { BoardActivity } from '../models/board-activity.model';

@Injectable({
  providedIn: 'root',
})
export class BoardActivityService {
  private readonly http = inject(HttpClient);

  getByBoard(boardId: number): Observable<BoardActivity[]> {
    return this.http.get<BoardActivity[]>(
      `${environment.apiUrl}/boards/${boardId}/activities`
    );
  }
}
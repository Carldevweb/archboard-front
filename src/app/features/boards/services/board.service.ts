import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly http = inject(HttpClient);

  create(workspaceId: number, name: string) {
    return this.http.post<Board>(
      `${environment.apiUrl}/workspaces/${workspaceId}/boards`,
      { name }
    );
  }

  getByWorkspace(workspaceId: number): Observable<Board[]> {
    return this.http.get<Board[]>(
      `${environment.apiUrl}/workspaces/${workspaceId}/boards`
    );
  }
}
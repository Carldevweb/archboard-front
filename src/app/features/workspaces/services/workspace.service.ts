import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Workspace } from '../models/workspace.model';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  private readonly http = inject(HttpClient);

  create(name: string) {
    return this.http.post<Workspace>(
      `${environment.apiUrl}/workspaces`,
      { name }
    );
  }

  getAll(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(`${environment.apiUrl}/workspaces`);
  }

  getById(id: number): Observable<Workspace> {
    return this.http.get<Workspace>(`${environment.apiUrl}/workspaces/${id}`);
  }


}
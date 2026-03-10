import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { BoardCard } from '../models/board-card.model';
import { CardMoveRequest } from '../models/card-move-request.model';
import { CreateCardRequest } from '../models/create-card-request.model';
import { UpdateCardRequest } from '../models/update-card-request.model';

@Injectable({
  providedIn: 'root',
})
export class BoardCardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getByColumn(columnId: number): Observable<BoardCard[]> {
    return this.http.get<BoardCard[]>(`${this.apiUrl}/columns/${columnId}/cards`);
  }

  createCard(columnId: number, payload: CreateCardRequest): Observable<BoardCard> {
    return this.http.post<BoardCard>(`${this.apiUrl}/columns/${columnId}/cards`, payload);
  }

  moveCard(cardId: number, payload: CardMoveRequest): Observable<BoardCard> {
    return this.http.patch<BoardCard>(`${this.apiUrl}/cards/${cardId}/move`, payload);
  }

  updateCard(cardId: number, payload: UpdateCardRequest): Observable<BoardCard> {
    return this.http.patch<BoardCard>(`${this.apiUrl}/cards/${cardId}`, payload);
  }

  deleteCard(cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${cardId}`);
  }
}
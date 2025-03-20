import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ENTITY } from '@core/global/constans/api-endpoints';
import { environment } from '@environments/environments.dev';
import { EntityResponse } from '@interfaces/entity';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  httpClient = inject(HttpClient);

  apiBaseUrl = environment.url;

  constructor() {}

  getAllEntities(): Observable<EntityResponse[]> {
    const url = `${this.apiBaseUrl}/${ENTITY.GET_ALL}`;
    return this.httpClient.get<EntityResponse[]>(url);
  }

  getEntityById(id: number): Observable<EntityResponse> {
    const url = `${this.apiBaseUrl}/${ENTITY.GET_BY_ID}/${id}`;
    return this.httpClient.get<EntityResponse>(url);
  }

  createEntity(entity: EntityResponse): Observable<EntityResponse> {
    const url = `${this.apiBaseUrl}/${ENTITY.CREATE}`;
    return this.httpClient.post<EntityResponse>(url, entity);
  }

  updateEntity(id: number, entity: EntityResponse): Observable<EntityResponse> {
    const url = `${this.apiBaseUrl}/${ENTITY.UPDATE}/${id}`;
    return this.httpClient.put<EntityResponse>(url, entity);
  }

  deleteEntity(id: number) {
    const url = `${this.apiBaseUrl}/${ENTITY.DELETE}/${id}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }

  getNextNumber(): Observable<string> {
    const url = `${this.apiBaseUrl}/${ENTITY.GET_NEXT_NUMBER}`;
    return this.httpClient.get(url, { responseType: 'text' });
  }

}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DOCUMENT_TYPE } from '@core/global/constans/api-endpoints';
import { environment } from '@environments/environments.dev';
import {
  DocumentTypeByStateResponse,
  DocumentTypeRequest,
  DocumentTypeResponse,
} from '@interfaces/documentType';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  httpClient = inject(HttpClient);

  apiBaseUrl = environment.url;

  constructor() {}

  getAllDocumentTypes(): Observable<DocumentTypeResponse[]> {
    const url = `${this.apiBaseUrl}/${DOCUMENT_TYPE.GET_ALL}`;
    return this.httpClient.get<DocumentTypeResponse[]>(url);
  }

  getDocumentTypeById(id: number): Observable<DocumentTypeResponse> {
    const url = `${this.apiBaseUrl}/${DOCUMENT_TYPE.GET_BY_ID}/${id}`;
    return this.httpClient.get<DocumentTypeResponse>(url);
  }

  createDocumentType(
    documentType: DocumentTypeRequest
  ): Observable<DocumentTypeResponse> {
    const url = `${this.apiBaseUrl}/${DOCUMENT_TYPE.CREATE}`;
    return this.httpClient.post<DocumentTypeResponse>(url, documentType);
  }

  updateDocumentType(
    id: number,
    documentType: DocumentTypeRequest
  ): Observable<DocumentTypeResponse> {
    const url = `${this.apiBaseUrl}/${DOCUMENT_TYPE.UPDATE}/${id}`;
    return this.httpClient.put<DocumentTypeResponse>(url, documentType);
  }

  deleteDocumentType(id: number) {
    const url = `${this.apiBaseUrl}/${DOCUMENT_TYPE.DELETE}/${id}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }

  getAllDocumentTypesByState(): Observable<DocumentTypeByStateResponse[]> {
    const url = `${this.apiBaseUrl}/${DOCUMENT_TYPE.GET_ALL_BY_STATE}`;
    return this.httpClient.get<DocumentTypeByStateResponse[]>(url);
  }

  getNextNumber(): Observable<string> {
    const url = `${this.apiBaseUrl}/${DOCUMENT_TYPE.GET_NEXT_NUMBER}`;
    return this.httpClient.get(url, { responseType: 'text' });
  }
}

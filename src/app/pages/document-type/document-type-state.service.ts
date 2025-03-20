import { inject, Injectable } from '@angular/core';
import {
  DocumentTypeRequest,
  DocumentTypeResponse,
} from '@interfaces/documentType';
import { DocumentTypeService } from '@services/document-type.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeStateService {
  documentTypeService = inject(DocumentTypeService);

  documentTypesSubject: BehaviorSubject<DocumentTypeResponse[]> =
    new BehaviorSubject<DocumentTypeResponse[]>([]);
  documentTypes$: Observable<DocumentTypeResponse[]> =
    this.documentTypesSubject.asObservable();

  constructor() {}

  getAllDocumentTypes(): void {
    this.documentTypeService
      .getAllDocumentTypes()
      .subscribe((documentType: DocumentTypeResponse[]) => {
        this.documentTypesSubject.next(documentType);
      });
  }

  addDocument(documentrequest: DocumentTypeResponse): void {
    const documentType = this.documentTypesSubject.getValue();
    documentType.unshift(documentrequest);
    this.documentTypesSubject.next(documentType);
  }

  updateDocument(documentTypeRequest: DocumentTypeRequest, id: number): void {
    const documentType = this.documentTypesSubject.getValue();
    const index = documentType.findIndex((doc) => doc.idDocumentType === id);
    if (index !== -1) {
      documentType[index] = documentTypeRequest;
      this.documentTypesSubject.next(documentType);
    }
  }

  deleteDocument(id: number): void {
    const document = this.documentTypesSubject.getValue();
    const deleteDocument = document.filter((doc) => doc.idDocumentType !== id);
    this.documentTypesSubject.next(deleteDocument);
  }
}

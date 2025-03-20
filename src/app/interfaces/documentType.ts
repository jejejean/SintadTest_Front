export interface DocumentTypeResponse {
  idDocumentType: number;
  code: string;
  name: string;
  description: string;
  state: boolean;
}

export interface DocumentTypeRequest {
  idDocumentType: number;
  code: string;
  name: string;
  description: string;
  state: boolean;
}

export interface DocumentTypeByStateResponse {
  idDocumentType: number;
  name: string;
}

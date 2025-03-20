import { DocumentTypeRequest, DocumentTypeResponse } from "./documentType";
import { TaxpayerTypeRequest, TaxpayerTypeResponse } from "./taxpayerType";

export interface EntityRequest {
  idEntity: number;
  numDocument: string;
  companyName: string;
  tradeName: string;
  address: string;
  phone: string;
  state: boolean;
  taxpayerType: TaxpayerTypeRequest;
  documentType: DocumentTypeRequest;
}

export interface EntityResponse {
  idEntity: number;
  numDocument: string;
  companyName: string;
  tradeName: string;
  address: string;
  phone: string;
  state: boolean;
  taxpayerType: TaxpayerTypeResponse;
  documentType: DocumentTypeResponse;
}

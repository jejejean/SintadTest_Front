export interface TaxpayerTypeRequest {
  idTaxpayerType: number;
  name: string;
  state: boolean;
}

export interface TaxpayerTypeResponse {
  idTaxpayerType: number;
  name: string;
  state: boolean;
}

export interface TaxpayerTypeInfoResponse{
  idTaxpayerType: number;
  name: string;
}

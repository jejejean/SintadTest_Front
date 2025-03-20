import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TAXPAYER_TYPE } from '@core/global/constans/api-endpoints';
import { environment } from '@environments/environments.dev';
import { TaxpayerTypeInfoResponse, TaxpayerTypeResponse } from '@interfaces/taxpayerType';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaxpayerTypeService {
  httpClient = inject(HttpClient);

  apiBaseUrl = environment.url;

  constructor() {}

  getAllTaxpayerTypes(): Observable<TaxpayerTypeResponse[]> {
    const url = `${this.apiBaseUrl}/${TAXPAYER_TYPE.GET_ALL}`;
    return this.httpClient.get<TaxpayerTypeResponse[]>(url);
  }

  getTaxpayerTypeById(id: number): Observable<TaxpayerTypeResponse> {
    const url = `${this.apiBaseUrl}/${TAXPAYER_TYPE.GET_BY_ID}/${id}`;
    return this.httpClient.get<TaxpayerTypeResponse>(url);
  }

  createTaxpayerType(taxpayerType: TaxpayerTypeResponse): Observable<TaxpayerTypeResponse> {
    const url = `${this.apiBaseUrl}/${TAXPAYER_TYPE.CREATE}`;
    return this.httpClient.post<TaxpayerTypeResponse>(url, taxpayerType);
  }

  updateTaxpayerType(id:number ,taxpayerType: TaxpayerTypeResponse): Observable<TaxpayerTypeResponse> {
    const url = `${this.apiBaseUrl}/${TAXPAYER_TYPE.UPDATE}/${id}`;
    return this.httpClient.put<TaxpayerTypeResponse>(url, taxpayerType);
  }

  deleteTaxpayerType(id: number) {
    const url = `${this.apiBaseUrl}/${TAXPAYER_TYPE.DELETE}/${id}`;
    return this.httpClient.delete(url, { responseType: 'text' });
  }

  getAllTaxpayerTypesByState(): Observable<TaxpayerTypeInfoResponse[]> {
    const url = `${this.apiBaseUrl}/${TAXPAYER_TYPE.GET_ALL_BY_STATE}`;
    return this.httpClient.get<TaxpayerTypeInfoResponse[]>(url);
  }
}

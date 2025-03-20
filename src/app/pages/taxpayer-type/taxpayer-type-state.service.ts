import { inject, Injectable } from '@angular/core';
import { TaxpayerTypeRequest, TaxpayerTypeResponse } from '@interfaces/taxpayerType';
import { TaxpayerTypeService } from '@services/taxpayer-type.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaxpayerTypeStateService {
  taxpayerTypeService = inject(TaxpayerTypeService);

  taxpayerTypesSubject: BehaviorSubject<TaxpayerTypeResponse[]> =
    new BehaviorSubject<TaxpayerTypeResponse[]>([]);
  taxpayerTypes$: Observable<TaxpayerTypeResponse[]> =
    this.taxpayerTypesSubject.asObservable();

  constructor() {}

  getAllTaxpayerTypes(): void {
    this.taxpayerTypeService
      .getAllTaxpayerTypes()
      .subscribe((taxpayer: TaxpayerTypeResponse[]) => {
        this.taxpayerTypesSubject.next(taxpayer);
      });
  }

  addTaxpayer(taxpayerRequest: TaxpayerTypeResponse): void {
    const taxpayerType = this.taxpayerTypesSubject.getValue();
    taxpayerType.unshift(taxpayerRequest);
    this.taxpayerTypesSubject.next(taxpayerType);
  }

  updateTaxpayer(taxpayerTypeRequest: TaxpayerTypeRequest, id: number): void {
    const taxpayerType = this.taxpayerTypesSubject.getValue();
    const index = taxpayerType.findIndex((doc) => doc.idTaxpayerType === id);
    if (index !== -1) {
      taxpayerType[index] = taxpayerTypeRequest;
      this.taxpayerTypesSubject.next(taxpayerType);
    }
  }

  deleteTaxpayer(id: number): void {
    const taxpayer = this.taxpayerTypesSubject.getValue();
    const deleteTaxpayer = taxpayer.filter((doc) => doc.idTaxpayerType !== id);
    this.taxpayerTypesSubject.next(deleteTaxpayer);
  }
}

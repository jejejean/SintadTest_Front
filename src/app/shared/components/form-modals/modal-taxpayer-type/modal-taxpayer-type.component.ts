import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TaxpayerTypeRequest } from '@interfaces/taxpayerType';
import { TaxpayerTypeStateService } from '@pages/taxpayer-type/taxpayer-type-state.service';
import { TaxpayerTypeService } from '@services/taxpayer-type.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FormErrorComponent } from "../../form-errors/form-error.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-taxpayer-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    FormErrorComponent
],
  templateUrl: './modal-taxpayer-type.component.html',
  styleUrl: './modal-taxpayer-type.component.css',
})
export class ModalTaxpayerTypeComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  taxpayerTypeService = inject(TaxpayerTypeService);
  taxpayerTypeStateService = inject(TaxpayerTypeStateService);

  taxpayerTypeForm!: FormGroup;
  modalTaxpayerType: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.buildFormTaxpayerType();
  }

  buildFormTaxpayerType() {
    this.taxpayerTypeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/), Validators.minLength(3)]],
    });
  }

  onSubmitTaxpayerType() {
    if (this.taxpayerTypeForm.valid) {
      let { name } = this.taxpayerTypeForm.getRawValue();
      const taxpayerTypeRequest: TaxpayerTypeRequest = {
        idTaxpayerType: 0,
        name: name,
        state: true,
      };
      this.taxpayerTypeService
        .createTaxpayerType(taxpayerTypeRequest)
        .subscribe({
          next: (createTaxpayer) => {
            this.taxpayerTypeStateService.addTaxpayer(createTaxpayer);
            this.toastr.success('Tipo de contribuyente ha sido creado exitosamente', 'Éxito');
            this.closeModalTaxpayerType();
          },
          error: (error) => {
            this.toastr.error(error.error.message, 'Error');
          },
        });
          
    } else {
      this.taxpayerTypeForm.markAllAsTouched();
    }
  }

  openModalTaxpayerType() {
    this.modalTaxpayerType = true;
  }
  
  closeModalTaxpayerType() {
    this.taxpayerTypeForm.reset();
    this.modalTaxpayerType = false;
  }
}

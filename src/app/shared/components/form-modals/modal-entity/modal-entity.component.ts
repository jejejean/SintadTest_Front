import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EntityRequest } from '@interfaces/entity';
import { EntityStateService } from '@pages/entity/entity-state.service';
import { EntityService } from '@services/entity.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { DocumentTypeService } from '@services/document-type.service';
import { TaxpayerTypeService } from '@services/taxpayer-type.service';
import { DocumentTypeByStateResponse } from '@interfaces/documentType';
import { TaxpayerTypeInfoResponse } from '@interfaces/taxpayerType';
import { InputNumberModule } from 'primeng/inputnumber';
import { forkJoin } from 'rxjs';
import { SelectModule } from 'primeng/select';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FormErrorComponent } from '../../form-errors/form-error.component';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-modal-entity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    KeyFilterModule,
    FormErrorComponent,
  ],
  templateUrl: './modal-entity.component.html',
  styleUrl: './modal-entity.component.css',
})
export class ModalEntityComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  entityServiceState = inject(EntityStateService);
  entityService = inject(EntityService);
  documentTypeService = inject(DocumentTypeService);
  taxpayerTypeService = inject(TaxpayerTypeService);

  entityForm!: FormGroup;
  modalEntity: boolean = false;
  optionDocuments!: DocumentTypeByStateResponse[];
  optionTaxpayers!: TaxpayerTypeInfoResponse[];

  constructor() {}

  ngOnInit(): void {
    this.buildFormEntity();
  }

  loadOptions() {
    forkJoin({
      documents: this.documentTypeService.getAllDocumentTypesByState(),
      taxpayers: this.taxpayerTypeService.getAllTaxpayerTypesByState(),
    }).subscribe({
      next: ({ documents, taxpayers }) => {
        this.optionDocuments = documents;
        this.optionTaxpayers = taxpayers;
        this.modalEntity = true;
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error');
        this.closeModalEntity();
      },
    });
  }

  buildFormEntity() {
    this.entityForm = this.formBuilder.group({
      numDocument: ['', [Validators.required, Validators.maxLength(25)]],
      companyName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      tradeName: ['', [Validators.maxLength(100)]],
      address: ['', [Validators.maxLength(250)]],
      phone: [null, [Validators.maxLength(11)]],
      documentType: ['', [Validators.required]],
      taxpayerType: [null],
    });
  }

  onSubmitEntity() {
    if (this.entityForm.valid) {
      let {
        numDocument,
        companyName,
        tradeName,
        address,
        phone,
        documentType,
        taxpayerType,
      } = this.entityForm.getRawValue();

      const entityRequest: EntityRequest = {
        idEntity: 0,
        numDocument: numDocument,
        companyName: companyName,
        tradeName: tradeName,
        address: address,
        phone: phone,
        state: true,
        taxpayerType:taxpayerType?.idTaxpayerType ||  null,
        documentType: documentType.idDocumentType,
      };
      this.entityService.createEntity(entityRequest).subscribe({
        next: (createdEntity) => {
          this.entityServiceState.addEntity(createdEntity);
          this.toastr.success(
            'La Entidad ha sido creada exitosamente ',
            'Éxito'
          );
          this.closeModalEntity();
        },
        error: (error) => {
          let errorMessages = Object.values(error.error.errors).join('\n');
          this.toastr.error(errorMessages || error.error.message, 'Error');
        },
      });
    } else {
      this.entityForm.markAllAsTouched();
    }
  }

  openModalEntity() {
    this.loadOptions();
  }

  closeModalEntity() {
    this.entityForm.reset();
    this.modalEntity = false;
  }
}

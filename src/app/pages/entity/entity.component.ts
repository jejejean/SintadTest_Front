import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Column, TableColumns } from '@shared/constants/TableColumns';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalEntityComponent } from '../../shared/components/form-modals/modal-entity/modal-entity.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EntityStateService } from './entity-state.service';
import { EntityService } from '@services/entity.service';
import { DocumentTypeService } from '@services/document-type.service';
import { TaxpayerTypeService } from '@services/taxpayer-type.service';
import { forkJoin } from 'rxjs';
import { DocumentTypeByStateResponse } from '@interfaces/documentType';
import { TaxpayerTypeInfoResponse } from '@interfaces/taxpayerType';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { EntityResponse } from '@interfaces/entity';
import { State, states } from '@shared/data/states';
import { ToastrService } from 'ngx-toastr';
import { FormErrorComponent } from '../../shared/components/form-errors/form-error.component';
import { AuthoritiesService } from '@auth/services/authorities.service';
@Component({
  selector: 'app-entity',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    TableModule,
    CommonModule,
    ButtonModule,
    ModalEntityComponent,
    DividerModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    InputNumberModule,
    ConfirmDialogModule,
    ToastModule,
    FormErrorComponent,
  ],
  templateUrl: './entity.component.html',
  providers: [ConfirmationService, MessageService],
})
export class EntityComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  entityServiceState = inject(EntityStateService);
  entityService = inject(EntityService);
  documentTypeService = inject(DocumentTypeService);
  taxpayerTypeService = inject(TaxpayerTypeService);
  authorities = inject(AuthoritiesService);

  entityUpdateForm!: FormGroup;
  optionDocuments!: DocumentTypeByStateResponse[];
  optionTaxpayers!: TaxpayerTypeInfoResponse[];
  entities: EntityResponse[] = [];
  entity!: EntityResponse;

  cols: Column[] = TableColumns.ColumnsEntity;
  modalEntity: boolean = false;
  stateOptions: State[] = states;

  roles: string = '';

  constructor(private readonly confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.getAllEntities();
    this.buildEntity();
    this.getRoleData();
    this.entityServiceState.entity$.subscribe((entities) => {
      this.entities = entities;
    });
  }

  getRoleData() {
    this.roles = this.authorities.getRoles();
  }

  getEntityById(id: number) {
    forkJoin({
      documents: this.documentTypeService.getAllDocumentTypesByState(),
      taxpayers: this.taxpayerTypeService.getAllTaxpayerTypesByState(),
      entity: this.entityService.getEntityById(id),
    }).subscribe({
      next: ({ documents, taxpayers, entity }) => {
        this.optionDocuments = documents;
        this.optionTaxpayers = taxpayers;
        this.entity = entity;
        this.initEntity(entity);
        this.openModalEntity();
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error');
        this.closeModalEntity();
      },
    });
  }

  getAllEntities() {
    this.entityServiceState.getAllEntityTypes();
  }

  initEntity(entity: EntityResponse) {
    this.entityUpdateForm.setValue({
      numDocument: entity.numDocument,
      companyName: entity.companyName,
      tradeName: entity.tradeName,
      address: entity.address,
      phone: entity.phone,
      documentType:
        this.optionDocuments.find(
          (doc) => doc.idDocumentType === entity.documentType.idDocumentType
        ) || null,
      taxpayerType:
        this.optionTaxpayers.find(
          (tp) => tp.idTaxpayerType === entity.taxpayerType?.idTaxpayerType
        ) || null,
      state:
        this.stateOptions.find((state) => state.value === entity.state) || null,
    });
  }

  buildEntity() {
    this.entityUpdateForm = this.formBuilder.group({
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
      phone: [null, [Validators.maxLength(15)]],
      state: ['', [Validators.required]],
      documentType: ['', [Validators.required]],
      taxpayerType: [null],
    });
  }

  onUpdateEntity() {
    if (this.entityUpdateForm.valid) {
      let {
        numDocument,
        companyName,
        tradeName,
        address,
        phone,
        state,
        documentType,
        taxpayerType,
      } = this.entityUpdateForm.getRawValue();

      const entityRequest: EntityResponse = {
        idEntity: this.entity.idEntity,
        numDocument: numDocument,
        companyName: companyName,
        tradeName: tradeName,
        address: address,
        phone: phone,
        state: state.value,
        taxpayerType:taxpayerType?.idTaxpayerType ||  null,
        documentType: documentType.idDocumentType,
      };
      this.entityService
        .updateEntity(this.entity.idEntity, entityRequest)
        .subscribe({
          next: () => {
            const updatedEntity: EntityResponse = {
              ...entityRequest,
              taxpayerType:
                this.optionTaxpayers.find(
                  (tax) => tax.idTaxpayerType === taxpayerType?.idTaxpayerType
                ) || taxpayerType,
              documentType:
                this.optionDocuments.find(
                  (doc) => doc.idDocumentType === documentType.idDocumentType
                ) || documentType,
            };

            this.entityServiceState.updateEntity(
              updatedEntity,
              this.entity.idEntity
            );

            this.toastr.success('Entidad actualizada correctamente', 'Éxito');
            this.closeModalEntity();
          },
          error: (error) => {
            let errorMessages = Object.values(error.error.errors).join('\n');
            this.toastr.error(errorMessages, 'Error');
          },
        });
    } else {
      this.entityUpdateForm.markAllAsTouched();
    }
  }

  deleteEntiy(id: number) {
    this.entityService.deleteEntity(id).subscribe(() => {
      this.entityServiceState.deleteEntity(id);
    });
  }

  openModalEntity() {
    this.modalEntity = true;
  }

  closeModalEntity() {
    this.modalEntity = false;
  }

  modalDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Te gustaría eliminar esta entidad?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-info-circle',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        label: 'Cancelar',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Eliminar',
        severity: 'danger',
      },
      accept: () => {
        this.deleteEntiy(id);
        this.toastr.success('Entidad eliminada correctamente', 'Éxito');
      },
      reject: () => {
        this.toastr.info('No se eliminó la entidad', 'Cancelado');
      },
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  DocumentTypeRequest,
  DocumentTypeResponse,
} from '@interfaces/documentType';
import { DocumentTypeService } from '@services/document-type.service';
import { Column, TableColumns } from '@shared/constants/TableColumns';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ModalDocumentTypeComponent } from '../../shared/components/form-modals/modal-document-type/modal-document-type.component';
import { DocumentTypeStateService } from './document-type-state.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { State, states } from '@shared/data/states';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { KeyFilterModule } from 'primeng/keyfilter';
import { FormErrorComponent } from '../../shared/components/form-errors/form-error.component';
import { AuthoritiesService } from '@auth/services/authorities.service';

@Component({
  selector: 'app-document-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    TableModule,
    CommonModule,
    ButtonModule,
    ModalDocumentTypeComponent,
    DividerModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    KeyFilterModule,
    FormErrorComponent,
  ],
  templateUrl: './document-type.component.html',
  providers: [ConfirmationService, MessageService],
})
export class DocumentTypeComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  documentTypeStateService = inject(DocumentTypeStateService);
  documentTypeService = inject(DocumentTypeService);
  toastr = inject(ToastrService);
  authorities = inject(AuthoritiesService);

  documentTypeUpdateForm!: FormGroup;
  documentTypes: DocumentTypeResponse[] = [];
  document!: DocumentTypeResponse;

  modalDocumentType: boolean = false;
  stateOptions: State[] = states;
  cols: Column[] = TableColumns.ColumnsDocumentType;
  roles: string = '';

  constructor(private readonly confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.getRoleData();
    this.getAllDocumentType();
    this.buildDocumentType();
    this.documentTypeStateService.documentTypes$.subscribe((documentTypes) => {
      this.documentTypes = documentTypes;
    });
  }

  getRoleData() {
    this.roles = this.authorities.getRoles();
  }

  getDocumentTypeById(id: number) {
    this.documentTypeService
      .getDocumentTypeById(id)
      .subscribe((document: DocumentTypeResponse) => {
        this.openModalDocumentType();
        this.initDocumentType(document);
        this.document = document;
      });
  }

  getAllDocumentType() {
    this.documentTypeStateService.getAllDocumentTypes();
  }

  buildDocumentType() {
    this.documentTypeUpdateForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(20)]],
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: ['', [Validators.maxLength(200)]],
      state: ['', [Validators.required]],
    });
  }

  initDocumentType(document: DocumentTypeResponse) {
    this.documentTypeUpdateForm.setValue({
      code: document.code,
      name: document.name,
      description: document.description,
      state:
        this.stateOptions.find((state) => state.value === document.state) ||
        null,
    });
  }

  onUpdateDocumentType() {
    if (this.documentTypeUpdateForm.valid) {
      let { code, name, description, state } =
        this.documentTypeUpdateForm.getRawValue();
      const documentTypeRequest: DocumentTypeRequest = {
        idDocumentType: this.document.idDocumentType,
        code: code,
        name: name,
        description: description,
        state: state.value,
      };
      this.documentTypeService
        .updateDocumentType(this.document.idDocumentType, documentTypeRequest)
        .subscribe({
          next: () => {
            this.documentTypeStateService.updateDocument(
              documentTypeRequest,
              this.document.idDocumentType
            );
            this.toastr.success('Documento actualizado correctamente', 'Éxito');
            this.closeModalDocumentType();
          },
          error: (err) => {
            this.toastr.error(err.error.message, 'Error');
          },
        });
    } else {
      this.documentTypeUpdateForm.markAllAsTouched();
    }
  }

  deleteDocumentType(id: number): void {
    this.documentTypeService.deleteDocumentType(id).subscribe(() => {
      this.documentTypeStateService.deleteDocument(id);
    });
  }

  openModalDocumentType() {
    this.modalDocumentType = true;
  }

  closeModalDocumentType() {
    this.modalDocumentType = false;
  }

  modalDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Te gustaría eliminar este documento?',
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
        this.deleteDocumentType(id);
        this.toastr.success('Documento eliminado correctamente', 'Éxito');
      },
      reject: () => {
        this.toastr.info('No se eliminó el documento', 'Cancelado');
      },
    });
  }
}

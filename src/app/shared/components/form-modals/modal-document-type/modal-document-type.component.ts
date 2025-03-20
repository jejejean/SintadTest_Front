import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DocumentTypeRequest } from '@interfaces/documentType';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DocumentTypeService } from '@services/document-type.service';
import { DocumentTypeStateService } from '@pages/document-type/document-type-state.service';
import { FormErrorComponent } from '../../form-errors/form-error.component';
import { KeyFilterModule } from 'primeng/keyfilter';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-document-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    FormErrorComponent,
    KeyFilterModule,
  ],
  templateUrl: './modal-document-type.component.html',
  styleUrl: './modal-document-type.component.css',
})
export class ModalDocumentTypeComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);
  documentTypeService = inject(DocumentTypeService);
  documentTypeStateService = inject(DocumentTypeStateService);

  documentTypeForm!: FormGroup;
  modalDocumentType: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.buildFormDocumentType();
  }

  buildFormDocumentType() {
    this.documentTypeForm = this.formBuilder.group({
      code: [
        { value: '', disabled: true },
        [Validators.required, Validators.maxLength(50)],
      ],
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
    });
  }

  onSubmitDocumentType() {
    if (this.documentTypeForm.valid) {
      let { code, name, description } = this.documentTypeForm.getRawValue();
      const documentTypeRequest: DocumentTypeRequest = {
        idDocumentType: 0,
        code: code,
        name: name,
        description: description,
        state: true,
      };
      this.documentTypeService
        .createDocumentType(documentTypeRequest)
        .subscribe({
          next: (createdDocumentType) => {
            this.documentTypeStateService.addDocument(createdDocumentType);
            this.toastr.success(
              'El tipo de documento ha sido creado exitosamente',
              'Éxito'
            );
            this.closeModalDocumentType();
          },
          error: (error) => {
            this.toastr.error(error.error.message, 'Error');
          },
        });
    } else {
      this.documentTypeForm.markAllAsTouched();
    }
  }

  getNexNumber() {
    this.documentTypeService.getNextNumber().subscribe({
      next: (code: string) => {
        this.documentTypeForm.get('code')?.setValue(code);
      },
      error: (error) => {
        this.toastr.error(error.error.message, 'Error');
      },
    });
  }

  openModalDocumentType() {
    this.modalDocumentType = true;
    this.getNexNumber();
  }

  closeModalDocumentType() {
    this.documentTypeForm.reset();
    this.modalDocumentType = false;
  }
}

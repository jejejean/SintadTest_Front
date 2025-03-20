import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { State, states } from '@shared/data/states';
import { TaxpayerTypeStateService } from './taxpayer-type-state.service';
import { TaxpayerTypeService } from '@services/taxpayer-type.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import {
  TaxpayerTypeRequest,
  TaxpayerTypeResponse,
} from '@interfaces/taxpayerType';
import { ModalTaxpayerTypeComponent } from '../../shared/components/form-modals/modal-taxpayer-type/modal-taxpayer-type.component';
import { Column, TableColumns } from '@shared/constants/TableColumns';
import { ToastrService } from 'ngx-toastr';
import { FormErrorComponent } from '../../shared/components/form-errors/form-error.component';
import { AuthoritiesService } from '@auth/services/authorities.service';

@Component({
  selector: 'app-taxpayer-type',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    TableModule,
    CommonModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    InputTextModule,
    SelectModule,
    ConfirmDialogModule,
    ToastModule,
    ModalTaxpayerTypeComponent,
    FormErrorComponent,
  ],
  templateUrl: './taxpayer-type.component.html',
  providers: [ConfirmationService, MessageService],
})
export class TaxpayerTypeComponent implements OnInit {
  formBuilder = inject(FormBuilder);
  taxpayerTypeStateService = inject(TaxpayerTypeStateService);
  taxpayerTypeService = inject(TaxpayerTypeService);
  toastr = inject(ToastrService);
  authorities = inject(AuthoritiesService);

  cols: Column[] = TableColumns.ColumnsTaxpayer;

  taxpayerTypeUpdateForm!: FormGroup;
  taxpayerTypes: TaxpayerTypeResponse[] = [];
  taxpayer!: TaxpayerTypeResponse;
  stateOptions: State[] = states;
  modalTaxpayerType: boolean = false;

  roles: string = '';

  constructor(private readonly confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.getAllTaxpayerTypes();
    this.taxpayerTypeStateService.taxpayerTypes$.subscribe((taxpayerType) => {
      this.taxpayerTypes = taxpayerType;
    });
    this.buildTaxpayerType();
    this.getRoleData();
  }

  getRoleData() {
    this.roles = this.authorities.getRoles();
  }

  getTaxpayerTypeById(id: number) {
    this.taxpayerTypeService
      .getTaxpayerTypeById(id)
      .subscribe((taxpayer: TaxpayerTypeResponse) => {
        this.openModalTaxpayer();
        this.initTaxpayerType(taxpayer);
        this.taxpayer = taxpayer;
      });
  }

  getAllTaxpayerTypes() {
    this.taxpayerTypeStateService.getAllTaxpayerTypes();
  }

  buildTaxpayerType() {
    this.taxpayerTypeUpdateForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
          Validators.minLength(3),
        ],
      ],
      state: ['', Validators.required],
    });
  }

  initTaxpayerType(taxpayer: TaxpayerTypeResponse) {
    this.taxpayerTypeUpdateForm.setValue({
      name: taxpayer.name,
      state:
        this.stateOptions.find((state) => state.value === taxpayer.state) ||
        null,
    });
  }

  onUpdateTaxpayerType() {
    if (this.taxpayerTypeUpdateForm.valid) {
      let { name, state } = this.taxpayerTypeUpdateForm.getRawValue();
      const taxpayerTypeRequest: TaxpayerTypeRequest = {
        idTaxpayerType: this.taxpayer.idTaxpayerType,
        name: name,
        state: state.value,
      };

      this.taxpayerTypeService
        .updateTaxpayerType(this.taxpayer.idTaxpayerType, taxpayerTypeRequest)
        .subscribe({
          next: () => {
            this.taxpayerTypeStateService.updateTaxpayer(
              taxpayerTypeRequest,
              this.taxpayer.idTaxpayerType
            );
            this.toastr.success(
              'Contribuyente actualizado correctamente',
              'Éxito'
            );
            this.closeModalTaxpayer();
          },
          error: (err) => {
            this.toastr.error(err.error.mensaje, 'Error');
          },
        });
    } else {
      this.taxpayerTypeUpdateForm.markAllAsTouched();
    }
  }

  deleteTaxpayerType(id: number) {
    this.taxpayerTypeService.deleteTaxpayerType(id).subscribe(() => {
      this.taxpayerTypeStateService.deleteTaxpayer(id);
    });
  }

  openModalTaxpayer() {
    this.modalTaxpayerType = true;
  }

  closeModalTaxpayer() {
    this.modalTaxpayerType = false;
  }

  modalDelete(event: Event, id: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Te gustaría eliminar este contribuyente?',
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
        this.deleteTaxpayerType(id);
        this.toastr.success('Contribuyente eliminado correctamente', 'Éxito');
      },
      reject: () => {
        this.toastr.info('No se eliminó el contribuyente', 'Cancelado');
      },
    });
  }
}

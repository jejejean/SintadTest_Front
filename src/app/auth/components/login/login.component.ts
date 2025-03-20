import { Component, inject, OnInit } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { PasswordModule } from 'primeng/password';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormErrorComponent } from '../../../shared/components/form-errors/form-error.component';
import { ToastrService } from 'ngx-toastr';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    PasswordModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
    FormErrorComponent,
    CardModule
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  toastr = inject(ToastrService);
  loginForm!: FormGroup;
  constructor(
    readonly formBuilder: FormBuilder,
    readonly router: Router,
    readonly authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    sessionStorage.clear();
    this.buildFormLogin();
  }
  
  buildFormLogin() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }


  onSubmitLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authenticationService.login({ username, password }).subscribe({
        next: () => {
          localStorage.setItem('username', username);
          this.toastr.success('Acceso exitoso, ¡todo listo para comenzar!',"Bienvenido");
          this.router.navigate(['/main']);
        },
        error: (err) => {
          console.log('Error de autenticacion ',err.error.message);
          this.toastr.error(err.error.message, "Error")
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

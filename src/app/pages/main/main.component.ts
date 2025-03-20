import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MegaMenu, MegaMenuModule } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { MegaMenuItem } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { AuthoritiesService } from '@auth/services/authorities.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MegaMenuModule, MegaMenu, ButtonModule],
  templateUrl: './main.component.html',
})
export class MainComponent {
  toastr = inject(ToastrService);
  router = inject(Router);
  authorities = inject(AuthoritiesService);

  roles: string = '';
  userName: string = '';

  constructor() {}

  navigateTo(route: string): void {
    this.toastr.info(`Hasta pronto ${this.userName}`, 'Información');
    this.router.navigate([route]);
  }

  items: MegaMenuItem[] | undefined;

  ngOnInit() {
    this.getUserData();
    this.items = [
      {
        label: 'Entidad',
        icon: 'pi pi-box',
        routerLink: '/main/entities',
      },
      {
        label: 'Documentos',
        icon: 'pi pi-clipboard',
        routerLink: '/main/document-type',
      },
      {
        label: 'Contribuyentes',
        icon: 'pi pi-money-bill',
        routerLink: '/main/taxpayer-type',
      },
    ];
  }

  getUserData() {
    this.userName = this.authorities.getUsername();
    this.roles = this.authorities.getRoles();
  }
}

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from './core/loader/loader.component';
import { LoaderService } from '@core/loader/loader.service';
import { PrimeNG } from 'primeng/config';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    LoaderComponent,
    NgxSpinnerModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  loader = inject(LoaderService);
  primeng = inject(PrimeNG);
  toastr = inject(ToastrService);

  title = 'SintadTest-Front';

  ngOnInit(): void {
    this.primeng.ripple.set(true);

    this.primeng.zIndex = {
      modal: 1100, // dialog, sidebar
      overlay: 1000, // dropdown, overlaypanel
      menu: 1000, // overlay menus
      tooltip: 1100, // tooltip
    };
  }
}

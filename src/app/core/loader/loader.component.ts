import { Component } from '@angular/core';
import { LoaderService } from './loader.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css'],
  standalone: true,
  imports: [NgxSpinnerModule]
})
export class LoaderComponent {
  constructor(readonly loader: LoaderService, readonly spinner: NgxSpinnerService) { }
  ngOnInit() {
    this.loader.isLoading$.subscribe(isLoading => {
      if (isLoading) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }
}
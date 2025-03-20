import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="control && control.invalid && (control.dirty || control.touched)"
      class="text-red-600 font-semibold fade-in text-xs"
    >
      <span class="flex" *ngIf="control.errors?.['required']">{{ validationMessage }}</span>
      <span class="flex" *ngIf="control.errors?.['pattern']">{{ patternMessage }}</span>
      <span class="flex" *ngIf="control.errors?.['minlength']">{{ minMessage }}</span>
      <span class="flex" *ngIf="control.errors?.['maxlength']">{{ maxMessage }}</span>
    </div>
  `,
})
export class FormErrorComponent {
  @Input() validationMessage!: string;
  @Input() patternMessage?: string;
  @Input() minMessage?: string;
  @Input() maxMessage?: string;
  @Input() messageDate?: string;
  @Input() control!: AbstractControl | null;
}

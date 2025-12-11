import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { SafePipe } from './pipes/safe.pipe';

const PIPES = [CurrencyFormatPipe, DateFormatPipe, SafePipe];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...PIPES],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...PIPES,
  ],
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { SafePipe } from './pipes/safe.pipe';

// Components
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

const PIPES = [CurrencyFormatPipe, DateFormatPipe, SafePipe];
const COMPONENTS = [NavbarComponent, FooterComponent];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...PIPES, ...COMPONENTS],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...PIPES,
    ...COMPONENTS,
  ],
})
export class SharedModule {}

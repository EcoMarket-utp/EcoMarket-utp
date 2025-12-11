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
import { ModalComponent } from './components/modal/modal.component';
import { ToastComponent } from './components/toast/toast.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

// Services (will be provided at root level)
import { ToastService } from './services/toast.service';
import { ModalService } from './services/modal.service';

const PIPES = [CurrencyFormatPipe, DateFormatPipe, SafePipe];
const COMPONENTS = [
  NavbarComponent,
  FooterComponent,
  ModalComponent,
  ToastComponent,
  PaginationComponent,
  SpinnerComponent,
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...PIPES, ...COMPONENTS],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...PIPES,
    ...COMPONENTS,
  ],
  providers: [ToastService, ModalService],
})
export class SharedModule {}

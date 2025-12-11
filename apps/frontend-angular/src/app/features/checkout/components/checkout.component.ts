import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateOrderRequest, OrderResponse } from '@app/shared/models/order.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  loading = false;
  error = '';
  currentStep = 1; // 1: Shipping, 2: Payment, 3: Review

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.checkoutForm = this.formBuilder.group({
      // Shipping Info
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      country: ['', [Validators.required]],

      // Payment Info
      cardName: ['', [Validators.required]],
      cardNumber: ['', [Validators.required, Validators.minLength(16)]],
      expiryDate: ['', [Validators.required]],
      cvv: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      this.error = 'Please complete all required fields.';
      return;
    }

    this.loading = true;
    this.error = '';

    // TODO: Implement order creation
    console.log('Order data:', this.checkoutForm.value);
    setTimeout(() => {
      this.router.navigate(['/dashboard/orders']);
    }, 2000);
  }

  get f() {
    return this.checkoutForm.controls;
  }
}

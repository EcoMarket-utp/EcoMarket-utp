import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { RegisterRequest } from '@app/shared/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator(),
      }
    );
  }

  private passwordMatchValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        const errors = confirmPassword.errors;
        if (errors) {
          delete errors['passwordMismatch'];
          confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
        }
      }

      return null;
    };
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const registerRequest: RegisterRequest = {
      firstName: this.f['firstName'].value,
      lastName: this.f['lastName'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
    };

    this.authService.register(registerRequest).subscribe({
      next: () => {
        this.router.navigate(['/auth/login'], {
          queryParams: { registered: true },
        });
      },
      error: (error) => {
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        this.loading = false;
      },
    });
  }
}

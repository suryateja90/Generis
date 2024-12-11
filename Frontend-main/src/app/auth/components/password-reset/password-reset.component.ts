import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { clearError, passwordReset } from '../../../store/auth/auth.actions';
import { selectAuthErrorMessage, selectAuthLoading } from '../../../store/auth/auth.selectors';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  let errors: ValidationErrors | null = null;
  const confirmPasswordCtrl = control.get('confirmPassword');
  if (confirmPasswordCtrl) {
    const password = control.get('password')?.value;
    const confirmPassword = confirmPasswordCtrl?.value;
    errors = password === confirmPassword ? null : { 'passwordMismatch': true };
    if (!confirmPasswordCtrl.hasError('required')) { confirmPasswordCtrl.setErrors(errors); }
  }
  return errors;
}

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FloatLabelModule, PasswordModule, ButtonModule, MessageModule],
})
export class PasswordResetComponent implements OnInit {

  passwordResetForm?: FormGroup;

  // aware the realm of rxjs uses the "$" as appendix to the observables, not a bad idea using them also for signals to know they are actually a reactive asset
  loading$ = this.store.selectSignal(selectAuthLoading);
  error$ = this.store.selectSignal(selectAuthErrorMessage);

  constructor(
    public layoutService: LayoutService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.passwordResetForm = this.fb.group({
          token: [token, Validators.required],
          password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z]).+$/)]], // Matching IsStrongPassword criteria
          confirmPassword: ['', Validators.required],
        }, { validators: passwordMatchValidator });
      }
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearError());
  }

  onSubmit(): void {
    if (this.passwordResetForm.valid) {
      const { confirmPassword, ...passwordResetData } = this.passwordResetForm.value;
      this.store.dispatch(passwordReset({ passwordResetDto: passwordResetData }));
    }
  }
}

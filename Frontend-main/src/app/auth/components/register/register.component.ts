// src/app/auth/components/register/register.component.ts
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { RegisterAuthModel } from '../../../../shared/models/register-auth.model';
import { clearError, register } from '../../../store/auth/auth.actions';
import { selectAuthErrorMessage, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FloatLabelModule, InputTextModule, PasswordModule, ButtonModule, MessageModule]
})
export class RegisterComponent implements OnDestroy {

  registerForm = this.fb.group({
    name: [''],
    company: [''],
    area: [''],
    phone: [''],
    role: ['IDLE', Validators.required],
    level: ['99', Validators.required],
    privileges: ['0', Validators.required],
    ambiente_url_id: ['DEVEL', Validators.required],
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z]).+$/)]], // Matching IsStrongPassword criteria
  });

  // aware the realm of rxjs uses the "$" as appendix to the observables, not a bad idea using them also for signals to know they are actually a reactive asset
  loading$ = this.store.selectSignal(selectAuthLoading);
  error$ = this.store.selectSignal(selectAuthErrorMessage);

  constructor(
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnDestroy(): void {
    this.store.dispatch(clearError());
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerData: RegisterAuthModel = this.registerForm.value;
      this.store.dispatch(register({ registerDto: registerData }));
    }
  }
}

import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { PasswordForgotAuthModel } from 'src/shared/models/password-forgot-auth.model';
import { clearError, passwordForgot } from '../../../store/auth/auth.actions';
import { selectAuthErrorMessage, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-password-forgot',
  templateUrl: './password-forgot.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, MessageModule, RouterLink],
})
export class PasswordForgotComponent implements OnDestroy {

  passwordForgotForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
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
    if (this.passwordForgotForm.valid) {
      const passwordForgotData: PasswordForgotAuthModel = this.passwordForgotForm.value;
      this.store.dispatch(passwordForgot({ passwordForgotDto: passwordForgotData }));
    }
  }
}

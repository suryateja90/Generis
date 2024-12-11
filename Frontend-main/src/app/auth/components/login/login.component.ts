// src/app/auth/components/login/login.component.ts
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
import { LoginAuthModel } from 'src/shared/models/login-auth.model';
import { clearError, login } from '../../../store/auth/auth.actions';
import { selectAuthErrorMessage, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, FloatLabelModule, InputTextModule, PasswordModule, ButtonModule, MessageModule]
})
export class LoginComponent implements OnDestroy {

    loginForm = this.fb.group({
        username: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*\d)(?=.*[a-z]).+$/)]], // Matching IsStrongPassword criteria
    });;

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
        if (this.loginForm.valid) {
            const loginData: LoginAuthModel = this.loginForm.value;
            this.store.dispatch(login({ loginDto: loginData }));
        }
    }
}

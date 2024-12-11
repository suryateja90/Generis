// src/app/auth/components/confirm-email/confirm-email.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { confirmEmail } from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  standalone: true,
  imports: [ProgressSpinnerModule]
})
export class ConfirmEmailComponent implements OnInit {

  loading = true;
  message = 'Confirming your email...';
  info = 'A confirmation email is on its way';

  constructor(
    public layoutService: LayoutService,
    private route: ActivatedRoute,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.store.dispatch(confirmEmail({ token }));
      } else {
        this.message = 'Invalid confirmation token.';
        this.loading = false;
      }
    });

    // Listen to success or failure to update the message and loading state
    this.store.pipe(select(selectAuthLoading)).subscribe((loading: any) => {
      this.loading = loading;
    });

    this.store.pipe(select(selectAuthError)).subscribe((error: any) => {
      if (error) {
        this.message = error.error?.message || 'Email Confirmation Failed';
        this.info = 'Please contact our support team for assistance';
        this.loading = false;
      }
    });
  }
}


// src/app/store/profile/profile.effects.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import * as ProfileActions from './profile.actions';

import { ConfigService } from 'src/app/services/config.service';
import { SeguridadUserModel } from '../../../shared/models/seguridad-user.model';

@Injectable()
export class ProfileEffects {

  private get apiUrl(): string {
    return this.configService.getApiUrl();  // Use dynamic API URL from ConfigService
  }

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private messageService: MessageService,
    private configService: ConfigService,
  ) {
  }

  // Load Profile Effect
  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfile),
      mergeMap(() =>
        this.http.get<SeguridadUserModel>(`${this.apiUrl}/auth/load-profile`, { withCredentials: true }).pipe(
          map((profile) => ProfileActions.loadProfileSuccess({ profile })),
          catchError((error) => of(ProfileActions.loadProfileFailure({ error })))
        )
      )
    )
  );

  // Update Profile Effect
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfile),
      switchMap(({ profile }) =>
        this.http.post<SeguridadUserModel>(`${this.apiUrl}/auth/update-profile`, profile, { withCredentials: true }).pipe(
          map((updatedProfile) => ProfileActions.updateProfileSuccess({ profile: updatedProfile })),
          catchError((error) => of(ProfileActions.updateProfileFailure({ error })))
        )
      )
    )
  );

  // Success and Failure Effects
  loadProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(ofType(ProfileActions.loadProfileSuccess), tap(() => { })), { dispatch: false });

  loadProfileFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.loadProfileFailure),
      tap((action) => this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to load profile' }))
    ), { dispatch: false });

  updateProfileSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfileSuccess),
      tap(() => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Profile updated' }))
    ), { dispatch: false });

  updateProfileFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProfileActions.updateProfileFailure),
      tap((action) => this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to update profile' }))
    ), { dispatch: false });
}

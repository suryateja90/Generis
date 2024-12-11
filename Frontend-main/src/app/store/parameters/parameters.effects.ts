// src/app/store/parameters/parameters.effects.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import * as ParametersActions from './parameters.actions';

import { ConfigService } from 'src/app/services/config.service';
import { SeguridadParameterModel } from 'src/shared/models/seguridad-parameter.model';

@Injectable()
export class ParametersEffects {

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

  // ----------------------------------------------------------------------------------------------------------------------------
  // Load Parameters Effect
  getParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.getParameters),
      mergeMap(() =>
        this.http.get<SeguridadParameterModel[]>(`${this.apiUrl}/auth/get-parameters`, { withCredentials: true }).pipe(
          map((parameters) => ParametersActions.getParametersSuccess({ parameters })),
          catchError((error) => of(ParametersActions.getParametersFailure({ error })))
        )
      )
    )
  );

  // GET Success and Failure Effects
  getParametersSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.getParametersSuccess),
      tap(() => { })
    ), { dispatch: false }
  );

  getParametersFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.getParametersFailure),
      tap((action) => this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to load parameters' }))
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  // Set Parameters Effect
  setParameters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setParameters),
      mergeMap(({ parameters }) =>
        this.http.post<SeguridadParameterModel[]>(`${this.apiUrl}/auth/set-parameters`, parameters, { withCredentials: true }).pipe(
          map((updatedParameters) => ParametersActions.setParametersSuccess({ parameters: updatedParameters ?? parameters })),
          catchError((error) => of(ParametersActions.setParametersFailure({ error })))
        )
      )
    )
  );

  // SET Parameters
  setParametersSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setParametersSuccess),
      tap(() => this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Parameters set' }))
    ), { dispatch: false }
  );

  setParametersFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setParametersFailure),
      tap((action) => this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to set parameters' }))
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  // Set Parameter Effect
  setParameter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setParameter),
      mergeMap(({ parameter, showMessage }) =>
        this.http.post<SeguridadParameterModel>(`${this.apiUrl}/auth/set-parameter`, parameter, { withCredentials: true }).pipe(
          map((updatedParameter) => ParametersActions.setParameterSuccess({ parameter: updatedParameter ?? parameter, showMessage })),
          catchError((error) => of(ParametersActions.setParameterFailure({ error })))
        )
      )
    )
  );

  // SET Parameters
  setParameterSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setParameterSuccess),
      tap(({ showMessage }) => {
        if (showMessage) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Parameter set' });
        }
      })
    ), { dispatch: false }
  );

  setParameterFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setParameterFailure),
      tap((action) => this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to set parameter' }))
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  // Set Parameter Effect
  setDefaultParameter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setDefaultParameter),
      mergeMap(({ parameter, showMessage }) =>
        this.http.post<SeguridadParameterModel>(`${this.apiUrl}/auth/set-default-parameter`, parameter, { withCredentials: true }).pipe(
          map((updatedParameter) => ParametersActions.setDefaultParameterSuccess({ parameter: updatedParameter ?? parameter, showMessage })),
          catchError((error) => of(ParametersActions.setDefaultParameterFailure({ error })))
        )
      )
    )
  );

  // SET Parameters
  setDefaultParameterSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setDefaultParameterSuccess),
      tap(({ showMessage }) => {
        if (showMessage) {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Default parameter set' });
        }
      })
    ), { dispatch: false }
  );

  setDefaultParameterFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ParametersActions.setDefaultParameterFailure),
      tap((action) => this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to set default parameter' }))
    ), { dispatch: false }
  );
}

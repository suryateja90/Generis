// src/app/reporting/store/effects/reporting.effects.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import * as ReportingActions from './reporting.actions';

import { ConfigService } from 'src/app/services/config.service';
import { ReportingReportModel } from 'src/shared/models/reporting-report.model';
import { SeguridadParameterModel } from 'src/shared/models/seguridad-parameter.model';
import { setParameter } from '../parameters/parameters.actions';

@Injectable()
export class ReportingEffects {

  private get apiUrl(): string {
    return this.configService.getApiUrl();  // Use dynamic API URL from ConfigService
  }

  // -----------------------------------------------------------------
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store,
    private messageService: MessageService,
    private configService: ConfigService,
  ) {
  }

  private setSelectedReportId(reportId: number) {
    this.store.dispatch(ReportingActions.setSelectedReportId({ reportId }));
  }

  private appendSuccessMessage(detail: string) {
    this.store.dispatch(ReportingActions.appendMessage({ message: { severity: 'success', summary: 'Success', detail } }));
  }

  private appendErrorMessage(detail: string) {
    this.store.dispatch(ReportingActions.appendMessage({ message: { severity: 'error', summary: 'Error', detail } }));
  }

  // ----------------------------------------------------------------------------------------------------------------------------
  loadReports$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReports),
      mergeMap(() =>
        this.http.get<ReportingReportModel[]>(`${this.apiUrl}/reports`)
          .pipe(
            map(reports => ReportingActions.loadReportsSuccess({ reports })),
            catchError(error => of(ReportingActions.loadReportsFailure({ error })))
          )
      )
    )
  );


  loadReportsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReportsSuccess),
      tap(action => {
        // Optionally show a success message
        this.appendSuccessMessage(`The report list of ${action.reports.length} items fetched.`);
      })
    ), { dispatch: false }
  );


  loadReportsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReportsFailure),
      tap(action => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to load reports' });
        this.appendErrorMessage(action.error.error.message || 'Unable to fetch the report list.');
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  createReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.createReport),
      mergeMap(action =>
        this.http.post<ReportingReportModel>(`${this.apiUrl}/reports`, action.reportDto)
          .pipe(
            map(report => ReportingActions.createReportSuccess({ report, execute: action.execute })),
            catchError(error => of(ReportingActions.createReportFailure({ error })))
          )
      )
    )
  );


  createReportSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.createReportSuccess),
      tap(action => {
        if (action.execute) {
          this.store.dispatch(ReportingActions.loadReportData({ reportId: action.report.id }));
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report created successfully' });
        this.appendSuccessMessage(`The '${action.report.name}' report item data created.`);
        this.setSelectedReportId(action.report.id);
      })
    ), { dispatch: false }
  );


  createReportFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.createReportFailure),
      tap(action => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to create report' });
        this.appendErrorMessage(`Unable to create the report.`);
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  updateReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.updateReport),
      mergeMap(action =>
        this.http.put<ReportingReportModel>(`${this.apiUrl}/reports/${action.reportDto.id}`, action.reportDto)
          .pipe(
            map(report => ReportingActions.updateReportSuccess({ report, execute: action.execute })),
            catchError(error => of(ReportingActions.updateReportFailure({ reportId: action.reportDto.id, error })))
          )
      )
    )
  );


  updateReportSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.updateReportSuccess),
      tap(action => {
        if (action.execute) {
          this.store.dispatch(ReportingActions.loadReportData({ reportId: action.report.id }));
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report updated successfully' });
        this.appendSuccessMessage(`The '${action.report.name}' report item data updated.`);
        this.setSelectedReportId(action.report.id);
      })
    ), { dispatch: false }
  );


  updateReportFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.updateReportFailure),
      tap(action => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to update report' });
        this.appendErrorMessage(`Unable to update the report. [id: ${action.reportId}]`);
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  deleteReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.deleteReport),
      mergeMap(action =>
        this.http.delete(`${this.apiUrl}/reports/${action.reportId}`)
          .pipe(
            map(() => ReportingActions.deleteReportSuccess({ reportId: action.reportId })),
            catchError(error => of(ReportingActions.deleteReportFailure({ reportId: action.reportId, error })))
          )
      )
    )
  );


  deleteReportSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.deleteReportSuccess),
      tap(action => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Report deleted successfully' });
        this.appendSuccessMessage(`The '${action.reportId}' report item data deleted.`);
        this.setSelectedReportId(null);
      })
    ), { dispatch: false }
  );


  deleteReportFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.deleteReportFailure),
      tap(action => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to delete report' });
        this.appendErrorMessage(`Unable to delete the report. [id: ${action.reportId}]`);
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------

  initializeReporting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.initializeReportingState),
      // Perform any necessary async operations here
      map(() => ReportingActions.initializeReportingStateSuccess())
    )
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  loadReportDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReportDetail),
      mergeMap(action =>
        (
          action.reportId
            ? this.http.get<ReportingReportModel>(`${this.apiUrl}/reports/${action.reportId}`)
            : of(null)
        ).pipe(
          map(report => ReportingActions.loadReportDetailSuccess({ reportId: action.reportId, report: report })),
          catchError(error => of(ReportingActions.loadReportDetailFailure({ reportId: action.reportId, error })))
        )
      )
    )
  );


  loadReportDetailSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReportDetailSuccess),
      tap(action => {
        // Optionally show a success message
        if (action.report) {
          this.appendSuccessMessage(`The '${action.report.name}' report detail retrieved.`);
        }
      })
    ), { dispatch: false }
  );


  loadReportDetailFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReportDetailFailure),
      tap(action => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to load report detail' });
        this.appendErrorMessage(`Unable to load the report detail. [id: ${action.reportId}]`);
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  loadReportData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReportData),
      mergeMap(action =>
        (
          action.reportId
            ? this.http.get<any>(`${this.apiUrl}/reports/execute/${action.reportId}`)
            : of(null)
        ).pipe(
          map(items => ReportingActions.loadReportDataSuccess({ reportId: action.reportId, items })),
          catchError(error => of(ReportingActions.loadReportDataFailure({ reportId: action.reportId, error })))
        )
      )
    )
  );


  loadReportDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReportDataSuccess),
      tap(action => {
        // Optionally show a success message
        this.appendSuccessMessage(`The report data retrieved. [id: ${action.reportId}, records: ${action.items?.length | 0}]`);
      })
    ), { dispatch: false }
  );


  loadReportDataFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.loadReportDataFailure),
      tap(action => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: action.error.error.message || 'Failed to load report data' });
        this.appendErrorMessage(`Unable to load the report data. [id: ${action.reportId}]`);
      })
    ), { dispatch: false }
  );

  // ----------------------------------------------------------------------------------------------------------------------------
  setSelectedReportId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.setSelectedReportId),
      tap(action => {
        const parameterData: SeguridadParameterModel = {
          application: 'REPORTING',
          parameter: 'selectedReportKey',
          value: (action.reportId ?? 0).toString(),
        };
        this.store.dispatch(setParameter({ parameter: parameterData }));
      })
    ), { dispatch: false }
  );


}

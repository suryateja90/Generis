// src/app/reporting/store/actions/reporting.actions.ts
// Create actions to handle reporting processes.

import { createAction, props } from '@ngrx/store';
import { Message } from 'primeng/api';

import { ReportingReportModel } from 'src/shared/models/reporting-report.model';

// --------------------------------------------------------------------------------------------------
export const initializeReportingState = createAction('[Reporting] Initialize State');
export const initializeReportingStateSuccess = createAction('[Reporting] Initialize Reporting State Success');
export const initializeReportingStateFailure = createAction('[Reporting] Initialize Reporting State Failure', props<{ error: any }>());

// --------------------------------------------------------------------------------------------------
export const loadReports = createAction('[Reporting] Load Reports');

export const loadReportsSuccess = createAction(
  '[Reporting] Load Reports Success',
  props<{ reports: ReportingReportModel[] }>()
);

export const loadReportsFailure = createAction(
  '[Reporting] Load Reports Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const createReport = createAction(
  '[Reporting] Create Report',
  props<{ reportDto: ReportingReportModel, execute: boolean }>()
);

export const createReportSuccess = createAction(
  '[Reporting] Create Report Success',
  props<{ report: ReportingReportModel, execute: boolean }>()
);

export const createReportFailure = createAction(
  '[Reporting] Create Report Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const updateReport = createAction(
  '[Reporting] Update Report',
  props<{ reportDto: ReportingReportModel, execute: boolean }>()
);

export const updateReportSuccess = createAction(
  '[Reporting] Update Report Success',
  props<{ report: ReportingReportModel, execute: boolean }>()
);

export const updateReportFailure = createAction(
  '[Reporting] Update Report Failure',
  props<{ reportId: number, error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const deleteReport = createAction(
  '[Reporting] Delete Report',
  props<{ reportId: number }>()
);

export const deleteReportSuccess = createAction(
  '[Reporting] Delete Report Success',
  props<{ reportId: number }>()
);

export const deleteReportFailure = createAction(
  '[Reporting] Delete Report Failure',
  props<{ reportId: number, error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const loadReportDetail = createAction(
  '[Reporting] Load Report Detail',
  props<{ reportId: number }>()
);

export const loadReportDetailSuccess = createAction(
  '[Reporting] Load Report Detail Success',
  props<{ reportId: number, report: ReportingReportModel }>()
);

export const loadReportDetailFailure = createAction(
  '[Reporting] Load Report Detail Failure',
  props<{ reportId: number, error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const loadReportData = createAction(
  '[Reporting] Load Report Data',
  props<{ reportId: number }>()
);

export const loadReportDataSuccess = createAction(
  '[Reporting] Load Report Data Success',
  props<{ reportId: number, items: unknown[] }>()
);

export const loadReportDataFailure = createAction(
  '[Reporting] Load Report Data Failure',
  props<{ reportId: number, error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const updateReportDataItems = createAction(
  '[Reporting] Update Report Data Items',
  props<{ reportId: number, dataKey: string, dataKeyId: string, item: unknown }>()
);

// --------------------------------------------------------------------------------------------------
export const setSelectedReportId = createAction(
  '[Reporting] Set Selected Report Id',
  props<{ reportId: number }>()
);

// --------------------------------------------------------------------------------------------------
export const appendMessage = createAction(
  '[Reporting] Append Message',
  props<{ message: Message }>()
);
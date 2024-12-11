// src/app/reporting/store/reducers/reporting.reducer.ts
// Define the reporting state and create a reducer to handle state changes.

import { createReducer, on } from '@ngrx/store';

import * as ReportingActions from './reporting.actions';

import { initialReportingState } from './reporting.state';

function updateItems(items: unknown[], dataKey: string, dataKeyId: string, item: unknown): unknown[] {
  return items?.map(existingItem => {
    if (existingItem[dataKey] === dataKeyId) {
      // Update existing item
      return item;
    } else {
      // Return existing item
      return existingItem;
    }
  }).concat(
    // Add new item if not found
    items.findIndex(i => i[dataKey] === dataKeyId) === -1 ? [item] : []
  );
}

export const reportingReducer = createReducer(
  initialReportingState,

  // Initialize Reporting State
  on(ReportingActions.initializeReportingState, state => ({ ...state, loading: false, error: null })),
  on(ReportingActions.initializeReportingStateSuccess, (state) => ({ ...state, loading: false, error: null, initialized: true })),
  on(ReportingActions.initializeReportingStateFailure, (state, { error }) => ({ ...state, error, loading: false, initialized: true })),

  // Load Reports
  on(ReportingActions.loadReports, state => ({ ...state, reports: { ...state.reports, list: null, loading: true } })),
  on(ReportingActions.loadReportsSuccess, (state, { reports }) => ({ ...state, reports: { ...state.reports, list: reports, loading: false } })),
  on(ReportingActions.loadReportsFailure, (state, { error }) => ({ ...state, error, reports: { ...state.reports, loading: false } })),

  // Create Report
  on(ReportingActions.createReport, state => ({ ...state, reports: { ...state.reports, loading: true } })),
  on(ReportingActions.createReportSuccess, (state, { report }) => ({ ...state, reports: { ...state.reports, list: [...state.reports.list, report], loading: false } })),
  on(ReportingActions.createReportFailure, (state, { error }) => ({ ...state, error, reports: { ...state.reports, loading: false } })),

  // Update Report
  on(ReportingActions.updateReport, state => ({ ...state, reports: { ...state.reports, loading: true } })),
  on(ReportingActions.updateReportSuccess, (state, { report }) => ({ ...state, reports: { ...state.reports, list: state.reports.list.map(item => item.id === report.id ? report : item), loading: false } })),
  on(ReportingActions.updateReportFailure, (state, { error }) => ({ ...state, error, reports: { ...state.reports, loading: false } })),

  // Delete Report
  on(ReportingActions.deleteReport, state => ({ ...state, reports: { ...state.reports, loading: true } })),
  on(ReportingActions.deleteReportSuccess, (state, { reportId }) => ({ ...state, reports: { ...state.reports, list: state.reports.list.filter(r => r.id !== reportId), loading: false } })),
  on(ReportingActions.deleteReportFailure, (state, { error }) => ({ ...state, error, reports: { ...state.reports, loading: false } })),

  // Load Report Detail Report
  on(ReportingActions.loadReportDetail, (state, { reportId }) => ({ ...state, reportDetails: { ...state.reportDetails, [reportId]: { ...state.reportDetails[reportId], report: null, loading: true } } })),
  on(ReportingActions.loadReportDetailSuccess, (state, { reportId, report }) => ({ ...state, reportDetails: { ...state.reportDetails, [reportId]: { ...state.reportDetails[reportId], report, loading: false } } })),
  on(ReportingActions.loadReportDetailFailure, (state, { reportId, error }) => ({ ...state, error, reportDetails: { ...state.reportDetails, [reportId]: { ...state.reportDetails[reportId], report: null, loading: false } } })),

  // Load Report Data Report
  on(ReportingActions.loadReportData, (state, { reportId }) => ({ ...state, reportData: { ...state.reportData, [reportId]: { ...state.reportData[reportId], items: null, loading: true } } })),
  on(ReportingActions.loadReportDataSuccess, (state, { reportId, items }) => ({ ...state, reportData: { ...state.reportData, [reportId]: { ...state.reportData[reportId], items, loading: false } } })),
  on(ReportingActions.loadReportDataFailure, (state, { reportId, error }) => ({ ...state, error, reportData: { ...state.reportData, [reportId]: { ...state.reportData[reportId], items: null, loading: false } } })),

  // Update Report Data Items
  on(ReportingActions.updateReportDataItems, (state, { reportId, dataKey, dataKeyId, item }) => ({ ...state, reportData: { ...state.reportData, [reportId]: { ...state.reportData[reportId], items: updateItems(state.reportData[reportId].items, dataKey, dataKeyId, item) } } })),

  // Set Selected Report
  // on(ReportingActions.setSelectedReportId, (state, { reportId }) => ({ ...state, layout: { ...state.layout, selectedReportId: reportId, date: new Date() } })),

  // Append Message
  on(ReportingActions.appendMessage, (state, { message }) => ({ ...state, messages: [...state.messages, { ...message, data: { date: new Date() } }] })),
);

// src/app/reporting/store/selectors/reporting.selectors.ts
// Create selectors to access specific pieces of the reporting state.

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ReportDataState, ReportDetailState, ReportingState, ReportsState } from './reporting.state';

export const selectReportingState = createFeatureSelector<ReportingState>('reporting');

export const selectReportingError = createSelector(
  selectReportingState,
  (state: ReportingState) => state.error
);

// export const selectLayout = createSelector(
//   selectReportingState,
//   (state: ReportingState) => state.layout
// );

// export const selectLayoutSelectedReportId = createSelector(
//   selectLayout,
//   (state: LayoutState) => state.selectedReportId
// );

export const selectReportingMessages = createSelector(
  selectReportingState,
  (state: ReportingState) => state.messages
);

export const selectReports = createSelector(
  selectReportingState,
  (state: ReportingState) => state.reports
);

export const selectReportsLoading = createSelector(
  selectReports,
  (state: ReportsState) => state.loading
);

export const selectReportsList = createSelector(
  selectReports,
  (state: ReportsState) => state.list
);

export const selectReportDetail = (reportId: number) => createSelector(
  selectReportingState,
  (state: ReportingState) => state.reportDetails[reportId] ?? { report: null, loading: false }
);

export const selectReportDetailReport = (reportId: number) => createSelector(
  selectReportDetail(reportId), (state: ReportDetailState) => state.report
);

export const selectReportDetailLoading = (reportId: number) => createSelector(
  selectReportDetail(reportId), (state: ReportDetailState) => state.loading
);

export const selectReportData = (reportId: number) => createSelector(
  selectReportingState,
  (state: ReportingState) => state.reportData[reportId] ?? { data: null, loading: false }
);

export const selectReportDataLoading = (reportId: number) => createSelector(
  selectReportData(reportId),
  (state: ReportDataState) => state.loading
);

export const selectReportDataItems = (reportId: number) => createSelector(
  selectReportData(reportId),
  (state: ReportDataState) => state.items
);

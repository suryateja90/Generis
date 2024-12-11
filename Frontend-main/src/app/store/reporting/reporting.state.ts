// src/app/store/reporting/reporting.state.ts
// Each feature should have its own state interface:

import { Message } from "primeng/api";

import { ReportingReportModel } from "src/shared/models/reporting-report.model";

export interface ReportsState {
  loading: boolean;
  list: ReportingReportModel[];
}

export interface ReportDetailState {
  report: ReportingReportModel;
  loading: boolean;
}

export interface ReportDataState {
  items: unknown[];
  loading: boolean;
}

export interface ReportingState {
  reports: ReportsState;
  reportDetails: Record<number, ReportDetailState>;
  reportData: Record<number, ReportDataState>;
  error: any;
  messages: Message[]
}

export const initialReportingState: ReportingState = {
  reports: { list: null, loading: false },
  reportDetails: {},
  reportData: {},
  error: null,
  messages: [],
};
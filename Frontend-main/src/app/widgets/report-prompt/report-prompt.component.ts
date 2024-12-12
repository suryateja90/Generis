import { NgClass } from '@angular/common';
import { Component, computed, effect, ElementRef, input, signal, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { take } from 'rxjs';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { selectApplicationParameter } from 'src/app/store/parameters/parameters.selectors';
import { createReport, deleteReport, loadReportData, loadReportDetail, loadReports, setSelectedReportId, updateReport } from 'src/app/store/reporting/reporting.actions';
import { selectReportDetailLoading, selectReportDetailReport, selectReportsLoading } from 'src/app/store/reporting/reporting.selectors';
import { ReportingReportModel } from 'src/shared/models/reporting-report.model';

@Component({
  selector: 'app-report-prompt',
  templateUrl: './report-prompt.component.html',
  styleUrl: './report-prompt.component.scss',
  standalone: true,
  imports: [ProgressSpinnerModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, InputTextareaModule, ToolbarModule, ButtonModule, RippleModule, TooltipModule, NgClass,],
})
@RegisterWidget('app-report-prompt', PrimeIcons.SERVER)
export class ReportPromptComponent {
  parameters$ = input.required<any>({ alias: 'parameters' });

  private selectedReportKeyParam$ = this.store.selectSignal(selectApplicationParameter('REPORTING', 'selectedReportKey'));
  private selectedReportKey = computed(() => Number(this.selectedReportKeyParam$()));
  reportId: number;

  // aware the realm of rxjs uses the "$" as appendix to the observables, not a bad idea using them also for signals to know they are actually a reactive asset
  reportsLoading$ = this.store.selectSignal(selectReportsLoading);

  loading$ = signal<boolean>(false);

  reportForm = this.fb.group({
    id: [undefined],
    name: ['', Validators.required],
    database: ['', Validators.required],
    query: ['', Validators.required],
    security: ['.*', Validators.required],
  });

  private clone = false;
  private actionButtonRef$ = viewChild('actionButtonRef', { read: ElementRef });

  constructor(
    private fb: FormBuilder,
    private store: Store,
    public layoutService: LayoutService,
  ) {

    effect(() => {
      this.reportId = this.selectedReportKey();
      if (this.reportId) {
        this.store.dispatch(loadReportDetail({ reportId: this.reportId }));

        this.store.pipe(select(selectReportDetailLoading(this.reportId)))
          .subscribe((loading: boolean) => this.loading$.set(loading));

        this.store.pipe(select(selectReportDetailReport(this.reportId)))
          .subscribe((report: ReportingReportModel) => this.resetForm(report));
      }
      else if (!this.clone) {
        this.resetForm(undefined);
      }

    }, { allowSignalWrites: true });
  }

  onAdd() {
    this.store.dispatch(setSelectedReportId({ reportId: null }));
    this.resetForm(undefined);
  }

  onSaveAs() {
    let report: ReportingReportModel;
    this.store.select(selectReportDetailReport(this.reportId)).pipe(take(1)).subscribe(rep => report = rep);
    this.store.dispatch(setSelectedReportId({ reportId: null }));
    this.resetForm(report, true);
  }

  onSave(execute = false) {
    if (this.reportForm.valid) {
      const report = this.reportForm.value as ReportingReportModel;
      if (report.id) {
        this.store.dispatch(updateReport({ reportDto: report, execute }));
      } else {
        this.store.dispatch(createReport({ reportDto: report, execute }));
      }
    }
  }

  onDelete() {
    this.store.dispatch(deleteReport({ reportId: this.reportId }));
  }

  onRefresh() {
    this.store.dispatch(loadReports());
    this.store.dispatch(loadReportDetail({ reportId: this.reportId }));
    this.store.dispatch(loadReportData({ reportId: this.reportId }));
  }

  onActionCtrlEnter = () => {
    if (!this.reportsLoading$()) {
      this.actionButtonRef$()?.nativeElement.click();
    }
  }

  onActionClick() {
    this.onSave(true);
  }

  private resetForm(report: ReportingReportModel, clone = false) {
    this.clone = clone;
    let { id, ...otherFields } = report ?? { name: '', database: '', query: '', security: '.*' };
    if (clone) { id = undefined; }
    this.reportForm.markAsPristine();
    this.reportForm.patchValue({ ...otherFields, id });
  }
}

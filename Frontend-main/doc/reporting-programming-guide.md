Here's how you can set up your **Reporting** component using Angular 18 and NgRX without modules.

---

## Steps to Set Up the Reporting Feature

### 1. **Configure NgRx Store and ReportingEffects Effects in `main.ts`**

Since you're using standalone components, configure the NgRx Store and Effects during the bootstrap process.

```typescript
// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideStore } from '@ngrx/store';
import { authReducer } from './app/auth/store/auth.reducer';
import { reportingReducer } from './app/reporting/store/reporting.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './app/auth/store/auth.effects';
import { ReportingEffects } from './app/reporting/store/reporting.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEntityData } from '@ngrx/data';
import { entityConfig } from './app/entity-metadata';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideStore({
      auth: authReducer,
      reporting: reportingReducer,
    }),
    provideEffects([AuthEffects, ReportingEffects]),
    provideEntityData(entityConfig),
    provideStoreDevtools(),
  ],
});
```

### 2. **Set Up NgRx Data for Report Catalog**

#### a. **Define Entity Metadata**

```typescript
// src/app/entity-metadata.ts

import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  ReportingReport: {},
};

export const entityConfig = {
  entityMetadata,
};
```

#### b. **Create Report Interface**

```typescript
// src/shared/models/reporting-report.model.ts <- watch out as there is already a reporting-report model in the shared repository/directory

export interface ReportingReport {
  id: number;
  name: string;
  database: string;
  query: string;
  // Additional parameters when needed
}
```

#### c. **Use `EntityCollectionService` in Components**

```typescript
// src/app/report-list/report-list.component.ts

import { Component } from '@angular/core';
import { EntityCollectionServiceFactory } from '@ngrx/data';
import { ReportingReport } from '../shared/models/reporting-report.model';
import { NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  standalone: true,
  imports: [NgFor, AsyncPipe],
})
export class ReportListComponent {
  reports$ = this.reportService.entities$;
  private reportService = this.serviceFactory.create<ReportingReport>('ReportingReport');

  constructor(private serviceFactory: EntityCollectionServiceFactory) {
    this.reportService.getAll();
  }

  deleteReport(id: number) {
    this.reportService.delete(id);
  }

  // Methods for create/update
}
```

### 3. **Implement Custom NgRx Logic for ReportingReport Execution**

#### a. **Define Actions**

```typescript
// src/app/reporting/store/reporting.actions.ts

import { createAction, props } from '@ngrx/store';

export const executeReport = createAction(
  '[Reporting] Execute Report',
  props<{ reportId: number }>()
);

export const executeReportSuccess = createAction(
  '[Reporting] Execute Report Success',
  props<{ data: any }>()
);

export const executeReportFailure = createAction(
  '[Reporting] Execute Report Failure',
  props<{ error: any }>()
);
```

#### b. **Create Reducer**

```typescript
// src/app/reporting/store/reporting.reducer.ts

import { createReducer, on } from '@ngrx/store';
import * as ReportingActions from './reporting.actions';

export interface ReportingState {
  data: any;
  loading: boolean;
  error: any;
}

export const initialState: ReportingState = {
  data: null,
  loading: false,
  error: null,
};

export const reportingReducer = createReducer(
  initialState,
  on(ReportingActions.executeReport, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ReportingActions.executeReportSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
  })),
  on(ReportingActions.executeReportFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
```

#### c. **Set Up Effects**

```typescript
// src/app/reporting/store/reporting.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ReportingActions from './reporting.actions';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { ReportingService } from '../services/reporting.service';
import { of } from 'rxjs';

@Injectable()
export class ReportingEffects {
  executeReport$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportingActions.executeReport),
      mergeMap(({ reportId }) =>
        this.reportingService.executeReport(reportId).pipe(
          map((data) =>
            ReportingActions.executeReportSuccess({ data })
          ),
          catchError((error) =>
            of(ReportingActions.executeReportFailure({ error }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private reportingService: ReportingService
  ) {}
}
```

#### d. **Create Reporting Service**

```typescript
// src/app/reporting/services/reporting.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ReportingService {
  private apiUrl = 'https://your-api-url.com/api';

  constructor(private http: HttpClient) {}

  executeReport(reportId: number) {
    return this.http.get<any>(`${this.apiUrl}/reports/execute/${reportId}`);
  }
}
```

#### e. **Create Selectors**

```typescript
// src/app/reporting/store/reporting.selectors.ts

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ReportingState } from './reporting.reducer';

export const selectReportingState = createFeatureSelector<ReportingState>('reporting');

export const selectReportData = createSelector(
  selectReportingState,
  (state) => state.data
);

export const selectReportingLoading = createSelector(
  selectReportingState,
  (state) => state.loading
);

export const selectReportingError = createSelector(
  selectReportingState,
  (state) => state.error
);
```

#### f. **Use in Component**

```typescript
// src/app/reporting/report-execution.component.ts

import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as ReportingActions from './store/reporting.actions';
import * as ReportingSelectors from './store/reporting.selectors';
import { Observable } from 'rxjs';
import { NgFor, AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-report-execution',
  templateUrl: './report-execution.component.html',
  standalone: true,
  imports: [NgFor, AsyncPipe, NgIf],
})
export class ReportExecutionComponent {
  data$: Observable<any> = this.store.select(ReportingSelectors.selectReportData);
  loading$: Observable<boolean> = this.store.select(ReportingSelectors.selectReportingLoading);
  error$: Observable<any> = this.store.select(ReportingSelectors.selectReportingError);

  constructor(private store: Store) {}

  executeReport(reportId: number) {
    this.store.dispatch(ReportingActions.executeReport({ reportId }));
  }

  getHeaders(data: any[]): string[] {
    return data.length > 0 ? Object.keys(data[0]) : [];
  }
}
```

#### g. **Dynamic Data Rendering**

```html
<!-- src/app/reporting/report-execution.component.html -->

<div *ngIf="loading$ | async">Loading...</div>
<div *ngIf="error$ | async as error">Error: {{ error }}</div>

<table *ngIf="data$ | async as data">
  <thead>
    <tr>
      <th *ngFor="let header of getHeaders(data)">
        {{ header }}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let row of data">
      <td *ngFor="let header of getHeaders(data)">
        {{ row[header] }}
      </td>
    </tr>
  </tbody>
</table>
```

### 4. **Routing Configuration**

```typescript
// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportExecutionComponent } from './reporting/report-execution.component';

export const routes: Routes = [
  { path: '', component: ReportListComponent },
  { path: 'report/:id', component: ReportExecutionComponent },
];
```

---

This setup avoids the use of modules and aligns with Angular 18's standalone component architecture. It provides a concise way to establish both the report catalog management using NgRx Data and the dynamic report execution with custom NgRx logic.
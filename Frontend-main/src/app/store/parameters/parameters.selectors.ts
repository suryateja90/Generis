// src/app/store/paraameters/paraameters.selectors.ts
// Create selectors to access specific pieces of the Parametersentication state.

import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ParametersState } from './parameters.state';

export const selectParametersState = createFeatureSelector<ParametersState>('parameters');

export const selectParametersError = createSelector(
  selectParametersState,
  (state: ParametersState) => state.error
);

export const selectParametersLoading = createSelector(
  selectParametersState,
  (state: ParametersState) => state.loading
);

// New Selector for Parameters
export const selectParameters = createSelector(
  selectParametersState,
  (state: ParametersState) => state.parameters
);

export const selectApplicationParameters = (application: string) => createSelector(
  selectParameters,
  (parameters: Record<string, Record<string, string>>) => parameters?.[application]
);

export const selectApplicationParameter = (application: string, parameter: string) => createSelector(
  selectApplicationParameters(application),
  (applicationParameters: Record<string, string>) => applicationParameters?.[parameter]
);

// upate parameters error
export const selectUpdateParametersError = createSelector(
  selectParametersState,
  (state: ParametersState) => state.error
);

// update parameters loading
export const selectUpdateParametersLoading = createSelector(
  selectParametersState,
  (state: ParametersState) => state.loading
);

// UI
export const selectDragFeature = createFeatureSelector<ParametersState>('parameters');
export const selectIsDraggable = createSelector(selectDragFeature, (state) => state.isDraggable);

// Selector to get the `dynamicLayoutAction` value
export const selectDynamicLayoutAction = createSelector(
  selectParametersState,
  (state: ParametersState) => state.dynamicLayoutAction?.action
);

// Selector to get the `dynamicLayoutAction.detail` value
export const selectDynamicLayoutActionDetail = createSelector(
  selectParametersState,
  (state: ParametersState) => state.dynamicLayoutAction?.detail
);

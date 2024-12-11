// src/app/store/parameters/parameters.reducer.ts
// Define the Parametersentication state and create a reducer to handle state changes.

import { createReducer, on } from '@ngrx/store';

import * as ParametersActions from './parameters.actions';

import { SeguridadParameterModel } from 'src/shared/models/seguridad-parameter.model';
import { initialParametersState } from './parameters.state';

// --------------------------------------------------------------------------------------------------------
// Attempt to modify the convertToNestedRecords function to preserve references when data hasn't changed. 
// This way selectors relying on reference equality won't signal changes when the data is the same.
function convertToNestedRecords(stateParams: Record<string, Record<string, string>>, parameters: SeguridadParameterModel[]): Record<string, Record<string, string>> {
  let hasChanges = false;
  const newStateParams = { ...stateParams };

  parameters?.forEach((param) => {
    if (param) {
      const { application, parameter, value } = param;
      const currentAppParams = newStateParams?.[application] ?? {};
      const currentValue = currentAppParams[parameter];

      // only create new objects when the actual data changes, preserving references otherwise.
      if (currentValue !== value) {
        hasChanges = true;
        const newAppParams = { ...currentAppParams };
        if (value !== null && value !== undefined) {
          newAppParams[parameter] = value;
        } else {
          delete newAppParams[parameter];
        }
        newStateParams[application] = newAppParams;
      }
    }
  });

  return hasChanges ? newStateParams : stateParams;
}


// --------------------------------------------------------------------------------------------------------
export const parametersReducer = createReducer(
  initialParametersState,

  // Load Parameters
  // in this case we affect the loading state as we want to show a loading progress bar or something similar  
  on(ParametersActions.getParameters, state => ({ ...state, loading: true })),
  on(ParametersActions.getParametersSuccess, (state, { parameters }) => ({ ...state, parameters: convertToNestedRecords(state.parameters, parameters), loading: false })),
  on(ParametersActions.getParametersFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Update Parameters
  // in this case we affect the loading state as we want to show a loading progress bar or something similar
  // updates applied immediately after a parameter is saved, without needing to reload from the backend
  on(ParametersActions.setParameters, state => ({ ...state, loading: true })),
  on(ParametersActions.setParametersSuccess, (state, { parameters }) => ({ ...state, parameters: convertToNestedRecords(state.parameters, parameters), loading: false })),
  on(ParametersActions.setParametersFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Update Parameter
  // in this case we affect the loading state as we want to show a loading progress bar or something similar
  // updates applied immediately after a parameter is saved, without needing to reload from the backend
  on(ParametersActions.setParameter, state => ({ ...state, loading: true })),
  on(ParametersActions.setParameterSuccess, (state, { parameter }) => ({ ...state, parameters: convertToNestedRecords(state.parameters, [parameter]), loading: false })),
  on(ParametersActions.setParameterFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // Update Default Parameter
  // in this case we affect the loading state as we want to show a loading progress bar or something similar
  // updates applied immediately after a parameter is saved, without needing to reload from the backend
  on(ParametersActions.setDefaultParameter, state => ({ ...state, loading: true })),
  on(ParametersActions.setDefaultParameterSuccess, (state, { parameter }) => ({ ...state, parameters: convertToNestedRecords(state.parameters, [parameter]), loading: false })),
  on(ParametersActions.setDefaultParameterFailure, (state, { error }) => ({ ...state, error, loading: false })),

  // DragState
  on(ParametersActions.setDragState, (state, { isDraggable }) => ({ ...state, isDraggable })),

  // Perform `dynamicLayoutAction` each time the action is dispatched
  on(ParametersActions.performDynamicLayoutAction, (state, { action }) => ({ ...state, dynamicLayoutAction: { action }, })),

);

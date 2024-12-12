// src/app/store/auth/auth.actions.ts
// Create actions to handle authentication processes.

import { createAction, props } from '@ngrx/store';

import { DynamicLayoutAction } from 'src/app/layout/dynamic-layout/dynamic-layout.model';
import { SeguridadParameterModel } from 'src/shared/models/seguridad-parameter.model';

// --------------------------------------------------------------------------------------------------
export const getParameters = createAction(
  '[Parameters] Load Parameters'
);

export const getParametersSuccess = createAction(
  '[Parameters] Load Parameters Success',
  props<{ parameters: SeguridadParameterModel[] }>()
);

export const getParametersFailure = createAction(
  '[Parameters] Load Parameters Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const setParameters = createAction(
  '[Parameters] Set Parameters',
  props<{ parameters: SeguridadParameterModel[] }>()
);
export const setParametersSuccess = createAction(
  '[Parameters] Set Parameters Success',
  props<{ parameters: SeguridadParameterModel[] }>()
);
export const setParametersFailure = createAction(
  '[Parameters] Set Parameters Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const setParameter = createAction(
  '[Parameters] Set Parameter',
  props<{ parameter: SeguridadParameterModel, showMessage?: boolean }>()
);
export const setParameterSuccess = createAction(
  '[Parameters] Set Parameter Success',
  props<{ parameter: SeguridadParameterModel, showMessage: boolean }>()
);
export const setParameterFailure = createAction(
  '[Parameters] Set Parameter Failure',
  props<{ error: any }>()
);

// --------------------------------------------------------------------------------------------------
export const setDefaultParameter = createAction(
  '[Parameters] Set Default Parameter',
  props<{ parameter: SeguridadParameterModel, showMessage?: boolean }>()
);
export const setDefaultParameterSuccess = createAction(
  '[Parameters] Set Default Parameter Success',
  props<{ parameter: SeguridadParameterModel, showMessage: boolean }>()
);
export const setDefaultParameterFailure = createAction(
  '[Parameters] Set Default Parameter Failure',
  props<{ error: any }>()
);


// --------------------------------------------------------------------------------------------------
export const setDragState = createAction(
  '[Grid] Set Drag State',
  props<{ isDraggable: boolean }>()
);

// --------------------------------------------------------------------------------------------------
export const performDynamicLayoutAction = createAction(
  '[Parameters] Perform Dynamic Layout Action',
  props<{ action: DynamicLayoutAction, detail?: unknown }>()
);
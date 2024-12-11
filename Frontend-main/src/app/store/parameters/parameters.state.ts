// src/app/store/parameters/parameters.state.ts
// Each feature should have its own state interface:

import { DynamicLayoutAction } from "src/app/layout/dynamic-layout/dynamic-layout.model";

export interface ParametersState {
  parameters: Record<string, Record<string, string>>;
  error: string | null;
  loading: boolean;
  isDraggable: boolean;
  dynamicLayoutAction: { action: DynamicLayoutAction };
};

export const initialParametersState: ParametersState = {
  parameters: null,
  error: null,
  loading: false,
  isDraggable: false,
  dynamicLayoutAction: null,
};

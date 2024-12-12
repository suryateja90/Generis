// src/app/dynamic-layout/dynamic-layout
import { ComponentDetail } from "./register-widget.decorator";

// here we store all component constructors by name
export const ComponentRegistry: Record<string, ComponentDetail> = {};

// base interface definition for widget layout and its parameters
export interface DynamicLayoutItem {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  parameters?: any;
};

export type DynamicLayoutAction = 'reset-layout' | 'add-widget';


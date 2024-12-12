// src/app/dynamic-layout/register-components.ts
import { Type } from "@angular/core";
import { ComponentRegistry } from "./dynamic-layout.model";

export interface ComponentDetail {
  type: Type<unknown>;
  icon?: string;
}

// this method is actually a decorator to take care of the widget registry
export function RegisterWidget(selector: string, icon?: string) {
  return function (constructor: Type<unknown>) {
    const componentDetail: ComponentDetail = { type: constructor, icon };
    ComponentRegistry[selector] = componentDetail;
    console.debug(`Registered widget: '${selector}' for '${componentDetail.type.name}'`);
  };
}
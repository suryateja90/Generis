// src/app/dynamic-layout/register-components.ts
import { Type } from "@angular/core";
import { ComponentRegistry } from "./dynamic-layout.model";

// this method is actually a decorator to take care of the widget registry
export function RegisterWidget(selector: string) {
  return function (constructor: Type<unknown>) {
    ComponentRegistry[selector] = constructor;
    console.debug(`Registered widget: '${selector}' for '${constructor.name}'`);
  };
}
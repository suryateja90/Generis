// src/app/models/app-route
import { Route } from '@angular/router';

// base interface definition for app route data
export interface AppRouteData {
  /**
   * Determines if the adjust layout options should be visible for the route.
   * This setting is only applicable to routes that utilize dynamic layout.
   */
  // showAdjustLayoutOptions?: boolean;

  [key: string]: any;
}

// base interface definition for app route with data options
export interface AppRoute extends Route {
  data?: AppRouteData;
  children?: AppRoute[];
}
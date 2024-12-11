// src/environments/environment.ts (Development)

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  index: 0,
  apiUrls: ['http://workstation:3000', 'https://coatl.generis.mx/tradedesk', 'https://teotl.generis.mx/tradedesk',], // NestJS dev URLs
  socketServerUrls: ['ws://workstation:3000', 'wss://coatl.generis.mx/tradedesk', 'wss://teotl.generis.mx/tradedesk',], // Socket dev URLs
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

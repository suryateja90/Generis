# Project Name

Generis Electronic Markets

---

## Table of Contents
1. [Objective](#Objective)
2. [Technology Stack](#technology-stack)
3. [Versions Used](#versions-used)
4. [Modules Structure](#module-structure)
5. [Features](#features)


---

## Objective
The Generis Electronic Markets (GEM) DeskTrade application promises to offer traders, investors, and institutions a comprehensive platform for trading financial assets on a global scale. It utilizes an easy-to-use PrimeNG interface to provide extensive trading capabilities, real-time monitoring, and customized dashboards. The platform ensures accessibility by providing browser-based access for easy trading and portfolio management.

---



## Technology Stack
UI features using PrimeNG, FullCalendar, and Chart.js.
State management handled by NgRx.
Signals are Used for state management and reactivity.
Advanced Testing setup with Jasmine, Karma, and Puppetee

---

## Versions used
Angular Framework:
•	@angular/animations: ^18.2.11
•	@angular/cdk: ^18.2.14
•	@angular/common: ^18.2.11
•	@angular/compiler: ^18.2.11
•	@angular/core: ^18.2.11
•	@angular/forms: ^18.2.11
•	@angular/platform-browser: ^18.2.11
•	@angular/platform-browser-dynamic: ^18.2.11
•	@angular/router: ^18.2.11
State Management:
•	@ngrx/effects: ^18.1.1
•	@ngrx/entity: ^18.1.1
•	@ngrx/router-store: ^18.1.1
•	@ngrx/store: ^18.1.1
•	@ngrx/store-devtools: ^18.1.1
DevTools and Testing:
•	@angular-devkit/build-angular: ^18.2.11
•	@angular/cli: ^18.2.11
•	@angular/compiler-cli: ^18.2.11
•	@ngrx/eslint-plugin: ^18.1.1


---

## Module Structure
•  auth: Likely handles authentication-related functionality such as login,      signup, and token management.
•	dashboards: Contains components and services related to dashboard views.
•	layout: Holds the layout components like headers, footers, and navigation bars.
•	models: Defines data models used across the application, providing strong typing and structure for data.
•	notfound: Handles routes or components for "404 - Not Found" pages.
•	services: Includes shared services that provide business logic or API interaction for different parts of the app.
•	shared: Contain reusable components, directives, or pipes shared across the application.
•	store: Represents the state management structure, possibly with NgRx or similar state management tools.
•	utils: A utility folder that could include helper functions or constants used across the app.
•	widgets: Contain small, reusable components or UI elements that can be used throughout the app.

---

## Features
List the key features of the project:

Login Feature primarily relies on the access token received after a successful login API call. This access token is included in the request headers and is mainly used to refresh the token after a specified duration, which is determined by the expiration time embedded within the access token itself.

App Layout: AppLayoutComponent provides the actual layout skelton for this Application once the user is successfully logged in.The application layout serves as the main navigation structure, featuring a fixed footer, topbar, and sidebar. The dynamic body content is rendered through the RouterOutlet, enabling seamless navigation within the application.

Sidebar Navigation:  All menu items are housed within the sidebar, providing easy access to various features. Navigation routes are dynamically determined based on the selected menu item.

Dashboard serves as a centralized interface in the Angular app, providing users with an overview of key metrics, actionable insights, and quick access to essential features through interactive widgets and customizable components.

Lazy Loading: Enabled for auth, uikit, utilities, and all other feature modules.

Dynamic Redirect: Utilizes sessionStorage for remembering the last route.

Fallback: Handles invalid routes with a wildcard redirect to a custom NotfoundComponent.

Component-based Loading: Most routes load individual components dynamically using loadComponent.


ConfigService is the service that provides api urls again which are configured in environment file and provides websocket urls 

Widgets are used on layouts that is  having reusable component such as DataTableComponent

NGRX is used for state management, and the store folder is organized into separate modules for each feature of the application, such as auth, profile, and parameters.

Web Socket functionality is used in  the widgets in order to receive the seamless messages/notifications

MessageService of priming is thoroughly used across the application to inform/alert the user with appropriate messages.

---


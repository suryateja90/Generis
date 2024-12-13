# Project Name

Generis Electronic Markets

---

## Table of Contents
1. [Platform Overview](#Platform-Overview)
2. [Technology Stack](#technology-stack)
3. [Versions Used](#versions-used)
4. [Modules Structure](#module-structure)
5. [Features](#features)


---

## Platform Overview
A comprehensive trading platform, Generis Electronic Markets (GEM) DeskTrade allows traders, investors, and institutions to trade a variety of financial assets on international markets, such as stocks, currencies, and cryptocurrencies. GEM TradeDesk provides configurable dashboards, real-time monitoring, and sophisticated trading capabilities.

 as functional units, and dozens of widgets. It is run on the user-friendly PrimeNG interface, which offers instant access to tools for trading, order management, and portfolio management. It guarantees users' flexibility and accessibility by supporting browser-based access.

 The developer can create individual dashboards tailored to specific functionality needs, each populated with a variety of widgets that offer distinct functionalities such as real-time market data, database data management, and advanced charting tools.
 The end users relies on a modular design that allows to drag and drop widgets, resize them, and configure their settings to suit their trading strategies. This flexibility ensures workspace optimization for efficiency and effectiveness


---



## Technology Stack
The application uses PrimeNG for UI features, FullCalendar for event management, and Chart.js for data visualization.
State management is primarily handled by NgRx, but in addition to this, Angular Signals are leveraged for more efficient and intuitive component interaction. Signals provide a simpler and more maintainable approach to managing state and data flow, reducing the cognitive load typically associated with RxJS’s complex reactive paradigms. This native Angular feature ensures seamless compatibility, enhances performance, and reduces bundle size, offering a lightweight footprint while improving overall maintainability.
Advanced testing is set up with Jasmine, Karma, and Puppeteer, ensuring high-quality code and functionality.

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

Widgets: The application utilizes widgets as modular, reusable components within the layout. These widgets provide interactive and dynamic functionalities, offering users real-time data insights and seamless user experiences. The integration of web socket functionality within these widgets enables instant message and notification updates, ensuring that the user interface reflects the most current data without requiring page refreshes. This dynamic, component-based structure ensures that the application is not only responsive but also highly maintainable, with each widget handling its own specific functionality and state.

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


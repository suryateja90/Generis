import { Component, isDevMode, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';

import { performDynamicLayoutAction } from '../store/parameters/parameters.actions';
import { AppMenuitemComponent } from './app.menuitem.component';
import { ComponentRegistry } from './dynamic-layout/dynamic-layout.model';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [AppMenuitemComponent]
})
export class AppMenuComponent implements OnInit {

    model: MenuItem[] = [];

    private isDevMode = isDevMode();

    constructor(
        private store: Store,
        public layoutService: LayoutService
    ) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                    { label: 'DeskTrade', icon: 'pi pi-fw pi-table', routerLink: ['/desktrade'] },
                    { label: 'ArbiTrade', icon: 'pi pi-fw pi-sort', routerLink: ['/arbitrade'] },
                    { label: 'Test', icon: 'pi pi-fw pi-eraser', routerLink: ['/test'] },
                    { label: 'Reporting', icon: 'pi pi-fw pi-file', routerLink: ['/reporting'] },
                    { label: 'Risk Manager', icon: 'pi pi-fw pi-filter', routerLink: ['/risk-manager'] },
                    { label: 'Portfolios', icon: 'pi pi-fw pi-briefcase', routerLink: ['/portfolio'] },
                    { label: 'AlgoTrade', icon: 'pi pi-fw pi-android', routerLink: ['/algotrade'] },
                    { label: 'LiquidTrade', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/liquidtrade'] },
                ]
            },
            {
                label: 'Marketplace',
                items: Object.keys(ComponentRegistry).map(name => ({
                    label: name, icon: ComponentRegistry[name].icon ?? 'pi pi-fw pi-cog',
                    command: () => this.store.dispatch(performDynamicLayoutAction({ action: 'add-widget', detail: name }))
                }))
            },
            {
                label: 'Layout',
                visible: this.isDevMode,
                items: [
                    { label: 'Adjust Layout', icon: 'pi pi-fw pi-objects-column', routerLink: ['/dashboard'] },
                    { label: 'Reset Layout', icon: 'pi pi-fw pi-table', routerLink: ['/dashboard'] },
                    { label: 'Add Widget', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/dashboard'] },
                ]
            },
            {
                label: 'Demo Components',
                visible: this.isDevMode,
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-chart-pie', routerLink: ['/dashboard'] },
                    { label: 'Orders Ticket', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                    { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                    { label: 'Float Ticket', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                    { label: 'Risk Check', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                    { label: 'Route', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                    { label: 'Report', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                    { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                    { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                    { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                    { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                    { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'Prime Blocks',
                visible: this.isDevMode,
                items: [
                    { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
                ]
            },
            {
                label: 'Utilities',
                visible: this.isDevMode,
                items: [
                    { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                ]
            },
            {
                label: 'Generis Toolset',
                visible: this.isDevMode,
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Landing',
                        icon: 'pi pi-fw pi-globe',
                        routerLink: ['/landing']
                    },
                    {
                        label: 'Auth',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            {
                                label: 'Login',
                                icon: 'pi pi-fw pi-sign-in',
                                routerLink: ['/auth/login']
                            },
                            {
                                label: 'Error',
                                icon: 'pi pi-fw pi-times-circle',
                                routerLink: ['/auth/error']
                            },
                            {
                                label: 'Access Denied',
                                icon: 'pi pi-fw pi-lock',
                                routerLink: ['/auth/access']
                            },
                            {
                                label: 'Confirm Email',
                                icon: 'pi pi-fw pi-envelope',
                                routerLink: ['/auth/confirm-email']
                            },
                        ]
                    },
                    {
                        label: 'Crud',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/pages/crud']
                    },
                    {
                        label: 'Timeline',
                        icon: 'pi pi-fw pi-calendar',
                        routerLink: ['/pages/timeline']
                    },
                    // {
                    //     label: 'Not Found',
                    //     icon: 'pi pi-fw pi-exclamation-circle',
                    //     routerLink: ['/notfound']
                    // },
                    // {
                    //     label: 'Empty',
                    //     icon: 'pi pi-fw pi-circle-off',
                    //     routerLink: ['/pages/empty']
                    // },
                ]
            },
            {
                label: 'AI & LLM',
                visible: this.isDevMode,
                items: [
                    {
                        label: 'Vendors & Licences', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Prompts Setup', icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                ]
                            },
                        ]
                    }
                ]
            },
            {
                label: 'Get Started with Generis',
                visible: this.isDevMode,
                items: [
                    {
                        label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
                    },
                    {
                        label: 'Sample code', icon: 'pi pi-fw pi-search', url: 'https://github.com/primefaces/sakai-ng', target: '_blank'
                    }
                ]
            }
        ];
    }
}

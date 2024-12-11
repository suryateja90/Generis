import { NgClass } from '@angular/common';
import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppFooterComponent } from './app.footer.component';
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppTopBarComponent } from './app.topbar.component';
import { AppConfigComponent } from './config/app.config.component';
import { LayoutService } from "./service/app.layout.service";
import { AppUserprofileComponent } from "./userprofile/app.userprofile.component";

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
    standalone: true,
    imports: [NgClass, AppTopBarComponent, AppSidebarComponent, RouterOutlet, AppFooterComponent, AppConfigComponent, AppUserprofileComponent]
})
export class AppLayoutComponent implements OnDestroy {

    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    topbarMenuOutsideClickListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
                        || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if (!this.topbarMenuOutsideClickListener) {
                this.topbarMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
                        || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideTopbarMenu();
                    }
                });
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.layoutService.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
                this.hideTopbarMenu();
            });
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.layoutService.unblockBodyScroll();
    }

    hideTopbarMenu() {
        this.layoutService.state.topbarMenuVisible = false;
        if (this.topbarMenuOutsideClickListener) {
            this.topbarMenuOutsideClickListener();
            this.topbarMenuOutsideClickListener = null;
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config().colorScheme === 'light',
            'layout-theme-dark': this.layoutService.config().colorScheme === 'dark',
            'layout-overlay': this.layoutService.config().menuMode === 'overlay',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}

import { Injectable, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
    inputStyle: string;
    colorScheme: string;
    theme: string;
    ripple: boolean;
    menuMode: string;
    scale: number;
}

interface LayoutState {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    topbarMenuVisible: boolean;
    configSidebarVisible: boolean;
    userProfileSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutService {
    _bodyBlockedScroll = false;
    _config: AppConfig = {
        ripple: false,
        inputStyle: 'outlined',
        menuMode: 'static',
        colorScheme: 'dark',
        theme: 'mdc-dark-indigo',
        scale: 14,
    };

    config = signal<AppConfig>(this._config);

    state: LayoutState = {
        staticMenuDesktopInactive: false,
        overlayMenuActive: false,
        topbarMenuVisible: false,
        configSidebarVisible: false,
        userProfileSidebarVisible: false,
        staticMenuMobileActive: false,
        menuHoverActive: false,
    };

    private configUpdate = new Subject<AppConfig>();

    private overlayOpen = new Subject<any>();

    configUpdate$ = this.configUpdate.asObservable();

    overlayOpen$ = this.overlayOpen.asObservable();

    constructor() {
        const strAppConfig = localStorage.getItem('appConfig');
        if (strAppConfig) { this.config.set(JSON.parse(strAppConfig)); }
        const strStaticMenuDesktopInactive = localStorage.getItem('appConfig_staticMenuDesktopInactive');
        if (strStaticMenuDesktopInactive) { this.state.staticMenuDesktopInactive = JSON.parse(strStaticMenuDesktopInactive); }

        effect(() => {
            const config = this.config();
            if (this.updateStyle(config)) {
                this.changeTheme();
            }
            this.changeScale(config.scale);
            this.onConfigUpdate();
        });
    }

    updateStyle(config: AppConfig) {
        return (
            config.theme !== this._config.theme ||
            config.colorScheme !== this._config.colorScheme
        );
    }

    onMenuToggle() {
        if (this.isOverlay()) {
            this.state.overlayMenuActive = !this.state.overlayMenuActive;
            if (this.state.overlayMenuActive) {
                this.overlayOpen.next(null);
            }
        }

        if (this.isDesktop()) {
            this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
            localStorage.setItem('appConfig_staticMenuDesktopInactive', JSON.stringify(this.state.staticMenuDesktopInactive));
        } else {
            this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;
            if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            }
        }
    }

    showTopbarMenu() {
        this.state.topbarMenuVisible = !this.state.topbarMenuVisible;
        if (this.state.topbarMenuVisible) {
            this.overlayOpen.next(null);
        }
    }

    showUserProfileSidebar() {
        this.state.userProfileSidebarVisible = true;
    }

    showConfigSidebar() {
        this.state.configSidebarVisible = true;
    }

    isOverlay() {
        return this.config().menuMode === 'overlay';
    }

    isDesktop() {
        return window.innerWidth > 991;
    }

    isMobile() {
        return !this.isDesktop();
    }

    onConfigUpdate() {
        this._config = { ...this.config() };
        this.resetBodyClassList();
        localStorage.setItem('appConfig', JSON.stringify(this._config));
        this.configUpdate.next(this.config());
    }

    changeTheme() {
        const config = this.config();
        const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
        const themeLinkHref = themeLink.getAttribute('href')!;
        const newHref = themeLinkHref
            .split('/')
            .map((el) =>
                el == this._config.theme
                    ? (el = config.theme)
                    : el == `theme-${this._config.colorScheme}`
                        ? (el = `theme-${config.colorScheme}`)
                        : el
            )
            .join('/');

        this.replaceThemeLink(newHref);
    }
    replaceThemeLink(href: string) {
        const id = 'theme-css';
        let themeLink = <HTMLLinkElement>document.getElementById(id);
        const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

        cloneLinkElement.setAttribute('href', href);
        cloneLinkElement.setAttribute('id', id + '-clone');

        themeLink.parentNode!.insertBefore(
            cloneLinkElement,
            themeLink.nextSibling
        );
        cloneLinkElement.addEventListener('load', () => {
            themeLink.remove();
            cloneLinkElement.setAttribute('id', id);
        });
    }

    changeScale(value: number) {
        document.documentElement.style.fontSize = `${value}px`;
    }

    blockBodyScroll(): void {
        this._bodyBlockedScroll = true;
        this.resetBodyClassList();
    }

    unblockBodyScroll(): void {
        this._bodyBlockedScroll = false;
        this.resetBodyClassList();
    }

    appInit() {
        setTimeout(() => { document.querySelector('#splash').classList.toggle('hidden', true); }, 1000);
    }

    private resetBodyClassList() {
        document.body.classList.toggle('p-input-filled', this._config.inputStyle === 'filled');
        document.body.classList.toggle('p-ripple-disabled', !this._config.ripple);
        document.body.classList.toggle('blocked-scroll', this._bodyBlockedScroll);
    }
}

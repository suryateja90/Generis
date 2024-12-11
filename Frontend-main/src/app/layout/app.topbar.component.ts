import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { filter, startWith } from 'rxjs';

import { logout } from 'src/app/store/auth/auth.actions';
import { performDynamicLayoutAction, setDragState } from 'src/app/store/parameters/parameters.actions';
import { selectIsDraggable } from 'src/app/store/parameters/parameters.selectors';
import { socketConnect, socketDisconnect } from 'src/app/store/websocket/websocket.actions';
import { selectSocketConnected } from 'src/app/store/websocket/websocket.selectors';
import { ConfigService } from '../services/config.service';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    standalone: true,
    imports: [RouterLink, NgClass, TooltipModule, SplitButtonModule,],
    providers: [DatePipe] // Provide DatePipe here
})
export class AppTopBarComponent implements OnInit {

    adjustLayoutItems: MenuItem[] = [
        { label: 'Add new widget', command: () => { this.onAddNewWidget(); } },
        { label: 'Reset current layout', command: () => { this.onResetCurrentLayout(); } },
    ];

    // showAdjustLayoutOptions = false;
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    public connected$ = this.store.selectSignal(selectSocketConnected);
    public isDraggable$ = this.store.selectSignal(selectIsDraggable);

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor(public layoutService: LayoutService,
        private datePipe: DatePipe,
        private store: Store,
        private router: Router,
        private confirmationService: ConfirmationService,
        private configService: ConfigService,
    ) { }

    ngOnInit() {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                startWith(null),
                takeUntilDestroyed(this.destroyRef)
            ).subscribe(() => {
                // Reset draggable state when navigating to a new route.
                this.store.dispatch(setDragState({ isDraggable: false }));

                // // Determine if the layout adjustment options should be visible for the current route.
                // this.showAdjustLayoutOptions = checkRouterChildsData(
                //     this.router.routerState.root.snapshot,
                //     (data) => data.showAdjustLayoutOptions ?? false
                // );
            });
    }

    // ------------------------------------------------------------------------
    onConnect(): void {
        this.store.dispatch(socketConnect());
    }

    // ------------------------------------------------------------------------
    onDisconnect(): void {
        this.store.dispatch(socketDisconnect());
        this.configService.incrementServerIndex();
    }


    // ------------------------------------------------------------------------
    private onAddNewWidget() {
        this.store.dispatch(performDynamicLayoutAction({ action: 'add-widget' }));
    }

    // ------------------------------------------------------------------------
    private onResetCurrentLayout() {
        this.store.dispatch(performDynamicLayoutAction({ action: 'reset-layout' }));
    }

    // ------------------------------------------------------------------------
    onSetDraggable(isDraggable: boolean): void {
        this.store.dispatch(setDragState({ isDraggable }));
    }

    // ------------------------------------------------------------------------
    // display the tooltip with the current date and time
    currentDateTime$ = computed(() => this.datePipe.transform(new Date(), 'EEE yyyy-MMM-dd HH:mm:ss'));

    // ------------------------------------------------------------------------
    onUserProfileButtonClick() {
        this.layoutService.showUserProfileSidebar();
    }

    // ------------------------------------------------------------------------
    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    // ------------------------------------------------------------------------
    onLogout(event: Event): void {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Logging out will terminate your current session. Do you want to proceed?',
            header: 'Are you sure you want to log out?',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.store.dispatch(logout());
                this.store.dispatch(socketDisconnect());
            },
        });
    }

}

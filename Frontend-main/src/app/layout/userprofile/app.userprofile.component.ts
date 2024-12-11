import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { SidebarModule } from 'primeng/sidebar';
import { selectProfile, selectProfileLoading } from 'src/app/store/profile/profile.selectors';
import { LayoutService } from '../service/app.layout.service';

@Component({
    selector: 'app-userprofile',
    templateUrl: './app.userprofile.component.html',
    styles: [`
        :host ::ng-deep .userprofile-sidebar {
            &.p-sidebar {
                .p-sidebar-header {
                    padding-left: 1.5rem;
                }

                .p-sidebar-content {
                    margin-top: 0.75rem;
                    padding-left: 1.5rem;
                }
            }
        }
    `],
    standalone: true,
    imports: [
        SidebarModule,
    ],
})
export class AppUserprofileComponent {

    public profile$ = this.store.selectSignal(selectProfile);
    public loading$ = this.store.selectSignal(selectProfileLoading);

    // ------------------------------------------------------------------------------------------------------------------------
    constructor(
        private store: Store,
        public layoutService: LayoutService,
    ) { }

    get visible(): boolean {
        return this.layoutService.state.userProfileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.userProfileSidebarVisible = _val;
    }
}

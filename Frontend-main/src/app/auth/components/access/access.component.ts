import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { selectIsAuthenticated } from '../../../store/auth/auth.selectors';

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
    standalone: true,
    imports: [RouterLink, ButtonModule]
})
export class AccessComponent {

    // aware the realm of rxjs uses the "$" as appendix to the observables, not a bad idea using them also for signals to know they are actually a reactive asset
    public isAuth$ = this.store.selectSignal(selectIsAuthenticated);

    constructor(private store: Store) { }
}

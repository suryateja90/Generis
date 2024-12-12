import { Component, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { PrimeIcons } from 'primeng/api';

import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';
import { selectProfile, selectProfileLoading } from '../../store/profile/profile.selectors';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html'
})
@RegisterWidget('app-profile', PrimeIcons.USER)
export class ProfileComponent {

  parameters$ = input.required<any>({ alias: 'parameters' });

  public profile$ = this.store.selectSignal(selectProfile);
  public loading$ = this.store.selectSignal(selectProfileLoading);

  // ------------------------------------------------------------------------------------------------------------------------
  constructor(private store: Store) {

  }

}

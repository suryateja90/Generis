import { Component, input } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectProfile, selectProfileLoading } from '../../store/profile/profile.selectors';
import { RegisterWidget } from 'src/app/layout/dynamic-layout/register-widget.decorator';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html'
})
@RegisterWidget('app-profile')
export class ProfileComponent {

  parameters$ = input.required<any>({ alias: 'parameters' });

  public profile$ = this.store.selectSignal(selectProfile);
  public loading$ = this.store.selectSignal(selectProfileLoading);

  // ------------------------------------------------------------------------------------------------------------------------
  constructor(private store: Store) {

  }

}

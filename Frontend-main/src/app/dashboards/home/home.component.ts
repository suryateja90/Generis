// src/app/home/home.component.ts

import { Component } from '@angular/core';

import { DynamicLayoutComponent } from 'src/app/layout/dynamic-layout/dynamic-layout.component';
import { DynamicLayoutItem } from 'src/app/layout/dynamic-layout/dynamic-layout.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [DynamicLayoutComponent]
})
export class HomeComponent {

    defaultLayout: DynamicLayoutItem[] = [
        { id: 'app-watchlist', x: 0, y: 0, w: 12, h: 6 },
        { id: 'app-blotter', x: 0, y: 6, w: 12, h: 6 },
        { id: 'app-heartbeat', x: 6, y: 12, w: 6, h: 6 },
        { id: 'app-echo', x: 0, y: 18, w: 6, h: 6, parameters: { echoTitle: 'Hello World!', echoArray: [0, 1, 2] } },
        { id: 'app-broadcast', x: 6, y: 18, w: 6, h: 6, },
        { id: 'app-profile', x: 0, y: 24, w: 12, h: 6 },
        { id: 'app-parameters-view', x: 0, y: 30, w: 6, h: 8 },
        { id: 'app-parameters-set', x: 6, y: 30, w: 6, h: 8 },
    ];

}

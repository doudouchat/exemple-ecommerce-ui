import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ConfigService } from '../core/config/config.service';
import { Config } from '../core/config/config';

@Component( {
    templateUrl: './home.component.html',
    selector: 'home'
} )

export class HomeComponent {

    config: Observable<any | Config>;

    constructor( private configService: ConfigService ) { }

    ngOnInit() {

        this.config = this.configService.load();

    }
}
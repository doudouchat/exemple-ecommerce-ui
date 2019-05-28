import { Component } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Message, MenuItem } from 'primeng/primeng';

import { ConfigService } from './core/config/config.service';
import { MessageService } from './core/message/message.service';
import { Config } from './core/config/config';

@Component( {
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    selector: 'my-app'
} )

export class AppComponent {

    constructor( private configService: ConfigService, private messageService: MessageService ) { }

    msgs: Message[] = [];

    items: MenuItem[];

    config: Observable<Config>;

    ngOnInit() {

        this.messageService.get().filter( message => message != null ).subscribe( message => { this.msgs.splice( 0, 0, message ); } );

        this.items = [
            {
                label: 'Service',
                items: [
                    { label: 'home', routerLink: ['/'] }
                ]
            }
        ];

        this.config = this.configService.load();
    }
}

import { ErrorHandler, Injectable } from '@angular/core';

import { MessageService } from './message/message.service';

@Injectable()
export class ErrorService implements ErrorHandler {

    constructor( private messageService: MessageService ) { }

    handleError( error: any ) {

        console.error( error );

        this.messageService.put( { severity: 'error', summary: '', detail: error } );
    }
}
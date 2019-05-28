import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { Message } from 'primeng/primeng';

@Injectable()
export class MessageService {

    private message = new Subject<Message>();

    put( message: Message ) {

        this.message.next( message );
    }

    get(): Observable<Message> {

        return this.message.asObservable();
    }

}

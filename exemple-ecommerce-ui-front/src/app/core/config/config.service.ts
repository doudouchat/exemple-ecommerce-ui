import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Http, Response } from '@angular/http';

import { Config } from './config';
import { SessionStorage } from '../../shared/SessionStorage';

@Injectable()
export class ConfigService {

    @SessionStorage( "config" )
    private config: Config;

    constructor( private http: Http ) {
    }

    load(): Observable<Config> {

        if ( this.config == null ) {

            return this.http.get( "resources/configuration" )
                .map( res => this.config = res.json() )
                .do( x => console.info( "init config:" + JSON.stringify( x ) ) );

        } else {

            return Observable.of( this.config );
        }
    }

}

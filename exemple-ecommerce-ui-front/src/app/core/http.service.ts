import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers } from '@angular/http';

import { ConfigService } from './config/config.service';
import { Config } from './config/config';

@Injectable()
export class HttpService extends Http {

    constructor( private config: ConfigService, backend: XHRBackend, options: RequestOptions ) {
        super( backend, options );
    }

    request( url: string | Request, options?: RequestOptionsArgs ): Observable<Response> {

        return this.config.load().flatMap(( data: Config ) => {

            if ( typeof url == 'string' ) {

                if ( !options ) {
                    options = { headers: new Headers() };
                }

                url = data.url + url;
                options.headers.set( 'Content-Type', 'application/json' );

                console.debug( "appel du service:", url );

            } else {

                url.url = data.url + url.url;
                url.headers.set( 'Content-Type', 'application/json' );

                console.debug( "appel du service:", url.url );
            }

            return super.request( url, options );
        } );
    }

}

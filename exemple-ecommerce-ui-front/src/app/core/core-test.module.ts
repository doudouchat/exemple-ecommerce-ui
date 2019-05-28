import { NgModule, APP_INITIALIZER } from '@angular/core';

import { ConfigService } from './config/config.service';
import { HttpService } from './http.service';
import { CoreModule } from './core.module';

import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

@NgModule( {
    imports: [CoreModule],
    providers: [
        {
            provide: HttpService,
            useFactory: ( config, backend, options ) => {
                return new HttpService( config, backend, options );
            },
            deps: [ConfigService, MockBackend, BaseRequestOptions]
        },
        MockBackend,
        {
            provide: APP_INITIALIZER,
            useFactory: ( mockBackend: MockBackend ) => () => mockBackend.connections.subscribe(( c: MockConnection ) => {

                if ( c.request.url === 'resources/configuration' ) {

                    c.mockRespond( new Response(
                        new ResponseOptions( {
                            status: 200, body: JSON.stringify( {
                                url: "localhost",
                                service: {
                                    ping: "/ws/v1/ping",
                                    delete: "/ws/v1/jeton"
                                },
                                version: "test"
                            } )
                        } )
                    ) );
                }
            } ),
            deps: [MockBackend],
            multi: true
        },
        BaseRequestOptions,
        {
            provide: Http,
            useFactory: ( backend, options ) => new Http( backend, options ),
            deps: [MockBackend, BaseRequestOptions]
        }
    ]
} )
export class CoreTestModule { }


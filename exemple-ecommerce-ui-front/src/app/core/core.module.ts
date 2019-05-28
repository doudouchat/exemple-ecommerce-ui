import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ConfigService } from './config/config.service';
import { ErrorService } from './error.service';
import { MessageService } from './message/message.service';
import { HttpService } from './http.service';

@NgModule( {
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpModule
    ],
    providers: [
        {
            provide: HttpService,
            useFactory: ( config: ConfigService, backend: XHRBackend, options: RequestOptions ) => {
                return new HttpService( config, backend, options );
            },
            deps: [ConfigService, XHRBackend, RequestOptions]
        },
        { provide: ErrorHandler, useClass: ErrorService },
        ConfigService,
        MessageService
    ]
} )
export class CoreModule { }

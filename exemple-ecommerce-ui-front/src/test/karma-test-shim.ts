import '../polyfills';

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/mocha-patch';

var appContext = ( <{ context?: Function }>require ).context( '../app', true, /\.spec\.ts/ );

appContext.keys().forEach( appContext );

import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

TestBed.initTestEnvironment( BrowserDynamicTestingModule, platformBrowserDynamicTesting() );

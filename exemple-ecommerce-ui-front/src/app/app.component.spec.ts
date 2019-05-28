import { Location } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { CoreTestModule } from './core/core-test.module';

@Component( {
    template: ''
} )
class DummyComponent { }

describe( 'test', () => {

    let fixture: ComponentFixture<AppComponent>;
    let mock: ComponentFixture<DummyComponent>;
    let component: AppComponent;

    beforeEach( async(() => {

        TestBed.configureTestingModule( {

            imports: [CoreTestModule, AppModule, RouterTestingModule.withRoutes(
                [{ path: '', component: DummyComponent }] )],
            declarations: [DummyComponent]
        } );

        mock = TestBed.createComponent( DummyComponent )
        fixture = TestBed.createComponent( AppComponent );

        component = fixture.componentInstance;

    } ) );

    afterEach(() => {

        TestBed.resetTestingModule();

    } );

    class AssertRoute {

        static assert( location: Location, index: number, expectedPath: string ) {

            let de: DebugElement[];
            de = fixture.debugElement.queryAll( By.css( "span" ) );

            de[index].nativeElement.click();

            mock.detectChanges();

            mock.whenStable().then(() => {
                mock.detectChanges();
                expect( location.path() ).to.equal( expectedPath );

            } )

        }
    }

    it( 'home success', async( inject(
        [MockBackend, Location], ( mockBackend, location ) => {

            fixture.detectChanges();

            let de: DebugElement[];
            de = fixture.debugElement.queryAll( By.css( "h6" ) );

            expect( de[0].nativeElement.innerHTML ).to.equal( 'version:test' );

        } ) ) );

} );
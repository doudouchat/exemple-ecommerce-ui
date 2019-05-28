import { DebugElement } from '@angular/core';
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { HomeModule } from './home.module';
import { HomeComponent } from './home.component';
import { CoreTestModule } from '../core/core-test.module';

describe( 'test', () => {

    let fixture: ComponentFixture<HomeComponent>;
    let component: HomeComponent;

    beforeEach( async(() => {

        fixture = TestBed.configureTestingModule( {

            imports: [CoreTestModule, HomeModule]
        } ).createComponent( HomeComponent );

        component = fixture.componentInstance;

    } ) );

    afterEach(() => {

        TestBed.resetTestingModule();

    } );

    it( 'home success', async( inject(
        [MockBackend], ( mockBackend ) => {

            fixture.detectChanges();

            let de: DebugElement[];
            de = fixture.debugElement.queryAll( By.css( "a" ) );

            expect( de[0].nativeElement.innerHTML ).to.equal( 'ici' );

        } ) ) );

} );
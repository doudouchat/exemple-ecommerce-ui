import { DebugElement } from '@angular/core';
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';


describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    beforeEach(async(() => {

        fixture = TestBed.configureTestingModule({

            imports: [AppModule],
            providers: [MockBackend]

        }).createComponent(AppComponent);

        component = fixture.componentInstance;

    }));

    afterEach(() => {

        TestBed.resetTestingModule();

    });

    it("should have as title 'exemple-ecommerce-ui'", async(inject(
        [MockBackend], (mockBackend) => {

            fixture.detectChanges();

            let de: DebugElement[];
            de = fixture.debugElement.queryAll(By.css("h1"));

            expect(de[0].nativeElement.innerHTML).to.equal(" Welcome to exemple-ecommerce-ui! ");

        })));
});

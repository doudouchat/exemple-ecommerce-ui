import { Component, DebugElement } from '@angular/core';
import { async, inject, TestBed, ComponentFixture } from '@angular/core/testing';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from 'chai';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@Component({
    template: '<h6>dummy</h6>'
})
class DummyComponent { }

describe('AppComponent', () => {

    let fixture: ComponentFixture<AppComponent>;
    let mock: ComponentFixture<DummyComponent>;
    let component: AppComponent;

    beforeEach(async(() => {

        fixture = TestBed.configureTestingModule({

            imports: [AppModule, RouterTestingModule.withRoutes(
                [{ path: '', component: DummyComponent }])],
            declarations: [DummyComponent],
            providers: [MockBackend]

        }).createComponent(AppComponent);

        mock = TestBed.createComponent(DummyComponent)
        component = fixture.componentInstance;

    }));

    afterEach(() => {

        TestBed.resetTestingModule();

    });

    it("routing should have as template dummy", async(inject(
        [MockBackend], (mockBackend) => {

            fixture.detectChanges();

            mock.detectChanges();

            mock.whenStable().then(() => {

                mock.detectChanges();
                let de: DebugElement[];
                de = mock.debugElement.queryAll(By.css("h6"));

                expect(de[0].nativeElement.innerHTML).to.equal('dummy');

            })

        })));

});

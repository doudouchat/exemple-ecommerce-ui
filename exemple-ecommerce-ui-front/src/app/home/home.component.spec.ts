import { DebugElement } from '@angular/core';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'chai';

import { HomeModule } from './home.module';
import { HomeComponent } from './home.component';

describe('test', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  beforeEach(async(() => {

    fixture = TestBed.configureTestingModule({

      imports: [HttpClientTestingModule, HomeModule]

    }).createComponent(HomeComponent);

    component = fixture.componentInstance;

  }));

  afterEach(() => {

    TestBed.resetTestingModule();

  });

  it('home should have as title "exemple-ecommerce-ui"', async(() => {

    fixture.detectChanges();

    let de: DebugElement[];
    de = fixture.debugElement.queryAll(By.css('h1'));

    expect(de[0].nativeElement.innerHTML).to.equal(' Welcome to exemple-ecommerce-ui! ');

  }));

});

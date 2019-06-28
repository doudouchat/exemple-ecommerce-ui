import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule( {
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        HttpModule
    ]
} )
export class CoreModule { }

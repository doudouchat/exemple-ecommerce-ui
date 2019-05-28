import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { ButtonModule, CalendarModule, DataTableModule, DialogModule, DropdownModule, GrowlModule, InputTextModule, InputTextareaModule, MenuModule, MessagesModule, SharedModule as PrimengSharedModule } from 'primeng/primeng';

@NgModule( {
    exports: [
        CommonModule,
        HttpModule,
        ButtonModule,
        CalendarModule,
        DataTableModule,
        DialogModule,
        DropdownModule,
        GrowlModule,
        MenuModule,
        GrowlModule,
        InputTextModule,
        InputTextareaModule,
        MenuModule,
        MessagesModule,
        PrimengSharedModule
    ]
} )
export class SharedModule { }

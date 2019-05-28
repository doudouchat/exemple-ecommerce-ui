import { NgModule } from '@angular/core';
import 'font-awesome-webpack';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

@NgModule( {
    imports: [
        CoreModule,
        SharedModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
} )
export class AppModule { }

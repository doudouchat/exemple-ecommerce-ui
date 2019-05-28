import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

if ( process.env.ENV === 'production' ) {
    enableProdMode();
}

// Get the locale id from the global
const locale = document['locale'] as string;
console.debug( "locale:" + locale );

//use the require method provided by webpack
declare const require: any;

platformBrowserDynamic().bootstrapModule( AppModule, {
    providers: getTranslationFilesWithWebpack( locale )
} );

function getTranslationFilesWithWebpack( locale: string ) {

    try {
        // we use the webpack raw-loader to return the content as a string
        const translations = require( 'raw-loader!./locale/messages.' + locale + '.xlf' );
        return [
            { provide: TRANSLATIONS, useValue: translations },
            { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
            { provide: LOCALE_ID, useValue: locale }
        ]
    } catch ( e ) {
        return [];
    }
}
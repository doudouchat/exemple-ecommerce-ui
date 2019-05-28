
export function SessionStorage( key: string ) {

    return function( target: any, propertyKey: string ) {
        // get and set methods
        Object.defineProperty( target, propertyKey, {
            get: function() {
                return JSON.parse( sessionStorage.getItem( key ) );
            },
            set: function( value ) {
                sessionStorage.setItem( key, JSON.stringify( value ) );
            }
        } );
    };
}

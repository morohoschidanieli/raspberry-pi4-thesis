const path = require( 'path' );

module.exports = function(app){
    app.get( '/analytics', ( request, response ) => {
        response.sendFile( path.resolve( __dirname, '../public/html/analytics.html' ), {
            headers: {
                'Content-Type': 'text/html',
            }
        } );

    } );
}
//home.js
const path = require( 'path' );

module.exports = function(app){
app.get( '/', ( request, response ) => {
    response.sendFile( path.resolve( __dirname, '../public/html/index.html' ), {
      headers: {
        'Content-Type': 'text/html',
      }
    } );
  } );
}
/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var express = require( 'express' ),
        q = require( 'q' );

    var server = null;

    module.exports.start = function _start( port ) {
        var deferred = q.defer(),
            app = express();

        app.get( '/test', function( req, res ) {
            res.send( { test: 'test' } );
        } );

        server = app.listen( port, function() {
            deferred.resolve( server );
        } );

        return deferred;
    };

    module.exports.stop = function _stop() {
        var deferred = q.defer();
        server.on( 'close', function() {
            deferred.resolve();
        } );
        server.close();
        return deferred.promise;
    };

}) ();
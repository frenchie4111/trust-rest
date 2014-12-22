/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var express = require( 'express' ),
        q = require( 'q' );

    var server = null,
        response_value = { test: 'test'},
        response_status = 200;

    module.exports.start = function _start() {
        var deferred = q.defer(),
            app = express();

        app.get( '/test', function( req, res ) {
            res.status( response_status ).send( response_value );
        } );

        server = app.listen( function() {
            deferred.resolve( server );
        } );

        return deferred.promise;
    };

    module.exports.setResponse = function( new_response_value, new_response_status ) {
        response_value = new_response_value;
        response_status = new_response_status || 200;
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
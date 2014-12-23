/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var express = require( 'express' ),
        q = require( 'q' );

    var server = null,
        response_value = { test: 'test'},
        response_status = 200,
        request_validation_function = function( req ) {},
        request_validation_failed_handler = function( err ) {};

    module.exports.start = function _start() {
        var deferred = q.defer(),
            app = express();

        app.get( '/test', function( req, res ) {
            res.status( response_status ).send( response_value );
        } );

        var _validateRequest = function( req, res ) {
            try {
                request_validation_function( req );
            } catch( err ) {
                request_validation_failed_handler( err );
            }

            res.send( { test: 'test' } );
        };
        app.get( '/validation', _validateRequest );
        app.post( '/validation', _validateRequest );
        app.put( '/validation', _validateRequest );
        app.delete( '/validation', _validateRequest );

        server = app.listen( function() {
            deferred.resolve( server );
        } );

        return deferred.promise;
    };

    module.exports.setResponse = function( new_response_value, new_response_status ) {
        response_value = new_response_value;
        response_status = new_response_status || 200;
    };

    module.exports.setRequestValidationFunction = function( new_request_validation_function, new_request_validation_failed_handler ) {
        request_validation_function = new_request_validation_function;
        request_validation_failed_handler = new_request_validation_failed_handler;
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
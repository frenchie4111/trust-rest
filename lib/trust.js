/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var supertest = require ( 'supertest' ),
        chai = require ( 'chai' ),
        assert = chai.assert;

    function ValidationError ( message ) {
        Error.captureStackTrace ( this, ValidationError );

        this.name = 'ValidationError';
        this.message = message;
    }
    ValidationError.prototype = Object.create ( Error.prototype );

    module.exports = function( url ) {
        url = url || 'http://127.0.0.1/';
        var request = supertest ( url );

        var _validateIn = function( in_options ) {
            assert.isDefined ( in_options, 'in_options: in_options not defined' );

            assert.property ( in_options, 'method', new ValidationError( 'in_options: method not specified' ) );
            assert.isString ( in_options.method,  new ValidationError( 'in_options: method not a string' ) );
            assert.include ( [ 'get', 'put', 'post', 'delete' ], in_options.method,  new ValidationError( 'in_options: method not valid method' ) );
        };

        return function( done, in_options, out_options ) {
            _validateIn ( in_options );
        }
    };
}) ();
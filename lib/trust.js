/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var supertest = require ( 'supertest' ),
        chai = require ( 'chai' ),
        assert = chai.assert,
        _ = require( 'underscore' );

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
            assert.isString ( in_options.method, new ValidationError( 'in_options: method not a string' ) );
            assert.include ( [ 'get', 'put', 'post', 'delete' ], in_options.method,  new ValidationError( 'in_options: method not valid method' ) );

            assert.property( in_options, 'path', new ValidationError( 'in_options: path not specified' ) );
            assert.isString( in_options.path, new ValidationError( 'in_options: path not a string' ) );
            assert.match( in_options.path, /\//, new ValidationError( 'in_options: path doesn\'t start with /' ) );

            if( _.contains( [ 'get', 'delete' ], in_options.method ) ) {
                assert.notProperty( in_options, 'body', new ValidationError( 'in_options: should not contain body if method is get or delete' ) );
            }

            if( in_options.body ) {
                assert.isObject( in_options.body, new ValidationError( 'in_options: body should be an Object' ) );
            }
        };

        /**
         * Takes an input option body, and an output option body. Runs the specified webrequest, then validates it according
         * to the specified options
         *
         * @param done {Function} Completion function to be called, will be called with error when fail
         * @param in_options {Object} Contains options for the web request that will be sent
         * @param in_options.path {String} Path to send request to, will be appended to base_url specified on trust creation
         * @param in_options.method {String} [get, put, post, delete] request type to be sent
         * @param in_options.body {Object} body to be sent in request
         * @param in_options.header {Object} headers to be sent in request
         * @param out_options Contains options for the validation of the response
         * @param out_options.body.KEY.required {boolean} [out_options.body.KEY.required=true] Whether or not KEY is required in the response body
         * @param out_options.body.KEY.value {Object} The expected value of KEY in the response body
         * @param out_options.header.KEY.require {boolean} [out_options.header.KEY.required=true] Whether or not KEY is required in the response headers
         * @param out_options.header.KEY.value {Object} The expected value of KEY in the response headers
         * @param out_options.content_type {String} [out_options.content_type=application/json] Expected content type of response
         * @param out_options.code {Number} [out_options.code=200] Expect response code of the response
         */
        return function _trust( done, in_options, out_options ) {
            _validateIn ( in_options );
        }
    };
}) ();
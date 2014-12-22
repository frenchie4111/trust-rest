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

        /**
         * Validates the given request_options
         * @param request_options The request_options to validate
         * @private
         */
        var _validateRequestOptions = function( request_options ) {
            assert.isDefined ( request_options, 'request_options: request_options not defined' );

            assert.property ( request_options, 'method', new ValidationError( 'request_options: method not specified' ) );
            assert.isString ( request_options.method, new ValidationError( 'request_options: method not a string' ) );
            assert.include ( [ 'get', 'put', 'post', 'delete' ], request_options.method,  new ValidationError( 'request_options: method not valid method' ) );

            assert.property( request_options, 'path', new ValidationError( 'request_options: path not specified' ) );
            assert.isString( request_options.path, new ValidationError( 'request_options: path not a string' ) );
            assert.match( request_options.path, /\//, new ValidationError( 'request_options: path doesn\'t start with /' ) );

            if( _.contains( [ 'get', 'delete' ], request_options.method ) ) {
                assert.notProperty( request_options, 'body', new ValidationError( 'request_options: should not contain body if method is get or delete' ) );
            }

            if( request_options.body ) {
                assert.isObject( request_options.body, new ValidationError( 'request_options: body should be an Object' ) );
            }
        };

        /**
         * Validates the given response_options
         * @param response_options {Object} The response_options to validate
         * @private
         */
        var _validateResponseOptions = function( response_options ) {
            if( response_options.code ) {
                var valid_response_codes = [ 100, 101, 200, 201, 202, 203, 204, 205, 206, 207, 300, 301, 302, 303, 304, 305, 307, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 500, 501, 502, 503, 504, 505 ];

                assert.include( valid_response_codes, response_options.code, 'response_options: code not a valid http response code' );
            }
        };

        /**
         * Takes an input option body, and an output option body. Runs the specified webrequest, then validates it according
         * to the specified options
         *
         * @param done {Function} Completion function to be called, will be called with error when fail
         * @param request_options {Object} Contains options for the web request that will be sent
         * @param request_options.path {String} Path to send request to, will be appended to base_url specified on trust creation
         * @param request_options.method {String} [get, put, post, delete] request type to be sent
         * @param request_options.body {Object} body to be sent in request
         * @param request_options.headers {Object} headers to be sent in request
         * @param response_options Contains options for the validation of the response
         * @param response_options.body.KEY.required {boolean} [response_options.body.KEY.required=true] Whether or not KEY is required in the response body
         * @param response_options.body.KEY.value {Object} The expected value of KEY in the response body
         * @param response_options.header.KEY.require {boolean} [response_options.header.KEY.required=true] Whether or not KEY is required in the response headers
         * @param response_options.header.KEY.value {Object} The expected value of KEY in the response headers
         * @param response_options.content_type {String} [response_options.content_type=application/json] Expected content type of response
         * @param response_options.code {Number} [response_options.code=200] Expect response code of the response
         */
        return function _trust( done, request_options, response_options ) {
            // Validate the arguments
            _validateRequestOptions ( request_options );
            _validateResponseOptions ( response_options );
        }
    };
}) ();
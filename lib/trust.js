/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var supertest = require ( 'supertest' ),
        chai = require ( 'chai' ),
        assert = chai.assert,
        _ = require( 'underscore' ),
        q = require( 'q' );

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
            return q.try( function() {
                assert.isDefined( request_options, 'request_options: request_options not defined' );

                assert.property( request_options, 'method', new ValidationError( 'request_options: method not specified' ) );
                assert.isString( request_options.method, new ValidationError( 'request_options: method not a string' ) );
                assert.include( [ 'get', 'put', 'post', 'delete' ], request_options.method, new ValidationError( 'request_options: method not valid method' ) );

                assert.property( request_options, 'path', new ValidationError( 'request_options: path not specified' ) );
                assert.isString( request_options.path, new ValidationError( 'request_options: path not a string' ) );
                assert.match( request_options.path, /\//, new ValidationError( 'request_options: path doesn\'t start with /' ) );

                if( _.contains( [ 'get', 'delete' ], request_options.method ) ) {
                    assert.notProperty( request_options, 'body', new ValidationError( 'request_options: should not contain body if method is get or delete' ) );
                }

                if( request_options.body ) {
                    if( !( _.isObject( request_options.body ) || _.isArray( request_options.body ) ) )
                        throw new Error( 'request_options: body should be an object' );
                }
            } );
        };

        /**
         * Validates the given response_options
         * @param response_options {Object} The response_options to validate
         * @private
         */
        var _validateResponseOptions = function( response_options ) {
            return q.try( function() {
                if( response_options.code ) {
                    var valid_response_codes = [ 100, 101, 200, 201, 202, 203, 204, 205, 206, 207, 300, 301, 302, 303, 304, 305, 307, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 500, 501, 502, 503, 504, 505 ];

                    assert.include( valid_response_codes, response_options.code, 'response_options: code not a valid http response code' );
                }

                if( response_options.body ) {
                    assert.isObject( response_options.body, new ValidationError( 'response_options: body should be an object' ) );

                    _.each( response_options.body, function( options, key ) {
                        if( options.hasOwnProperty( 'value' ) && options.hasOwnProperty( 'type' ) ) {
                            assert.typeOf( options.value, options.type, 'response_options: body expected value should be same as expected type' );
                        }
                    } );
                }
            } );
        };

        var _prepareRequest = function( request_options ) {
            var prepared_request = request
                [ request_options.method ]( request_options.path );

            if( request_options.headers ) {
                _.each ( request_options.headers, function( header_value, header_name ) {
                    prepared_request.set( header_name, header_value );
                } );
            }

            if( request_options.body ) {
                prepared_request.send( request_options.body );
            }

            return prepared_request;
        };

        var _validateDictionary = function( response_body, response_options_body, allow_unspecified_keys ) {
            if( response_options_body ) {
                assert.isDefined( response_body, new ValidationError( 'response_validation: body should not be null' ) );

                if( !allow_unspecified_keys ) {
                    // Validate that all response_body keys are contained in response_options_body
                    _.each( response_body, function( response_value, response_key ) {
                        assert.property( response_options_body, response_key, new ValidationError( 'response_validation: body should not contain a key not specified in validation body' ) );
                    } );
                }

                // Validate values / requiredness of keys
                _.each( response_options_body, function( expected_options, expected_key ) {
                    // If it's required, make sure that we have it
                    if( !expected_options.hasOwnProperty( 'required' ) || expected_options.required ) {
                        assert.property( response_body, expected_key, new ValidationError( 'response_validation: body should contain required key' ) );
                    }

                    // If we have an expected_value, and a value: make sure they match
                    if( expected_options.hasOwnProperty( 'value' ) && response_body.hasOwnProperty( expected_key ) ) {
                        assert.propertyVal( response_body, expected_key, expected_options.value, new ValidationError( 'response_validation: incorrect value for key in body' ) );
                    }

                    // If we have an expected_type, and a value: make sure they match
                    if( expected_options.hasOwnProperty( 'type' ) && response_body.hasOwnProperty( expected_key ) ) {
                        if( !( expected_options.allow_null === true && response_body[ expected_key ] === null ) ) {
                            assert.typeOf( response_body[ expected_key ], expected_options.type, new ValidationError( 'response_validation: incorrect type in response body' ) );
                        }    
                    }

                    if( expected_options.hasOwnProperty( 'nested' ) && response_body.hasOwnProperty( expected_key ) ) {
                        if( expected_options.type === 'object' ) {
                            _validateDictionary( response_body[ expected_key ], expected_options.nested );
                        } else if( expected_options.type === 'array' ) {
                            _.each( response_body[ expected_key ], function( response_body_array_i ) {
                                _validateDictionary( response_body_array_i, expected_options.nested );
                            } );
                        }
                    }
                } );
            } else {
                if( !allow_unspecified_keys ) {
                    // If there is no response_options_body, that means that we should have no body as well
                    assert.isUndefined( response_body, new ValidationError( 'response_validation: body should be null' ) );
                }
            }
        };

        var _addValidations = function( request, response_options, completion_handler ) {
            if( !completion_handler ) completion_handler = function() { console.error( 'trust: Should specify a completion handler' ) };
            request
                .end( function( err, res ) {
                    if( err ) return completion_handler( err );

                    try {
                        assert.propertyVal( res, 'statusCode', response_options.code || 200, 'response_validation: http response code invalid' );

                        assert.property( res, 'headers', 'response_validation: should have headers in response' );
                        assert.property( res.headers, 'content-type', 'response_validation: should have content type in resposne' );
                        assert.match( res.headers[ 'content-type' ], response_options.content_type || /json/, 'response_validation: content type should match'  );

                        assert.typeOf( res.body, response_options.type || 'object', 'response_validation: should be specified type' );

                        if( response_options.type === 'array' ) {
                            _.each( res.body, function( body_array_i ) {
                                _validateDictionary( body_array_i, response_options.body );
                            } );
                        } else if( typeof res.body === 'object' ) {
                            _validateDictionary( res.body, response_options.body, false );
                        }
                        _validateDictionary( res.headers, response_options.headers, true );
                    } catch( err ) {
                        if( response_options.after_handler ) return response_options.after_handler( err, res, completion_handler );
                        return completion_handler( err );
                    }

                    if( response_options.after_handler ) return response_options.after_handler( null, res, completion_handler );
                    return completion_handler();
                } );
        };

        /**
         * Takes an input option body, and an output option body. Runs the specified webrequest, then validates it according
         * to the specified options
         *
         * @param request_options {Object} Contains options for the web request that will be sent
         * @param request_options.path {String} Path to send request to, will be appended to base_url specified on trust creation
         * @param request_options.method {String} [get, put, post, delete] request type to be sent
         * @param request_options.body {Object} body to be sent in request
         * @param request_options.headers {Object} headers to be sent in request
         * @param response_options Contains options for the validation of the response
         * @param response_options.body.KEY.required {boolean} [response_options.body.KEY.required=true] Whether or not KEY is required in the response body
         * @param response_options.body.KEY.value {Object} The expected value of KEY in the response body
         * @param reqponse_options.body.KEY.nested {Object} nested body validation, should match format of body validations
         * @param response_options.header.KEY.require {boolean} [response_options.header.KEY.required=true] Whether or not KEY is required in the response headers
         * @param response_options.header.KEY.value {Object} The expected value of KEY in the response headers
         * @param response_options.content_type {String} [response_options.content_type=application/json] Expected content type of response
         * @param response_options.code {Number} [response_options.code=200] Expect response code of the response
         * @param response_options.type {String} [response_options.type='object'] Expected response object type, should be 'object' or 'array'
         * @param response_options.after_handler {Function} Function to be run after the request function( err, res, done )
         * @param done {Function} Completion function to be called, will be called with error when fail
         */
        return function _trust( request_options, response_options, done ) {
            // Validate the arguments
            return _validateRequestOptions ( request_options )
                .then( _validateResponseOptions ( response_options ) )
                .then( function() {
                    q.try( function() {
                        _addValidations( _prepareRequest( request_options ), response_options, done );
                    } );
                } )
                .catch( function( err ) {
                    if( done !== undefined ) {
                        done( err );
                    }
                } );
        }
    };
}) ();

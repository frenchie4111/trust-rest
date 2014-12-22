/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var chai = require( 'chai' ),
        assert = chai.assert,
        _ = require( 'underscore' );

    describe( 'Variable validation tests', function() {
        var trust = require( '../' )();

        var valid_done = function() {

        };

        var valid_request_options = {
            method: 'get',
            path: '/test'
        };

        var valid_response_options = {
            code: 200,
            body: {
                test: {
                    required: true,
                    value: 'test'
                }
            },
            headers: {

            },
            content_type: /json/
        };

        it( 'Should not be valid when no method specified', function() {
            var invalid_in = _.clone( valid_request_options );
            delete invalid_in.method;

            assert.throws( function() {
                trust( invalid_in, valid_response_options, valid_done );
            }, /request_options: method not specified/ );
        } );

        it( 'Should not be valid when no method is not a string', function() {
            var invalid_in = _.clone( valid_request_options );
            invalid_in.method = 1;

            assert.throws( function() {
                trust( invalid_in, valid_response_options, valid_done );
            }, /request_options: method not a string/ );
        } );

        it( 'Should not be valid when method is not in valid methods list', function() {
            var invalid_in = _.clone( valid_request_options );
            invalid_in.method = 'NOT CORRECT';

            assert.throws( function() {
                trust( invalid_in, valid_response_options, valid_done );
            }, /request_options: method not valid method/ );
        } );

        it( 'Should work with all valid methods', function() {
            var other_methods = [ 'get', 'put', 'post', 'delete' ];

            _.each( other_methods, function( other_method ) {
                var other_method_in = _.clone( valid_request_options );
                other_method_in.method = other_method;

                assert.doesNotThrow( function() {
                    trust( other_method_in, valid_response_options, valid_done );
                } );
            } );
        } );

        it( 'Should not be valid when no path specified', function() {
            var invalid_in = _.clone( valid_request_options );
            delete invalid_in.path;

            assert.throws( function() {
                trust( invalid_in, valid_response_options, valid_done );
            }, /request_options: path not specified/ );
        } );

        it( 'Should not be valid when no path is not a string', function() {
            var invalid_in = _.clone( valid_request_options );
            invalid_in.path = 1;

            assert.throws( function() {
                trust( invalid_in, valid_response_options, valid_done );
            }, /request_options: path not a string/ );
        } );

        it( 'Should not be valid when path does not start with /', function() {
            var invalid_in = _.clone( valid_request_options );
            invalid_in.path = 'NOT CORRECT';

            assert.throws( function() {
                trust( invalid_in, valid_response_options, valid_done );
            }, /request_options: path doesn't start with \// );
        } );

        it( 'Should not be valid with body and get method', function() {
            var invalid_in = _.clone( valid_request_options );
            invalid_in.body = {};

            assert.throws( function() {
                trust( invalid_in, valid_response_options, valid_done );
            }, /request_options: should not contain body if method is get or delete/ );
        } );

        it( 'Should not be valid with body and delete method', function() {
            var invalid_in = _.clone( valid_request_options );
            invalid_in.body = {};
            invalid_in.method = 'delete';

            assert.throws( function() {
                trust( invalid_in, valid_response_options, valid_done );
            }, /request_options: should not contain body if method is get or delete/ );
        } );

        it( 'Should be valid with body and put method', function() {
            var valid_in_put = _.clone( valid_request_options );
            valid_in_put.body = {};
            valid_in_put.method = 'put';

            assert.doesNotThrow( function() {
                trust( valid_in_put, valid_response_options, valid_done );
            }, /request_options: should not contain body if method is get or delete/ );
        } );

        it( 'Should be valid with body and post method', function() {
            var valid_in_put = _.clone( valid_request_options );
            valid_in_put.body = {};
            valid_in_put.method = 'post';

            assert.doesNotThrow( function() {
                trust( valid_in_put, valid_response_options, valid_done );
            }, /request_options: should not contain body if method is get or delete/ );
        } );

        it( 'Should not be valid with invalid http error code', function() {
            var invalid_response_options = _.clone( valid_response_options );
            invalid_response_options.code = 1;

            assert.throws( function() {
                trust( valid_request_options, invalid_response_options, valid_done );
            }, /response_options: code not a valid http response code/ );
        } );

        it( 'Should be valid with all valid http codes', function() {
            var valid_http_codes = [ 100, 101, 200, 201, 202, 203, 204, 205, 206, 207, 300, 301, 302, 303, 304, 305, 307, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 500, 501, 502, 503, 504, 505 ];

            _.each( valid_http_codes, function( valid_http_code ) {
                var valid_response_options_code = _.clone( valid_response_options );
                valid_response_options_code.code = valid_http_code;

                assert.doesNotThrow( function() {
                    trust( valid_request_options, valid_response_options_code, valid_done );
                }, /response_options: code not a valid http response code/ );
            } );
        } );

    } );
}) ();
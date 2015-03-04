/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var chai = require( 'chai' ),
        assert = chai.assert,
        helper = require( './lib/helper' ),
        _ = require( 'underscore' );

    var trust_lib = require( '../' ),
        trust = null;

    describe( 'Trust resposne validation functional tests', function() {
        before( function( done ) {
            helper
                .before()
                .then( function() {
                    trust = trust_lib( 'http://127.0.0.1:' + helper.port );
                    done();
                } );
        } );

        it( 'should send get request', function( done ) {
            helper.setRequestValidationFunction( function( req ) {
                assert.isDefined( req.route, 'route should be defined' );

                assert.isDefined( req.route.path, 'path should be defined' );
                assert.strictEqual( req.route.path, '/validation', 'path should be /validation' );

                assert.isDefined( req.route.methods, 'methods should be defined' );
                assert.propertyVal( req.route.methods, 'get', true,'methods should contain get' );
            }, done );

            assert.doesNotThrow( function() {
                trust( {
                    method: 'get',
                    path: '/validation'
                }, {
                    body: {
                        test: {
                            value: 'test'
                        }
                    }
                }, function() {} )
            } );
        } );

        it( 'should send post request', function( done ) {
            helper.setRequestValidationFunction( function( req ) {
                assert.isDefined( req.route, 'route should be defined' );

                assert.isDefined( req.route.path, 'path should be defined' );
                assert.strictEqual( req.route.path, '/validation', 'path should be /validation' );

                assert.isDefined( req.route.methods, 'methods should be defined' );
                assert.propertyVal( req.route.methods, 'post', true,'methods should contain post' );
            }, done );

            assert.doesNotThrow( function() {
                trust( {
                    method: 'post',
                    path: '/validation'
                }, {
                    body: {
                        test: {
                            value: 'test'
                        }
                    }
                }, function() {} )
            } );
        } );

        it( 'should send put request', function( done ) {
            helper.setRequestValidationFunction( function( req ) {
                assert.isDefined( req.route, 'route should be defined' );

                assert.isDefined( req.route.path, 'path should be defined' );
                assert.strictEqual( req.route.path, '/validation', 'path should be /validation' );

                assert.isDefined( req.route.methods, 'methods should be defined' );
                assert.propertyVal( req.route.methods, 'put', true,'methods should contain put' );
            }, done );

            assert.doesNotThrow( function() {
                trust( {
                    method: 'put',
                    path: '/validation'
                }, {
                    body: {
                        test: {
                            value: 'test'
                        }
                    }
                }, function() {} )
            } );
        } );

        it( 'should send delete request', function( done ) {
            helper.setRequestValidationFunction( function( req ) {
                assert.isDefined( req.route, 'route should be defined' );

                assert.isDefined( req.route.path, 'path should be defined' );
                assert.strictEqual( req.route.path, '/validation', 'path should be /validation' );

                assert.isDefined( req.route.methods, 'methods should be defined' );
                assert.propertyVal( req.route.methods, 'delete', true,'methods should contain delete' );
            }, done );

            assert.doesNotThrow( function() {
                trust( {
                    method: 'delete',
                    path: '/validation'
                }, {
                    body: {
                        test: {
                            value: 'test'
                        }
                    }
                }, function() {} )
            } );
        } );

        it( 'should send post body', function( done ) {
            var body = { test: 'test' };

            helper.setRequestValidationFunction( function( req ) {
                assert.isDefined( req.body, 'req body should be defined' );
                assert.deepEqual( req.body, body, 'body should be equal to sent body' );
            }, done );

            assert.doesNotThrow( function() {
                trust( {
                    method: 'post',
                    path: '/validation',
                    body: body
                }, {
                    body: {
                        test: {
                            value: 'test'
                        }
                    }
                }, function() {} )
            } );
        } );

        it( 'should send put body', function( done ) {
            var body = { test: 'test' };

            helper.setRequestValidationFunction( function( req ) {
                assert.isDefined( req.body, 'req body should be defined' );
                assert.deepEqual( req.body, body, 'body should be equal to sent body' );
            }, done );

            assert.doesNotThrow( function() {
                trust( {
                    method: 'put',
                    path: '/validation',
                    body: body
                }, {
                    body: {
                        test: {
                            value: 'test'
                        }
                    }
                }, function() {} )
            } );
        } );

        it( 'should send headers', function( done ) {
            var headers = { test: 'test' };

            helper.setRequestValidationFunction( function( req ) {
                assert.isDefined( req.headers, 'req headers should be defined' );

                _.each( headers, function( value, key ) {
                    assert.propertyVal( req.headers, key, value, 'req headers should be equal to sent headers' );
                } );
            }, done );

            assert.doesNotThrow( function() {
                trust( {
                    method: 'put',
                    path: '/validation',
                    headers: headers
                }, {
                    body: {
                        test: {
                            value: 'test'
                        }
                    }
                }, function() {} )
            } );
        } );

        it( 'Should call after_handler before completion_handler when success', function( done ) {
            helper.setResponse( { test: 'test' } );

            var after_handler_called = false;

            var after_handler = function( err, req, complete ) {
                after_handler_called = true;
                complete();
            };

            var compltion_handler = function() {
                assert.isTrue( after_handler_called, 'after handler should have been called first' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    method: 'get',
                    path: '/test'
                }, {
                    body: {
                        test: {
                            value: 'test'
                        }
                    },
                    after_handler: after_handler
                }, compltion_handler );
            } );
        } );

        it( 'Should call after_handler before completion_handler when failure', function( done ) {
            helper.setResponse( { test: 'test' } );

            var after_handler_called = false;

            var after_handler = function( err, req, complete ) {
                after_handler_called = true;
                complete( err );
            };

            var compltion_handler = function( err ) {
                assert.isDefined( err, 'should have been an error' );
                assert.isTrue( after_handler_called, 'after handler should have been called first' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    method: 'get',
                    path: '/test'
                }, {
                    body: {
                        test: {
                            value: 'wrong'
                        }
                    },
                    after_handler: after_handler
                }, compltion_handler );
            } );
        } );

        after( function( done ) {
            helper.after().then( done );
        } );

    } );
}) ();
/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var chai = require( 'chai' ),
        assert = chai.assert,
        helper = require( './lib/helper' );

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

        it( 'Should work when valid', function( done ) {
            helper.setResponse( { test: 'test' } );

            var completion_handler = function( err ) {
                assert.isUndefined( err );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: true,
                            value: 'test',
                            type: 'string'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should throw when key value is incorrect', function( done ) {
            helper.setResponse( { test: 'incorrect' } );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should have been an error' );
                assert.match( err.message, /response_validation: incorrect value for key in body/, 'error should have been properly formatted' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: true,
                            value: 'test',
                            type: 'string'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should throw when value is not strict equal', function( done ) {
            helper.setResponse( { test: 1 } );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should have been an error' );
                assert.match( err.message, /response_validation: incorrect value for key in body/, 'error should have been properly formatted' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: true,
                            value: '1'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should work when value is right type, and no expected_value specified', function( done ) {
            helper.setResponse( { test: 'incorrect' } );

            var completion_handler = function( err ) {
                assert.isUndefined( err, 'should not have been an error' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: true,
                            type: 'string'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should assert work when value is wrong type, and no expected_value specified', function( done ) {
            helper.setResponse( { test: 1 } );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should have been an error' );
                assert.match( err.message, /response_validation: incorrect type in response body/, 'error should have been properly formatted' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: true,
                            type: 'string'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should assert when specified required key is not found', function( done ) {
            helper.setResponse( { test: 'test' } );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should have been an error' );
                assert.match( err.message, /response_validation: body should contain required key/, 'error should have been properly formatted' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: true,
                            value: 'test'
                        },
                        another: {
                            required: true,
                            value: 'test'
                        }
                    }
                }, completion_handler );
            } );
        } );


        it( 'Should not assert when key is not required, and not found', function( done ) {
            helper.setResponse( { test: 'test' } );

            var completion_handler = function( err ) {
                assert.isUndefined( err, 'should not have been an error' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: true,
                            value: 'test'
                        },
                        another: {
                            required: false,
                            value: 'test'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should assert when unaccounted for key is returned', function( done ) {
            helper.setResponse( { test: 'test', unaccounted: 'unaccounted' } );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should have been an error' );
                assert.match( err.message, /response_validation: body should not contain a key not specified in validation body/, 'error should have been properly formatted' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: true,
                            value: 'test'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should should not require keys when required: false', function( done ) {
            helper.setResponse( {} );

            var completion_handler = function( err ) {
                assert.isUndefined( err, 'should not have been an error' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: false,
                            value: 'test'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should not work when response code is not equal', function( done ) {
            helper.setResponse( { test: 'test' }, 404 );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should have been an error' );
                assert.match( err.message, /response_validation: http response code invalid/, 'error should have been properly formatted' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    body: {
                        test: {
                            required: false,
                            value: 'test'
                        }
                    }
                }, completion_handler );
            } );
        } );

        describe( 'Default values in response validation', function() {

            it( 'Should default to 200 expected, positive case', function( done ) {
                helper.setResponse( { test: 'test' } );

                var completion_handler = function( err ) {
                    assert.isUndefined( err, 'should not have been an error' );
                    done();
                };

                assert.doesNotThrow( function() {
                    trust( {
                        path: '/test',
                        method: 'get'
                    }, {
                        content_type: /json/,
                        body: {
                            test: {
                                required: true,
                                value: 'test',
                                type: 'string'
                            }
                        }
                    }, completion_handler );
                } );
            } );

            it( 'Should default to 200 expected, negative case', function( done ) {
                helper.setResponse( { test: 'test' }, 404 );

                var completion_handler = function( err ) {
                    assert.isDefined( err, 'should have been an error' );
                    assert.match( err.message, /response_validation: http response code invalid/, 'error should have been properly formatted' );
                    done();
                };

                assert.doesNotThrow( function() {
                    trust( {
                        path: '/test',
                        method: 'get'
                    }, {
                        content_type: /json/,
                        body: {
                            test: {
                                required: false,
                                value: 'test'
                            }
                        }
                    }, completion_handler );
                } );
            } );

        } );

        after( function( done ) {
            helper.after().then( done );
        } );

    } );
}) ();
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
                assert.match( err.message, /INCORRECT_VALUE/, 'error should have been properly formatted' );
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
                assert.match( err.message, /INCORRECT_VALUE/, 'error should have been properly formatted' );
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
                assert.match( err.message, /INCORRECT_TYPE/, 'error should have been properly formatted' );
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
                assert.match( err.message, /MISSING_KEY/, 'error should have been properly formatted' );
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
                assert.match( err.message, /UNKNOWN_KEY/, 'error should have been properly formatted' );
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
                assert.match( err.message, /INVALID_HTTP_CODE/, 'error should have been properly formatted' );
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

        it( 'Should not work when response content type is not equal', function( done ) {
            helper.setResponse( { test: 'test' }, 200 );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should have been an error' );
                assert.match( err.message, /INCORRECT_CONTENT_TYPE/, 'error should have been properly formatted' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /different/,
                    body: {
                        test: {
                            required: false,
                            value: 'test'
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should be able to validate nested objects', function( done ) {
            helper.setResponse( { test: 'test', nested: { test: 'derp' } } );

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
                        },
                        nested: {
                            type: 'object',
                            nested: {
                                test: {
                                    required: true,
                                    value: 'derp'
                                }
                            }
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should find it invalid when nested key is invalid', function( done ) {
            helper.setResponse( { test: 'test', nested: { test: 'derp' } } );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should be an error' );
                assert.match( err.message, /INCORRECT_VALUE/, 'error should match' );
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
                        },
                        nested: {
                            type: 'object',
                            nested: {
                                test: {
                                    required: true,
                                    value: 'wrong'
                                }
                            }
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should be able to validate array of objects', function( done ) {
            helper.setResponse( [ { test: 'test' }, { test: 'test' } ] );

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
                    type: 'array',
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

        it( 'Should throw in array of objects when one is wrong', function( done ) {
            helper.setResponse( [ { test: 'test' }, { wrong: 'test' } ] );

            var completion_handler = function( err ) {
                assert.isDefined( err, 'should be an error' );
                assert.match( err.message, /UNKNOWN_KEY/, 'error should match' );
                done();
            };

            assert.doesNotThrow( function() {
                trust( {
                    path: '/test',
                    method: 'get'
                }, {
                    code: 200,
                    content_type: /json/,
                    type: 'array',
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

        it( 'Should be able to vaidate nested array', function( done ) {
            helper.setResponse( { test: 'test', nested: [ { test: 'test' }, { test: 'test' } ] } );

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
                        },
                        nested: {
                            type: 'array',
                            nested: {
                                test: {
                                    value: 'test'
                                }
                            }
                        }
                    }
                }, completion_handler );
            } );
        } );

        it( 'Should throw when error in nested array', function( done ) {
            helper.setResponse( { test: 'test', nested: [ { test: 'error' }, { test: 'test' } ] } );

            var completion_handler = function( err ) {
                assert.isDefined( err );
                assert.match( err.message, /INCORRECT_VALUE/ );
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
                        },
                        nested: {
                            type: 'array',
                            nested: {
                                test: {
                                    value: 'test'
                                }
                            }
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
                    assert.match( err.message, /INVALID_HTTP_CODE/, 'error should have been properly formatted' );
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

            it( 'Should default to /json/ expected, positive case', function( done ) {
                helper.setResponse( { test: 'test' }, 200 );

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
                        body: {
                            test: {
                                required: false,
                                value: 'test'
                            }
                        }
                    }, completion_handler );
                } );
            } );

            it( 'Should default to required: true, positive case', function( done ) {
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
                                value: 'test'
                            }
                        }
                    }, completion_handler );
                } );
            } );

            it( 'Should default to required: true, negative case', function( done ) {
                helper.setResponse( { } );

                var completion_handler = function( err ) {
                    assert.isDefined( err, 'should not have been an error' );
                    assert.match( err.message, /MISSING_KEY/, 'error should have been properly formatted' );
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

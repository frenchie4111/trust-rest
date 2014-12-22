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

        after( function( done ) {
            helper.after().then( done );
        } );

    } );
}) ();
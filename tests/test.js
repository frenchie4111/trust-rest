/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var chai = require( 'chai' ),
        assert = chai.assert,
        helper = require( './lib/helper' );

    var trust_lib = require( '../' );

    describe( 'Smoke test', function() {
        before( function( done ) {
            helper.before().then( done );
        } );

        it( 'Should work when valid', function( done ) {
            var trust = trust_lib( 'http://127.0.0.1:' + helper.port );

            var completion_handler = function( err ) {
                assert.isUndefined( err );
                done();
            };

            assert.doesNotThrow( function() {
                trust( completion_handler, {
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
                } );
            } );
        } );

        after( function( done ) {
            helper.after().then( done );
        } );

    } );
}) ();
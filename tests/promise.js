/**
* Copyright of Michael Lyons
*
* Authors:
*     - Michael Lyons (mdl0394@gmail.com)
*/

(function() {
    'use strict';

    var chai = require( 'chai' ),
        assert = chai.assert,
        helper = require( './lib/helper' );

    var trust_lib = require( '../' ),
        trust = null;

    before( function( done ) {
        helper
            .before()
            .then( function() {
                trust = trust_lib( 'http://127.0.0.1:' + helper.port );
                done();
            } );
    } );

    describe( 'Promise validations', function() {
        it( 'Should return promise', function( done ) {
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
            } )
                .then( function() {
                    console.log( arguments );
                } )
                .then( done )
                .catch( done );
        } );
    } );

    after( function( done ) {
        helper.after().then( done );
    } );
})();
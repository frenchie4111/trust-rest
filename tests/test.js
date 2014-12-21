/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var chai = require( 'chai' ),
        assert = chai.assert,
        helper = require( './lib/helper' );

    describe( 'Smoke test', function() {
        before( function( done ) {
            helper.before().then( done );
        } );

        it( 'Should true', function() {
            assert( true );
        } );

        after( function( done ) {
            helper.after().then( done );
        } );

    } );
}) ();
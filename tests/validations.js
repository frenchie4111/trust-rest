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

        var valid_in = {
            method: 'get'
        };

        var valid_out = {

        };

        it( 'Should not be valid when no method specified', function() {
            var invalid_in = _.clone( valid_in );
            delete invalid_in.method;

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, 'in_options: method not specified: expected {} to have a property \'method\'' );
        } );

        it( 'Should not be valid when no method is not a string', function() {
            var invalid_in = _.clone( valid_in );
            invalid_in.method = 1;

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, 'in_options: method not a string: expected 1 to be a string' );
        } );

        it( 'Should not be valid when no method is not a string', function() {
            var invalid_in = _.clone( valid_in );
            invalid_in.method = 'NOT CORRECT';

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, 'in_options: method not valid method: expected [ \'get\', \'put\', \'post\', \'delete\' ] to include \'NOT CORRECT\'' );
        } );
    } );
}) ();
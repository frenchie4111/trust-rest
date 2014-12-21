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
            method: 'get',
            path: '/test'
        };

        var valid_out = {

        };

        it( 'Should not be valid when no method specified', function() {
            var invalid_in = _.clone( valid_in );
            delete invalid_in.method;

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, /in_options: method not specified/ );
        } );

        it( 'Should not be valid when no method is not a string', function() {
            var invalid_in = _.clone( valid_in );
            invalid_in.method = 1;

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, /in_options: method not a string/ );
        } );

        it( 'Should not be valid when method is not in valid methods list', function() {
            var invalid_in = _.clone( valid_in );
            invalid_in.method = 'NOT CORRECT';

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, /in_options: method not valid method/ );
        } );

        it( 'Should work with all valid methods', function() {
            var other_methods = [ 'get', 'put', 'post', 'delete' ];

            _.each( other_methods, function( other_method ) {
                var other_method_in = _.clone( valid_in );
                other_method_in.method = other_method;

                assert.doesNotThrow( function() {
                    trust( valid_done, other_method_in, valid_out );
                } );
            } );
        } );

        it( 'Should not be valid when no path specified', function() {
            var invalid_in = _.clone( valid_in );
            delete invalid_in.path;

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, /in_options: path not specified/ );
        } );

        it( 'Should not be valid when no path is not a string', function() {
            var invalid_in = _.clone( valid_in );
            invalid_in.path = 1;

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, /in_options: path not a string/ );
        } );

        it( 'Should not be valid when path does not start with /', function() {
            var invalid_in = _.clone( valid_in );
            invalid_in.path = 'NOT CORRECT';

            assert.throws( function() {
                trust( valid_done, invalid_in, valid_out );
            }, /in_options: path doesn't start with \// );
        } );
    } );
}) ();
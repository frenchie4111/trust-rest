/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var test_server = require( '../test_server' );

    module.exports.before = function() {
        return test_server
            .start()
            .then( function( port ) {
                module.exports.port = port;
            } );
    };

    module.exports.after = function() {
        return test_server.stop();
    };

}) ();
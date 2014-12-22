/**
 * Created by Michael Lyons (mdl0394@gmail.com)
 */

(function() {
    var test_server = require( '../test_server' );

    module.exports.before = function() {
        return test_server
            .start()
            .then( function( server ) {
                module.exports.port = server.address().port;
                module.exports.server = server;
            } );
    };

    module.exports.after = function() {
        return test_server.stop();
    };

}) ();
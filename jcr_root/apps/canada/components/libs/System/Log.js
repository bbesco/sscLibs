
/* globals use org java currentPage currentNode sling console System */
/* System/Log.js
* @description: A libary for storing information within a Node
* @author: Government of Canada
*/
"use strict";
use( [], function( ) {

    var logger = { version: "1.0" };


    function log( type, text ) {
        var now = new Date();
        console.log( "\n#######################################" );
        console.log(
            "\n[" + type + "] " +
            text
        );
        console.log( "\n#######################################" );
    }

    /**
     * set
     * @param   {string} text   - the text to log
     */
    logger.debug = function( text ) {
        log( "DEBUG", text );
    };

    return logger;
} );

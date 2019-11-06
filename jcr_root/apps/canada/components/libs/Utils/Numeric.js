/* globals use org java */
/* Utils/Numeric.js
* @description: A libary for dealing with numeric objects
* @author: Government of Canada
*/
"use strict";
use( [], function() {

    var numeric = { "version": "1.0" };

    /**
     * toLocaleString
     * @param   {string} iso    the 2 letter ISO 639 language code
     * @param   {number} number the number required to format
     * @returns {string} local based formatted string representation of a number
     */
    numeric.toLocaleString = function( iso, number ) {
        var tag = ( iso ) ? iso : "en",
            locale = org.apache.commons.lang3.LocaleUtils.toLocale( tag ),
            format = java.text.NumberFormat.getInstance( locale );

        return format.format( parseInt(number) );
    };

    /**
     * random
     * @param   {integer} min minimum value of a random integer
     * @param   {integer} max maximun value of a random integer
     * @returns {integer} a random integer
     */
    numeric.random = function( min, max ) {
        return  org.apache.commons.lang3.RandomUtils.nextInt( min, max );
    };

    return numeric;
} );

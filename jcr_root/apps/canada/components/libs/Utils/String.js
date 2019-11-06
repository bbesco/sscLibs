/* globals use xssAPI org java */
/* Utils/String.js !!
* @description: A libary for various string function
* @author: Government of Canada
*/
"use strict";
use( function() {
    var string = { "version": "1.0" };
    var boolFalse = [ "0", "", null ];


    /**
     * Check to see if Object is empty - Collection safe
     * @param {string|collection} object - pass the string and/or collection
     */
    string.isEmpty = function( object ) {
        if ( object === null || object instanceof org.mozilla.javascript.Undefined ||
        	org.apache.commons.lang3.StringUtils.isWhitespace( object ) ) {
            return true;
        }

        return org.apache.commons.lang3.StringUtils.isEmpty( object );
    };

    /**
     * Check to see if a string contains another string - case insensitive
     * @param {string} text    - the text to check against
     * @param {string} substring - string to check for
     * @param {boolean} ignorecase - set checks to ignorecase
     */
    string.contains = function( text, substring, ignorecase ) {

        if ( ignorecase ) {
            text = text.toLowerCase();
            substring.toLowerCase();
        }

        return ( text.indexOf( substring ) > -1 );
    };

    /**
     * Check to see if a string starts with a substring
     * @param {string} text    - the text to check against
     * @param {string} substring - string to check for
     */
    string.startsWith = function( text, substring ) {
        return org.apache.commons.lang3.StringUtils.startsWith( text, substring );
    };

    /**
     * Check to see if a string ends with a substring
     * @param {string} text    - the text to check against
     * @param {string} substring - string to check for
     */
    string.endsWith = function( text, substring ) {
        return org.apache.commons.lang3.StringUtils.endsWith( text, substring );
    };

    /**
     * Stringify any object
     * @param {object} object key
     * @returns {string} string equivalent of what ever value it is given
     */
    string.stringify = function( obj ) {
        return JSON.stringify( obj, _replacer );
    };

    /**
     * JSON.stringify replacer function to allow for console.log output
     * @param {key} string - the string to object key
     * @param {value} object/number/string - and instance spacific value for an object
     * @returns {string} string equivalent of what ever value it is given
     */
    function _replacer( key, value ) {
        var returnValue = value;

        try {
            if ( value.getClass() !== null ) {
                if ( value instanceof java.lang.Number ) {
                    returnValue = 1 * value;
                } else if ( value instanceof java.lang.Boolean ) {
                    returnValue = value.booleanValue();
                } else {
                    returnValue = "" + value;
                }
            }
        } catch ( err ) {}

        return returnValue;
    }


    /** *
    * same - a function checks an array of strings to be the same
    * @param: [String] array - array of strings
    *@notes:
    *- an array of 1 item will always return true
    *- an array of 0 items will always return false
    **/
    string.same = function( array ) {
        if ( array.length < 2 ) {
            return ( array.length == 1 ) ? true : false;
        }
        var index = array[ 0 ];

        for ( var i = 1; i < array.length; i++ ) {
            if ( index != array[ i ] ) {
                return false;
            }
        }

        return true;
    };

    /**
     * join an array with an delimiter
     * @param: {string} array  of text to join
     * @param: {string} delimiter string to join the elements
     */
    string.join = function( array, delimiter ) {
        return org.apache.commons.lang3.StringUtils.join( array, delimiter );
    };

    /**
     * join an array with an delimiter
     * @param: {string} array  of text to join
     * @param: {string} delimiter string to join the elements
     */
    string.trim = function( text ) {
        return org.apache.commons.lang3.StringUtils.trim( text );
    };


     /***
     * Return a new string with replaced values ( null safe )
     * @param {string} haystack - the string to be search against
     * @param {string} needle - the search term
     * @param {string} replacement - the replacing value
     * @returns {string} replaced string
     */
    function replace( haystack, needle, replacement ) {
        return org.apache.commons.lang3.StringUtils.replace( haystack, needle, replacement );
    }

     /**
     * Pollinate alters a string in various ways
     * @param {string} text - the text to alter
     * @param {string} treatment - the type of treatment you want to do on a string
     * @param {string} pollen - the string to decorate the initial text with
     * @returns {string} the new string or original if no treatent was found
     */
    string.pollinate = function( text, treatment, pollen ) {

        if ( treatment === "wedge" ) {
            return replace( "" + pollen, "|-|", text );
        }

        if ( treatment === "infuse" ) {
            var words = org.apache.commons.lang3.StringUtils.split( text );

            for ( var idx = 0; idx < words.length; idx++ ) {
                words[ idx ] = "" + pollen + words[ idx ];
            }

            return org.apache.commons.lang3.StringUtils.join( words );
        }

        if ( treatment === "prefix" ) {
            return "" + pollen + text;
        }

        return text;
    };

    return string;
} );

/* globals use xssAPI org java */
/* Gumbo.js
* @description: A libary for various string function
* @author: Government of Canada
*/
"use strict";
use( function()
{
    var boolFalse = [ "0", "", null ];
    /**
     * Makes the string JS safe from XSS injection
     * @param {string} text - the string that needs to be sanitized
     */
    function forJavascript( text )
    {
        return xssAPI.encodeForJSString( text );
    }

    /**
     * Makes the string HTML Attribute safe from XSS injection
     * @param {string} text - the string that needs to be sanitized
     */
    function forHTMLAttribute( text )
    {
        return xssAPI.encodeForHTMLAttr( text );
    }

    /**
     * Makes the string HTML safe from XSS injection
     * @param {string} text - the string that needs to be sanitized
     */
    function forHTML( text )
    {
        return xssAPI.encodeForHTML( text );
    }

    /**
     * Makes the string HTML safe from XSS injection
     * @param {string} text - the string that needs to be sanitized
     */
    function filterHTML( text )
    {
        return xssAPI.filterHTML( text );
    }

    /**
     * Checks to see if the array/collection is empty (null-safe)
     * @param {array} collection - the collection to check if empty
     * @return {boolean} - True/False if collection is empty
     */
    function isCollectionEmpty( collection )
    {
        if ( collection.isEmpty() || collection == null )
        {
            return true;
        }

        return false;
    }
    /**
     * Check to see if Object is empty - Collection safe
     * @param {string|collection} object - pass the string and/or collection
     */
    function isEmpty( object )
    {
        if ( object == null || object instanceof org.mozilla.javascript.Undefined 
        	|| org.apache.commons.lang3.StringUtils.isWhitespace(object))
        {
            return true;
        }

        return org.apache.commons.lang3.StringUtils.isEmpty( object );
    }

    /**
     * Check to see if a string contains any of the array of string in it
     * @param {string} text    - the text to check against
     * @param {array} options - array of string to check for
     */
    function containsAny( text, options )
    {
        for ( var i = 0; i < options.length; i++ )
        {
            if ( text.indexOf( options[ i ] ) > -1 )
            {
                return true;
            }
        }
        return false;
    }

    /**
     * Check to see if a string contains another string - case insensitive
     * @param {string} text    - the text to check against
     * @param {string} substring - string to check for
     * @param {boolean} ignorecase - set checks to ignorecase
     */
    function contains( text, substring, ignorecase )
    {
        if ( ignorecase )
        {
            text = text.toLowerCase();
            substring.toLowerCase();
        }

        return ( text.indexOf( substring ) > -1 );
    }

    /**
     * Check to see if a string starts with a substring
     * @param {string} text    - the text to check against
     * @param {string} substring - string to check for
     */
    function startsWith( text, substring )
    {
        return org.apache.commons.lang3.StringUtils.startsWith( text, substring );
    }

    /**
     * Check to see if a string ends with a substring
     * @param {string} text    - the text to check against
     * @param {string} substring - string to check for
     */
    function endsWith( text, substring )
    {
        return org.apache.commons.lang3.StringUtils.endsWith( text, substring );
    }

    /**
     * Removes newline from the end of text if it's there, otherwise leaves it alone.
     * @param {string} text    - the text to check against
     */
    function chomp( text )
    {
        return org.apache.commons.lang3.StringUtils.chomp( text );
    }

    /**
     * Trims a line to remove extra space with a chomp.
     * @param {string} text    - the text to check against
     */
    function trim( text )
    {
        return org.apache.commons.lang3.StringUtils.trimToEmpty( chomp( text ) );
    }

    /**
     * Removes the last character from a String.
     * @param {string} text    - the text to check against
     */
    function chop( text )
    {
        return org.apache.commons.lang3.StringUtils.chop( text );
    }

    /**
     * Check is string is representative of false.
     * @param {string|array|boolean} text    - the text to check against
     */
    function exists( text )
    {
        if ( typeof text == "boolean" )
        {
            return text;
        }

        if ( text instanceof Array )
        {
            return ( text.length > 0 ) ? true : false;
        }

        for ( var idx = 0; idx < boolFalse.length; idx++ )
        {
            if ( org.apache.commons.lang3.StringUtils.equalsIgnoreCase( boolFalse[ idx ], text ) )
            {
                return false;
            }
        }

        return true;
    }

    /**
     * Pollinate alters a string in various ways
     * @param {string} text - the text to alter
     * @param {string} treatment - the type of treatment you want to do on a string
     * @param {string} pollen - the string to decorate the initial text with
     * @returns {string} the new string or original if no treatent was found
     */
    function pollinate( text, treatment, pollen ) {

        if ( treatment == "wedge" )
        {
            return replace( "" + pollen, "|-|", text );
        }

        if ( treatment == "infuse" )
        {
            var words = org.apache.commons.lang3.StringUtils.split( text );

            for ( var idx = 0; idx < words.length; idx++ ) {
                words[ idx ] = "" + pollen + words[ idx ];
            }

            return org.apache.commons.lang3.StringUtils.join( words );
        }

        if ( treatment == "prefix" )
        {
            return "" + pollen + text;
        }

        return text;
    }

    /**
     * Abbreviates a String using ellipses.
     * @param {string} text - the text to alter
     * @param {integer} max - the max width of the string
     * @returns {string} the new string
     */
    function abbreviate( text, max ) {

        max = ( max < 4 && !isEmpty( text ) ) ? 4 : max;

        return org.apache.commons.lang3.StringUtils.abbreviate( text, max );
    }

    /**
     * StringToArray creates an array from various string formats
     * @param {string} text - the text to check against
     */
    function stringToArray( text )
    {
        var core = org.apache.commons.lang3.StringUtils.substringBetween( text, "[", "]" );

        if ( contains( ".." ) )
        {
            var points = org.apache.commons.lang3.StringUtils.split( core, ".." ),
                start = parseInt( points[ 0 ] ),
                length = parseInt( points[ 2 ] ) - start;
            var range = [];
            for ( var idx = 0; idx < length; idx++ )
            {
                range[ idx ] = start++;
            }
            return range;
        }

        return org.apache.commons.lang3.StringUtils.split( core, "," );
    }

    /**
     * Check to see if a string is a stop word
     * @param {string} text    - the text to check against
     */
    function notStopWord( text )
    {
        if ( isEmpty( text ) )
        {

            return false;
        }

        return ( text.length() > 3 ) ? true : false;
    }
    /**
     * Return only the numbers in the string
     * @param {string} text - the string to inspect and return only the numbers from
     */
    function onlyNumbers( str )
    {
        if ( str == null )
        {
            return -1;
        }
        var builder = new java.lang.StringBuilder();
        var c;
        for ( var i = 0; i < str.length; i++ )
        {
            c = str.charAt( i );
            if ( java.lang.Character.isDigit( c ) || c == "." )
            {
                builder.append( c );
            }
        }

        return builder.toString();
    }

    /**
     * Return only the text in the string
     * @param {string} text - the string to inspect and return only the text from
     */
    function onlyText( text )
    {
        return ( text ) ? text.replaceAll( "[a-zA-Z]+", "" ) : "";
    }

    /**
     * Return a padded number
     * @param {string} text - the string to inspect and return only the text from
     */
    function pad( number )
    {
        if ( parseInt( number ) < 10 )
        {
            return "0" + number;
        }

        return "" + number;
    }

    /**
     * Return string with no vowels
     * @param {string} text - the string to inspect
     */
    function noVowels( text )
    {
        if ( isEmpty( text ) )
        {
            return "";
        }

        text = org.apache.commons.lang3.StringUtils.remove( text, "a" );
        text = org.apache.commons.lang3.StringUtils.remove( text, "e" );
        text = org.apache.commons.lang3.StringUtils.remove( text, "i" );
        text = org.apache.commons.lang3.StringUtils.remove( text, "o" );
        text = org.apache.commons.lang3.StringUtils.remove( text, "u" );

        return text;
    }

    /**
     * Return integer value of ISODate String the numbers in the string
     * @param {string} date - the string to inspect and return only the numbers from
     * @returns {integer} interger - integer representation of year|month|day (useful for datesorting)
     */
    function getIntegerFromISODate( sDate )
    {
        var numbers = ( sDate ) ? sDate.replaceAll( "\\D+", "" ) : "0";

        return parseInt( numbers );
    }

    /**
     * Gets a Date Object from a  condensed "20130921" datestring
     * @param   {string}   sDate a condensed datestring
     * @returns {date} return date object
     */
    function getISODateFromCondensedString( sDate )
    {
        return sDate.substring( 0, 4 ) + "-" + sDate.substring( 4, 6 ) + "-" + sDate.substring( 6, 8 );
    }

    /**
     * Get Julian Date from Date
     * @param {string} sDate - string of ISO date
     */
    function getJulianDateFromDate( sDate )
    {
        var date = new Date( sDate );

        return Math.ceil( ( date.getTime() / 86400000 ) - ( date.getTimezoneOffset() / 1440 ) + 2440587.5 );
    }

    /**
     * Return integer value of ISODate String the numbers in the string
     * @param {string} date - the string to inspect and return only the numbers from
     * @returns {integer} interger - integer representation of year|month|day (useful for datesorting)
     */
    function getISODateFromString( sDate )
    {
        var date = new Date( sDate );

        return ( date != null ) ?
                    date.getFullYear() + "-" + pad( date.getMonth() + 1 ) + "-" + pad( date.getDate() )
                    : "";
    }

    /**
     * Return integer value of ISODate String the numbers in the string
     * @param {string} date - the string to inspect and return only the numbers from
     * @returns {integer} interger - integer representation of year|month|day (useful for datesorting)
     */
    function getDateTimeStampFromString( sDate )
    {
        var date = new Date( sDate );

        return ( date != null ) ?
                    date.getFullYear() + "-" + pad( date.getMonth() + 1 ) + "-" + pad( date.getDate() ) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
                    : "";
    }

    /**
     * Stringify any object
     * @param {object} object key
     * @returns {string} string equivalent of what ever value it is given
     */
    function stringify( obj )
    {
        return JSON.stringify( obj, _replacer );
    }

    /**
     * JSON.stringify replacer function to allow for console.log output
     * @param {key} string - the string to object key
     * @param {value} object/number/string - and instance spacific value for an object
     * @returns {string} string equivalent of what ever value it is given
     */
    function _replacer( key, value )
    {
        var returnValue = value;
        
        try
        {
            if ( value.getClass() !== null )
            {
                if ( value instanceof java.lang.Number )
                {
                    returnValue = 1 * value;
                }
                else if ( value instanceof java.lang.Boolean )
                {
                    returnValue = value.booleanValue();
                }
                else
                {
                    returnValue = "" + value;
                }
            }
        }
        catch ( err )
        {
            // No worries... not a Java object
        }

        return returnValue;
    }
    /***
     * Return a new string with replaced values ( null safe )
     * @param {string} haystack - the string to be search against
     * @param {string} needle - the search term
     * @param {string} replacement - the replacing value
     * @returns {string} replaced string
     */
    function replace( haystack, needle, replacement )
    {
        return org.apache.commons.lang3.StringUtils.replace( haystack, needle, replacement );
    }

    /***
     * Return the complete string after a specific character
     * @param {string} haystack - the string to be search against
     * @param {string} needle - the search term
     * @returns {string} replaced string
     */
    function stringAfter( haystack, needle )
    {
        return org.apache.commons.lang3.StringUtils.substringAfter( haystack, needle );
    }
    
	/***
     * return array of string separated on delim
     * @param {string} str - the string to be split into an array
     * @param {string} delim - the delimiter to use for splitting. Defaults to space.
     * @returns {string[]} array - array generated by splitting string on delimiter character
     */
    function split(str, delim) 
    {
        delim = delim || " ";

        var array = str.split(delim);

        return array;
    }

    /***
     * return array of string separated on delim, removing any matches to stop words.
     * @param {string} str - the string to split
     * @param {string} delim - the delimiter to split on. Default space.
     * @returns {String[]} array - resulting array after splitting and removing stopwords.
     */
    function splitWithoutStopWords(str, delim) 
    {
        delim = delim || " ";
        var result = [];
        var array = str.split(delim);

        for (var indx in array) {
            if (notStopWord(array[indx])) {
                if(!isEmpty(array[indx])){
                	result.push(array[indx]);
                }
            }
        }

        return result;
    }
    
    /***
     * Return ret if any string in the array is found in the string. Return !ret otherwise
     * @param {string} str - the string to be checked for matches
     * @param {string[]} array - array of substring to check for
     * @param {boolean} ret - the return value on match
     * @returns {boolean} ret - the value to return on a match, otherwise !ret
     */
    function hasAny(str, array, ret) 
    {
        var found = false;
        var matcher = array.join("|");
        var test = new RegExp("\\b(" + matcher + ")\\b", "ig").test(str);

        if (array == null || array.length == 0) {
            return !ret;
        }

        return (test) ? ret : !ret;
    }
    
    /***
     * Return the number of matches from array found in string. Used for scoring search result relevancy
     * @param {string} str - the string to check for matches
     * @param {string[]} array - the array of substrings to match
     * @returns {number} count - the number of matches found in the string
     */
    function matchCount(str, array) 
    {
        var matcher = array.join("|");
        var re = new RegExp("\\b(" + matcher + ")\\b", "ig");
        var matches = str.match(re);
        var count = matches.length;

        return count;
    }

 
    
    return {
        isCollectionEmpty: isCollectionEmpty,
        isEmpty: isEmpty,
        forJavascript: forJavascript,
        forHTMLAttribute: forHTMLAttribute,
        forHTML: forHTML,
        filterHTML: filterHTML,
        onlyNumbers: onlyNumbers,
        onlyText: onlyText,
        noVowels: noVowels,
        containsAny: containsAny,
        contains: contains,
        endsWith: endsWith,
        startsWith: startsWith,
        chomp: chomp,
        chop: chop,
        exists: exists,
        trim: trim,
        pollinate: pollinate,
        abbreviate: abbreviate,
        stringify: stringify,
        replace: replace,
        stringToArray: stringToArray,
        stringAfter: stringAfter,
        notStopWord: notStopWord,
        getIntegerFromISODate: getIntegerFromISODate,
        getDateTimeStampFromString: getDateTimeStampFromString,
        getJulianDateFromISODate: getJulianDateFromDate,
        getISODateFromCondensedString: getISODateFromCondensedString,
        getISODateFromString: getISODateFromString,
    	split: split,
        splitWithoutStopWords: splitWithoutStopWords,
        hasAny: hasAny,
        matchCount: matchCount
    };
} );

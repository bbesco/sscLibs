
/* globals use org java */
/* Utils/Date.js
* @description: A libary for dealing with dates
* @author: Government of Canada
*/
"use strict";
use( [ "String.js" ], function( StrUtils ) {

    var uDate = {};
    var lang = currentPage.getLanguage( true );

    /**
     * Return a padded number
     * @param {string} text - the string to inspect and return only the text from
     */
    function pad( number ) {
        if ( parseInt( number ) < 10 ) {
            return "0" + number;
        }

        return "" + number;
    }

     /**
     * Return integer value of ISODate String the numbers in the string
     * @param {string} date - the string to inspect and return only the numbers from
     * @returns {integer} interger - integer representation of year|month|day (useful for datesorting)
     */
    uDate.getIntegerFromISODate = function( sDate ) {
        var numbers = ( sDate ) ? sDate.replaceAll( "\\D+", "" ) : "0";

        return parseInt( numbers );
    };

    /**
     * Gets a Date Object from a  condensed "20130921" datestring
     * @param   {string}   sDate a condensed datestring
     * @returns {date} return date object
     */
    uDate.getISODateFromCondensedString = function( sDate ) {
        return sDate.substring( 0, 4 ) + "-" + sDate.substring( 4, 6 ) + "-" + sDate.substring( 6, 8 );
    };

    /**
     * Get Julian Date from Date
     * @param {string} sDate - string of ISO date
     */
    uDate.getJulianDateFromDate = function( sDate ) {
        var date = new Date( sDate );

        return Math.ceil( ( date.getTime() / 86400000 ) - ( date.getTimezoneOffset() / 1440 ) + 2440587.5 );
    };

    /**
     * Return integer value of ISODate String the numbers in the string
     * @param {string} date - the string to inspect and return only the numbers from
     * @returns {integer} interger - integer representation of year|month|day (useful for datesorting)
     */
    uDate.getISODateFromString = function( sDate ) {
        var date = new Date( sDate );

        return ( date != null ) ?
                    date.getFullYear() + "-" + pad( date.getMonth() + 1 ) + "-" + pad( date.getDate() ) :
                    "";
    };

    /**
     * Return integer value of ISODate String the numbers in the string
     * @param {string} date - the string to inspect and return only the numbers from
     * @returns {integer} interger - integer representation of year|month|day (useful for datesorting)
     */
    uDate.getDateTimeStampFromString = function( sDate ) {
        var date = new Date( sDate );

        return ( date != null ) ?
                    date.getFullYear() + "-" + pad( date.getMonth() + 1 ) + "-" + pad( date.getDate() ) + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() :
                    "";
    };


    /*
    epoch - a that parses the epoch seconds to a specific date
    @param: <String> text - the epoch seconds to format
    @param: <Function> render - the Mustache context specific function to render
    */
    uDate.epochToDate = function( text, format ) {

        if ( StrUtils.isEmpty( text ) ) {
            return "";
        }

        format = ( format ) ? format : "MMMM dd";

        // lets get the dateformat object
        var datefmt = new java.text.SimpleDateFormat( format, lang );
            datefmt.setTimeZone( java.util.TimeZone.getTimeZone( "GMT " ) );

        // parse the date
        var date = new java.util.Date( parseInt( text ) * 1000 );

        return datefmt.format( date );
    };

    return uDate;
} );

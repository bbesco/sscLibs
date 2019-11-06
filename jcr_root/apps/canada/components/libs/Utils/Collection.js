/* globals use org java */
/* Utils/Collection.js
* @description: A libary for dealing with collections (Array/Hashmaps)
* @author: Government of Canada
*/
"use strict";
use( [ "String.js" ], function( Strings ) {

    var collection = { "version": "1.0" };

    /**
     * Checks to see if the array/collection is empty (null-safe)
     * @param {array} collection - the collection to check if empty
     * @return {boolean} - True/False if collection is empty
     */
     collection.isEmpty = function( _collection ) {
        if ( _collection == null || _collection.isEmpty() ) {
            return true;
        }
        return false;
    };

    /**
     * Check to see if a string contains any of the array of string in it
     * @param {string} text    - the text to check against
     * @param {array} options - array of string to check for
     */
    collection.containsAny = function( text, _collection, ignorecase ) {

        for ( var idx = 0; idx < _collection.length; idx++ ) {

            if ( Strings.contains( text, _collection[ idx ], ignorecase ) ) {
                return true;
            }
        }

        return false;
    };

    return collection;

} );

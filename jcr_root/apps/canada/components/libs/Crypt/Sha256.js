/* globals use org */
/* Crypt/Sha256.js
 * @description: A libary for accessing http resources outside of AEM
 * @author: Government of Canada
 */
"use strict";
use( function() {

    var sha256 = { "version": "1.0" };

    /**
     * Get
     * @param {[[Type]]} url [[Description]] the absolute path that is required to fetch
     * @returns {[[Type]]} Object [[Description]]  the response with the resource payload as well as HTTP status and error code.
     */
    sha256.hex = function( text ) {

        return org.apache.commons.codec.digest.DigestUtils.sha256Hex( text );

    };

    return sha256;

} );

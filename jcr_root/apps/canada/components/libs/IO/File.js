/* globals use Packages org java resource */
/* IO/File.js
 * @description: A libary for accessing file resources
 * @author: Government of Canada
 */
"use strict";
use( [], function() {

    var charset = java.nio.charset.Charset.forName( "UTF-8" );

    /**
     * GetJSON
     *  - get a JSON File from
     * @returns {JSONNative} from the file.
     */
    function getJSON( path ) {

        var resource = getResourceFromPath( path );

        if ( resource === false ) {
            return JSON.parse( "{\"error\":\"could not find resource [" + path + "]\"}" );
        }

        // Lets set up the stream
        var stream = getStreamFromResource( resource );

        if ( stream === false ) {
            return JSON.parse( "{\"error\":\"could not establish stream from resource [" + path + "]\"}" );
        }

        var json = getStringFromStream( stream );

        if ( json === false ) {
            return JSON.parse( "{\"error\":\"could not convert to JSON string [" + path + "]\"}" );
        }

        // Parse to JSON and return
        return JSON.parse( json );
    }

    function getContents( path ) {

        var resource = getResourceFromPath( path );

        if ( resource === false ) {
            return "";
        }

        // Lets set up the stream
        var stream = getStreamFromResource( resource );

        if ( stream === false ) {
            return "";
        }

        return getStringFromStream( stream );
    }

    /**
     * Gets a file stream from a file path
     * @returns {InputStream} from the file.
     */
    function getStream( path ) {

        var resource = getResourceFromPath( path );

        if ( resource == false ) {
            return resource;
        }

        // Lets set up the stream
        return getStreamFromResource( resource );
    }

    /**
     * Get the AEM Resource object from AEM
     * @param   {string} path - string path to resource
     * @returns {Resource} - AEM Resource
     */
    function getResourceFromPath( path ) {

        var file = resource.resourceResolver.getResource( path + "/jcr:content" );

        return ( file == null ) ?
                    false :
                    file;
    }

    /**
     * Get the input Stream from a resource
     * @param   {Resource} resource - AEM Resource Object
     * @returns {InputStream} - Java based java.io.InputStream
     */
    function getStreamFromResource( resource ) {

        var stream = Packages.com.day.cq.wcm.commons.WCMUtils.getNode( resource ).getProperty( "jcr:data" ).getStream();

        return ( stream == null ) ?
                    false :
                    stream;
    }

    /**
     * Converts a stream to string
     * @param   {InputStream} stream - java.io.InputStream
     * @returns {String} - a string
     */
    function getStringFromStream( stream ) {

        var builder = new java.lang.StringBuilder();
        var it = org.apache.commons.io.IOUtils.lineIterator( stream, charset );

        try {
            while ( it.hasNext() ) {
                var line = it.nextLine();
                builder.append( line );
            }
        } finally {
            it.close();
        }

        return builder.toString();
    }

    return {
        getJSON: getJSON,
        getStream: getStream,
        getContents: getContents
    };
} );

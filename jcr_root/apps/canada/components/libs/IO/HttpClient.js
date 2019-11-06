/* globals use org */
/* HttpClient.js
 * @description: A libary for accessing http resources outside of AEM
 * @author: Government of Canada
 */
"use strict";
use( function() {
    
    var ctimeout = "client-timeout";
    /**
     * timeout
     * @param {[Object]} headers - array of headers to add to the request
     * @returns {[int]]} integer of timeout.
     */
    function timeout( headers ) {
        if ( headers ) {
            for ( var idx = 0; idx < headers.length; idx++ ) {
                if ( headers[idx].name == ctimeout ) {
                    return parseInt( headers[idx].value );
                }
            }
        }
        return 30000;
    }

    /**
     * Get
     * @param {[[Type]]} url [[Description]] the absolute path that is required to fetch
     * @returns {[[Type]]} Object [[Description]]  the response with the resource payload as well as HTTP status and error code.
     */
    function get( url, headers ) {

        var client = new org.apache.commons.httpclient.HttpClient();
        var status = new org.apache.commons.httpclient.HttpStatus();
        var response = {
                status: false,
                payload: false,
                error: false,
                critical: false
            };
        

        // Add a sane timeout - 30 seconds
        client.setConnectionTimeout( timeout( headers ) );

        try {
            var request = generateGETRequest( url, headers );

            // Lets get status code first
            var statusCode = client.executeMethod( request );
            response.status = status.getStatusText( statusCode );
            
            // Lets stream the response
            var inputStream = request.getResponseBodyAsStream();
            var buffer = org.apache.commons.io.IOUtils.toByteArray( inputStream );
            
            // cast the buffer to a string for the response;
            response.payload = new java.lang.String( buffer );
            
        } catch ( e ) {
            response.error = e;
        } finally {

            if ( response.payload == null ) {
                response.critical = true;
                response.payload = false;
            }

            if ( request ) {
                request.releaseConnection();
            }
        }

        return response;
    }

    function post(url, headers, body){

        var client = new org.apache.commons.httpclient.HttpClient();
        var status = new org.apache.commons.httpclient.HttpStatus();
        var response = {
                status: false,
                payload: false,
                error: false,
                critical: false
            };
        

        // Add a sane timeout - 30 seconds
        client.setConnectionTimeout( timeout( headers ) );

        try {
            var request = generatePOSTRequest( url, headers, body );

            // Lets get status code first
            var statusCode = client.executeMethod( request );
            response.status = status.getStatusText( statusCode );
            
            // Lets stream the response
            var inputStream = request.getResponseBodyAsStream();
            var buffer = org.apache.commons.io.IOUtils.toByteArray( inputStream );
            
            // cast the buffer to a string for the response;
            response.payload = new java.lang.String( buffer );
            
        } catch ( e ) {
            response.error = e;
        } finally {

            if ( response.payload == null ) {
                response.critical = true;
                response.payload = false;
            }

            if ( request ) {
                request.releaseConnection();
            }
        }

        return response;

    }

    /**
     * GenerateRequest
     * @param {[[Type]]} url [[Description]] the absolute path that is required to fetch
     * @param {[Object]} headers - array of headers to add to the request
     * @returns {[[Type]]} Object [[Description]]  the response with the resource payload as well as HTTP status and error code.
     */
    function generateGETRequest( url, headers ) {
        var request = new org.apache.commons.httpclient.methods.GetMethod( url );

        if ( headers ) {
            for ( var idx = 0; idx < headers.length; idx++ ) {
                if ( headers[ idx ].name == ctimeout ){
                    continue;
                }
                var hdr = headers[ idx ];
                request.addRequestHeader( hdr.name, hdr.value );
            }
        }



        return request;
    }

    function generatePOSTRequest( url, headers, body ) {
        var request = new org.apache.commons.httpclient.methods.PostMethod( url );
        //var request = new org.apache.http.client.methods.HttpPost( url );
        //var entity = new org.apache.http.entity.StringEntity ( body, "UTF-8" );
        //entity.setContentEncoding( "UTF-8" );
        var entity = new org.apache.commons.httpclient.methods.StringRequestEntity(
    		body,
    		"application/json",
    		"UTF-8");

        if ( headers ) {
            for ( var idx = 0; idx < headers.length; idx++ ) {
                if ( headers[ idx ].name == ctimeout ){
                    continue;
                }
                var hdr = headers[ idx ];
                request.addRequestHeader( hdr.name, hdr.value );
            }
        }

        request.setRequestEntity( entity );





        return request;
    }


    return {
        get: get,
        post: post
    };
} );

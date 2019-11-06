/* globals use org */
/* HttpClient.js
 * @description: A libary for accessing http resources outside of AEM
 * @author: Government of Canada
 */
"use strict";
use(function() {

    /**
     * Get
     * @param {[[Type]]} url [[Description]] the absolute path that is required to fetch
     * @returns {[[Type]]} Object [[Description]]  the response with the resource payload as well as HTTP status and error code.
     */
    function get(url, headers) {

        var client = new org.apache.commons.httpclient.HttpClient();
        var status = new org.apache.commons.httpclient.HttpStatus();
        var response = {
            status: false,
            payload: false,
            error: false,
            critical: false
        };

        // Add a sane timeout - 30 seconds
        client.setConnectionTimeout(30000);

        try {
            var request = generateRequest(url, headers);

			// Lets set the status text
            response.status = status.getStatusText( client.executeMethod( request )  );

            // Lets set the body text
            response.payload = getBody( request );

        } catch (e) {
            response.error = e;
        } finally {

            if (response.payload == null) {
                response.critical = true;
                response.payload = false;
            }

            if (request) {
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
    function generateRequest(url, headers) {
        var request = new org.apache.commons.httpclient.methods.GetMethod(url);

        // Add some defaults
        request.addRequestHeader("Accept-Encoding","gzip;q=1.0, identity; q=0.5, *;q=0");
        request.addRequestHeader("Accept-Charset","utf-8");

        if (headers) {
            for (var idx = 0; idx < headers.length; idx++) {
                var hdr = headers[idx];
                request.addRequestHeader(hdr.name, hdr.value);
            }
        }

        return request;
    }

    /**
     * GetBody
     * @param {[[Request]]} requestobject used by the HTTPClient
     * @returns {[[String]]} string of the UTF-8 response content.
     */
    function getBody( request ) {

        var responseBody = new java.io.ByteArrayOutputStream();

        var stream = ( isCompressed( request) ) 
        				? org.apache.commons.io.IOUtils.copy( new java.util.zip.GZIPInputStream( request.getResponseBodyAsStream() ), responseBody )
        				: org.apache.commons.io.IOUtils.copy( request.getResponseBodyAsStream(),  responseBody );

        return responseBody.toString('UTF-8');
    }

	 /**
     * isCompressed - check to see if the response stream is using gzip
     * @param {[[Request]]} requestobject used by the HTTPClient
     * @returns {[[Boolean]]} true/false if response is gzipped or not.
     */
    function isCompressed(request) {

        var contentEncoding = request.getResponseHeader("Content-Encoding");

        if ( contentEncoding == null ) {
            return false;
        }

        var accept = contentEncoding.getValue();

        if ( accept.indexOf("gzip") < 0 )
        {
            return false;
        }

        return true;

    }

    // return object properties
    return {
        get: get
    };
});

/* globals use org java currentPage properties sling */
/* System/Node/Datasource.js
* @description: A libary for dealing with tags
* @author: Government of Canada
*/
"use strict";
use( [
        "../../IO/File.js",
        "../../IO/Net.js",
        "../../Utils/String.js",
        "../../Template/Engine.js",
        "../Log.js"
    ], function( FileUtils, NetUtils, StrUtils, Template, Logger) {

    var datasource = { version: "1.0" };
    var datastoreid = "./gcDatasource";

    /**
     * tags
     * @param   {string} property which stores the tags
     * @returns {array} array of language specific tags
     */
    datasource.get = function( node, parameters ) {

        var source = Template.render( properties.get( datastoreid ), parameters );

        if ( StrUtils.isEmpty( source ) ) {
            return {};
        }

        // Lets see if you are file
        if ( !source.startsWith( "http" ) ) {
            return FileUtils.getJSON( source );
        }

        // Lets see if you URI
        if ( source.startsWith( "http" ) ) {
             var resp = NetUtils.get( source );
             if ( resp.payload !== false ) {
                try {
                    return  JSON.parse( resp.payload );
                } catch ( e ) {
                    return {}
                }
             }
        }

        return {};
    };

    return datasource;
} );

/* globals use org Packages sling */
/* System/Enviroment.js
* @description: A libary for dealing system resolvers
* @author: Government of Canada
*/
"use strict";
use( [], function() {

    var enviroment = { version: "1.0" };
    var factory = sling.getService( Packages.org.apache.sling.api.resource.ResourceResolverFactory );
    var subservice = org.apache.sling.api.resource.ResourceResolverFactory.SUBSERVICE;
    var types = {
        "tag": [ "systemUser", Packages.com.day.cq.tagging.TagManager ],
        "session": [ "GCContentNodeFullAccessSystemUser", Packages.javax.jcr.Session ]
    };

    /**
     * get - get the underlying service api
     * @param {[[type]]} type [[Description]]
     * @returns {{object}} api object
     */
    enviroment.get = function( type ) {

        var catalog = {};

        catalog[ subservice ] = types[ type ][ 0 ];

        var resolver = factory.getServiceResourceResolver( catalog );

        return resolver.adaptTo( types[ type ][ 1 ] );
    };

    return enviroment;
} );

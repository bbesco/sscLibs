/* globals use org request */
/* Utils/URL.js
* @description: A libary for working with the current URL parameters of the page
* @author: Government of Canada
*/
"use strict";
use( [ "Collection.js", "String.js", "../Template/Engine.js" ], function( ColUtil, StrUtil, Template ) {

    var urll = { "version": "1.0" };

    /**
     * get
     *  - get all the parameters for the current page request
     * @param: {Boolean} asObject - do you want the parameters are an object
     * @returns {Boolean|Collection} And Collection of keys and values for Hashmaps. False if empty.
     */
    urll.get = function( asObject ) {
        var parameters = request.getRequestParameterMap();
        var mappings = ( asObject === true ) ? {} : [];

        if ( ColUtil.isEmpty( parameters ) ) {
            return mappings;
        }

        var entries = parameters.entrySet().iterator();

        while ( entries.hasNext() ) {
            var item = entries.next();
            var name = item.getKey();
            var param = request.getParameter( name ).trim();
            var value = param;
            try {
                value = decodeURIComponent( param );
            }catch (err) {
            }

            if ( asObject === true ) {
                mappings[ name ] = value;
                continue;
            }
            mappings.push( { "key": name, "value": value } );
        }

        return mappings;
    };

    /**
     * Flattens and alters the passed parameter of a item.key / item.value list
     * @param {array} list  - the parameters that need to flattened for the modified list
     * @param {string} name  - the name of the key that is being replaced
     * @param {string} value - the value of the key that is to be inserted
     */
    urll.infuse = function( list, name, value ) {
        var flattened = {},
            found = false;

        for ( var j = 0; j < list.length; j++ ) {

            var item = list[ j ];

            if ( item.key == name ) {
                flattened[ item.key ] = value;
                found = true;
                continue;
            }

            flattened[ item.key ] = item.value;
        }

        if ( !found ) {
            flattened[ name ] = value;
        }

        return flattened;
    };

    /**
     * Check to see if parameter exists if so return it safely
     * @param {string} name  - parameter name
     */
    urll.has = function( name, value ) {
        var parameter = request.getParameter( name );

        // Check if the parameter exists - if not then report false
        if ( StrUtil.isEmpty( parameter ) || value != parameter ) {
            return false;
        }

        return true;
    };


    /**
     * Siphon - filter the requesting parameter by an array of parameters
     * @param   { array } rules - parameters that are allowed to interact with the request
     * @returns { array } array of normalized parameters
     */
    urll.siphon = function( allowed, settings ) {
        var query = {};
        var searchterms = [];
        var requested = [];
        var coalesce = [];

        /* Parse Allowed Parameters
        ------------------------------------- */
        for ( var j = 0; j < allowed.length; j++ ) {

            // Ignore stripped items / and 'request' keyword since it is reserved
            if ( allowed[ j ].strip ) {
                continue;
            }

            // Get aliased parameter correct key for the API
            var item = allowed[ j ];
            var key = ( item.alias ) ?  StrUtil.trim( item.alias ) : StrUtil.trim( item.key );

            // Bake item value if not false
            if ( item.value ) {

                // Lets see if the item is query to component properties
                item.value = Template.render( item.value, settings );


                query[ item.key ] = item.value;

                if ( item.pollen ) {
                    item.value = StrUtil.pollinate( item.value, item.pollen.treatment, item.pollen.value );
                }

                requested.push( {
                    key: key,
                    value: item.value
                } );

                continue;
            }

            // Get parameter from query string
            var parameter = StrUtil.trim( request.getParameter( item.key ) );

            // Only process if there is a parameter
            if ( !StrUtil.isEmpty( parameter ) ) {

                // Lets add this to the query property
                query[ item.key ] = parameter;

                if ( item.pollen ) {
                    parameter = StrUtil.pollinate( parameter, item.pollen.treatment, item.pollen.value );
                }

                // Lets treat search terms correctly with quotes
                if ( item.type === "searchterm" ) {
                    searchterms.push( parameter );
                }

                if ( item.coalesce ) {
                    coalesce.push( item );
                    continue;
                }

                requested.push( {
                    key: key,
                    value: parameter
                } );
            }
        }

        // Lets see if we have filtered items
        // ** @NOTE: Filtered items are post query processing that include the searchterms as a whole
        if ( coalesce.length > 0 && searchterms.length > 0 ) {
            for ( var f = 0; f < coalesce.length; f++ ) {
                item = coalesce[ f ];
                key = ( item.alias ) ? StrUtil.trim( item.alias ) : StrUtil.trim( item.key );
                parameter = StrUtil.join( searchterms, " " );

                if ( typeof item.coalesce != "boolean" ) {
                    parameter = StrUtil.pollinate( parameter, item.coalesce.treatment, item.coalesce.value );
                }

                if ( item.prefix ) {
                    parameter = request.getParameter( item.key ) + parameter;
                }

                requested.push( {
                    key: key,
                    value: parameter
                } );
            }
        }

        return {
            query: query,
            requested: requested,
            searchterms: searchterms
        };
    };


    /**
     * GET Method of creating a URL from parameters
     * @private
     * @param {string} baseUrl - the absolute base path
     * @param {collection} parameters - the parameters to build the query with
     */
    function _get( baseUrl, parameters ) {

        var query = "?";

        for ( var j = 0; j < parameters.length; j++ ) {

            if ( parameters[ j ].key ) {
                var item = parameters[ j ];

                if ( j > 0 ) {
                    query = query + "&";
                }

                query = query + item.key + "=" + encodeURIComponent( item.value );
            }
        }

        return baseUrl + query;
    }

    /**
     * POST Method of creating a URL from parameters
     * @private
     * @param {string} baseUrl - the absolute base path
     * @param {collection} parameters - the parameters to build the query with
     */
    function _post( baseUrl, parameters ) {
        return _get( baseUrl, parameters );
    }

        /**
     * Build an HTTP URL
     * @param {string} baseUrl - the absolute base path
     * @param {collection} parameters - the parameters to build the query with
     * @param {string} method  - action for the URL (defaults to GET)
     */
    urll.build = function( baseUrl, parameters, method ) {
        return ( method != "post" ) ?
                    _get( baseUrl, parameters ) :
                    _post( baseUrl, parameters );
    };

    return urll;

} );

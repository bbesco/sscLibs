/* globals use JSON properties currentPage currentNode */
/*====================================
* Node library for working with Nodes using the Javascript USE API
* @author: Government of Canada
=====================================*/
"use strict";
use( [ "../Utils/String.js", "../Utils/Date.js", "Node/Store.js", "Node/Datasource.js" ], function(  StrUtils, DateUtils, Store, Datasource ) {

    var node = {};
    var lang = currentPage.getLanguage( true );
    var depthlimit = currentPage;

    /**
     * getChildren
     * @param {iterator} iterator 	the iterator that will be looped to get the children
     * @param - {boolean} recurse 	signals to recurse the iterator or not
     * @return - [array] of nodes
     **/
    function getChildren( node, recurse ) {

        var children = [];
        var iterator = node.listChildren();

        while ( iterator.hasNext() ) {
            var page = iterator.next();
            var reference = audit( page, recurse );
            var offspring = page.listChildren();

            reference.children = ( recurse == true && offspring.hasNext() ) ? getChildren( offspring, recurse ) : "";

            children.push( reference );
        }
        return children;
    }
    node.children = getChildren;


     /**
     * parents
     * @param {node} node  node to get the parents from
     * @return - {object} of node properties
     **/
    node.parents = function( crux ) {

        var nodes = [];
        var depthlimit = crux.getAbsoluteParent( 2 ).getDepth();
        var node = crux;

        while ( node.getDepth() > depthlimit ) {

            var page = audit( node, false );

            nodes.push( page );

            node = node.getParent();
        }
        return nodes;
    };

    /**
     * Get the tombstone data of the alternate node for a node
     * @param {Node} node - the node to explore
     * @returns {Object}  - the properties of the alternate node
     */
    function lastmodified( node ) {
        var props = node.getProperties();
        var lastmod = props.get( "cq:lastModified", Date.class );

        if ( props.get( "gcModifiedIsOverridden" ) === "true" ) {
            return props.get( "gcModifiedOverride" );
        }

        return DateUtils.getISODateFromString( lastmod );
    }
    node.lastmodified = lastmodified;

    /**
     * Get the tombstone data of the alternate node for a node
     * @param {Node} node - the node to explore
     * @returns {Object}  - the properties of the alternate node
     */
    function alternate( node ) {
        var props = node.getProperties();
        return {
            url: props.get( "gcAltLanguagePeer" ),
            path: props.get( "otherPath" ),
            title: props.get( "otherTitle" ),
            name: props.get( "otherName" )
        };
    }
    node.alternate = alternate;

     /**
     * audit
     * @param {node} node 	the node that will be audited
     * @param - {boolean} children 	to include children
     * @return - (object) of properties for the asking node
     **/
    function audit( node, recurse ) {

        var props = node.getProperties();

        var details = {
            lang: "" + lang,
            path: "" + node.path,
            title: "" + node.title,
            created: "" + props.get( "jcr:created" ),
            description: "" + props.get( "jcr:description" )
        };

        var hide = "" + props.get( "hideInNav" );

        if ( hide !== "true" ) {
            details.navigation = "show";
        }

        if ( recurse === true ) {
			details.children = getChildren( node, true );
        }

        if ( !StrUtils.isEmpty( props.get( "dtitle" )  )  ) {
            details.title = "" + props.get( "dtitle" );
        }

        // Lets do alternate language profile
        details.alternate =  StrUtils.stringify( alternate( node ) );

        // Lets do the last modified
        details.modified = lastmodified( node );

        return details;
    }
    node.audit = audit;

    /**
     * Serializes the node to a JSON format
     * @param {aem.node} node
     */
    function serialize( node ) {
        return StrUtils.stringify( audit( node, true ) );
    }
    node.serialize = serialize;

	// Refer to Node/Datasource.js for logic documentation
    node.datasource = Datasource.get;

    return node;

} );

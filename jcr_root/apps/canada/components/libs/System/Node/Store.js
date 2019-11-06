
/* globals use org java currentPage currentNode sling */
/* System/Node/Store.js
* @description: A libary for storing information within a Node
* @author: Government of Canada
*/
"use strict";
use( [ "../Enviroment.js" ], function( Enviroment ) {

    var store = { version: "1.0" };


    /**
     * set
     * @param   {node} node    the node
     * @param   {string} property    the property name to store a value in
     * @param   {object|string|integer} the property value to store
     * @returns {object|string|integer} the value of the object
     */
    store.set = function( node, property, value ) {

        //var session = Enviroment.get( "session" );
        //var _node = session.getNode( node.path );

        //_node.setProperty( property, value );

        //session.save();

        return value;
    };

    return store;
} );

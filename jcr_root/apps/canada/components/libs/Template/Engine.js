/* globals use org java currentPage */
/* Template/Engine.js
 * @description: A wrapper for the Mustache Templating engine
 * @author: Government of Canada
 */
"use strict";
use( [ "Engine/Mustache.js", "../Utils/String.js", "../Utils/Numeric.js", "../Utils/Date.js"], function( Mustache, StrUtils, NumUtils, DateUtils ) {

    var engine = { "version": "1.0" };
    var lang = currentPage.getLanguage( true );

	/*
	 numeric - a function to format a specific number to a local
     @param: <String> text - the number to format
     @param: <Function> render - the Mustache context specific function to render
    */
    function numeric( text, render ) {

        if ( StrUtils.isEmpty( text ) ) {
			return "";
        }

        return NumUtils.toLocaleString( lang,  render( text )  );
    };

    /*
	 epoch - a that parses the epoch seconds to a specific date
     @param: <String> text - the epoch seconds to format
     @param: <Function> render - the Mustache context specific function to render
    */
    function epoch( text, render ) {

        if ( StrUtils.isEmpty( text ) ) {
			return "";
        }

        return DateUtils.epochToDate( render( text ) );
    }

    /*
	 epoch - a that parses the epoch seconds to a specific date
     @param: <String> text - the epoch seconds to format
     @param: <Function> render - the Mustache context specific function to render
    */

    function dateCompare( text, render ) {

        if ( StrUtils.isEmpty( text ) ) {
			return "";
        }

        var aText = render( text ).split( " - " );

        if ( StrUtils.same( aText ) ) {
			return epoch( aText[ 0 ], render );
        }

        for ( var i = 0; i < aText.length; i++ ) {
			aText[ i ] = epoch( aText[ i ], render );
        }

        return StrUtils.join( aText, " - " );

    }

	/*
	 text - a function to encode url
     @param: <String> text - the paramter
     @param: <Function> render - the Mustache context specific function to render
    */
    function url_encode( text, render ) {

        if ( StrUtils.isEmpty( text ) ) {
			return "";
        }

        return encodeURIComponent( render( text )  );
    };    

	/*
	 text - a function to decode url
     @param: <String> text - the paramter
     @param: <Function> render - the Mustache context specific function to render
    */
    function url_decode( text, render ) {

        if ( StrUtils.isEmpty( text ) ) {
			return "";
        }

        return decodeURIComponent( render( text )  );
    };  

    /*
	 text - a function to replace , with </li> </li>
     @param: <String> text - the paramter
     @param: <Function> render - the Mustache context specific function to render
    */
    function replace( text, render ) {
    // Get the parameters
		var extractedParams = render( text ).split('~');

        if ( StrUtils.isEmpty( text ) || extractedParams.length <2) {
			return text;
        }

	if(extractedParams.length == 2)
        	return render( extractedParams[0] ).replace(/,/g,extractedParams[1]);
	if(extractedParams.length == 3)
        	return render( extractedParams[0] ).split(extractedParams[1]).join(extractedParams[2]); 
    };  


    /* pollenate - a worker function used to add lambdas to the current context object
     * @param - [[ Object ]] context - the object used to populate the mustache template
     * @returns - [[ Object ]] context - the enhanced object with the new properties
     */
    function pollenate( context ) {
        context[ ":epoch" ] = function() {
            return epoch;
        };
        context[ ":numeric" ] = function() {
            return numeric;
        };
        context[ ":datecompare" ] = function() {
            return dateCompare;
        };
        context[ ":url_encode" ] = function() {
            return url_encode;
        };
        context[ ":url_decode" ] = function() {
            return url_decode;
        };
        context[ ":replace" ] = function() {
            return replace;
        };

        return context;
    }

	/* render - a wrapper function used to add lambdas to the current context object
     */
    engine.render = function( template, context ) {
        return Mustache.render( template, pollenate( context ) );
    };

    return engine;
} );

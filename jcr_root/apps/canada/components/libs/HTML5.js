/* globals use */
/* HTML5.js
 * @description: A libary for dealing with HTML5 markup
 * @author: Government of Canada
 */
"use strict";
use([ "Gumbo.js" ], function( Gumbo ) {
    
    /**
     * increment HTML markup tags like "h1" to "h2"
     * @param {string} tag - the tag to increment
     */
    function increment( tag )
    {
       var index = parseInt( Gumbo.onlyNumbers( tag ) ) + 1;
       return  Gumbo.onlyText( tag ) + "" + index;
    }
    
    /**
     * decrement HTML markup tags like "h2" to "h1"
     * @param {string} tag - the tag to increment
     */
    function decrement( tag )
    {
        var index = parseInt( Gumbo.onlyNumbers( tag ) ) - 1;
        return  Gumbo.onlyText( tag ) + "" + _cap( index ) ;
        
    }
    
    /**
     * ensure that the lowest value in tag language is 1
     * @private
     * @param   {integer} index - the integer to check if below 1
     * @returns {integer} the new number if needed
     */
    function _cap( index )
    {
        return ( index < 1 ) ? 1 : index;
    }
    
    return {
      increment: increment,
      decrement: decrement
    }
});
/* globals use org java currentPage */
/* Template.js
 * @description: A libary for generating HTML source via template/data relationships
 * @author: Government of Canada
 */
"use strict";
use( [ "Gumbo.js", "Numeral.js" ], function( Gumbo, Numeral )
{
     var start = "\\{",
        end = "\\}",
        path = "[a-zA-Z0-9_$][\\.a-zA-Z0-9_]*", // E.g. config.person.name//

        rxVar = java.util.regex.Pattern.compile( start + "\\{\\s+(" + path + ")\\s+\\}" + end ),
        rxDate = java.util.regex.Pattern.compile( start + "%\\s+date+(.*?)\\s+\\%" + end ),
        rxLocale = java.util.regex.Pattern.compile( start + "%\\s+locale+(.*?)\\s+\\%" + end ),
        rxIf = java.util.regex.Pattern.compile( start + "%\\s+if" + "\\s+(" + path + ")\\s+%" + end + "(.*?)" + start + "%\\s+" + "endif" + "\\s+%" + end, java.util.regex.Pattern.DOTALL ),
        rxNot = java.util.regex.Pattern.compile( start + "%\\s+not" + "\\s+(" + path + ")\\s+%" + end + "(.*?)" + start + "%\\s+" + "endnot" + "\\s+%" + end, java.util.regex.Pattern.DOTALL ),

        rxFor = java.util.regex.Pattern.compile( start + "%\\s+for" + "\\s+(.*?)\\s+%" + end + "(.*?)" + start + "%\\s+endfor" + "\\s+%" + end, java.util.regex.Pattern.DOTALL ),
        rxComment = java.util.regex.Pattern.compile( start + "\\#" + "\\s+(.*?)\\s+" + "\\#" + end, java.util.regex.Pattern.DOTALL );

    /**
     * Cookbook - dot.notation enabled method that extract templates values from a collection
     * @param  {[type]} templates     templates to select
     * @param  {[type]} notation dot-notation of property wanted
     * @return {[type]}          string|array
     */
    function cookbook( templates, data )
    {

        for ( var idx = 0; idx < templates.length; ++idx )
        {

            if ( validate( templates[ idx ][ "trigger" ], data ) )
            {
                return generate( templates[ idx ][ "template" ], data );
            }
        }

        return "[error] no template found";
    }

    /**
     * Validate - dot.notation enabled method that validates a space delimited series of checks
     * @param  {string} condition    string of conditions (space delimited for multiple )
     * @param  {object} object to check against
     * @return {boolean} true/false if exists in object
     */
    function validate( condition, obj )
    {
        var conditions = org.apache.commons.lang3.StringUtils.split( condition );

        for ( var idx = 0; idx < conditions.length; ++idx )
        {

            if ( Gumbo.startsWith( conditions[ idx ], "!" ) )
            {

                var check = org.apache.commons.lang3.StringUtils.substringAfter( conditions[ idx ], "!" );

                if ( getProperty( obj, check ) == "" )
                {
                    return true;
                }

                continue;
            }

            if ( Gumbo.exists( getProperty( obj, conditions[ idx ] ) ) )
            {
                return true;
            }
        }

        return false;
    }

    /**
     * GetProperty - dot.notation enabled method that extract property values from object
     * @param  {[type]} data     object to extract data from
     * @param  {[type]} notation dot-notation of property wanted
     * @return {[type]}          string|array
     */
    function getProperty( data, notation )
    {
        var paths = ( Gumbo.startsWith( notation, "$" ) )
                        ? [ org.apache.commons.lang3.StringUtils.substringAfter( notation, "$" ) ]
                        : org.apache.commons.lang3.StringUtils.split( notation, "." );

        for ( var idx = 0; idx < paths.length; ++idx )
        {
            var key = paths[ idx ];

            if ( key in data )
            {
                data = data[ key ];
            }
            else
            {
                return "";
            }
        }

        return data;
    }

    /**
     * Command - replaces the property values and instruction with the corresponding values
     * @param  {string} template the template to inspect and chance out values with
     * @param  {object} data     data to inspect against
     * @return {string}          the newly conformed template
     */
    function command( text, data )
    {
        var constructs = org.apache.commons.lang3.StringUtils.split( text );

        if ( constructs.length == 1 )
        {
            return {
                name: "item",
                array: getProperty( data, constructs[ 0 ] )
            };
        }

        var range = ( Gumbo.startsWith( constructs[ 2 ], "[" ) )
                        ? Gumbo.stringToArray( constructs[ 2 ] )
                        : getProperty( data, constructs[ 2 ] );

        return {
            name: constructs[ 0 ],
            array: range
        };
    }

    /**
     * Loop - a preprocessing template based method to extropolotate loops
     * @param  {string} template the template to inspect and chance out values with
     * @param  {object} data     data to inspect against
     * @return {string}          the newly conformed template
     */
    function _forloop( template, data )
    {
        var loops = rxFor.matcher( template );

        while ( loops.find() )
        {

            var cmd = command( loops.group( 1 ), data ),

                concated = "";

            for ( var idx = 0; idx < cmd.array.length; idx++ )
            {

                var local = cmd.array[ idx ];

                concated += generate( loops.group( 2 ), local );
            }

            template = org.apache.commons.lang3.StringUtils.replace( template, loops.group( 0 ), concated );
        }

        return template;
    }

    /**
     * _comments - strips comments from the string text
     * @scope private
     * @param  {string} template the template to inspect and chance out values with
     * @return {string}          the newly conformed template
     */
    function _locale( template, data )
    {
        var properties = rxLocale.matcher( template );

        while ( properties.find() )
        {

            var constructs = org.apache.commons.lang3.StringUtils.split( properties.group( 1 ) ),
                property = Numeral.toLocaleString( constructs[ 0 ], getProperty( data, constructs[ 1 ] ) );

            template = org.apache.commons.lang3.StringUtils.replace( template, properties.group( 0 ), property );
        }

        return template;
    }

    /**
     * _comments - strips comments from the string text
     * @scope private
     * @param  {string} template the template to inspect and chance out values with
     * @return {string}          the newly conformed template
     */
    function _variables( template, data )
    {

        var properties = rxVar.matcher( template );

        while ( properties.find() )
        {
            var property = getProperty( data, properties.group( 1 ) );

            template = org.apache.commons.lang3.StringUtils.replace( template, properties.group( 0 ), property );
        }

        return template;
    }

    /**
     * _comments - strips comments from the string text
     * @scope private
     * @param  {string} template the template to inspect and chance out values with
     * @return {string}          the newly conformed template
     */
    function _datetime( template, data )
    {
        var properties = rxDate.matcher( template );

        while ( properties.find() )
        {

            var constructs = org.apache.commons.lang3.StringUtils.split( properties.group( 1 ) ),
                property = ( constructs[ 1 ] == "iso-date" )
                                ? Gumbo.getISODateFromString( getProperty( data, constructs[ 0 ] ) )
                                : Gumbo.getDateTimeStampFromString( getProperty( data, constructs[ 0 ] ), currentPage.getLanguage( false ).getLanguage() );

            template = org.apache.commons.lang3.StringUtils.replace( template, properties.group( 0 ), property );
        }

        return template;
    }

    /**
     * _comments - strips comments from the string text
     * @scope private
     * @param  {string} template the template to inspect and chance out values with
     * @return {string}          the newly conformed template
     */
    function _conditionals( template, data )
    {

        var ifs = rxIf.matcher( template ),
            property = false;

        while ( ifs.find() )
        {

            property = Gumbo.exists( getProperty( data, ifs.group( 1 ) ) );

            template = ( property )
                            ? org.apache.commons.lang3.StringUtils.replace( template, ifs.group( 0 ), generate( ifs.group( 2 ), data ) )
                            : org.apache.commons.lang3.StringUtils.replace( template, ifs.group( 0 ), "" );
        }

        var nots = rxNot.matcher( template );

        while ( nots.find() )
        {

            property = Gumbo.exists( getProperty( data, nots.group( 1 ) ) );

            template = ( !property )
                            ? org.apache.commons.lang3.StringUtils.replace( template, nots.group( 0 ), generate( nots.group( 2 ), data ) )
                            : org.apache.commons.lang3.StringUtils.replace( template, nots.group( 0 ), "" );
        }

        return template;
    }

    /**
     * _comments - strips comments from the string text
     * @scope private
     * @param  {string} template the template to inspect and chance out values with
     * @return {string}          the newly conformed template
     */
    function _comments( template )
    {

        var matches = rxComment.matcher( template );

        while ( matches.find() )
        {
            template = org.apache.commons.lang3.StringUtils.replace( template, matches.group( 0 ), "" );
        }

        return template;
    }

    /**
     * ParseStructures - parse and replaces the program structures (loops) in a template
     * @scope public
     * @param  {string} template the template to inspect and chance out values with
     * @return {string}          the newly conformed template
     */
    function parseStructures( template, data )
    {
        template = _forloop( template, data );

        return template;
    }

    /**
     * ParseLexical - parse and replaces the lexical poptions in a template
     * @scope public
     * @param  {string} template the template to inspect and chance out values with
     * @return {string}          the newly conformed template
     */
    function parseLexical( template, data )
    {
        template = _comments( template );
        template = _conditionals( template, data );
        template = _locale( template, data );
        template = _variables( template, data );
        template = _datetime( template, data );

        return template;
    }

    /**
     * Generate - parent method exposed by object
     * @scope public
     * @param  {string} template the template to inspect and chance out values with
     * @param  {object}
     * @return {string} the newly conformed template
     */
    function generate( template, data )
    {
        if ( template == "" )
        {
            return "";
        }

        // There is an order of execunion to maximize
        template = parseStructures( template, data );
        template = parseLexical( template, data );

        return org.apache.commons.lang3.StringUtils.trim( template );
    }

    // Return the function
    return {
        cookbook: cookbook,
        getProperty: getProperty,
        generate: generate
    };

});

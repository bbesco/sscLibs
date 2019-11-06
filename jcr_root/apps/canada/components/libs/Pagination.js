/* globals use request */
/* Pagination.js
 * @description: A libary for generating pagination links
 * @author: Government of Canada
 */
"use strict";
use( [ "URL.js" ], function( Url ) {

 	var searchText = {
	"en": {
		"prev": "Previous",
		"next": "Next",
        "hideText": " of search results"
		},
	"fr": {
		"prev": "Page précédente",
		"next": "Page suivante",
        "hideText": " des résultats de recherche"
		}
	}

    var lang = currentPage.getLanguage(false).getLanguage();
    var i18n = searchText[lang] || searchText.en
	
    /**
     * Generate a array of links for pagination
     * @param {integer} current   current offset
     * @param {integer} perpage    number of records per page (usually the display amount)
     * @param {integer} total    total records
     * @param {string} parameter parameter name that increments offset
     */
    function generate( current, perpage, total, param ) {
        // Lets not return anything when there are no results
        if ( total < 1 ) {
            return false;
        }
        
        var pages = Math.ceil( total / perpage ),
            page = Math.ceil( current / perpage ),
            low = perpage * ( page - 1 ),
            high = ( perpage * page ) - 1,
            parms = Url.parameters( false ),
            parameter = ( param ) ? param : "idx",
            startpage = ( page < 5 ) ? 0 : page - 4,
            endpage = 8 + startpage,
            pagination = [];

        endpage = ( pages < endpage ) ? pages - 1 : endpage;

        var difference = startpage - endpage + 8; 

        startpage -= ( startpage - difference > 0 ) ? difference : 0;

        // Previous Button
        pagination.push({
            query: Url.infuse( parms, parameter, ( page == 1 || current <= perpage ) ? 0 : ( page - 1 ) * perpage ),
            type: "previous",
            css: ( page == 0 ) ? "disabled" : ""
        });


        // Loop for Links to Pages
        for ( var pg = startpage; pg <= endpage; pg++ )
        {
            var offst = pg * perpage,
                range = offst - 1;
            
            //@adolfo add pg+1 to increment the page number
            pagination.push({
                text: pg + 1,
                query: Url.infuse( parms, parameter, offst ),
                type: "page",
                css: ( range >= low && range <= high ) ? "active" : ""
            });
        }

        // Next Button
        //@adolfo fix page+1 and add the data-sly-attribute.class="${item.css} in the template
        pagination.push({
            query: Url.infuse( parms, parameter, ( page === pages ) ? pages * perpage : perpage * ( page + 1 ) ),
            type: "next",
            css: ( page + 1 === pages ) ? "disabled" : ""
        });

        return pagination;
    }

    /**
     * Generate a array of links for pagination limited to a object mapping
     * @param {array} mapping   of URL parameters
     * @param {integer} current   current offset
     * @param {integer} perpage    number of records per page (usually the display amount)
     * @param {integer} total    total records
     * @param {string} parameter parameter name that increments offset
     */
    function harden( mapping, current, perpage, total, param ) {
        // Lets not return anything when there are no results
        if ( total < 1 ) {
            return false;
        }
        
        var pages = Math.ceil( total / perpage ),
            page = Math.ceil( current / perpage ),
            low = perpage * ( page - 1 ),
            high = ( perpage * page ) - 1,
            parms = [],
            parameter = ( param ) ? param : "idx",
            startpage = ( page < 5 ) ? 0 : page - 4,
            endpage = 8 + startpage,
            pagination = [];

        for ( var key in mapping )
        {
            if ( Url.has( key ) ) {
                parms.push({
                    key: key,
                    value: encodeURIComponent( request.getParameter( key ) )
                });
            }
        }

        endpage = ( pages < endpage ) ? pages - 1 : endpage;

        var difference = startpage - endpage + 8;

        startpage -= ( startpage - difference > 0 ) ? difference : 0;

        // Previous Button
        pagination.push({
            query: Url.infuse( parms, parameter, ( page == 1 || current <= perpage ) ? 0 : ( page - 1 ) * perpage ),
            type: "previous",
            css: ( page == 0 ) ? "disabled" : ""
        });


        // Loop for Links to Pages
        for ( var pg = startpage; pg <= endpage; pg++ )
        {
            var offst = pg * perpage,
                range = offst - 1;
            
            //@adolfo add pg+1 to increment the page number
            pagination.push({
                text: pg + 1,
                query: Url.infuse( parms, parameter, offst ),
                type: "page",
                css: ( range >= low && range <= high ) ? "active" : ""
            });
        }

        // Next Button
        //@adolfo fix page+1 and add the data-sly-attribute.class="${item.css} in the template
        pagination.push({
            query: Url.infuse( parms, parameter, ( page === pages ) ? pages * perpage : perpage * ( page + 1 ) ),
            type: "next",
            css: ( page + 1 === pages ) ? "disabled" : ""
        });

        return pagination;
    }

    

    /**
     * Generate a array of links for pagination limited to a object mapping
     * @param {array} mapping   of URL parameters
     * @param {integer} current   current offset
     * @param {integer} perpage    number of records per page (usually the display amount)
     * @param {integer} total    total records
     * @param {string} parameter parameter name that increments offset
     Pagination.generatePaging(userQueryParameter, offset, num, total, "idx" ),*/
     function generatePaging( mapping, current, perpage, total, param ) {
        // Lets not return anything when there are no results
        if ( total < 1 ) {
            return false;
        }

        var pages = Math.ceil( total / perpage ),
            page = Math.ceil( current / perpage ),
            low = perpage * ( page - 1 ),
            high = ( perpage * page ) - 1,
            parms = [],
            parameter = ( param ) ? param : "idx",
            startpage = ( page < 5 ) ? 0 : page - 4,
            endpage = 8 + startpage,
            pagination = [];

		var i, i_len;

        i_len = mapping.length;

        for ( i=0; i < i_len; i++) // var key in mapping )
        {
            var key = mapping[ i ];

            if ( Url.has( key ) ) {
                parms.push({
                    key: key,
                    value: encodeURIComponent( request.getParameter( key ) )
                });
            }
        }

        endpage = ( pages < endpage ) ? pages - 1 : endpage;

        var difference = startpage - endpage + 8;

        startpage -= ( startpage - difference > 0 ) ? difference : 0;
		var activePage = Math.ceil( current / perpage ) +1;
        var hiddenText = "Page {{text}}" + i18n.hideText;

        // Previous Button
        pagination.push({
            parms: parms,
            text: i18n.prev,
            query: Url.infuse( parms, parameter, ( page == 1 || current <= perpage ) ? 0 : ( page - 1 ) * perpage ),
            type: "previous",
            rel: "prev",
            css: ( page == 0 ) ? "wb-inv" : "",
            hideText: (lang=='en'? i18n.prev +" page ": i18n.prev) + i18n.hideText
        });

		 for( var pg = startpage; pg <= endpage; pg++ ) {
            var offst = pg * perpage,
            range = offst - 1;


            if(activePage == 1){ //special case for first page because of how the classes are needed
                if(range >= low && range <= high){
                    pagination.push({
                        text: pg + 1,
                        query: Url.infuse( parms, parameter, offst ),
                        type: "page",
                        rel: "",
                        css:  "active",
                        hideText: "Page " + (pg + 1) + i18n.hideText
                    });
                } else if( pg+1 == (activePage+1) || pg+1 == (activePage+2)) {
                    pagination.push({
                        text: pg + 1,
                        query: Url.infuse( parms, parameter, offst ),
                        type: "page",
                        rel: "",
                        css:"",
                        hideText: "Page " + (pg + 1) + i18n.hideText
                    });
				} else if( pg+1 == (activePage+3) || pg+1 == (activePage+4)) {
                    pagination.push({
                        text: pg + 1,
                        query: Url.infuse( parms, parameter, offst ),
                        type: "page",
                        rel: "",
                        css:"hidden-xs hidden-sm",
                        hideText: "Page " + (pg + 1) + i18n.hideText
                    });
                } else {
                	pagination.push({
                        text: pg + 1,
                        query: Url.infuse( parms, parameter, offst ),
                        type: "page",
                        rel: "",
                        css:"hidden-xs hidden-sm hidden-md",
                        hideText: "Page " + (pg + 1) + i18n.hideText
                    });
                }
            } else if(activePage == endpage){ //special case for last page because of how the classes are needed
                    if(range >= low && range <= high){
                        pagination.push({
                            text: pg + 1,
                            query: Url.infuse( parms, parameter, offst ),
                            type: "page",
                            rel: "",
                            css:  "active",
                        hideText: "Page " + (pg + 1) + i18n.hideText
                        });
                    } else if( pg+1 == (activePage-1) || pg+1 == (activePage-2)) {
                        pagination.push({
                            text: pg + 1,
                            query: Url.infuse( parms, parameter, offst ),
                            type: "page",
                            rel: "",
                            css:"",
                        hideText: "Page " + (pg + 1) + i18n.hideText
                        });
                    } else if( pg+1 == (activePage-3) || pg+1 == (activePage-4)) {
                        pagination.push({
                            text: pg + 1,
                            query: Url.infuse( parms, parameter, offst ),
                            type: "page",
                            rel: "",
                            css:"hidden-xs hidden-sm",
                        hideText: "Page " + (pg + 1) + i18n.hideText
                        });
                    } else {
                        pagination.push({
                            text: pg + 1,
                            query: Url.infuse( parms, parameter, offst ),
                            type: "page",
                            rel: "",
                            css:"hidden-xs hidden-sm hidden-md",
                        hideText: "Page " + (pg + 1) + i18n.hideText
                        });
                    }   
            } else if(range >= low && range <= high){
                pagination.push({
                    text: pg + 1,
                    query: Url.infuse( parms, parameter, offst ),
                    type: "page",
                    rel: "",
                    css:  "active",
                    hideText: "Page " + (pg + 1) + i18n.hideText
                });
            } else if(pg+1 == (activePage-1) || pg+1 == (activePage+1)) {
                pagination.push({
                    text: pg + 1,
                    query: Url.infuse( parms, parameter, offst ),
                    type: "page",
                    rel: "",
                    css:"",
                    hideText: "Page " + (pg + 1) + i18n.hideText
                });
            } else if(activePage == 2 && (pg+1 == (activePage+2) || pg+1 == (activePage+3))) {
                pagination.push({
                    text: pg + 1,
                    query: Url.infuse( parms, parameter, offst ),
                    type: "page",
                    rel: "",
                    css:"hidden-xs hidden-sm",
                    hideText: "Page " + (pg + 1) + i18n.hideText
                });
            } else if(pg+1 == (activePage-2) || pg+1 == (activePage+2)) {
                pagination.push({
                    text: pg + 1,
                    query: Url.infuse( parms, parameter, offst ),
                    type: "page",
                    rel: "",
                    css:"hidden-xs hidden-sm",
                    hideText: "Page " + (pg + 1) + i18n.hideText
                });
            } else {
                pagination.push({
                    text: pg + 1,
                    query: Url.infuse( parms, parameter, offst ),
                    type: "page",
                    rel: "",
                    css:"hidden-xs hidden-sm hidden-md",
                    hideText: "Page " + (pg + 1) + i18n.hideText
                });    
            } 
        }

        // Next Button
        pagination.push({
             text: i18n.next,
            query: Url.infuse( parms, parameter, ( page === pages ) ? pages * perpage : perpage * ( page + 1 ) ),
            type: "next",
             rel: "next",
            css: ( page + 1 === pages ) ? "wb-inv" : "",
            hideText: (lang=='en'? i18n.next +" page ": i18n.next) + i18n.hideText
        });


        return pagination;

    }

    return {
        generate: generate,
        harden: harden,
        generatePaging: generatePaging
    };
});


/**
 * 
 * Author: Lars Berg Hustveit (lars.berg@hustveit.org)
 * Created: 2012.02
 * Last edited date:
 * 
 *
 */



var search_result_counter = 0;
var search_result_tabs = new Array();	//array som held oversikt over talet på faner med søkeresultat.
										//inneheld div id på kvar fane med søkeresultat.



// GET data from html form.
function what_2_search_4_in_sindice() {
	var deferred = new dojo.Deferred();
	
	var thing_type_uri = null;
	var this_is_the_thing_we_are_looking_for = null; // thing_type_label
	var the_rdf_triples_we_are_looking_for = null;
	var use_this_google_map_icon = null;
	
	// Finn URI på tingen me leitar etter frå HTML skjema (radiobutton)
	for (var i=0; i < document.form_search_settings.thing2look4.length; i++) {
		if (document.form_search_settings.thing2look4[i].checked) {
			thing_type_uri = document.form_search_settings.thing2look4[i].value;
			break;
		}
	}
	
	if ( thing_type_uri == null ) {
		alert("thing_type_uri == null. Det er feil.");
	}
	else if (thing_type_uri == "text_search"){
		// Search for a string
		this_is_the_thing_we_are_looking_for = document.form_search_settings.input_text_search.value; // --> For example: hotel
	}
	else if (thing_type_uri == "everything"){
		this_is_the_thing_we_are_looking_for = null;
	}
	else {
		
		var search_for_this_thing = things_to_search_for_store.get(thing_type_uri); // Eksempel på input: http://data.sognefjord.vestforsk.no/resource/ontology#Hike
		
		this_is_the_thing_we_are_looking_for = search_for_this_thing.thing_type_label; // For example: Hike
		
		if ( search_for_this_thing.characterized_by_rdf_triples.length > 0 ) {
			
			var rdf_triples_to_search_for = [];
			
			for ( c in search_for_this_thing.characterized_by_rdf_triples ) {
				
				var triple = search_for_this_thing.characterized_by_rdf_triples[c];
				
				var predicate = "*";
				var object = "*";
				
				if ( triple.hasOwnProperty('triple_predicate') ){
					predicate = triple.triple_predicate;
				}
				
				if ( triple.hasOwnProperty('triple_object') ){
					object = triple.triple_object;
				}
				
				rdf_triples_to_search_for.push({
					"Subject":		"*",
					"Predicate":	predicate,
					"Object":		object
				});
				
			} //END for()
			
			if ( rdf_triples_to_search_for.length > 0 ) {
			
				the_rdf_triples_we_are_looking_for = { //object
					"RDFtriple": rdf_triples_to_search_for //object array
				};
				
				//
				// SET THING ICON
				//
				if (		thing_type_uri == "http://data.sognefjord.vestforsk.no/resource/ontology#Hike" ) {
					use_this_google_map_icon = "map_icon/hike_icon.png";
				}
				else if (	thing_type_uri == "http://data.sognefjord.vestforsk.no/resource/ontology#Hospital" ) {
					use_this_google_map_icon = "map_icon/bar_icon.png";
				}
				else if (	thing_type_uri == "http://data.sognefjord.vestforsk.no/resource/ontology#Museum" ) {
					use_this_google_map_icon = "map_icon/bar_icon.png";
				}
				
			}
			else {
				alert("Tingen har ingen RDF triplar til aa bruke i sooket. Det er feil.");
			}
		}
		else {
			alert("Tingen har ingen RDF triplar til aa bruke i sooket. Det er feil.");
		}
		
	} //END else
	
	var return_this_array = new Array();
	return_this_array.push(this_is_the_thing_we_are_looking_for);
	return_this_array.push(the_rdf_triples_we_are_looking_for);
	return_this_array.push(use_this_google_map_icon);
	return_this_array.push(thing_type_uri);

	deferred.resolve(return_this_array);
	return deferred;
} //END what_2_search_4_in_sindice()



function open_new_dojo_tab_showing_the_search_result(this_is_the_thing_we_are_looking_for) {
	var deferred = new dojo.Deferred();

	search_result_counter += 1;										//dette er søkeresultat nr..
	var new_tab_div_id =	"div_id_tab_search_result_" +			//lagar div id til ny fane
							search_result_counter;	
	search_result_tabs[search_result_counter] = new_tab_div_id;		//oppdaterar array

	//id til <div> der du vil opprette ny tab.
	//<div> må vere av type dojoType="dijit.layout.TabContainer"
	var display_result_tab_here = dijit.byId('div_id_tab_container');
	
	var new_result_tab = new dijit.layout.TabContainer({
		id:			new_tab_div_id, //<div id="...">
		title:		"Search " +
					search_result_counter +
					": " +
					this_is_the_thing_we_are_looking_for,
		//doLayout:	false,
		nested:		true,
		closable:	true,
		onClose: function(){
			// confirm() returns true or false
			var answer = confirm("Do you really want to close the \""+ this.title +"\" tab?")
			if (answer){
				//Utfører sletting av denne fana!
				//TODO: Delete the search result here! Lag ein funksjon for dette!
				alert("Deleting this tab: " + this.title);
			}
			return answer;
        },
        search_result_id: search_result_counter
	});
	
	var sub_tab_1 = new dijit.layout.ContentPane({
		id:			new_tab_div_id + '_sub_1', //<div id="...">
		title:		'All things'
	});
	new_result_tab.addChild(sub_tab_1);
	
/*
	var sub_tab_2 = new dijit.layout.ContentPane({
		id:			new_tab_div_id + '_sub_2', //<div id="...">
		title:		'Things on the map',
		content:	'N/A'
	});
	new_result_tab.addChild(sub_tab_2);
	
	var sub_tab_3 = new dijit.layout.ContentPane({
		id:			new_tab_div_id + '_sub_3', //<div id="...">
		title:		'Selected thing',
		content:	'Select something in order to explore it.'
	});
	new_result_tab.addChild(sub_tab_3);
	
	var sub_tab_4 = new dijit.layout.ContentPane({
		id:			new_tab_div_id + '_sub_4', //<div id="...">
		title:		'Search info',
		content:	'N/A'
	});
	new_result_tab.addChild(sub_tab_4);
*/
	
	display_result_tab_here.addChild(new_result_tab);		//ny fane
	
	display_result_tab_here.startup();						//opprettar ny fane
	display_result_tab_here.selectChild(new_result_tab);	//hoppar til visning av ny fane
	
	var return_this_array = new Array();
	return_this_array.push(new_tab_div_id);
	return_this_array.push(search_result_counter);
	
	deferred.resolve(return_this_array);
	return deferred;
} //END open_new_dojo_tab_showing_the_search_result()



/*

// INPUT
doc: vestforsk_google_map.js
	var: map_bounds_south_west
	var: map_bounds_north_east

var: the_rdf_triples_we_are_looking_for
	
	

Det som må bli input til denne funksjonen er frå eit skjema i HTML eller ein ontology.

Framtidig input:
- HTML form
- Google Map
- Ontology
*/
//var sindice_search_input = 
function generate_the_http_request(
	search_result_id,
	the_rdf_triples_we_are_looking_for,
	text_search,
	text_search_value
){
	var generate_the_http_request_deferred = new dojo.Deferred();

	//TODO: "the_rdf_triples_we_are_looking_for" burde lagrast i dojo store så ein kan bruke den igjen seinare!
	//	Altså få input frå dojo store!
	//	Først lagre denne i dojo store under initialize()
	//	Så hente den fram igjen her for generering av HTTP requesten
	
	

	
	
	// IF det er satt nokon RDF triplar,
	// inkluder triplane i "http_request"
	var include_rdf_triples = ""; //resultatet vert satt i denne
	var number_of_triples = 0;

	if (text_search == "text_search"){

		// "The q parameter specifies the keyword query."
		include_rdf_triples =  "+AND+%28"+ text_search_value +"%29";
	}
	else if (the_rdf_triples_we_are_looking_for != null) {
		
		number_of_triples = the_rdf_triples_we_are_looking_for['RDFtriple'].length;
		
		//"The nq parameter specifies the ntriple query."
		include_rdf_triples = "&nq=(";
		
		for (	i =		0; //Startar med første tripel
				i <		number_of_triples; //fordi "array" er 0 index og "length" er 1 index
				i++) {
			
			var s = the_rdf_triples_we_are_looking_for['RDFtriple'][i]['Subject'];
			var p = the_rdf_triples_we_are_looking_for['RDFtriple'][i]['Predicate'];
			var o = the_rdf_triples_we_are_looking_for['RDFtriple'][i]['Object'];
			
			//
			// Store this RDF triple that we are looking for in the dojo store
			//
			var id = "div_id_tab_search_result_" + search_result_id + "_tripel_nr_" + i;
			var parent_id = "div_id_tab_search_result_" + search_result_id;
			
			store.add({
				id:					id,
				name:				"RDF triple search id: " + i,
				subject:			s,
				predicate:			p,
				object:				o,
				type:				'searchingForThisRDFtriple',
				parent_id:			parent_id,
				search_result_id:	search_result_id
			});

			//
			// Generere HTTP request to Sindice index API
			//
			if (s != "*") { //Streng skal pyntast dersom den ikkje ser ut som ei stjerne!
				s = "<" + s + ">"; //URI vert pakka inn
				s = escape(s); //URI vert URL encoded
			}
			
			if (p != "*") { //Streng skal pyntast dersom den ikkje ser ut som ei stjerne!
				p = "<" + p + ">"; //URI vert pakka inn
				p = escape(p); //URI vert URL encoded
			}
			
			if (o != "*") { //Streng skal pyntast dersom den ikkje ser ut som ei stjerne!
				o = "<" + o + ">"; //URI vert pakka inn
				o = escape(o); //URI vert URL encoded
			}
			
			var m = "%20"; //mellomrom
			var last_array = number_of_triples - 1;
			
			include_rdf_triples += "(" + s + m + p + m + o + ")";
			
			var all_properties_must_match = get_input_from_form_checkbox("form_at_least_one_or_all_property_match");
			console.debug("all_properties_must_match: " + all_properties_must_match);


			if (i < last_array) { //Alle skal ha "OR" eller "AND" etter seg bortsett frå minstemann!
				if ( all_properties_must_match == true ) {
					include_rdf_triples += m + "AND" + m;
				}
				else {
					include_rdf_triples += m + "OR" + m;
				}				
			}
		} //END for()
		
		include_rdf_triples += ")";
	} //END if()
	
	
	var http_request =	"http://api.sindice.com/v3/search?" +
						"q=%28geo%3Alat+%5B" +
						map_bounds_south_west.lat() +			//latitude
						"+TO+" +
						map_bounds_north_east.lat() +			//latitude
						"%5D%29+AND+%28geo%3Along+%5B" +
						map_bounds_south_west.lng() +			//longitude
						"+TO+" +
						map_bounds_north_east.lng() +			//longitude
						"%5D%29" +
						include_rdf_triples +	// denne er tom viss ein søker etter alt!
						"&field=predicate" +
						"&format=json" +
						"&page=1";
	
	
	var return_this_array = new Array();
	return_this_array.push(http_request);
	return_this_array.push(number_of_triples);
	
	generate_the_http_request_deferred.resolve(return_this_array);
	return generate_the_http_request_deferred;		
} //END generate_the_http_request()



function search_the_sindice_index(	new_store_array_number,
									http_request) {
	var deferred = new dojo.Deferred();

	//var what_we_look_for_is_this = "http://api.sindice.com/v3/search?q=%28geo%3Alat+%5B60.25+TO+60.35%5D%29+AND+%28geo%3Along+%5B5.22+TO+5.32%5D%29&field=predicate&format=json&page=1";
	
	var what_we_look_for_is_this  = http_request;
	
	//var what_we_look_for_is_this ="http://api.sindice.com/v3/search?q=%28geo%3Alat+%5B60.25+TO+60.35%5D%29+AND+%28geo%3Along+%5B5.22+TO+5.32%5D%29&nq=((*%20%3Chttp%3A//www.w3.org/1999/02/22-rdf-syntax-ns%23type%3E%20%3Chttp%3A//www.w3.org/2003/01/geo/wgs84_pos%23SpatialThing%3E)%20OR%20(*%20%3Chttp%3A//www.w3.org/2000/01/rdf-schema%23label%3E%20*))&field=predicate&format=json&page=1";

	//var what_we_look_for_is_this ="http://api.sindice.com/v3/search?q=%28geo%3Alat+%5B60.384822463922056+TO+60.39330438684575%5D%29+AND+%28geo%3Along+%5B5.304754673319167+TO+5.345524250345534%5D%29&nq=((*%20%3Chttp%3A//www.w3.org/1999/02/22-rdf-syntax-ns%23type%3E%20%3Chttp%3A//www.w3.org/2003/01/geo/wgs84_pos%23SpatialThing%3E)%20OR%20(*%20%3Chttp%3A//www.w3.org/2000/01/rdf-schema%23label%3E%20*))&field=predicate&format=json&page=1";
	
	
	//Gjennomfører søk nr 1.
	//Her får me vite kor mange "sider" resultatet er fordelt over.
	//Gjennomfør så ein loop frå side nr 2 og utover til at me har fått fetcha alle resultat.

	dojo.when(
		read_cross_domain_data(
			what_we_look_for_is_this,
			"ask_sindice_index_to_find_this_thing",
			new_store_array_number),
		function(sindice_reply) {
		
			//Kva vil du gjere etter første søket?
			dojo.when(
			
				fetch_the_other_result_pages(	sindice_reply,
												new_store_array_number	),
				function(sindice_reply) {
					deferred.resolve(sindice_reply);
				}

			); //END dojo.when()
		}
	);
	
	
	//me treng å få tilbake eit objekt med info frå første søket så me kan gjere ting med det
	
	
	return deferred;
} //END search_the_sindice_index()



/**
 * Sends cross domain request using Dojo. Call-back method is defined here.
 */
function read_cross_domain_data(
	url,
	type,
	new_store_array_number
){
	var deferred = new dojo.Deferred();

	if(type == "ask_sindice_index_to_find_this_thing") {
	
		dojo.io.script.get({
			callbackParamName: "callback",
			url: url,
			handleAs: "json",
			load: function(sindice_reply){
				
				// #5_1.
				console.debug("#5_1. START (Handle reply from Sindice.com)");
				console.debug(sindice_reply);				// Kva vil du gjere med søkeresultet?
				
				dojo.when(
					handle_sindice_index_reply(	sindice_reply,		// 1. Lagre resultatet i dojo store
												new_store_array_number),	
					function(result_count) {						// Dette svaret er ikkje viktig.
						console.debug("#5_1. END");
						deferred.resolve(sindice_reply);			// 2. Returnerar sindice_reply,
					}												// fordi den gir status om søket.
				); //END dojo.when()
			}
		});
		
	} //END if()
	
	
	else if(type == "ask_sindice_cache_api_to_find_item_data") {
	/*
		// OBS! Dersom ein ikkje har med timeout
		dojo.io.script.get({
			callbackParamName: "callback2",
			url: url,
			//handleAs: "json",
			load: function(sindice_cache_api_reply){
			
				// #6_1.
				console.debug("#6_1. START (Handle reply from Sindice Cache API)");
				console.log(sindice_cache_api_reply);				// Kva vil du gjere med søkeresultet?
			
				dojo.when(
					// Lagre resultatet i dojo store
					fetch_from_sindice_cache_api_reply(
						sindice_cache_api_reply,
						new_store_array_number
					),		
					function(reply6_1) {
						console.debug("#6_1. END");
						deferred.resolve(reply6_1);
					}
				); //END dojo.when()
			},
			error: function(error) {
				console.debug("error");
				deferred.resolve("error");
			},
			timeout: 9000
		});

		*/
		/*
		dojo.io.script.get({
			callbackParamName: "callback2",
			url: url,
			//handleAs: "json",
			timeout: 9000
		}).then(
			function(sindice_cache_api_reply){
				// #6_1.
				console.debug("#6_1. START (Handle reply from Sindice Cache API)");
				console.log(sindice_cache_api_reply);				// Kva vil du gjere med søkeresultet?
			
				dojo.when(
					// Lagre resultatet i dojo store
					fetch_from_sindice_cache_api_reply(
						sindice_cache_api_reply,
						new_store_array_number
					),		
					function(reply6_1) {
						console.debug("#6_1. END");
						deferred.resolve(reply6_1);
					}
				); //END dojo.when()
			},
            function(error){
            	console.debug(error);
            	deferred.resolve("error");
            }
		);
		*/

		// OBS! Dersom ein ikkje har med timeout
		dojo.io.script.get({
			callbackParamName: "callback",
			url: url,
			//handleAs: "json",
			load: function(sindice_cache_api_reply){
			
				// #6_1.
				console.debug("#6_1. START (Handle reply from Sindice Cache API)");
				console.log(sindice_cache_api_reply);				// Kva vil du gjere med søkeresultet?
			
				dojo.when(
					// Lagre resultatet i dojo store
					fetch_from_sindice_cache_api_reply(
						sindice_cache_api_reply,
						new_store_array_number
					),		
					function(reply6_1) {
						console.debug("#6_1. END");
						//deferred.resolve(reply6_1);
					}
				); //END dojo.when()
			},
			error: function(error) {
				console.debug("error");
			},
			timeout: 15000
		}).then(function(dataa){
			deferred.resolve("error");
		});
		
		
	} //END if()

	
	else if(type == "query_sparql_endpoint") {
	
		dojo.io.script.get({
			callbackParamName: "callback",
			url: url,
			handleAs: "json",
			load: function(endpoint_reply){
				deferred.resolve(endpoint_reply);
			}
		});
		
	} //END if()

	else if(type == "query_osm_sparql_endpoint") {
	
		if (
			url.hasOwnProperty('escaped_query') &&
			url.hasOwnProperty('parent_uri')
		) {
			dojo.io.script.get({
				callbackParamName: "callback",
				url: url.escaped_query,
				handleAs: "json",
				load: function(endpoint_reply){
					endpoint_reply.triple_subject = url.parent_uri;
					deferred.resolve(endpoint_reply);
				}
			});
		}
		else {
			alert("error in read_cross_domain_data");
		}
		
	} //END if()

	
	
	return deferred;
} //END read_cross_domain_data()

function callback2(data) {
	console.debug(data);
	return data;
}

function handle_sindice_index_reply(
	sindice_reply, 
	new_store_array_number
){
	var deferred = new dojo.Deferred();

/*
	//TODO: dette objektet burde komme frå ontology!
	var the_location_types_we_are_looking_for = { //object
		"LocationType" : [ //object array
			{
				"LatitudeType" : "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
				"LongitudeType" : "http://www.w3.org/2003/01/geo/wgs84_pos#long"
			}
		]
	}; //END the_location_types_we_are_looking_for
	//console.log(the_location_types_we_are_looking_for);
*/	
	//alert(sindice_reply.totalResults);
	
		
	//
	// For kvar ting i resultatet
	//
	for (var i in sindice_reply.entries){
		var thing = sindice_reply.entries[i];

		//
		// Sjekkar at "thing.link" vil funke i ein SPARQL query
		//
		// dersom thing URI inneheld mellomrom eller + tegn, hopp over
		// fordi URI vil då ikkje funke i SPARQL spørjing
		if(	thing.link.indexOf('+') >= 0 || 
			thing.link.indexOf(' ') >= 0 || 
			thing.link.indexOf('http://ookaboo.com') >= 0){
			console.log("Hoppar over denne tingen: "+thing.link);
		} //END if() - Sjekkar at "thing.link" vil funke i ein SPARQL query
		else {
			console.log("Thing object:");
			console.log(thing); // The object

/* console.log(thing);
Object
link: "http://sognefjord.vestforsk.no/page/hike/101"
predicate: Array[21]
0: "http://purl.org/dc/terms/title"
1: "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
2: "http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#duration"
3: "http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#minute"
4: "http://data.sognefjord.vestforsk.no/resource/ontology#Length"
5: "http://data.sognefjord.vestforsk.no/resource/ontology#Kilometer"
6: "http://data.sognefjord.vestforsk.no/resource/ontology#Profile"
7: "http://data.sognefjord.vestforsk.no/resource/ontology#minimumElevation"
8: "http://purl.oclc.org/NET/muo/ucum/meter"
9: "http://data.sognefjord.vestforsk.no/resource/ontology#maximumElevation"
10: "http://data.sognefjord.vestforsk.no/resource/ontology#differenceInElevation"
11: "http://data.sognefjord.vestforsk.no/resource/ontology#heightIncrease"
12: "http://data.sognefjord.vestforsk.no/resource/ontology#heightDecrease"
13: "http://www.w3.org/2002/07/owl#sameAs"
14: "http://data.sognefjord.vestforsk.no/resource/ontology#StartOf"
15: "http://www.w3.org/2003/01/geo/wgs84_pos#lat"
16: "http://www.w3.org/2003/01/geo/wgs84_pos#long"
17: "http://www.w3.org/2003/01/geo/wgs84_pos#altitude"
18: "http://data.sognefjord.vestforsk.no/resource/ontology#EndOf"
19: "http://data.sognefjord.vestforsk.no/resource/ontology#Path"
20: "http://data.sognefjord.vestforsk.no/resource/ontology#GoogleEncodedPath"
length: 21
__proto__: Array[0]
title: Array[1]
0: Object
type: "literal"
value: ""Mellingen-Rimmaskaret-Veten""
*/
		
			// Interesting information about the thing
			// from the search in the Sindice Index API.
			// We will get more details about the thing
			// when we search the Sindice Cache API.
			var thing_title					= thing.title['0'].value;
			var thing_uri					= thing.link;
			var thing_number_of_predicates	= thing.predicate.length;
			var thing_predicates_array		= thing.predicate;
		
			console.log(thing_title);
			console.log(thing_uri);
			
/* Dette er i grunn unødvendig!			
			//
			//predicate
			//
			var the_location_types_we_have_found = {
				"LocationType" : [ //object array
				]
			};
			
			//
			// For each predicate..
			//
			for (var i in thing.predicate){
				//console.log(thing.predicate[i]);
				var predicate = thing.predicate[i];
					
				//
				// Finn alle predikat av typen LOKASJON
				//
				for (i in the_location_types_we_are_looking_for["LocationType"]) {
					var looking_for = the_location_types_we_are_looking_for["LocationType"][i];
					//console.log(looking_for);
						
					//matchar "predicate" med lat eller long i denne lokasjonstypen?
					if (predicate == looking_for.LatitudeType) {

						//dersom me ikkje har funne denne LatitudeType før, sett den inn i objekt
						if(	the_location_types_we_have_found["LocationType"] !== i.LatitudeType) {
							
							//er the_location_types_we_have_found["LocationType"][i] satt før?
							//dersom ikkje lyt ein opprette den!
							if(	!the_location_types_we_have_found["LocationType"].hasOwnProperty(i)) {
								the_location_types_we_have_found["LocationType"][i] = {};
							}
							
							the_location_types_we_have_found["LocationType"][i]["LatitudeType"] = predicate;
							//console.log(the_location_types_we_have_found["LocationType"][i]["LatitudeType"]);
						}
						else { //stop ein halv, denne tingen har fleire LatitudeType
							console.info("OBS: "+ thing.title['0'].value +" har fleire LatitudeType av same type!");
						}
					} //END if()
					else if (predicate == looking_for.LongitudeType) {
							
						//dersom me ikkje har funne denne LongitudeType før, sett den inn i objekt
						if(	the_location_types_we_have_found["LocationType"] !== i.LongitudeType) {
							
							//er the_location_types_we_have_found["LocationType"][i] satt før?
							//dersom ikkje lyt ein opprette den!
							if(	!the_location_types_we_have_found["LocationType"].hasOwnProperty(i)) {
								the_location_types_we_have_found["LocationType"][i] = {};
							}
								
							the_location_types_we_have_found["LocationType"][i]["LongitudeType"] = predicate;
						}
						else { //stop ein halv, denne tingen har fleire LongitudeType
							console.info("OBS: "+ thing.title['0'].value +" har fleire LongitudeType av same type!");
						}
					} //END else if()
				} //END for()
					
				//TODO: dersom me ikkje finn nokon lokasjon
		
			} //END for() kvar predikat
				
			var approved_locations = [];
				
			//godkjenner lokasjonane
			for (i in the_location_types_we_have_found["LocationType"]) {
				var have_found = the_location_types_we_have_found["LocationType"][i];
				console.log(have_found);
			
				//dersom me har funne både lat og long av same type
				if (	have_found.hasOwnProperty('LatitudeType') &&
						have_found.hasOwnProperty('LongitudeType') ) {
								
					//console.log("Lokasjon suksess!"); //Yes, me har lokasjon!

					approved_locations.push({
						"latitude_type" : have_found.LatitudeType,
						"longitude_type" : have_found.LongitudeType
					});
				} //END if()
			} //END for()
*/
			
			dojo.when(
				is_the_item_uri_added_before(
					thing_uri,
					new_store_array_number
				),
				function(is_the_item_uri_added_before_reply) {
					console.log(is_the_item_uri_added_before_reply);
			
					if (is_the_item_uri_added_before_reply == false) {
					
						// count the result
						var result_number = result_counter[new_store_array_number];
						if (result_number == null) {
							result_number = 1;
						}
						else {
							result_number = result_number + 1;
						}
						result_counter[new_store_array_number] = result_number;
					
						dojo.when(
							add_new_item_to_dojo_store(
								new_store_array_number,
								thing_uri,
								thing_title,
								thing_number_of_predicates,
								thing_predicates_array,
								result_number
							),
							function(add_new_item_to_dojo_store_reply) {
								console.debug("#5. END");
							}
						); //END dojo.when()
					} //END if
				}
			); //END dojo.when()
		} //END else
	} //END for() for kvar ting
	
	deferred.resolve(result_counter[new_store_array_number]);
	return deferred;
} //END handle_sindice_index_reply()



function fetch_the_other_result_pages(	sindice_reply,
										new_store_array_number) {
	var deferred = new dojo.Deferred();
	
	console.log("#5_1_1. START");
	
	// Kor mange resultatsider er søkeresultatet fordelt over?
	var n = what_page_number_does_this_url_have(sindice_reply['last']);
	
	// OBS! Sindice Search API vil ikkje vise resultatsidene som har
	// eit tal som er større enn 100. var n skal derfor ikkje vere
	// større enn 100.
	if (n > 100) {
		n = 100;
	}
	
	var v = what_page_number_does_this_url_have(sindice_reply['link']);
	
	console.log("(Handle sindice reply page number " + v + " of " + n + ".)");
	
	//Liste med URL til resultatsider for søket. (Frå side 2 og utover.)
	var deferred_reply_array = [];
		
	//arrange all the next searches..
	for (i=2; i<=n; i++) {
		console.log(i); //sidenummer

		var what_we_look_for_is_this = give_sindice_url_a_new_page_number(sindice_reply['link'], i);
	
		deferred_reply_array.push(read_cross_domain_data(
			what_we_look_for_is_this,
			"ask_sindice_index_to_find_this_thing",
			new_store_array_number
		));
	} //END for()
	
	var deferred_list = new dojo.DeferredList(deferred_reply_array);
	
	deferred_list.then(function(result){
		// "result" is an array of results
		console.log("#5_1_1. END");
		deferred.resolve(result);
	});

	
	
	//deferred.resolve(deferred_list);
	return deferred;
} //END fetch_the_other_result_pages()




/*
Døme på lenker i svar objektet frå Sindice:

first:
"http://api.sindice.com/v3/search?q=%28geo%3Alat+%5B60.25+TO+60.35%5D%29+AND+%28geo%3Along+%5B5.22+TO+5.32%5D%29&field=predicate&format=json&page=1"
itemsPerPage: 10
last:
"http://api.sindice.com/v3/search?q=%28geo%3Alat+%5B60.25+TO+60.35%5D%29+AND+%28geo%3Along+%5B5.22+TO+5.32%5D%29&field=predicate&format=json&page=15"
link:
"http://api.sindice.com/v3/search?q=%28geo%3Alat+%5B60.25+TO+60.35%5D%29+AND+%28geo%3Along+%5B5.22+TO+5.32%5D%29&field=predicate&format=json&page=1"
next:
"http://api.sindice.com/v3/search?q=%28geo%3Alat+%5B60.25+TO+60.35%5D%29+AND+%28geo%3Along+%5B5.22+TO+5.32%5D%29&field=predicate&format=json&page=2"
previous:
"http://api.sindice.com/v3/search?q=%28geo%3Alat+%5B60.25+TO+60.35%5D%29+AND+%28geo%3Along+%5B5.22+TO+5.32%5D%29&field=predicate&format=json&page=1"
*/
function what_page_number_does_this_url_have(sindice_search_url) {
	var splitted_url = sindice_search_url.split("page="); //Tek vekk det som står framfor talet
	var the_number_you_are_looking_for = splitted_url[1].split("&"); //Tek vekk det som eventuelt står bak talet
	return the_number_you_are_looking_for[0];
} //END what_page_number_does_this_url_have()



function give_sindice_url_a_new_page_number(sindice_search_url, new_page_number) {
	//first split
	var split_first_by = "page=";
	var split_last_by = "&";
	var split_first = sindice_search_url.split(split_first_by);
	var split_last = split_first[1].split(split_last_by);
	
	//then merge
	var sindice_url_with_new_page_number =
		split_first[0] +
		split_first_by +
		new_page_number;
	
	if (split_last.length > 1) {
		console.log("OBS! Delar av Sindice search URL forsvant her.. Oppgrader denne funksjonen til å ta med resten av URL'en.");
	}
	
	return sindice_url_with_new_page_number;
} //END what_page_number_does_this_url_have()



function for_each_item_in_sindice_index_reply(new_store_array_number){
	var deferred = new dojo.Deferred();
	var deferred_reply_array = [];
	
	// Invoke the search
	store.query({
		type:					'searchResult',
		dojo_store_id_number:	new_store_array_number
	}).forEach(function(thing){
		
		var sindice_cache_api_request =	"http://api.sindice.com/v3/cache?pretty=true&url=" +
										escape(thing.uri) + //ask sindice cache api about this uri
										"&format=json";
		
		//Fetch location data from Sindice
		//Store fetched data in dojo store[new_store_array_number]
		deferred_reply_array.push(
			read_cross_domain_data(	sindice_cache_api_request, 
									"ask_sindice_cache_api_to_find_item_data",
									new_store_array_number
			).then(function(data) {
				console.log("Fetching info about: " + thing.uri);
			})
		);

	}); //END store.query()

	

	//
	// create a deferred list
	//
	// ved hjelp av "deferred list" vert det som står inni ".then" 
	// kalla først ETTER at funksjonane i lista har kjøyrt og returnert svar!!
	//
	var deferred_list = new dojo.DeferredList(deferred_reply_array);
	deferred_list.then(function(result){
	
		// "result" is an array of results
		deferred.resolve(result);

	}); //END deferred_list.then()
	
	return deferred;
} //END for_each_item_in_sindice_index_reply()



/*
 Her behandlar me svar frå sindice cache api.
	//Get location types (predicate) on item from dojo store
	//Fetch location value on item's URI from Sindice
	//Store location value on item in dojo store
	//Put item's locations on the google map
 */
function fetch_from_sindice_cache_api_reply(
	sindice_cache_api_reply,
	new_store_array_number
){
	var deferred = new dojo.Deferred();

	//Fetch uri from Sindice
	for (first in sindice_cache_api_reply) break;
	
	var uri					= sindice_cache_api_reply[first]['url']; // The subject in the triple
	var domain				= sindice_cache_api_reply[first]['domain'];
	var explicit_content;
	var implicit_content;
	var number_of_rdf_triples;
	var label				= sindice_cache_api_reply[first]['label'][0];
	
	dojo.when(
		cleaning_rdf_tripel(sindice_cache_api_reply[first]['explicit_content']),
		function(cleaned_rdf_tripel) {
			explicit_content = cleaned_rdf_tripel;
		}
	); //END dojo.when()
	
	dojo.when(
		cleaning_rdf_tripel(sindice_cache_api_reply[first]['implicit_content']),
		function(cleaned_rdf_tripel) {
			implicit_content = cleaned_rdf_tripel;
		}
	); //END dojo.when()
	
	var sindice_content_merged = [];
	
	for (v in explicit_content) {
		explicit_content[v].sindice_content_type = "explicit_content";
		sindice_content_merged.push(explicit_content[v]);
	} //END for()
	
	for (v in implicit_content) {
		implicit_content[v].sindice_content_type = "implicit_content";
		sindice_content_merged.push(implicit_content[v]);
	} //END for()
	
	number_of_rdf_triples = sindice_content_merged.length;
	
	//console.log("fetch_from_sindice_cache_api_reply: ");
	//console.log(sindice_cache_api_reply);
	//console.log(uri);
	
	var parent_item_id; //Denne tingen vert parent item til alle tripplane den inneheld
	
	// Look uri up in dojo store
	// OBS! Brukar forEach() her men det er berre ein ting som har aktuell URI.
	store.query({																			// query
		uri:						uri,
		type:						'searchResult',
		dojo_store_id_number:		new_store_array_number
	}).forEach(function(item){																// get
		//console.log("item: ");
		//console.log(item);
		
		parent_item_id = item.id;
		item.number_of_rdf_triples = number_of_rdf_triples;									// update <--- denne lyt oppdaterast dersom me får fleire RDF tripplar gjennom reasoning.
		item.sindice_cache_api_reply = sindice_cache_api_reply[first];						// update // brukar n3 data frå explicit_content og implicit_content til reasoning.
		store.put(item);																	// store
		
	}); //END store.query()
	
	for (v in sindice_content_merged) {
	
		// Lagrar alle RDF triplar i dojo stor som eigen item
		add_new_rdf_triple_to_dojo_store(
			parent_item_id,
			v,
			sindice_content_merged[v]['triple_subject'],
			sindice_content_merged[v]['triple_predicate'],
			sindice_content_merged[v]['triple_object'],
			new_store_array_number,
			sindice_content_merged[v]['sindice_content_type']
		)
	} //END for()
	

	//BBBBBBBBBBBBBBBBBBBBBBBBB
/*
	for (v in sindice_content_merged) {
	
		// Lagrar alle RDF triplar i dojo stor som eigen item
		dojo.when(
			add_new_rdf_triple_to_dojo_store(
				parent_item_id,
				v,
				sindice_content_merged[v]['triple_subject'],
				sindice_content_merged[v]['triple_predicate'],
				sindice_content_merged[v]['triple_object'],
				new_store_array_number,
				sindice_content_merged[v]['sindice_content_type']
			),
			function(new_rdf_triple_id) {
				
		dojo.when(
			check_rdf_triple_for_patterns( <---------------------- aktiver denne ved behov seinare.
				sindice_content_merged[v]['triple_object'],
				new_rdf_triple_id,
				parent_item_id
			),
			function(did_you_find_something) {
				// did_you_find_something == true or false
				
			}
		); //END dojo.when()
			}
		); //END dojo.when()
	} //END for()
*/

	deferred.resolve("fetch_from_sindice_cache_api_reply");
	return deferred;
} //END fetch_from_sindice_cache_api_reply()


function remove_first_and_last_char_in_string(val){
	var string_length = val.length;
	return val.slice(1,string_length-1);
} //END remove_first_and_last_char_in_string()


function remove_last_chars_in_string(
	val,
	number
){
	var string_length = val.length;
	return val.slice(0,string_length-number);
} //END remove_last_chars_in_string()


/*
	Count how many matching RDF triples each item have
	Set +1 for each matching RDF triple an item have
*/
function count_matching_rdf_triples_in_the_search_result(
	new_store_array_number,
	number_of_rdf_triples_used_in_the_search
){
	var deferred1 = new dojo.Deferred();
	
	//
	// Define the callback
	// Denne vert kjøyrt for kvar RDF tripel me har brukt i søket vårt.
	//
	var for_each_rdf_tripel = function(item, request) {
		var deferred2 = new dojo.Deferred();
		//console.log(item);
		console.log("### Searching for things that have these URI's:");
		
		// Search criteria (RDF tripel)
		console.log("### searching_subject: "		+ item.subject);	//denne vert ikkje brukt
		console.log("### searching_predicate: "		+ item.predicate);
		console.log("### searching_object: "		+ item.object);
		
		// Samlar alle ting her og gir dei +1 poeng til slutt.
		// Dette fordi ein ting kan berre få eit poeng per RDF tripel.
		// Det hender at ein ting har fleire RDF triplar som inneheld
		// same predikat eller objekt.
		var all_things_that_have_this_RDF_triple = [];
		
		//
		// Invoke the search
		// Finn alle RDF triplar som matchar våre søke-kriterier
		//
		var query_object = {
			type:					'itemRDFtripel',
			search_result_id:		new_store_array_number
		};
		if (item.predicate != "*") {
			query_object.triple_predicate = item.predicate;
		}
		if (item.object != "*") {
			query_object.triple_object = item.object;
		}
		dojo.when(
			store.query(query_object).forEach(function(matching_rdf_triple){	// For kvar RDF tripel som matchar våre søke-kriterier
				
				console.debug("This RDF tripel is matching the search: ");
				console.debug(matching_rdf_triple);
				
				console.debug("This thing have that RDF tripel: ");
				var parent_object = store.get(matching_rdf_triple.parent_item_id);
			//	console.debug(parent_object);
				console.debug(parent_object.uri);
				
				// Denne RDF tripelen er ein match!
				// MEN dersom foreldre-tingen alt har blitt ført på poeng-lista
				// for andre matchande RDF triplar av denne typen,
				// vert den ikkje putta på lista igjen.
				if (find_string_in_array(all_things_that_have_this_RDF_triple,parent_object.id) == false) {
					all_things_that_have_this_RDF_triple.push(parent_object.id); // Ting ID førast på lista!
				}
				
				// For å vise kva RDF triplar som matchar,
				// sett matching_search = true
				matching_rdf_triple.matching_search = true;		// update object
				store.put(matching_rdf_triple);					// and store the change
				
			}),
			function(search_store_fetch_reply2) {

			
				var number_of_things_that_have_minimum_one_matching_rdf_triple =
				all_things_that_have_this_RDF_triple.length;
			
				console.log("Selected search criteria have found " +
					number_of_things_that_have_minimum_one_matching_rdf_triple +
					" things with matching RDF triples.");
			
				for (	i =		0; //Startar med første foreldre-ting på lista
						i <		number_of_things_that_have_minimum_one_matching_rdf_triple;
						i++) {
						
						// +1 til kvar foreldre-ting på lista
						var plus_1_to_this_parent = store.get(all_things_that_have_this_RDF_triple[i]);
						plus_1_to_this_parent.number_of_matching_rdf_triples += 1;	// update object
						store.put(plus_1_to_this_parent);							// and store the change
				} //END for()
			
				
				deferred2.resolve(search_store_fetch_reply2);
				console.debug("all done2");

			}
		); //END dojo.when()
		return deferred2;
	} //END for_each_rdf_tripel = function(item, request)
	

	//
	// Invoke the search
	// For kvar RDF tripel me har brukt i søket
	//
	dojo.when(
		store.query({
			type:						'searchingForThisRDFtriple',
			search_result_id:			new_store_array_number
		}).forEach(for_each_rdf_tripel),
		function(search_store_fetch_reply) {
		
			//
			// For kvar ting i søkeresultatet,
			// rekn ut kor mange prosent av RDF triplane i søket
			// som tingen har.
			//
			dojo.when(
				store.query({
					type:						'searchResult',
					dojo_store_id_number:		new_store_array_number
				}).forEach(function(search_result_thing){
					var one_match_in_percentage = 100 / number_of_rdf_triples_used_in_the_search;
					var percentage = one_match_in_percentage * search_result_thing.number_of_matching_rdf_triples;
					
					// update object
					search_result_thing.percent_matching_rdf_triples = parseInt(percentage);

					// and store the change
					store.put(search_result_thing);
				}),
				function(reply) {
			
					deferred1.resolve(search_store_fetch_reply);
					console.debug("all done");
					//console.debug(store);
				}
			); //END dojo.when()
		}
	); //END dojo.when()

	return deferred1;
} //END count_matching_rdf_triples_in_the_search_result()


function find_string_in_array(arr,obj) {
    return (arr.indexOf(obj) != -1);
}




/**
 * Method is a call-back method for request sent by readCrossDomainData() 
 */
function query_the_results_in_dojo_store(
	new_store_array_number,
	number_of_triples
){
	console.log("query_the_results_in_dojo_store");
	
	//
	// Select what <div> to display result in.
	// Select where to place the map markers in an array
	//
	//333333333333333333333333333333333
	var last_search_result_tab_created = search_result_tabs.length - 1; //the search result id!
	var display_id = search_result_tabs[last_search_result_tab_created];
	var display_search_result_here = display_id + "_sub_1";
	//eksempel: "div_id_tab_search_result_1_sub_1"
	
	//
	//	DISPLAY SUBTAB 1
	//
	var tab = document.getElementById(display_search_result_here);
	tab.innerHTML = ""; // fjernar alt som ligg i div frå før
	tab.className += " " + "remove_overflow";
	
	var subtab_1_container = document.createElement("div");
	subtab_1_container.id = display_search_result_here + "_container";
	subtab_1_container.className ="subtab_1_container"; //css
	
	var subtab_1_left_div = document.createElement("div");
	subtab_1_left_div.id = display_search_result_here + "_left_div";
	subtab_1_left_div.className ="subtab_1_left_div"; //css
	//subtab_1_left_div.innerHTML = "This HTML Div tag created using Javascript DOM dynamically.";
	
	var subtab_1_right_div = document.createElement("div");
	subtab_1_right_div.id = display_search_result_here + "_right_div";
	subtab_1_right_div.className ="subtab_1_right_div"; //css
	

	
	// Create a new grid
	grid = new dojox.grid.DataGrid({
		query: {
			type:	'searchResult',
			dojo_store_id_number:		new_store_array_number
		},
		store: dataStore = dojo.data.ObjectStore({objectStore: store}),
		structure: [
			{
				name:"Name", 
				field:"name", 
				width: "350px",
				formatter: function(value){
					if (value.length > 40) {
						value = value.slice(0,37) + "...";
					}
					return value;
				}
			},
			{
				name:"Match", 
				field:"percent_matching_rdf_triples", 
				width: "50px",
				formatter: function(value){
					value = value + "%";
					return value;
				}
			}
			/*
			{
				name:"Wikipedia", 
				field:"number_of_detected_wikipedia_articles", 
				width: "100px"
			},
			{
				name:"Test", 
				field:"hike_height_decrease_in_meters", 
				width: "200px"
			}
			*/
		]
	}, document.createElement('div'));
	
	//console.log(grid.domNode);
	




	dojo.connect(grid, "onSelected", grid, function(inRowIndex){
		//eksempel: http://dojotoolkit.org/documentation/tutorials/1.6/working_grid/


		var this_item = grid.getItem(inRowIndex);
		//console.log(this_item);


		unselect_selected_item();
		update_selected_item_on_map(this_item.id);
		update_selected_item_tab(this_item.id);

		/*
		if ( this_item.hasOwnProperty("location_markers") == true ) {
			
			//alert("location_markers");
			
			dojo.some(this_item.location_markers, function(marker, index){

					// the marker's content gets attached to the info-window
					var infowindow = new google.maps.InfoWindow({
						content: marker['content']
					});
					
					infowindow.open(map,marker);		// trigger the infobox's open function
					infoWindowArray[0]=infowindow;		// keep the handle, in order to close it on next click event
					
					//return false; //same som break i for each. OBS! dersom tingen har fleire markers, vert berre den første den finn valgt...
			});

		} //END if()
		*/


	}); //END dojo.connect()
	
	// append the new grid to the div id
	subtab_1_right_div.appendChild(grid.domNode);
	subtab_1_container.appendChild(subtab_1_left_div);
	subtab_1_container.appendChild(subtab_1_right_div);
	tab.appendChild(subtab_1_container);

	// Call startup, in order to render the grid:
	grid.startup();
	
} //END query_the_results_in_dojo_store()



//
// Døme på noko som skal vaskast: "<http://www.dyrebeskyttelsen.no/> <http://purl.org/dc/terms/title> "Dyrebeskyttelsen Norge |"@nb .?"
//
function cleaning_rdf_tripel(
	rdf_triple_array
){
	var deferred = new dojo.Deferred();
	
	var cleaned_rdf_tripels = [];
	
	for (i in rdf_triple_array){
		
		rdf_triple_as_a_dirty_string = rdf_triple_array[i];
		
		// delar string opp
		var triple_split = rdf_triple_as_a_dirty_string.split(" ");
		var triple_split_0_index_length = triple_split.length - 1;
		
		// setter bitane saman på rett plass
		var triple_subject		=	triple_split[0];
		var triple_predicate	=	triple_split[1];
		var triple_object		=	"";
		
		// skal ikkje ha med siste verdi i array
		if ( triple_split_0_index_length <= 3 ) {
			triple_object = triple_split[2];
		}
		else {
			var last_value_index = triple_split_0_index_length - 1;
		
			for (	i = 2;
					i < triple_split_0_index_length;
					i++
			){
				if ( i < last_value_index ) {
					triple_object += triple_split[i] + " ";
				}
				else {
					triple_object += triple_split[i]; //NO SPACE FOR YOU!!
				}
				
			} //END for()
		}
		
		dojo.when(
			clean_this_value(triple_subject),
			function(cleaned_value) {
				triple_subject = cleaned_value;
			}
		); //END dojo.when()
		
		dojo.when(
			clean_this_value(triple_predicate),
			function(cleaned_value) {
				triple_predicate = cleaned_value;
			}
		); //END dojo.when()
		
		dojo.when(
			clean_this_value(triple_object),
			function(cleaned_value) {
				triple_object = cleaned_value;
			}
		); //END dojo.when()
		
		cleaned_rdf_tripels.push({
			"triple_subject":		triple_subject,
			"triple_predicate":		triple_predicate,
			"triple_object":		triple_object
		});
	} //END for()
	
	deferred.resolve(cleaned_rdf_tripels);
	return deferred;
} //END fetch_from_sindice_cache_api_reply()


function clean_this_value(
	dirty_value
){
	var deferred = new dojo.Deferred();
	
	var value_0_index_length = dirty_value.length - 1;
	var first_character = dirty_value.charAt(0);
	//console.log(first_character);
	var last_character_position = null;
	
	if	( first_character == "<" ){
		// finn posisjon til ">"
		for(	i =		value_0_index_length; 
				i >=	1;
				i--
		){
			if (dirty_value.charAt(i) == ">") {
				last_character_position = i;
				var clean_value = dirty_value.slice(1,i);
				deferred.resolve(clean_value);
				break;
			} //END if()
		} //END for()
	} //END if()
	
	else if ( first_character == '"' ){
		// finn posisjon til '"'
		for(	i =		value_0_index_length; 
				i >=	1;
				i--
		){
			if (dirty_value.charAt(i) == '"') {
				last_character_position = i;
				var clean_value = dirty_value.slice(1,i);
				deferred.resolve(clean_value);
				break;
			} //END if()
		} //END for()
	} //END if()
	
	else {
		if ( last_character_position == null ){
			deferred.resolve(dirty_value);
		}
	}
	
	return deferred;
} //END fetch_from_sindice_cache_api_reply()



function identify_location_triples(
	new_store_array_number,
	use_this_google_map_icon
){
	var deferred1 = new dojo.Deferred();
	
	// INPUT
	var latitude_type = "http://www.w3.org/2003/01/geo/wgs84_pos#lat";
	var longitude_type = "http://www.w3.org/2003/01/geo/wgs84_pos#long";
	
	// STATUS
	var location_counter = 0;
	var location_polyline_counter = 0;
	
	// TODO
	// for kvar lokasjonstype du vil finne
		//lat og long
		// eller berre geo point / polyline <---- burde søke etter geo point også!

	// Define the callback
	var for_each_latitude_tripel = function(latitude_item, request){
		var deferred2 = new dojo.Deferred();
		
		// Her har me eit predikat av type latitude.
		// console.debug(latitude_item.triple_object);
		
		// No lyt me finne tilhøyrande predikat av type longitude.
		// Tilhøyrigheit finn ein ved å nytte subjekt (som truleg er ei tom node),
		// samt parent_id og search_result_id.
		
		// Define the callback
		var for_each_longitude_tripel = function(longitude_item, request){
			var deferred3 = new dojo.Deferred();
			
			//
			// No har me funne både lat og long! Lagre resultat i dojo store!
			//
			location_counter++
			
			var new_location_object = {
				latitude_type:		latitude_type,
				latitude_value:		latitude_item.triple_object,
				longitude_type:		longitude_type,
				longitude_value:	longitude_item.triple_object
			};
			
			var parent_object = store.get(latitude_item.parent_item_id);	// get object,
			parent_object.location.push(new_location_object);				// update object
			store.put(parent_object);										// and store the change
			
			console.debug("Location: ");
			console.debug(latitude_item.triple_object);
			console.debug(longitude_item.triple_object);
			
			//
			// Putt lokasjon på kart!
			//
			dojo.when(
				put_location_on_google_map(
					new_store_array_number,
					parent_object,
					latitude_item.triple_object,
					longitude_item.triple_object,
					use_this_google_map_icon
				),
				function(put_location_on_google_map_reply) {
					deferred3.resolve(new_location_object);
				}
			); //END dojo.when()
			return deferred3;
		} //END for_each_longitude_tripel = function(longitude_item, request)
		
		dojo.when(
			store.query({
				type:						'itemRDFtripel',
				search_result_id:			new_store_array_number,
				triple_predicate:			longitude_type,
				triple_subject:				latitude_item.triple_subject,
				parent_item_id:				latitude_item.parent_item_id
			}).forEach(for_each_longitude_tripel),
			function(for_each_longitude_tripel_reply) {
			
				// Denne skal berre gi eit svar!
				deferred2.resolve("ok");
			}
		); //END dojo.when()

		return deferred2;
	} //END for_each_latitude_tripel = function(latitude_item, request)
	
	dojo.when(
		store.query({
			type:						'itemRDFtripel',
			search_result_id:			new_store_array_number,
			triple_predicate:			latitude_type
		}).forEach(for_each_latitude_tripel),
		function(for_each_latitude_tripel_reply) {
		
			// Denne vert kjøyrt etter at den har loopa igjennom alle lat og long tripplane.
			
			console.debug("Talet paa lokasjonar funne: " + location_counter);
			
			
	//
	// START - inn RDF triplar med google polyline.
	//
	// Lag "map marker" objekt av polyline og legg objektet inn i objektet til aktuell ting (i dojo store).
	// For kvar ting som har "map marker" objekt av typen polyline, sett aktuelle map markers på google map.
	//
	
	var polyline_type = "http://data.sognefjord.vestforsk.no/resource/ontology#GoogleEncodedPath";
	
	// Define the callback
	var for_each_polyline_tripel = function(polyline_item, request){
		var for_each_polyline_tripel_deferred = new dojo.Deferred();
		
		location_polyline_counter++;

/*
console.debug("polyline_item");
console.debug(polyline_item);

Object
id: "search_nr_1_result_nr_1_triple_id_28"
matching_search: false
name: "Triple number: 28"
parent_item_id: "search_nr_1_result_nr_1"
search_result_id: 1
sindice_content_type: "explicit_content"
triple_object: "e}dpJu}o_@OTOZBd@NXLZNJNVJZLVH`@H`@F`@J^LXJ\\LXNTNPLXSCSCSBQ@QIUCQAQGSAQDQDQHQNOPQLOVM\\I`@KXMXOXQLQLMTSNOLORMXQLOJOXMTMVOPOXOPOROTMXMTOTMVQROVMVOVMZMXMTK\\K`@Ib@UHIl@OXOXMb@MXOTORQNMVORQTORMXMXOZMVMZKZMTOPORQLM\\K\\I\\MVMZM\\KZIb@Af@I`@QRQJQNOPK\\Gj@K\\ONOTQPM\\G`@KZGb@M^QLOXMZOROJS@SBUBSFWTSNQJONOXQMQPMTQIOPOROTMVQGSEQAS?QKM[SAIa@Be@Ae@MYSBQ@QJOJS@SLK^O`@QH?e@G_@Gc@Ce@Ka@QMNQ?g@Cc@MYH_@Ek@@c@Ae@Ga@Cc@?e@Ec@Bg@?e@OQOSQKEg@OQQ?KXSDM[KYK]MQK[M[QISFS?QAOUQMQKI_@Ga@KYEg@Cc@OWQMQEQCS?QBQ?QKMVONQDQCQMK]Ea@SFMROVMVOXSKQKMVQFQOAH"
triple_predicate: "http://data.sognefjord.vestforsk.no/resource/ontology#GoogleEncodedPath"
triple_subject: "_:node16tto9idqx41016"
type: "itemRDFtripel"
*/
		
		var encoded_polyline = polyline_item.triple_object;
		
		// Ekstra sjekk.
		// Dersom encoded_polyline inneheld to stk backslash etter kvarandre
		// skal den erstatast med ein stk backslash.
		encoded_polyline = encoded_polyline.replace(/\\\\/g,"\\");
		
		var decoded_polyline = google.maps.geometry.encoding.decodePath(encoded_polyline);
		
		var polyline_marker = new google.maps.Polyline({
			path: decoded_polyline,
			strokeColor: "#FF0000",
			strokeOpacity: 1.0,
			strokeWeight: 2,
			map: map
		});
		
		//
		// Oppdater objekt til aktuell ting med "polyline_marker".
		// På denne måten er det veldig enkelt å kontrollere kva som skal vere på kartet.
		//
		var parent_item_id = polyline_item.parent_item_id;									// get id
		var update_parent_item_object = store.get(parent_item_id);							// get object
		var polyline_status = update_parent_item_object.hasOwnProperty("polyline_markers");	// get status (true / false)

		if (polyline_status == false) {
			// Tingen har ingen array med polyline markers frå før.
			update_parent_item_object.polyline_markers = [];								// create new array
		} //END if()
		
		update_parent_item_object.polyline_markers.push(polyline_marker);					// update object
		store.put(update_parent_item_object);												// and store the change
		
		
/*
console.debug("update_parent_item_object");
console.debug(update_parent_item_object);

Object
checkbox: true
detected_wikipedia_articles: Array[0]
dojo_store_id_number: 1
id: "search_nr_1_result_nr_1"
location: Array[2]
name: ""Mellingen-Rimmaskaret-Veten""
number_of_detected_wikipedia_articles: 0
number_of_matching_rdf_triples: 3
number_of_predicates: 21
number_of_rdf_triples: 51
percent_matching_rdf_triples: 100
polyline_markers: Array[1]
predicates: Array[21]
type: "searchResult"
uri: "http://sognefjord.vestforsk.no/page/hike/101"
*/
		
		for_each_polyline_tripel_deferred.resolve(polyline_item);
		return for_each_polyline_tripel_deferred;
		
	} //END for_each_polyline_tripel
	
	
	
	dojo.when(
		store.query({
			type:						'itemRDFtripel',
			search_result_id:			new_store_array_number,
			triple_predicate:			polyline_type
		}).forEach(for_each_polyline_tripel),
		function(for_each_polyline_tripel_reply) {
		
			// Denne vert kjøyrt etter at all for each loopinga over er fullført.
			
			console.debug("Talet paa polyline lokasjonar funne: " + location_polyline_counter);
			deferred1.resolve(location_counter);
		}
	); //END dojo.when()
	
	//
	// END - inn RDF triplar med google polyline.
	//

		}
	); //END dojo.when()
	

	return deferred1;
} //END identify_location_triples()


function check_rdf_triple_for_patterns(
	triple_object,
	new_rdf_triple_id,
	parent_item_id
){
	var deferred = new dojo.Deferred();
	
	if (	triple_object.search(/wikipedia.org/i) >= 0 &&	// inneheld..
			triple_object.search(/http:/i) == 0			// startar med..
	){
		// triple_object er ein wikipedia.org url!
					
		var update_rdf_triple_object = store.get(new_rdf_triple_id);			// get object
		update_rdf_triple_object.triple_object_url_domain = "wikipedia.org";	// update object
		store.put(update_rdf_triple_object);									// and store the change
					
		var update_parent_object = store.get(parent_item_id);					// get object
		update_parent_object.detected_wikipedia_articles.push({					// update object
			wikipedia_url:			triple_object,
			rdf_triple_object_id:	new_rdf_triple_id							
		});
		update_parent_object.number_of_detected_wikipedia_articles =
			update_parent_object.number_of_detected_wikipedia_articles + 1;		// update object
		store.put(update_parent_object);										// and store the change
		
		deferred.resolve(true);
	}
	else {
		deferred.resolve(false);
	}
	
	return deferred;
} //END check_if_rdf_triple_is_a_wikipedia_url()





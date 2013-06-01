






function open_new_dojo_tab_showing_the_search_result_for_osm() {
	var open_new_dojo_tab_showing_the_search_result_for_osm_deferred = new dojo.Deferred();

	search_result_counter += 1;										//dette er søkeresultat nr..
	var new_tab_div_id =	"div_id_tab_search_result_" +			//lagar div id til ny fane
							search_result_counter;	
	search_result_tabs[search_result_counter] = new_tab_div_id;		//oppdaterar array

	//id til <div> der du vil opprette ny tab.
	//<div> må vere av type dojoType="dijit.layout.TabContainer"
	var display_result_tab_here = dijit.byId('div_id_tab_container');

/*
	var new_result_tab = document.createElement("div");
		new_result_tab.setAttribute('data-dojo-type', 'dijit.layout.ContentPane');
		new_result_tab.setAttribute('data-dojo-props', "id: 'div_id_tab_search_result_1', title: '1'");



*/


/*
        var new_result_tab = new dijit.layout.ContentPane({
        	id: "div_id_tab_search_result_1",
            title: "page 1",
            content: "page 1 content"
        });
*/

	var new_result_tab = new dijit.layout.ContentPane({
		id:			new_tab_div_id, //<div id="...">
		title:		"Search " + search_result_counter,
		//doLayout:	false,
		//nested:	false,
		closable:	true,
		content: "<p>Waiting on data source...</p>",
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

	//console.debug(new_result_tab);
	//console.debug(alert("hei"));
	//console.debug(dijit.byId('div_id_tab_search_result_1'));
	//console.debug(document.getElementById('div_id_tab_search_result_1'));
	//document.getElementById('div_id_tab_search_result_1').innerHTML = 'div_id_tab_search_result_1';

/*
	var sub_tab_1 = new dijit.layout.ContentPane({
		id:			new_tab_div_id + '_sub_1', //<div id="...">
		title:		'All things'
	});
	new_result_tab.addChild(sub_tab_1);

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
	
	open_new_dojo_tab_showing_the_search_result_for_osm_deferred.resolve(return_this_array);
	return open_new_dojo_tab_showing_the_search_result_for_osm_deferred;
} //END open_new_dojo_tab_showing_the_search_result_for_osm()



function count_things_in_osm_endpoint(
	osm_form_input_selected_things,
	search_result_id,
	osm_form_input_nearby_thing,
	sparql_filter
){
	var count_things_in_osm_endpoint_deferred = new dojo.Deferred();
	var deferred_reply_array = [];

	var filter_nearby_thing_1 = "";
	var filter_nearby_thing_2 = "";
	if (
		osm_form_input_nearby_thing != undefined &&
		osm_form_input_nearby_thing.hasOwnProperty('uri') &&
		osm_form_input_nearby_thing.hasOwnProperty('km')
	) {

		filter_nearby_thing_1 = "?nearby_thing_uri";
		filter_nearby_thing_2 = " \
	?nearby_thing_uri 			a 				<" + osm_form_input_nearby_thing.uri + "> . \
  	?nearby_thing_uri   	    geo:geometry 	?nearby_thing_geo . ";

	} //END if

	if ( osm_form_input_selected_things.length > 0 ) {

		for ( r in osm_form_input_selected_things ) {
			var thing_type = osm_form_input_selected_things[r];

			var query = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
SELECT count(?thing_uri) as ?thing_count \
FROM <http://linkedgeodata.org> \
WHERE { \
	?thing_uri 			a 				<"+ thing_type.uri +"> . \
	?thing_uri   	    geo:geometry 	?geo . \
	"+ filter_nearby_thing_2 +" \
	"+ sparql_filter +" \
}";

			var input = {};
				input.escaped_query = "http://live.linkedgeodata.org/sparql/?default-graph-uri=&query=" + escape(query) + "&format=json";
				input.parent_uri = thing_type.uri;

			deferred_reply_array.push(
				read_cross_domain_data(
					input,
					"query_osm_sparql_endpoint"
				)
			);

		} //END for

	}
	else {

		var query = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
SELECT count(?thing_uri) as ?thing_count \
FROM <http://linkedgeodata.org> \
WHERE { \
	?thing_uri   	    geo:geometry 	?geo . \
	"+ filter_nearby_thing_2 +" \
	"+ sparql_filter +" \
}";

		console.debug(query);

		var escaped_query = escape(query);
			escaped_query = "http://live.linkedgeodata.org/sparql/?default-graph-uri=&query=" + escaped_query + "&format=json";

		deferred_reply_array.push(
			read_cross_domain_data(
				escaped_query,
				"query_sparql_endpoint"
			)
		);

	} //END else

	var deferred_list = new dojo.DeferredList(deferred_reply_array);
	deferred_list.then(function(endpoint_reply){

		var result_item_counter = 0;
		var search_overview = search_overview_store.get(search_result_id);
		if (
			search_overview != undefined &&
			search_overview.hasOwnProperty('search_type') &&
			search_overview.hasOwnProperty('type_uri')
		) {
			// "endpoint_reply" is an array of results
			for ( a in endpoint_reply ) {

				var o = endpoint_reply[a][1];

/*
Object
head: Object
results: Object
	bindings: Array[1]
		0: Object
			thing_count: Object
				datatype: "http://www.w3.org/2001/XMLSchema#integer"
				type: "typed-literal"
				value: "1" <------------------------------- Fant ein ting
		length: 1
	distinct: false
	ordered: true
*/

				if (
					o.hasOwnProperty('results') &&
					o.results.hasOwnProperty('bindings') &&
					o.results.bindings.length == 1 &&
					o.results.bindings[0].hasOwnProperty('thing_count') &&
					o.results.bindings[0].thing_count.hasOwnProperty('value')
				) {
					result_item_counter += +o.results.bindings[0].thing_count.value; // ekstra + gjer var til int.

					// Er det ein utvalgt ting som har blitt talt opp?
					if (
						search_overview.search_type == "search_selected_things" &&
						o.hasOwnProperty('triple_subject')
					) {
						// Svaret er ja.

						// Finn type_uri objektet i search_overview_store.
						var array_index = undefined;
						for ( t in search_overview.type_uri ) {
							if ( search_overview.type_uri[t].uri == o.triple_subject ) {
								array_index = t;
								break;
							} //END if
						} //END for

						// Oppdater type_uri objektet i search_overview_store.
						if ( array_index != undefined ) {
							if ( search_overview.type_uri[array_index].hasOwnProperty('endpoint_count') != true ) {
								search_overview.type_uri[array_index].endpoint_count = o.results.bindings[0].thing_count.value;
							} else alert("Error in count_things_in_osm_endpoint()");
						} else alert("Error in count_things_in_osm_endpoint()");
						
					}
					else {
						// Svaret er nei.
						search_overview.type_uri.push({
							endpoint_count: 	o.results.bindings[0].thing_count.value
						});
					} //END else

					search_overview_store.put(search_overview); // store

				} else alert("Error in count_things_in_osm_endpoint()");
			} //END for
		} else alert("Error in count_things_in_osm_endpoint()");

		count_things_in_osm_endpoint_deferred.resolve(result_item_counter);
	}); // END deferred_list

	return count_things_in_osm_endpoint_deferred;
} //END count_things_in_osm_endpoint()




function query_open_street_map_sparql_endpoint(
	osm_form_input_selected_things,
	reply_3,			// tal på ting funne.
	search_result_id,
	osm_form_input_nearby_thing,
	sparql_filter
){
	var query_open_street_map_sparql_endpoint_deferred = new dojo.Deferred();

	// create result store
	open_street_map_result_stores[search_result_id] = new dojo.store.Memory({
		data:{
			identifier:	'uri',
			label:		'name',
			items:[]
		}
	});

	//
	// Lag query for kvar 1000 ting.
	// Dette fordi SPARQL endpoint har ein limit på 1000.
	//

	var search_overview = search_overview_store.get(search_result_id);

	if (
		search_overview != undefined &&
		search_overview.hasOwnProperty('search_type') &&
		search_overview.hasOwnProperty('type_uri')
	) {
		var deferred_reply_array = [];


		var filter_nearby_thing_1 = "";
		var filter_nearby_thing_2 = "";
		if (
			osm_form_input_nearby_thing != undefined &&
			osm_form_input_nearby_thing.hasOwnProperty('uri') &&
			osm_form_input_nearby_thing.hasOwnProperty('km')
		) {

			filter_nearby_thing_1 = "?nearby_thing_uri";
			filter_nearby_thing_2 = " \
	?nearby_thing_uri 			a 				<" + osm_form_input_nearby_thing.uri + "> . \
  	?nearby_thing_uri   	    geo:geometry 	?nearby_thing_geo . ";

		} //END if


		for ( a in search_overview.type_uri ) {
			var thing_type = search_overview.type_uri[a];
			if ( thing_type.hasOwnProperty('endpoint_count') ) {

/*
				//
				// temp - korte ned på resultat
				//
				var max_result = 1000;
				if( thing_type.endpoint_count > max_result ) {
					thing_type.endpoint_count = max_result;
				} //END if
				//
				// temp - korte ned på resultat
				//
*/

				var thing_type_uri = "";
				if ( search_overview.search_type == "search_selected_things" ) {
					if ( thing_type.hasOwnProperty('uri') ) {
						thing_type_uri = "\n	?thing_uri 			a 				<"+ thing_type.uri +"> . ";
					} else alert("Error in query_open_street_map_sparql_endpoint()");
				} //END if


				if ( thing_type.endpoint_count > 1000 ) {

					var offset = 0; // Dei ein har spurt etter og skal hoppe over.

					for (
						var i = thing_type.endpoint_count;
							i > 0;
							i = i - 1000
					) {
						console.debug("limit: " + i);

						var query = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
SELECT DISTINCT ?thing_uri "+ filter_nearby_thing_1 +" \
FROM <http://linkedgeodata.org> \
WHERE { "+ thing_type_uri +" \
	?thing_uri   	    geo:geometry 	?geo . \
	"+ filter_nearby_thing_2 +" \
	"+ sparql_filter +" \
} \
ORDER BY ?thing_uri \
LIMIT 1000 \
OFFSET " + offset;

						var escaped_query = "http://live.linkedgeodata.org/sparql/?default-graph-uri=&query=" + escape(query) + "&format=json";

						deferred_reply_array.push(
							read_cross_domain_data(
								escaped_query,
								"query_sparql_endpoint"
							)
						);

						// Gjer klar til neste runde.
						offset = offset + 1000;

					} //END for
				}
				else {

					var query = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
SELECT DISTINCT ?thing_uri "+ filter_nearby_thing_1 +" \
FROM <http://linkedgeodata.org> \
WHERE { "+ thing_type_uri +" \
	?thing_uri   	    geo:geometry 	?geo . \
	"+ filter_nearby_thing_2 +" \
	"+ sparql_filter +" \
}";

					var escaped_query = "http://live.linkedgeodata.org/sparql/?default-graph-uri=&query=" + escape(query) + "&format=json";

					deferred_reply_array.push(
						read_cross_domain_data(
							escaped_query,
							"query_sparql_endpoint"
						)
					);

				} //END else
	
			} else alert("Error in query_open_street_map_sparql_endpoint()");

		} //END for
	} else alert("Error in query_open_street_map_sparql_endpoint()");

	var deferred_list = new dojo.DeferredList(deferred_reply_array);
	
	deferred_list.then(function(endpoint_reply){

		var result_item_counter = 0;

		// "endpoint_reply" is an array of results
		for ( a in endpoint_reply) {

			var o = endpoint_reply[a][1];

/*
console.debug(o);
Object
head: Object
results: Object
	bindings: Array[1000]
		[0 … 49]
		[0 … 6]
			0: Object
				thing_uri: Object
					type: "uri"
					value: "http://linkedgeodata.org/triplify/node817775916"
			1: Object
			2: Object
			...
*/

			if (
				o.hasOwnProperty('results') &&
				o.results.hasOwnProperty('bindings') &&	// array med objekt som inneheld alle variablane i SPARQL spørjinga. skal ha "s" "p" og "o".
				o.results.bindings.length > 0
			) {

				for ( b in o.results.bindings ) {
					var object = o.results.bindings[b];
					console.debug(object);

					if (
						object.hasOwnProperty('thing_uri') &&
						object.thing_uri.hasOwnProperty('type') &&
						object.thing_uri.type == 'uri' &&
						object.thing_uri.hasOwnProperty('value') &&
						object.thing_uri.value.length > 0
					) {
						//console.debug(object.thing_uri.value);

						var do_you_exist = open_street_map_result_stores[search_result_id].get(object.thing_uri.value);

						if ( do_you_exist == undefined ) {

							var thing = {													// create object

								uri: 						object.thing_uri.value,
								name: 						'N/A',

								type:						'parent_item',
								number_of_rdf_triples: 		0
							};

							open_street_map_result_stores[search_result_id].add(thing);		// store object
							result_item_counter = result_item_counter + 1;

							do_you_exist = open_street_map_result_stores[search_result_id].get(object.thing_uri.value);
						}
						else {
							console.debug("added before");
						} //END else

						//
						// get nearby uri
						//
						if (
							do_you_exist != undefined &&
							object.hasOwnProperty('nearby_thing_uri') &&
							object.nearby_thing_uri.hasOwnProperty('type') &&
							object.nearby_thing_uri.type == 'uri' &&
							object.nearby_thing_uri.hasOwnProperty('value') &&
							object.nearby_thing_uri.value.length > 0
						) {
							// tingen har ein annan ting nearby. oppdater i store.
							if ( do_you_exist.hasOwnProperty('nearby') != true ) {
								do_you_exist.nearby = [];
							} //END if
							do_you_exist.nearby.push(object.nearby_thing_uri.value); 			// update
							open_street_map_result_stores[search_result_id].put(do_you_exist);	// store

							// legg nearby ting til store dersom den ikkje er der frå før.
							var do_nearby_exist = open_street_map_result_stores[search_result_id].get(object.nearby_thing_uri.value);
							if ( do_nearby_exist == undefined ) {

								var thing = {													// create object

									uri: 						object.nearby_thing_uri.value,
									name: 						'N/A',

									type:						'parent_item',
									number_of_rdf_triples: 		0
								};

								open_street_map_result_stores[search_result_id].add(thing);		// store object
								result_item_counter = result_item_counter + 1;

							}
							else {
								console.debug("added before");
							} //END else

						}
						else {
							console.debug("added before");
						} //END else






					} //END if
					else {
						console.debug("no match");
					}
				} //END for
			} //END if
		} //END for

		query_open_street_map_sparql_endpoint_deferred.resolve(result_item_counter);
	}); // END deferred_list

	return query_open_street_map_sparql_endpoint_deferred;
} //END query_open_street_map_sparql_endpoint()


function get_more_from_osm(
	search_result_id
){
	var get_more_from_osm_deferred = new dojo.Deferred();

	// create result store
	osm_rdf_store[search_result_id] = new dojo.store.Memory({
		data:{
			identifier:	'id',
			label:		'name',
			items:[]
		}
	});

	var deferred_list_array = [];
	
	open_street_map_result_stores[search_result_id].query({
		type:					'parent_item'
	}).forEach(function(parent_item){

		var query = "SELECT DISTINCT ?p ?o \
FROM <http://linkedgeodata.org> \
WHERE { \
    <" + parent_item.uri + ">	?p	?o . \
} \
";

		var input = {};
			input.escaped_query = "http://live.linkedgeodata.org/sparql/?default-graph-uri=&query=" + escape(query) + "&format=json";
			input.parent_uri = parent_item.uri;

		deferred_list_array.push(
			read_cross_domain_data(
				input,
				"query_osm_sparql_endpoint"
			)
		);

	}); //END store.query()

	var deferred_list = new dojo.DeferredList(deferred_list_array);
	
	var updated_items_counter = 0;

	deferred_list.then(function(endpoint_reply){

		//console.debug(endpoint_reply);
		// "endpoint_reply" is an array of results

		for ( a in endpoint_reply) {
			// for kvar query result.
			// kvar query spør etter info om ein ting.
			// for kvar ting altså...

			var o = endpoint_reply[a][1];

			// temp
			if ( updated_items_counter < 5 ) {
				console.debug(o);
			} //END if

			if (
				o.hasOwnProperty('results') &&
				o.results.hasOwnProperty('bindings') &&	// array med objekt som inneheld alle variablane i SPARQL spørjinga.
				o.results.bindings.length > 0 &&
				o.hasOwnProperty('triple_subject')
			) {
				var parent_item = open_street_map_result_stores[search_result_id].get(o.triple_subject);

				//console.debug(o.results.bindings);

				if (
					parent_item != undefined &&
					parent_item.hasOwnProperty('uri') &&
					parent_item.hasOwnProperty('number_of_rdf_triples')
				) {
					updated_items_counter = updated_items_counter + 1;

					//console.debug(parent_item);

					var rdf_triple_counter = parent_item.number_of_rdf_triples;

					for ( b in o.results.bindings ) {

						var rdf_triple = o.results.bindings[b];

						// sjekkar at rdf_triple har alt den skal ha.
						if (
							rdf_triple.hasOwnProperty('p') &&			// predicate
							rdf_triple.p.hasOwnProperty('type') &&
							rdf_triple.p.hasOwnProperty('value') &&
							rdf_triple.p.value.length > 0 &&

							rdf_triple.hasOwnProperty('o') &&			// objeckt
							rdf_triple.o.hasOwnProperty('type') &&
							rdf_triple.o.hasOwnProperty('value') &&
							rdf_triple.o.value.length > 0
						) {
							rdf_triple_counter = rdf_triple_counter + 1;

							var triple_nr = rdf_triple_counter;
							var triple_name = "Triple number: " + triple_nr;
							var child_id = parent_item.uri + "_triple_nr_" + triple_nr;

							var child_item = {											// create object

								id: 						child_id,
								name: 						triple_name,

								triple_subject: 			parent_item.uri,
								triple_predicate: 			rdf_triple.p.value,
								triple_object: 				rdf_triple.o.value,

								triple_subject_type:		"uri",
								triple_predicate_type:		rdf_triple.p.type,
								triple_object_type:			rdf_triple.o.type,

								type: 						"rdf_triple",
								triple_nr: 					triple_nr,
								parent_id: 					parent_item.uri,
								recognized_by_app: 			false

							};

							// Dersom objekt har språk-tagg..
							if (
								rdf_triple.o.hasOwnProperty('xml:lang')
							) {
								child_item.triple_object_language = rdf_triple.o['xml:lang'];
							}
							else {
								child_item.triple_object_language = "en";
							}

							osm_rdf_store[search_result_id].add(child_item);			// add to store

						} //END if
						else {
							console.debug("nei");
						}
					} //END for

					parent_item.number_of_rdf_triples = rdf_triple_counter;				// update
					open_street_map_result_stores[search_result_id].put(parent_item);	// store

				} //END if
			} //END if
		} //END for

		get_more_from_osm_deferred.resolve(updated_items_counter);

	}); // END deferred_list

	return get_more_from_osm_deferred;
} //END get_more_from_osm()










function osm_identify_location_triples(
	search_result_id
) {
	var osm_identify_location_triples_deferred = new dojo.Deferred();
	
	// INPUT
	var latitude_type = "http://www.w3.org/2003/01/geo/wgs84_pos#lat";
	var longitude_type = "http://www.w3.org/2003/01/geo/wgs84_pos#long";
	
	// STATUS
	var location_counter = 0;
	var location_polyline_counter = 0;
	
	// Define the callback
	var for_each_latitude_tripel = function(latitude_item, request){
		var deferred2 = new dojo.Deferred();
		
		console.debug("latitude_item");

		// Her har me eit predikat av type latitude.
		// console.debug(latitude_item.triple_object);
		
		// No lyt me finne tilhøyrande predikat av type longitude.
		// Tilhøyrigheit finn ein ved å nytte subjekt (som truleg er ei tom node),
		// samt parent_id og search_result_id.
		
		// Define the callback
		var for_each_longitude_tripel = function(longitude_item, request){
			var deferred3 = new dojo.Deferred();
			
			console.debug("longitude_item");

			//
			// No har me funne både lat og long! Lagre resultat i dojo store!
			//

			var parent_object = open_street_map_result_stores[search_result_id].get(latitude_item.parent_id);	// get

			if ( parent_object != undefined ) {

				location_counter = location_counter + 1;
			
				var new_location_object = {
					latitude_type:		latitude_type,
					latitude_value:		latitude_item.triple_object,
					longitude_type:		longitude_type,
					longitude_value:	longitude_item.triple_object
				};
			
				if ( parent_object.hasOwnProperty('location') != true ) {
					 parent_object.location = [];
				}

				if ( parent_object.hasOwnProperty('location_status') != true ) {
					 parent_object.location_status = true;
				}
			
				parent_object.location.push(new_location_object);	// update
				open_street_map_result_stores[search_result_id].put(parent_object);								// store
			
				console.debug("Location: ");
				console.debug(latitude_item.triple_object);
				console.debug(longitude_item.triple_object);

				//
				// Putt lokasjon på kart!
				//
				dojo.when(
					osm_put_location_on_google_map(
						search_result_id,
						parent_object,
						latitude_item.triple_object,
						longitude_item.triple_object
					),
					function(osm_put_location_on_google_map_reply) {
						deferred3.resolve(true);
					}
				); //END dojo.when()

			}
			else {
				deferred3.resolve(false);
			}

			return deferred3;
		} //END for_each_longitude_tripel = function(longitude_item, request)

		dojo.when(
			osm_rdf_store[search_result_id].query({
				type:						'rdf_triple',
				triple_predicate:			longitude_type,
				triple_predicate_type: 		'uri',
				triple_subject:				latitude_item.triple_subject,
				parent_id:					latitude_item.parent_id
			}).forEach(for_each_longitude_tripel),
			function(for_each_longitude_tripel_reply) {
			
				// Denne skal berre gi eit svar!
				deferred2.resolve(true);
			}
		); //END dojo.when()

		return deferred2;
	} //END for_each_latitude_tripel = function(latitude_item, request)
	


	dojo.when(
		osm_rdf_store[search_result_id].query({
			type:						'rdf_triple',
			triple_predicate:			latitude_type,
			triple_predicate_type: 		'uri'
		}).forEach(for_each_latitude_tripel),
		function(for_each_latitude_tripel_reply) {
/*
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
			osm_identify_location_triples_deferred.resolve(location_counter);
		}
	); //END dojo.when()
	
	//
	// END - inn RDF triplar med google polyline.
	//
*/


			osm_identify_location_triples_deferred.resolve(location_counter);
		}
	); //END dojo.when()


	return osm_identify_location_triples_deferred;
} //END osm_identify_location_triples()



function query_sparqlify(
	options
){
	var	post_deferred =
		dojo.xhrPost({ //HTTP POST REQUEST
			url: "php/sparqlify_proxy.php",
			sync: true,
			failOk: true, // Will suppress error message in console if error occurs.
			content: {
				query:	options.query
			},
			handleAs: "json",
			load: function(response, ioArgs) { // Invoked when the data is returned from the server.
				//console.debug(response);
				response.triple_subject = options.parent_uri;
				return response;
			},
			error: function(response, ioArgs) { // Invoked when an error occurs.
				return "error";
			}
		});

	return post_deferred;
} //END query_sparqlify()












function osm_put_location_on_google_map(
	search_result_id,
	parent_object,
	item_latitude,
	item_longitude
){
	var osm_put_location_on_google_map_deferred = new dojo.Deferred();

/*
category: Array[3]
	0: "http://linkedgeodata.org/ontology/Node"
	1: "http://linkedgeodata.org/ontology/City"
	2: "http://linkedgeodata.org/ontology/Place"
	length: 3
category_status: true
dbpedia_uri: "http://dbpedia.org/resource/Bergen"
dbpedia_uri_status: true
location: Array[1]
location_markers: Array[1]
location_status: true
name: "Bergen"
number_of_rdf_triples: 18
population: "250000"
population_date: "2008-08-15 01:04"
population_date_status: true
population_status: true
sameas: Array[1]
	0: "http://dbpedia.org/resource/Bergen"
	length: 1
sameas_status: true
type: "parent_item"
uri: "http://linkedgeodata.org/triplify/node21261083"
wikipedia_uri: "http://en.wikipedia.org/wiki/Bergen"
wikipedia_uri_status: true
*/

	var parent_item_name = "N/A";
	if (
		parent_object.hasOwnProperty('name') &&
		parent_object.name != "N/A"
	) {
		parent_item_name = parent_object.name;
	} //END if

	var contentString = '<div id="map_content">'+
		'<p>'+
		'Search result ' +
		search_result_id +
		'</p>'+
		'<h2>'+
		parent_item_name +
		'</h2>'+
		'</div>';
	
	var myLatLng = new google.maps.LatLng(
		item_latitude,
		item_longitude
	);
			
	var location_marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: parent_item_name,
		visible: true,
		uri: parent_object.uri,
		content: contentString,
		search_result_id: search_result_id,
		dojo_store_item_id: parent_object.id
	});
			
	//use_this_google_map_icon
	//if (use_this_google_map_icon != null) {
	//	location_marker.default_icon = use_this_google_map_icon;
	//	location_marker.setIcon(use_this_google_map_icon);
	//}
	

	//
	// EVENT - START
	// IF marker vert klikka på..
	//
	google.maps.event.addListener(location_marker, 'click', function() {
		
		unselect_selected_item();

/*
		//
		// START - opne infovindauge
		//

		var infowindow = new google.maps.InfoWindow({
			content: this.content
		});

		infowindow.open(map,this);		// trigger the infobox's open function
		infoWindowArray[0]=infowindow;	// keep the handle, in order to close it on next click event

		//
		// END - opne infovindauge
		//
*/

		// vis info om tingen i "Selected thing" tab
		osm_update_selected_item_tab(
			this.search_result_id,
			this.uri
		);

	});
	//
	// EVENT - END
	//


	//
	// Oppdater objekt til aktuell ting med "location_marker".
	// På denne måten er det veldig enkelt å kontrollere kva som skal vere på kartet.
	//
	var location_markers_status = parent_object.hasOwnProperty("location_markers");		// get status (true / false)

	if (location_markers_status == false) {
		// Tingen har ingen array med location markers frå før.
		parent_object.location_markers = [];												// create new array
	} //END if()
		
	parent_object.location_markers.push(location_marker);									// update object
	open_street_map_result_stores[search_result_id].put(parent_object);					// and store the change
	
	osm_put_location_on_google_map_deferred.resolve(parent_object.location_markers);
	return osm_put_location_on_google_map_deferred;
} //END osm_put_location_on_google_map()















//
// Source: https://groups.google.com/forum/?fromgroups#!topic/linked-geo-data/BXuH45-IXdU
// Source author: Claus Stadler
// Formål: Sørje etter ting som er i ein firkant / kartet (framfor i ein radius).
//

function createSparqlFilter(
	varName,
	osm_form_input_nearby_thing
) {
	var filter_nearby_thing = "";
	if (
		osm_form_input_nearby_thing != undefined &&
		osm_form_input_nearby_thing.hasOwnProperty('uri') &&
		osm_form_input_nearby_thing.hasOwnProperty('km')
	) {
		filter_nearby_thing = "&& \
		bif:st_intersects (?nearby_thing_geo, ?geo, " + osm_form_input_nearby_thing.km + ")";
	} //END if

    var cx = (map_bounds_south_west.lng() + map_bounds_north_east.lng()) * 0.5;
    var cy = (map_bounds_south_west.lat() + map_bounds_north_east.lat()) * 0.5;
    
    var d = getOuterRadiusDeg();

    return "Filter( \
		bif:st_intersects(?" + varName + ", \
    		bif:st_point(" + cx + ", " + cy + "), " + d + ") \
	) . \
	Filter( \
		bif:st_x(?geo) > " + map_bounds_south_west.lng() + " && \
		bif:st_x(?geo) < " + map_bounds_north_east.lng() + " && \
		bif:st_y(?geo) > " + map_bounds_south_west.lat() + " && \
		bif:st_y(?geo) < " + map_bounds_north_east.lat() + " " + filter_nearby_thing + "\
	) . ";
}


function getOuterRadiusDeg()
{
    var d1 = getDistanceDeg(
    	map_bounds_south_west.lng(), 
    	map_bounds_south_west.lat(), 
    	map_bounds_north_east.lng(), 
    	map_bounds_north_east.lat()
    );
    var d2 = getDistanceDeg(
    	map_bounds_south_west.lng(), 
    	map_bounds_north_east.lat(), 
    	map_bounds_north_east.lng(), 
    	map_bounds_south_west.lat()
    );
    var d = Math.max(d1, d2);

    return d * 0.5;
}

function getDistanceDeg(x1, y1, x2, y2) {
    return getDistanceRad(
            degToRad(x1),
            degToRad(y1),
            degToRad(x2),
            degToRad(y2)
    );
}

function degToRad(value)
{
    return value * (Math.PI / 180.0);
}


// Taken from http://www.movable-type.co.uk/scripts/latlong.html
// x -> lon, y -> lat
function getDistanceRad(x1, y1, x2, y2) {
    var R = 6371; // km
    var d = Math.acos(Math.sin(y1) * Math.sin(y2) + 
                      Math.cos(y1) * Math.cos(y2) *
                      Math.cos(x2 - x1)) * R;
    return d;
}























function osm_identify_supported_properties(
	search_result_id
){
	var osm_identify_supported_properties_deferred = new dojo.Deferred();

/*
http://www.w3.org/1999/02/22-rdf-syntax-ns#type	http://linkedgeodata.org/ontology/Node   	<-- ok
http://www.w3.org/1999/02/22-rdf-syntax-ns#type	http://linkedgeodata.org/ontology/City
http://www.w3.org/1999/02/22-rdf-syntax-ns#type	http://linkedgeodata.org/ontology/Place

http://www.w3.org/2000/01/rdf-schema#label	Bergen 											<-- ok
http://www.w3.org/2000/01/rdf-schema#label	"Bergen"@de
http://www.w3.org/2000/01/rdf-schema#label	"Берген"@ru

http://www.w3.org/2002/07/owl#sameAs	http://dbpedia.org/resource/Bergen 					<-- ok

http://linkedgeodata.org/ontology/directType	http://linkedgeodata.org/ontology/City

http://www.w3.org/2003/01/geo/wgs84_pos#geometry	"POINT(5.32696 60.395)"^^<http://www.openlinksw.com/schemas/virtrdf#Geometry>

http://linkedgeodata.org/property/note	Bergen plassert med sentrumsstenen. Det definerte mittpunktet av bergen

http://linkedgeodata.org/ontology/population	250000										<-- ok
http://linkedgeodata.org/property/wikipedia	yes 											<-- ok
http://www.w3.org/2003/01/geo/wgs84_pos#lat	60.394973
http://www.w3.org/2003/01/geo/wgs84_pos#long	5.3269603
http://linkedgeodata.org/ontology/contributor	http://linkedgeodata.org/triplify/user103253
http://linkedgeodata.org/property/old_name	Bjørgvin
http://linkedgeodata.org/property/population_precision	1
http://linkedgeodata.org/property/population_date	2008-08-15 01:04 						<-- do it
*/

	dojo.when(
		osm_find_categories(
			search_result_id
		),
		function(osm_find_categories_reply) {
	dojo.when(
		osm_find_labels(
			search_result_id
		),
		function(osm_find_labels_reply) {
	dojo.when(
		osm_find_sameas(
			search_result_id
		),
		function(osm_find_sameas_reply) {
	dojo.when(
		osm_find_wikipedia(
			search_result_id
		),
		function(osm_find_sameas_reply) {
	dojo.when(
		osm_find_population(
			search_result_id
		),
		function(osm_find_population_reply) {
	dojo.when(
		osm_find_population_date(
			search_result_id
		),
		function(osm_find_population_date_reply) {


			osm_identify_supported_properties_deferred.resolve("ok");
		}
	); //END dojo.when()
		}
	); //END dojo.when()
		}
	); //END dojo.when()
		}
	); //END dojo.when()
		}
	); //END dojo.when()
		}
	); //END dojo.when()




	return osm_identify_supported_properties_deferred;
} //END osm_identify_supported_properties()



function osm_find_categories(
	search_result_id
){
	var osm_find_categories_deferred = new dojo.Deferred();

	// create result store
	osm_category_store[search_result_id] = new dojo.store.Memory({
		data:{
			identifier:	'uri',
			label:		'label',
			items:[]
		}
	});

	// Define the callback
	var for_each_type = function(rdf_triple, request){
		var for_each_type_deferred = new dojo.Deferred();

		if (
			rdf_triple.hasOwnProperty('parent_id') &&
			rdf_triple.hasOwnProperty('triple_object')
		){
			var parent_item = open_street_map_result_stores[search_result_id].get(rdf_triple.parent_id);	// get

			if ( parent_item != undefined ) {
				// Update parent_item.

				if ( parent_item.hasOwnProperty('category') == false ) {
					parent_item.category = [];
					parent_item.category_status = true;
				}

				parent_item.category.push(rdf_triple.triple_object); // example: http://linkedgeodata.org/ontology/City
				open_street_map_result_stores[search_result_id].put(parent_item);							// store

				var category_item = osm_category_store[search_result_id].get(rdf_triple.triple_object);		// get
				if ( category_item == undefined ) {

					// Get label
					var label = "N/A";
					var ontology_object = things_to_search_for_store.get(rdf_triple.triple_object);
					if (
						ontology_object != undefined &&
						ontology_object.hasOwnProperty('thing_type_label')
					) {
						label = ontology_object.thing_type_label;
					} //END if

					category_item = {
						uri: 		rdf_triple.triple_object,
						label: 		label,
						thing_uri: 	[]
					}
				} //END if
				category_item.thing_uri.push(parent_item.uri);
				osm_category_store[search_result_id].put(category_item); 									// store

				rdf_triple.recognized_by_app = true;
				osm_rdf_store[search_result_id].put(rdf_triple); 											// store

				for_each_type_deferred.resolve(true);
			}
			else {
				alert("error in osm_find_categories");
			}
		}
		else {
			alert("error in osm_find_categories");
		}

		return for_each_type_deferred;
	} //END for_each_type_deferred

	dojo.when(
		osm_rdf_store[search_result_id].query({
			type:						'rdf_triple',
			triple_predicate:			'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
			triple_predicate_type: 		'uri',
			triple_object_type: 		'uri',
			recognized_by_app: 			false
		}).forEach(for_each_type),
		function(for_each_type_reply) {
			// Denne vert kjøyrt etter loopen over.
			osm_find_categories_deferred.resolve(true);
		}
	); //END dojo.when()

	return osm_find_categories_deferred;
} //END osm_find_categories()



function osm_find_labels(
	search_result_id
){
	var osm_find_labels_deferred = new dojo.Deferred();

	// Define the callback
	var for_each_type = function(rdf_triple, request){
		var for_each_type_deferred = new dojo.Deferred();

		if (
			rdf_triple.hasOwnProperty('parent_id') &&
			rdf_triple.hasOwnProperty('triple_object')
		){
			var parent_item = open_street_map_result_stores[search_result_id].get(rdf_triple.parent_id);	// get

			if (
				parent_item != undefined &&
				parent_item.hasOwnProperty('uri') &&
				parent_item.hasOwnProperty('name')
			) {
				if ( parent_item.name == "N/A" ) {

					parent_item.name = rdf_triple.triple_object; 											// example: Bergen
					open_street_map_result_stores[search_result_id].put(parent_item);						// store

					for_each_type_deferred.resolve(true);
				}
				else {
					// parent_item har fått label satt før.
					for_each_type_deferred.resolve(false);
				}
			}
			else {
				alert("error in osm_find_labels");
			} //END else
		}
		else {
			alert("error in osm_find_labels");
		} //END else

		rdf_triple.recognized_by_app = true;				// update
		osm_rdf_store[search_result_id].put(rdf_triple); 	// store

		return for_each_type_deferred;
	} //END for_each_type_deferred

	dojo.when(
		osm_rdf_store[search_result_id].query({
			type:						'rdf_triple',
			triple_predicate:			'http://www.w3.org/2000/01/rdf-schema#label',
			triple_predicate_type: 		'uri',
			triple_object_type: 		'literal',
			triple_object_language: 	'en',
			recognized_by_app: 			false
		}).forEach(for_each_type),
		function(for_each_type_reply) {
			// Denne vert kjøyrt etter loopen over.
			osm_find_labels_deferred.resolve(true);
		}
	); //END dojo.when()

	return osm_find_labels_deferred;
} //END osm_find_labels()




function osm_find_sameas(
	search_result_id
){
	var osm_find_sameas_deferred = new dojo.Deferred();

	// Define the callback
	var for_each_type = function(rdf_triple, request){
		var for_each_type_deferred = new dojo.Deferred();

		if (
			rdf_triple.hasOwnProperty('parent_id') &&
			rdf_triple.hasOwnProperty('triple_object')
		){
			var parent_item = open_street_map_result_stores[search_result_id].get(rdf_triple.parent_id);	// get

			if (
				parent_item != undefined &&
				parent_item.hasOwnProperty('uri')
			) {

				// har parent_item ein dbpedia uri frå før?
				if ( parent_item.hasOwnProperty('dbpedia_uri_status') == false ) {
					// nei. (me tek her utgangspunkt at parent_item berre kan ha ein dbpedia_uri).
					// er dette ein dbpedia uri?
					var check_first = "http://dbpedia.org/resource/";
					if (
						rdf_triple.triple_object.substring(0, check_first.length) === check_first &&
						rdf_triple.triple_object.charAt(rdf_triple.triple_object.length - 1)
					) {
						// fant ein dbpedia_uri!
						parent_item.dbpedia_uri = rdf_triple.triple_object;									// update
						parent_item.dbpedia_uri_status = true;												// update
					} //END if
				} //END if

				if ( parent_item.hasOwnProperty('sameas') == false ) {
					parent_item.sameas = [];
					parent_item.sameas_status = true;
				} //END if

				parent_item.sameas.push(rdf_triple.triple_object); 	// example: http://dbpedia.org/resource/Bergen
				open_street_map_result_stores[search_result_id].put(parent_item);							// store

				for_each_type_deferred.resolve(true);
			}
			else {
				alert("error in osm_find_sameas");
			} //END else
		}
		else {
			alert("error in osm_find_sameas");
		} //END else

		rdf_triple.recognized_by_app = true;				// update
		osm_rdf_store[search_result_id].put(rdf_triple); 	// store

		return for_each_type_deferred;
	} //END for_each_type_deferred

	dojo.when(
		osm_rdf_store[search_result_id].query({
			type:						'rdf_triple',
			triple_predicate:			'http://www.w3.org/2002/07/owl#sameAs',
			triple_predicate_type: 		'uri',
			triple_object_type: 		'uri',
			recognized_by_app: 			false
		}).forEach(for_each_type),
		function(for_each_type_reply) {
			// Denne vert kjøyrt etter loopen over.
			osm_find_sameas_deferred.resolve(true);
		}
	); //END dojo.when()

	return osm_find_sameas_deferred;
} //END osm_find_sameas()



function osm_find_wikipedia(
	search_result_id
){
	var osm_find_wikipedia_deferred = new dojo.Deferred();

	// Define the callback
	var for_each_type = function(rdf_triple, request){
		var for_each_type_deferred = new dojo.Deferred();

		if (
			rdf_triple.hasOwnProperty('parent_id') &&
			rdf_triple.hasOwnProperty('triple_object')
		){
			var parent_item = open_street_map_result_stores[search_result_id].get(rdf_triple.parent_id);	// get

			if ( parent_item != undefined ) {
				if (
					parent_item.hasOwnProperty('wikipedia_uri_status') == false &&
					parent_item.hasOwnProperty('name') &&
					parent_item.name != "N/A" &&
					rdf_triple.triple_object == "yes"
				) {
					parent_item.wikipedia_uri = "http://en.wikipedia.org/wiki/" + parent_item.name; 		// update
					parent_item.wikipedia_uri_status = true; 												// update
					open_street_map_result_stores[search_result_id].put(parent_item);						// store

					for_each_type_deferred.resolve(true);
				}
				else {
					// parent_item har fått label satt før.
					for_each_type_deferred.resolve(false);
				}
			}
			else {
				alert("error in osm_find_wikipedia");
			} //END else
		}
		else {
			alert("error in osm_find_wikipedia");
		} //END else

		rdf_triple.recognized_by_app = true;				// update
		osm_rdf_store[search_result_id].put(rdf_triple); 	// store

		return for_each_type_deferred;
	} //END for_each_type_deferred

	dojo.when(
		osm_rdf_store[search_result_id].query({
			type:						'rdf_triple',
			triple_predicate:			'http://linkedgeodata.org/property/wikipedia',
			triple_predicate_type: 		'uri',
			triple_object_type: 		'literal',
			recognized_by_app: 			false
		}).forEach(for_each_type),
		function(for_each_type_reply) {
			// Denne vert kjøyrt etter loopen over.
			osm_find_wikipedia_deferred.resolve(true);
		}
	); //END dojo.when()

	return osm_find_wikipedia_deferred;
} //END osm_find_wikipedia()




function osm_find_population(
	search_result_id
){
	var osm_find_population_deferred = new dojo.Deferred();

	// Define the callback
	var for_each_type = function(rdf_triple, request){
		var for_each_type_deferred = new dojo.Deferred();

		if (
			rdf_triple.hasOwnProperty('parent_id') &&
			rdf_triple.hasOwnProperty('triple_object')
		){
			var parent_item = open_street_map_result_stores[search_result_id].get(rdf_triple.parent_id);	// get

			if ( parent_item != undefined ) {
				if ( parent_item.hasOwnProperty('population_status') == false ) {
					parent_item.population = rdf_triple.triple_object; 										// update
					parent_item.population_status = true; 													// update
					open_street_map_result_stores[search_result_id].put(parent_item);						// store

					for_each_type_deferred.resolve(true);
				}
				else {
					// parent_item har fått label satt før.
					for_each_type_deferred.resolve(false);
				}
			}
			else {
				alert("error in osm_find_population");
			} //END else
		}
		else {
			alert("error in osm_find_population");
		} //END else

		rdf_triple.recognized_by_app = true;				// update
		osm_rdf_store[search_result_id].put(rdf_triple); 	// store

		return for_each_type_deferred;
	} //END for_each_type_deferred

	dojo.when(
		osm_rdf_store[search_result_id].query({
			type:						'rdf_triple',
			triple_predicate:			'http://linkedgeodata.org/ontology/population',
			triple_predicate_type: 		'uri',
			triple_object_type: 		'typed-literal',
			recognized_by_app: 			false
		}).forEach(for_each_type),
		function(for_each_type_reply) {
			// Denne vert kjøyrt etter loopen over.
			osm_find_population_deferred.resolve(true);
		}
	); //END dojo.when()

	return osm_find_population_deferred;
} //END osm_find_population()




function osm_find_population_date(
	search_result_id
){
	var osm_find_population_date_deferred = new dojo.Deferred();

	// Define the callback
	var for_each_type = function(rdf_triple, request){
		var for_each_type_deferred = new dojo.Deferred();

		if (
			rdf_triple.hasOwnProperty('parent_id') &&
			rdf_triple.hasOwnProperty('triple_object')
		){
			var parent_item = open_street_map_result_stores[search_result_id].get(rdf_triple.parent_id);	// get

			if ( parent_item != undefined ) {
				if ( parent_item.hasOwnProperty('population_date_status') == false ) {
					parent_item.population_date = rdf_triple.triple_object; 										// update
					parent_item.population_date_status = true; 													// update
					open_street_map_result_stores[search_result_id].put(parent_item);						// store

					for_each_type_deferred.resolve(true);
				}
				else {
					// parent_item har fått label satt før.
					for_each_type_deferred.resolve(false);
				}
			}
			else {
				alert("error in osm_find_population_date");
			} //END else
		}
		else {
			alert("error in osm_find_population_date");
		} //END else

		rdf_triple.recognized_by_app = true;				// update
		osm_rdf_store[search_result_id].put(rdf_triple); 	// store

		return for_each_type_deferred;
	} //END for_each_type_deferred

	dojo.when(
		osm_rdf_store[search_result_id].query({
			type:						'rdf_triple',
			triple_predicate:			'http://linkedgeodata.org/property/population_date',
			triple_predicate_type: 		'uri',
			triple_object_type: 		'literal',
			recognized_by_app: 			false
		}).forEach(for_each_type),
		function(for_each_type_reply) {
			// Denne vert kjøyrt etter loopen over.
			osm_find_population_date_deferred.resolve(true);
		}
	); //END dojo.when()

	return osm_find_population_date_deferred;
} //END osm_find_population_date()









function osm_set_nearby_thing() {
	var osm_form_input_nearby_thing = undefined;
	var radio = get_input_from_form_radio("form_search_filter");
	var km = document.getElementById("search_column_4_slider");

	if (
		radio != false &&
		radio != "nothing"
	) {
		osm_form_input_nearby_thing = {
			uri: 	radio,
			km: 	km.value
		};
	} //END if

	return osm_form_input_nearby_thing;
} //END osm_set_nearby_thing()












function osm_update_selected_item_tab(
	search_result_id,
	dojo_store_item_uri
){
	var osm_update_selected_item_tab_deferred = new dojo.Deferred();

	var selected_thing = open_street_map_result_stores[search_result_id].get(dojo_store_item_uri);
	var search_overview = search_overview_store.get(search_result_id);
	
	console.debug(selected_thing);
	console.debug(search_overview);



	//
	// Update selected_item var
	//
	if (
		search_overview.hasOwnProperty('search_source') &&
		search_overview.hasOwnProperty('search_result_id') &&
		selected_thing.hasOwnProperty('uri')
	) {
		selected_item = {
			selection_status: 	true, //something is selected, true or false
			selection_type: 	'item', //what is selected, item or group
			search_source: 		search_overview.search_source, //sindice or osm
			search_result_id: 	search_overview.search_result_id, //what search tab..
			thing_uri: 			selected_thing.uri //what thing..
		};
	}
	else {
		selected_item = {
			selection_status: 	false //something is selected, true or false
		};
	} //END else
	console.debug("selected_item:");
	console.debug(selected_item);



	//
	// DISPLAY info about a selected thing
	// by overwriting div_id_selected_thing
	//
	// OBS! Alle søk delar denne tabben!
	//
	var tab = document.getElementById("div_id_selected_thing");
	tab.innerHTML = ""; // fjernar alt som ligg i div frå før
	//selected_thing.name
	
	var	selected_thing_container				= document.createElement("div");
		selected_thing_container.id				= "div_id_selected_thing_container";
		selected_thing_container.className		= "div_class_selected_thing_container"; //css



	//
	// Heatmap categorysation
	//
	if (
		selected_item.hasOwnProperty('selection_status') &&
		selected_item.selection_status == true &&
		selected_item.hasOwnProperty('search_source') &&
		selected_item.hasOwnProperty('search_result_id') &&
		selected_item.hasOwnProperty('thing_uri')
	) {
		var	hc_div						= document.createElement("div");
			hc_div.id					= "div_id_heatmap_categorysation";
			hc_div.className			= "div_class_heatmap_categorysation"; //css

		var	p							= document.createElement("p");

		// Dersom tingen har ein kategori, sett matchande style.
		if ( selected_thing.hasOwnProperty('heatmap_category_id') ) {
			var category = heatmap_store.get(selected_thing.heatmap_category_id);
			if (
				category != undefined &&
				category.hasOwnProperty('cat_code') == true
			) {
				// jquery
				$(p).css('border-left', '24px solid #' + category.cat_code);
				$(p).css('padding-left', '6px');
				//$(p).css('font-size', '19px');
			} //END if
		} //END if

		var hc_select_label 			= document.createElement("label");
			hc_select_label.setAttribute('for', 'hc_select_id');
			hc_select_label.innerHTML 	= "Group ";
		p.appendChild(hc_select_label);

		var	hc_select					= document.createElement("select");
			hc_select.id 				= "hc_select_id";
			hc_select.setAttribute('onchange', "update_category_on_a_thing(selected_item.search_source,selected_item.search_result_id,selected_item.thing_uri)");
		var	hc_option 					= document.createElement("option");
			hc_option.setAttribute('value', 'none');
			hc_option.innerHTML 		= "None";
		hc_select.appendChild(hc_option);
		
		heatmap_store.query({
			type: 'category'
		}).forEach(function(category) {
			var	hc_option = document.createElement("option");
			hc_option.setAttribute('value', category.cat_id);
			hc_option.innerHTML = category.cat_label;

			if (
				selected_thing.hasOwnProperty('heatmap_category_id') &&
				selected_thing.heatmap_category_id == category.cat_id
			) {
				hc_option.setAttribute('selected', 'selected');
			} //END if

			hc_select.appendChild(hc_option);
		});

		p.appendChild(hc_select);
		hc_div.appendChild(p);
		selected_thing_container.appendChild(hc_div);

	} //END if



/* temp
		var category_div			= document.createElement("div");
			category_div.id			= "div_id_osm_category";
			category_div.className	= "div_class_osm_category"; //css

		for ( c in selected_thing.category ) {
			var category_uri = selected_thing.category[c];
			var category_object = osm_category_store[search_result_id].get(category_uri);

			console.debug(category_object);

			var category_label = "N/A";
			if (
				category_object != undefined &&
				category_object.hasOwnProperty('label') &&
				category_object.label.length > 0
			) {
				category_label = category_object.label;
			} //END if

			var h2				= document.createElement("h2");
				h2.innerHTML	= category_label;

			var	p				= document.createElement("p");
				p.innerHTML		= category_uri;
		
			category_div.appendChild(h2);
			category_div.appendChild(p);
		} //END for

		selected_thing_container.appendChild(category_div);
*/






















	if (
		selected_thing.hasOwnProperty('uri') &&
		selected_thing.hasOwnProperty('name')
	) {
		
		var	top_text_header							= document.createElement("p");
			top_text_header.innerHTML				= "Name";
		
		var	top_text = document.createElement("h1");
			top_text.innerHTML = "<a href=\"" +
				selected_thing.uri + "\" target=\"_blank\">" + 
				selected_thing.name + "</a>";
		
		var	selected_thing_top						= document.createElement("div");
			selected_thing_top.id					= "div_id_selected_thing_top";
			selected_thing_top.className			= "div_class_selected_thing_top"; //css
			//selected_thing_top.appendChild(top_text_header);
			selected_thing_top.appendChild(top_text);
			
		selected_thing_container.appendChild(selected_thing_top);
		
	} //END if

	if (
		selected_thing.hasOwnProperty('category_status') &&
		selected_thing.category_status == true &&
		selected_thing.hasOwnProperty('category') &&
		selected_thing.category.length > 0
	) {
		var category_div			= document.createElement("div");
			category_div.id			= "div_id_osm_category";
			category_div.className	= "div_class_osm_category"; //css

		for ( c in selected_thing.category ) {
			var category_uri = selected_thing.category[c];
			var category_object = osm_category_store[search_result_id].get(category_uri);

			console.debug(category_object);

			var category_label = "N/A";
			if (
				category_object != undefined &&
				category_object.hasOwnProperty('label') &&
				category_object.label.length > 0
			) {
				category_label = category_object.label;
			} //END if

			var h2				= document.createElement("h2");
				h2.innerHTML	= category_label;

			var	p				= document.createElement("p");
				p.innerHTML		= category_uri;
		
			category_div.appendChild(h2);
			category_div.appendChild(p);
		} //END for

		selected_thing_container.appendChild(category_div);

	} //END if

	if (
		selected_thing.hasOwnProperty('number_of_rdf_triples')
	) {
		var	selected_thing_stats_1				= document.createElement("p");
			selected_thing_stats_1.innerHTML	= "RDF triples";
			
		var	selected_thing_stats_2				= document.createElement("p");
			selected_thing_stats_2.innerHTML	= "Total: " + selected_thing.number_of_rdf_triples + " triples";
			
		var	selected_thing_stats			= document.createElement("div");
			selected_thing_stats.id			= "div_id_selected_thing_stats";
			selected_thing_stats.className	= "div_class_selected_thing_stats"; //css
			selected_thing_stats.appendChild(selected_thing_stats_1);
			selected_thing_stats.appendChild(selected_thing_stats_2);
		
		selected_thing_container.appendChild(selected_thing_stats);
	} //END if

	tab.appendChild(selected_thing_container);

	osm_update_selected_item_tab_deferred.resolve(true);
	return osm_update_selected_item_tab_deferred;
} //END osm_update_selected_item_tab()





function osm_add_result_to_new_tab(
	search_result_id
){
	var osm_add_result_to_new_tab_deferred = new dojo.Deferred();

	var display_id = search_result_tabs[search_result_id];
	//var display_search_result_here = display_id + "_sub_1";
	//var display_search_result_here = display_id + "_sub_1";
	//console.debug(display_search_result_here);
	//var display_search_result_here = "div_id_tab_search_result_" + display_id;
	
	//
	//	DISPLAY SUBTAB 1
	//
	var tab = document.getElementById(display_id);
	tab.innerHTML = ""; // fjernar alt som ligg i div frå før
	//document.getElementById('div_id_tab_search_result_1').innerHTML = 'div_id_tab_search_result_1';

/*
	var subtab_1_container = document.createElement("div");
	subtab_1_container.id = display_search_result_here + "_container";
	subtab_1_container.className ="subtab_1_container"; //css
	subtab_1_container.innerHTML = "tut";
*/
	var subtab_1_left_div = document.createElement("div");
	subtab_1_left_div.id = display_id + "_left_div";
	subtab_1_left_div.className ="subtab_1_left_div"; //css
	//subtab_1_left_div.innerHTML = "This HTML Div tag created using Javascript DOM dynamically.";

	var p = document.createElement("p");
		p.innerHTML = "<a href='javascript:osm_markers_show_all("+ search_result_id +")'>Show all<a/> / \
<a href='javascript:osm_markers_hide_all("+ search_result_id +")'>Hide all<a/>";
	subtab_1_left_div.appendChild(p);













	var p = document.createElement("p");
	osm_category_store[search_result_id].query({}, {
		sort:[{attribute: "label", descending: false}]
	}).forEach(function(category){
		if (
			category.hasOwnProperty('uri') &&
			category.uri.length > 0 &&
			category.hasOwnProperty('label') &&
			category.label.length > 0 &&
			category.hasOwnProperty('thing_uri') &&
			category.thing_uri.length > 0
		) {
			p.innerHTML += "<a href='javascript:osm_show_selected_category("+ search_result_id +",\""+ category.uri +"\")'>"+ category.label +" ("+ category.thing_uri.length +")<a/><br>";
		} //END if
	}); //END open_street_map_result_stores[search_result_id].query()
	subtab_1_left_div.appendChild(p);






/*
	var p = document.createElement("p");
	var for_each = function(category, request) {
		var category_deferred = new dojo.Deferred();
											
		if (
			category.hasOwnProperty('uri') &&
			category.uri.length > 0 &&
			category.hasOwnProperty('label') &&
			category.label.length > 0 &&
			category.hasOwnProperty('thing_uri') &&
			category.thing_uri.length > 0
		) {
			p.innerHTML += "<a href='javascript:osm_show_selected_category("+ search_result_id +",\""+ category.uri +"\")'>"+ category.label +" ("+ category.thing_uri.length +")<a/><br>";
		} //END if

		return category_deferred;
	} //END for_each
									
	dojo.when(
	osm_category_store[search_result_id].query().forEach(for_each),
		function(for_each_reply) {
		
	}); //END dojo.when()
	subtab_1_left_div.appendChild(p);
*/










	tab.appendChild(subtab_1_left_div);

	osm_add_result_to_new_tab_deferred.resolve(true);
	return osm_add_result_to_new_tab_deferred;
} //END osm_add_result_to_new_tab()





		var new_form_2 = document.createElement("form");
			new_form_2.name = "form_osm_select_ontology";
			new_form_2.action = "";

		var input_element_2 = document.createElement("input");
			input_element_2.type = "radio";
			input_element_2.name = "radio_osm_selected_ontology";
			input_element_2.value = "osm_ontology";
			input_element_2.setAttribute("checked", "checked");

			new_form_2.appendChild(input_element_2);
			new_form_2.appendChild(document.createTextNode("Open Street Map ontology"));
			new_form_2.appendChild(document.createElement("br"));



category: Array[3]
	0: "http://linkedgeodata.org/ontology/Node"
	1: "http://linkedgeodata.org/ontology/PostBox"
	2: "http://linkedgeodata.org/ontology/Amenity"
	length: 3
	__proto__: Array[0]
category_status: true
location: Array[1]
	0: Object
	latitude_type: "http://www.w3.org/2003/01/geo/wgs84_pos#lat"
	latitude_value: "60.379505"
	longitude_type: "http://www.w3.org/2003/01/geo/wgs84_pos#long"
	longitude_value: "5.3375363"
	__proto__: Object
	length: 1
	__proto__: Array[0]
location_markers: Array[1]
	0: wh
	length: 1
	__proto__: Array[0]
location_status: true
name: "N/A"
number_of_rdf_triples: 8
type: "parent_item"
uri: "http://linkedgeodata.org/triplify/node294942528"















		var div_id_search_column_4 = document.getElementById("div_id_search_column_4");
			div_id_search_column_4.innerHTML = ""; // fjernar alt som ligg i <div> frå før






Denne funka mal:

PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> 
SELECT DISTINCT ?thing_uri ?nearby_thing_uri
FROM <http://linkedgeodata.org>
WHERE { 

	?thing_uri 			a 				<http://linkedgeodata.org/ontology/TourismHotel> .
  	?thing_uri   	    geo:geometry 	?geo .

	?nearby_thing_uri 			a 				<http://linkedgeodata.org/ontology/Cafe> .
  	?nearby_thing_uri   	    geo:geometry 	?nearby_thing_geo .

	Filter( 	
		bif:st_intersects(?geo,    bif:st_point(5.321302329772948, 60.39032672879178), 1.9355573358036888) 	) . 
	Filter( 	
		bif:st_x(?geo) > 5.2887510411682115 &&
	 	bif:st_x(?geo) < 5.353853618377684 &&
	 	bif:st_y(?geo) > 60.383668677675935 &&
	  	bif:st_y(?geo) < 60.39698477990762 &&
        bif:st_intersects (?nearby_thing_geo, ?geo, 1)
 	) .  
} 



Filter(
 		bif:st_intersects(?geo,   bif:st_point(5.3262027256431566, 60.38928838705587), 0.241952399198968) 	) .
Filter(
 		bif:st_x(?geo) > 5.3221338145675645 &&
  		bif:st_x(?geo) < 5.330271636718749 && 
  		bif:st_y(?geo) > 60.38845610411361 &&
   		bif:st_y(?geo) < 60.39012066999814 	
) . 













function count_things_in_osm_endpoint(
	osm_form_input_selected_things,
	search_result_id
){
	var count_things_in_osm_endpoint_deferred = new dojo.Deferred();
	var deferred_reply_array = [];
	var sparql_filter = createSparqlFilter("geo");

	if ( osm_form_input_selected_things.length > 0 ) {

				console.debug("thing_type");
				console.debug(osm_form_input_selected_things); //temp

		for ( r in osm_form_input_selected_things ) {
			var thing_type = osm_form_input_selected_things[r];

			var query = "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
SELECT count(?thing_uri) as ?thing_count \
FROM <http://linkedgeodata.org> \
WHERE { \
	?thing_uri 			a 				<"+ thing_type.uri +"> . \
	?thing_uri   	    geo:geometry 	?geo . \
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
	"+ sparql_filter +" \
}";

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





























function query_open_street_map_sparql_endpoint(
	osm_form_input_selected_things,
	reply_3,			// tal på ting funne.
	search_result_id
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

	var find_type = "";

	if ( osm_form_input_selected_things > 0 ) {
		for ( thing_type_uri in osm_form_input_selected_things ) {
			find_type = find_type + "\n			?thing_uri 	a 	<"+ thing_type_uri +"> . ";
		}
	} //END if

	//
	// temp - korte ned på resultat
	//
	var max_result = 1000;
	if ( reply_3 > max_result ) {
		reply_3 = max_result;
	} //END if

	var deferred_reply_array = [];

	if ( reply_3 > 1000 ) {

		var offset = 0; // Dei ein har spurt etter og skal hoppe over.

		for (
			var i = reply_3;
				i > 0;
				i = i - 1000
		) {
			console.debug(i);

			var query = " \
			PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
			SELECT DISTINCT ?thing_uri \
			FROM <http://linkedgeodata.org> \
			WHERE { "+ find_type +" \
			    ?thing_uri   	    geo:geometry 	?geo . \
				"+ createSparqlFilter("geo") +" \
			} \
			ORDER BY ?thing_uri \
			LIMIT 1000 \
			OFFSET " + offset + " \
			";

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

		var query = " \
		PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \
		SELECT DISTINCT ?thing_uri \
		FROM <http://linkedgeodata.org> \
		WHERE { \
			"+ find_type +" \
		    ?thing_uri   	    geo:geometry 	?geo . \
			"+ createSparqlFilter("geo") +" \
		}";

		var escaped_query = "http://live.linkedgeodata.org/sparql/?default-graph-uri=&query=" + escape(query) + "&format=json";

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

/*							
	//
	//Setup - Data grid layout
	//
	var layout = [
		{
			//type: "dojox.grid._CheckBoxSelector"
			type: "dojox.grid._RadioSelector"
		},
		[
			{	name: 'Name', 
				field: 'name', 
				width: '350px',
				formatter: function(value){

					if (value.length > 40) {
						value = value.slice(0,37) + "...";
					}
					
					return value;
				}
			},
			{	name: 'Match', 
				field: 'number_of_matching_rdf_triples', 
				width: '100px',
				formatter: function(value){
					//Finn kor mange prosent av triplane me søkte etter denne tingen har.
					var one_match_in_percentage = 100 / number_of_triples;
					
					return one_match_in_percentage * value + "%";
				}
			},
			{	name: 'Display', 
				field: 'checkbox', 
				width: '100px',
				editable: true,
				type: dojox.grid.cells.Bool,
				styles: 'text-align: center;'
			},
			{	name: 'Wikipedia',
				field: 'number_of_detected_wikipedia_articles', 
				width: '100px',
				formatter: function(value){
					// PROBLEM: dersom ein spør etter eit array i grid
					// får ein berre første verdi i array. Det vert
					// dermed ikkje mogleg å få lengde på array.
					// Løysinga på problemet vert dermed å legge inn
					// lengde på array som eigen verdi slik at grid
					// kan vise verdien. Veldig tullete! >:(
					return value;
				}
			}
			
		]
	];
	
	//Create a new grid
	var grid = new dojox.grid.DataGrid({
		query: {
			type:	'searchResult'
		},
		store: store[new_store_array_number],
		structure: layout
		
	},
	document.createElement('div'));

	// append the new grid to the div id
	dojo.byId(display_search_result_here).appendChild(grid.domNode);

	// Call startup, in order to render the grid:
	grid.startup();




*/





	
/*	
	//
	// Events
	//
	
	// 111111111111111111111111111111111111111111
	// Når ein ting blir valgt....
	dojo.connect(grid, "onSelectionChanged", grid, function(){
	
		var array_of_selected_items		= this.selection.getSelected();		//  this will be an array of dojo.data items
		var selected_item				= array_of_selected_items[0];
		
		if (selected_item != null) {
			console.log("Thing selected!");
		
			var selected_item_uri				= selected_item['uri'][0];
			var selected_item_name				= selected_item['name'][0];
			var selected_item_dojo_store_id		= selected_item['dojo_store_id_number'][0];		// Viktig for å kunne plassere info i rett tab!
			
			console.log(selected_item);
			console.log(selected_item_uri);
			console.log(selected_item_name);
			console.log(selected_item_dojo_store_id);
			
			update_selected_item_tab(
				selected_item_dojo_store_id,
				selected_item_uri,
				selected_item
			);
		}
		else {
			console.log("Thing unselected!");
			//TODO: Lyt ha dojo store id for å vite kva tab ein skal null stille selected item...
		}
		
		//sjå her for eksempel: http://dojotoolkit.org/documentation/tutorials/1.6/working_grid/
	});
*/	
	
	
	dojo.connect(grid, "onSelected", grid, function(inRowIndex){
	
		var this_item = grid.getItem(inRowIndex);
		var this_item_uri = this_item['uri'][0];
		var this_item_name = this_item['name'][0];
		
		
	
		//this will be an array of dojo.data items
		//var items = this.selection.getSelected();
		//console.log(items);
		
		//alert("forandring! hipp hipp");
		//sjå her for eksempel: http://dojotoolkit.org/documentation/tutorials/1.6/working_grid/
	});
	
	

	dojo.connect(grid, "onApplyCellEdit", function (inValue, inRowIndex, inFieldIndex){
	
		// PROBLEM
		// Har problem med at denne EVENT'en vert kjøyrt fleire gonger!
		// Den vert kjøyrt både for den som var valgt og den som blir valgt!
		// Dette er eigentlig ikkje noko problem, så ignorerer problemet.

		var this_item = grid.getItem(inRowIndex);		// Hentar item som har aktuell checkbox.
														// Endringen i checkbox har alt skjedd,
														// så det er ingen gamal verdi å hente.
														
		var this_item_uri = this_item['uri'][0];		// Brukast til å finne aktuell marker.
		var this_item_checkbox_status = 				// OPPGÅVE: Aktuell marker skal få denne status.
			this_item['checkbox'][0];					// TRUE / FALSE
		
	//	console.log(inValue);
	//	console.log(inRowIndex);
	//	console.log(inFieldIndex);
	//	console.log(this_item);
	//	console.log(this_item_uri);
	//	console.log(markersArray);
		
		
		//5555555555555555555555555555555555555555
		
		dojo.forEach(markersArray, function(marker, index){
			if (marker['search_result_layer'] == map_layer_name) {		// IF marker tilhøyrer rett layer.
		
				if (marker['uri'] == this_item_uri) {					// IF dette er utvalgt marker.
				
					// Aktuell marker får rett status
					// Dette avgjer om marker vert vist på kart eller ikkje.
					markersArray[index].setVisible(this_item_checkbox_status);	// TRUE / FALSE
					store[new_store_array_number].save();
					console.log(markersArray[index]);
					
					//
					// Show info box for selected marker
					//
					if (this_item_checkbox_status == true) {	

						closeInfos(); // close the previous info-window
						
						// the marker's content gets attached to the info-window:
						var infowindow = new google.maps.InfoWindow({
							content: marker['content']
						});
						
						infowindow.open(map,marker); // trigger the infobox's open function
						infoWindowArray[0]=infowindow; // keep the handle, in order to close it on next click event
					} 
					else { // this_item_checkbox_status == false
						closeInfos(); // close the previous info-window
					} //END IF
				} //END IF
			} //END IF
			//else
			//dette er ein marker i eit anna layer
		});
		
		
		
		
		//alert(inValue);
		
		//store[new_store_array_number].save();
		
		//sjå her for eksempel: http://dojotoolkit.org/documentation/tutorials/1.6/working_grid/
	});
	
	
		
	//
	// Define the callback
	//
	var for_each_item = function(item, request){
		//console.log(item);
		
		//
		// Put the results on the google map
		//
		for (l in item['location']) {
			//console.log(item['location'][l]['latitude_value']);
			//console.log(item['location'][l]['longitude_value']);
/*			
			var contentString = '<div id="map_content">'+
				'<p>'+
				'Search result ' +
				new_store_array_number +
				'</p>'+
				'<h2>'+
				item['name'][0]+
				'</h2>'+
				'</div>';
			
			var myLatLng = new google.maps.LatLng(item['location'][l]['latitude_value'], item['location'][l]['longitude_value']);
			
			var myMarker = new google.maps.Marker({
				position: myLatLng,
				map: map,
				title: item['name'][0],
				visible: true,
				uri: item['uri'][0],
				content: contentString,
				search_result_layer: map_layer_name,
				dojo_store_id_number: new_store_array_number
			});
			
			//use_this_google_map_icon
			if (use_this_google_map_icon != null) {
				myMarker.setIcon(use_this_google_map_icon);
			}
*/			
			
			//IF marker vert klikka på
			google.maps.event.addListener(myMarker, 'click', function() {
				
				//
				// opne infovindauge
				//
				closeInfos();	// close the previous info-window
				
				// the marker's content gets attached to the info-window:
				var infowindow = new google.maps.InfoWindow({
					content: this.content
				});
				
				infowindow.open(map,this);		// trigger the infobox's open function
				infoWindowArray[0]=infowindow;	// keep the handle, in order to close it on next click event
				
				//
				// vis info om tingen i "Selected thing" tab
				//
				update_selected_item_tab(
					new_store_array_number,
					item['uri'][0],
					item
				);
				
				
			});
			
			markersArray.push(myMarker);
			

			//layers.entry("DojoStoreSearchResult").value.push(myMarker);
			
		} //END for()
		
		//
		// Legg ting til i lista over søkeresultat!
		//
		
	//	var place_item_in_search_result_list = document.createElement("li");
	//	display_map_status_in_a_list.appendChild(place_item_in_search_result_list);
	//						
	//	var item_to_display = document.createTextNode("Match: " + 
	//		item['number_of_matching_rdf_triples'][0] +
	//		" " +
	//		item['name'][0]);
	//	place_item_in_search_result_list.appendChild(item_to_display);
		
		
		//TODO: få lista til å sjå finare ut!
		
	} //END for_each_item = function(item, request)
	
	
	// Invoke the search
	store[new_store_array_number].fetch({
		query: {
			type:'searchResult'
		},
		onItem: for_each_item
		//onError: fetchFailed
		//sort: [{ attribute: "number_of_matching_rdf_triples", descending: true},{attribute: "name"}]
	});
*/
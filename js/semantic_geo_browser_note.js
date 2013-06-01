
function put_location_on_google_map(
	new_store_array_number,
	item_object,
	item_latitude,
	item_longitude,
	use_this_google_map_icon
){
	var put_location_on_google_map_deferred = new dojo.Deferred();
	
	var contentString = '<div id="map_content">'+
		'<p>'+
		'Search result ' +
		new_store_array_number +
		'</p>'+
		'<h2>'+
		item_object.name +
		'</h2>'+
		'</div>';
	
	var myLatLng = new google.maps.LatLng(
		item_latitude,
		item_longitude
	);
			
	var location_marker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: item_object.name,
		visible: true,
		uri: item_object.uri,
		content: contentString,
		search_result_id: new_store_array_number,
		dojo_store_item_id: item_object.id
	});
			
	//use_this_google_map_icon
	if (use_this_google_map_icon != null) {
		location_marker.default_icon = use_this_google_map_icon;
		location_marker.setIcon(use_this_google_map_icon);
	}
	
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

		//dersom tingen har path. gjer den blå!
		update_selected_item_on_map( this.dojo_store_item_id );

		// vis info om tingen i "Selected thing" tab
		update_selected_item_tab( this.dojo_store_item_id );

	});
	//
	// EVENT - END
	//
	

	//
	// Oppdater objekt til aktuell ting med "location_marker".
	// På denne måten er det veldig enkelt å kontrollere kva som skal vere på kartet.
	//
	var location_markers_status = item_object.hasOwnProperty("location_markers");		// get status (true / false)

	if (location_markers_status == false) {
		// Tingen har ingen array med location markers frå før.
		item_object.location_markers = [];												// create new array
	} //END if()
		
	item_object.location_markers.push(location_marker);									// update object
	store.put(item_object);																// and store the change
	
	put_location_on_google_map_deferred.resolve(item_object.location_markers);
	return put_location_on_google_map_deferred;
} //END put_location_on_google_map()



function update_selected_item_tab(
	dojo_store_item_id
){
	var deferred = new dojo.Deferred();

	var selected_thing = store.get(dojo_store_item_id);
	var search_overview = search_overview_store.get(selected_thing.dojo_store_id_number);
	
	console.debug(selected_thing);
	console.debug(search_overview);
	
/*	
	var myMarker = new google.maps.Marker({
		position: myLatLng,
		map: map,
		title: item_object.name,
		visible: true,
		uri: item_object.uri,
		content: contentString,
		search_result_id: new_store_array_number,
		dojo_store_item_id: item_object.id
	});

		id:								id,
		name:							thing_title,
		uri:							thing_uri,
		location:						[], //bytta ut approved_locations med array
		type:							'searchResult',
		checkbox:						true,
		number_of_predicates:			thing_number_of_predicates,
		predicates:						thing_predicates_array,
		number_of_matching_rdf_triples:	0,
		percent_matching_rdf_triples:	0,
		dojo_store_id_number:			new_store_array_number,			// ID til kva dojo store denne tingen tilhøyrer.
																		// Berre ei rask løysing!
		detected_wikipedia_articles:	[],
		number_of_detected_wikipedia_articles:	0	// Tullete, men rask løysing av problem i dojo grid.
*/



	//
	// Update selected_item var
	//
	if (
		search_overview.hasOwnProperty('search_source') &&
		search_overview.hasOwnProperty('search_result_id') &&
		selected_thing.hasOwnProperty('id')
	) {
		selected_item = {
			selection_status: 	true, //something is selected, true or false
			selection_type: 	'item', //what is selected, item or group
			search_source: 		search_overview.search_source, //sindice or osm
			search_result_id: 	search_overview.search_result_id, //what search tab..
			thing_id: 			selected_thing.id //what thing..
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

/*
	// top
	var	top_text = document.createElement("p");
		top_text.innerHTML = "( Selected thing )";
	
	var	selected_thing_top						= document.createElement("div");
		selected_thing_top.id					= "div_id_selected_thing_top";
		selected_thing_top.className			= "div_class_selected_thing_top"; //css
		selected_thing_top.appendChild(top_text);
		
	selected_thing_container.appendChild(selected_thing_top);
*/







	//
	// Heatmap categorysation
	//
	if (
		selected_item.hasOwnProperty('selection_status') &&
		selected_item.selection_status == true &&
		selected_item.hasOwnProperty('search_source') &&
		selected_item.hasOwnProperty('search_result_id') &&
		selected_item.hasOwnProperty('thing_id')
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
			hc_select.setAttribute('onchange', "update_category_on_a_thing(selected_item.search_source,selected_item.search_result_id,selected_item.thing_id)");
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



















	
	if (
		selected_thing.hasOwnProperty('uri') &&
		selected_thing.hasOwnProperty('name')
	) {
		
		var	top_text_header						= document.createElement("p");
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
		search_overview.hasOwnProperty('search_label') &&
		selected_thing.hasOwnProperty('percent_matching_rdf_triples')
	) {
		
		var search_label						= document.createElement("h2");
			search_label.innerHTML				= search_overview.search_label;
			
		var	percent_match						= document.createElement("p");
			percent_match.innerHTML				= selected_thing.percent_matching_rdf_triples + "% search match";
		
		var search_status						= document.createElement("div");
			search_status.id					= "div_id_search_status";
			search_status.className				= "div_class_search_status"; //css
			search_status.appendChild(search_label);
			search_status.appendChild(percent_match);
		
		selected_thing_container.appendChild(search_status);
		
	} //END if

	if (
		search_overview.hasOwnProperty('search_label') &&
		search_overview.search_label == "Hike"
	) {
		// Denne tingen er ein hike, vis støtta hike-info.
		
		if ( selected_thing.hasOwnProperty('hike_duration_in_minutes') ) {
		
			var hike_duration_in_minutes_h3				= document.createElement("h3");
				hike_duration_in_minutes_h3.innerHTML	= "Duration";
				
			var	hike_duration_in_minutes_p				= document.createElement("p");
				hike_duration_in_minutes_p.innerHTML	= selected_thing.hike_duration_in_minutes + " meters";
			
			var hike_duration_in_minutes_div			= document.createElement("div");
				hike_duration_in_minutes_div.className	= "div_class_thing_property"; //css
				hike_duration_in_minutes_div.appendChild(hike_duration_in_minutes_h3);
				hike_duration_in_minutes_div.appendChild(hike_duration_in_minutes_p);
				
			selected_thing_container.appendChild(hike_duration_in_minutes_div);
			
		} //END if
		
		if ( selected_thing.hasOwnProperty('hike_length_in_kilometers') ) {
		
			var hike_length_in_kilometers_h3			= document.createElement("h3");
				hike_length_in_kilometers_h3.innerHTML	= "Length";
				
			var	hike_length_in_kilometers_p				= document.createElement("p");
				hike_length_in_kilometers_p.innerHTML	= selected_thing.hike_length_in_kilometers + " kilometers";
				
			var hike_length_in_kilometers_div			= document.createElement("div");
				hike_length_in_kilometers_div.className	= "div_class_thing_property"; //css
				hike_length_in_kilometers_div.appendChild(hike_length_in_kilometers_h3);
				hike_length_in_kilometers_div.appendChild(hike_length_in_kilometers_p);
				
			selected_thing_container.appendChild(hike_length_in_kilometers_div);
			
		} //END if
		
		if ( selected_thing.hasOwnProperty('hike_height_increase_in_meters') ) {
		
			var hike_height_increase_in_meters_h3			= document.createElement("h3");
				hike_height_increase_in_meters_h3.innerHTML	= "Height increase";
				
			var	hike_height_increase_in_meters_p			= document.createElement("p");
				hike_height_increase_in_meters_p.innerHTML	= selected_thing.hike_height_increase_in_meters + " meters";
			
			var hike_height_increase_in_meters_div				= document.createElement("div");
				hike_height_increase_in_meters_div.className	= "div_class_thing_property"; //css
				hike_height_increase_in_meters_div.appendChild(hike_height_increase_in_meters_h3);
				hike_height_increase_in_meters_div.appendChild(hike_height_increase_in_meters_p);
				
			selected_thing_container.appendChild(hike_height_increase_in_meters_div);
			
		} //END if
		
		if ( selected_thing.hasOwnProperty('hike_height_decrease_in_meters') ) {
		
			var hike_height_decrease_in_meters_h3				= document.createElement("h3");
				hike_height_decrease_in_meters_h3.innerHTML	= "Height decrease";
				
			var	hike_height_decrease_in_meters_p				= document.createElement("p");
				hike_height_decrease_in_meters_p.innerHTML	= selected_thing.hike_height_decrease_in_meters + " meters";
			
			var hike_height_decrease_in_meters_div				= document.createElement("div");
				hike_height_decrease_in_meters_div.className	= "div_class_thing_property"; //css
				hike_height_decrease_in_meters_div.appendChild(hike_height_decrease_in_meters_h3);
				hike_height_decrease_in_meters_div.appendChild(hike_height_decrease_in_meters_p);
				
			selected_thing_container.appendChild(hike_height_decrease_in_meters_div);
			
		} //END if
		
		if ( selected_thing.hasOwnProperty('hike_maximum_elevation_in_meters') ) {
		
			var hike_maximum_elevation_in_meters_h3				= document.createElement("h3");
				hike_maximum_elevation_in_meters_h3.innerHTML	= "Maximum elevation";
				
			var	hike_maximum_elevation_in_meters_p				= document.createElement("p");
				hike_maximum_elevation_in_meters_p.innerHTML	= selected_thing.hike_maximum_elevation_in_meters + " meters";
			
			var hike_maximum_elevation_in_meters_div			= document.createElement("div");
				hike_maximum_elevation_in_meters_div.className	= "div_class_thing_property"; //css
				hike_maximum_elevation_in_meters_div.appendChild(hike_maximum_elevation_in_meters_h3);
				hike_maximum_elevation_in_meters_div.appendChild(hike_maximum_elevation_in_meters_p);
				
			selected_thing_container.appendChild(hike_maximum_elevation_in_meters_div);
			
		} //END if
		
		if ( selected_thing.hasOwnProperty('hike_minimum_elevation_in_meters') ) {
		
			var hike_minimum_elevation_in_meters_h3				= document.createElement("h3");
				hike_minimum_elevation_in_meters_h3.innerHTML	= "Minimum elevation";
				
			var	hike_minimum_elevation_in_meters_p				= document.createElement("p");
				hike_minimum_elevation_in_meters_p.innerHTML	= selected_thing.hike_minimum_elevation_in_meters + " meters";
			
			var hike_minimum_elevation_in_meters_div			= document.createElement("div");
				hike_minimum_elevation_in_meters_div.className	= "div_class_thing_property"; //css
				hike_minimum_elevation_in_meters_div.appendChild(hike_minimum_elevation_in_meters_h3);
				hike_minimum_elevation_in_meters_div.appendChild(hike_minimum_elevation_in_meters_p);
				
			selected_thing_container.appendChild(hike_minimum_elevation_in_meters_div);
			
		} //END if
		
		if ( selected_thing.hasOwnProperty('hike_difference_in_elevation_in_meters') ) {
		
			var hike_difference_in_elevation_in_meters_h3			= document.createElement("h3");
				hike_difference_in_elevation_in_meters_h3.innerHTML	= "Difference in elevation";
				
			var	hike_difference_in_elevation_in_meters_p			= document.createElement("p");
				hike_difference_in_elevation_in_meters_p.innerHTML	= selected_thing.hike_difference_in_elevation_in_meters + " meters";
			
			var hike_difference_in_elevation_in_meters_div				= document.createElement("div");
				hike_difference_in_elevation_in_meters_div.className	= "div_class_thing_property"; //css
				hike_difference_in_elevation_in_meters_div.appendChild(hike_difference_in_elevation_in_meters_h3);
				hike_difference_in_elevation_in_meters_div.appendChild(hike_difference_in_elevation_in_meters_p);
				
			selected_thing_container.appendChild(hike_difference_in_elevation_in_meters_div);
			
		} //END if
		
		if ( selected_thing.hasOwnProperty('hike_profile') ) {
		
			var hike_profile_h3				= document.createElement("h3");
				hike_profile_h3.innerHTML	= "Profile";
				
			var	hike_profile_p				= document.createElement("p");

			var hike_profile_a				= document.createElement("a");
				hike_profile_a.href			= selected_thing.hike_profile;
				hike_profile_a.target		= "_blank";

			var hike_profile_img			= document.createElement("img");
				hike_profile_img.setAttribute('src', selected_thing.hike_profile);

			//
			// START - img width
			//
			var display_element				= document.getElementById("div_id_selected_thing");
			var display_element_width		= display_element.style.width;

			//console.debug(display_element_width); //240px

			var display_element_width_value =
				remove_last_chars_in_string(
					display_element_width,	// for example: 240px
					2 						// remove: px
				);

		//	if ( display_element_width_value > 100 ) {
				hike_profile_img.width		= display_element_width_value - 15;
		//	}
		//	else {
		//		hike_profile_img.width		= "350";
		//	}
			//
			// END - img width
			//

				hike_profile_a.appendChild(hike_profile_img);
				hike_profile_p.appendChild(hike_profile_a);

			var hike_profile_div			= document.createElement("div");
				hike_profile_div.appendChild(hike_profile_h3);
				hike_profile_div.appendChild(hike_profile_p);
				
			selected_thing_container.appendChild(hike_profile_div);
			
		} //END if
		
		//
		// Reasoning
		//

		if ( selected_thing.hasOwnProperty('hike_difficulty') ) {
		
			var hike_difficulty_h3				= document.createElement("h3");
				hike_difficulty_h3.innerHTML	= "Difficulty";
				
			var	hike_difficulty_p				= document.createElement("p");
				hike_difficulty_p.innerHTML	= selected_thing.hike_difficulty;
			
			var hike_difficulty_div				= document.createElement("div");
				hike_difficulty_div.className	= "div_class_thing_reasoning"; //css
				hike_difficulty_div.appendChild(hike_difficulty_h3);
				hike_difficulty_div.appendChild(hike_difficulty_p);
				
			selected_thing_container.appendChild(hike_difficulty_div);
			
		} //END if




/*
Det som ikkje vert vist i boksen:

			hike_end_of_altitude_status:					true,
			hike_end_of_lat_status:							true,
			hike_end_of_long_status:						true,
			hike_start_of_altitude_status:					true,
			hike_start_of_lat_status:						true,
			hike_start_of_long_status:						true
*/

	} //END if
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
/*
	//Match in percent
	var	selected_thing_percent_match			= document.createElement("div");
		selected_thing_percent_match.id			= "div_id_selected_thing_percent_match";
		selected_thing_percent_match.className	= "div_class_selected_thing_percent_match"; //css
		selected_thing_percent_match.innerHTML	= selected_thing.percent_matching_rdf_triples +
			"% search match.";
			
	selected_thing_container.appendChild(selected_thing_percent_match);
*/
/*
	//Name of the thing
	var	selected_thing_name				= document.createElement("div");
		selected_thing_name.id			= "div_id_selected_thing_name";
		selected_thing_name.className	= "div_class_selected_thing_name"; //css
		selected_thing_name.innerHTML	= "<a href=\"" +
			selected_thing.uri + "\" target=\"_blank\">" + 
			selected_thing.name + "</a>";
			
	selected_thing_container.appendChild(selected_thing_name);
*/
		
	//selected_thing_stats
	var	selected_thing_stats_1				= document.createElement("p");
		selected_thing_stats_1.innerHTML	= "RDF triples";
		
	var	selected_thing_stats_2				= document.createElement("p");
		selected_thing_stats_2.innerHTML	= "Total: " + selected_thing.number_of_rdf_triples + " triples";
		
	var	selected_thing_stats_3				= document.createElement("p");
		selected_thing_stats_3.innerHTML	= "Matching: " + 
			selected_thing.number_of_matching_rdf_triples + " triples";
			
	var	selected_thing_stats_4				= document.createElement("p");
		selected_thing_stats_4.innerHTML	= "Predicates: " + 
			selected_thing.number_of_predicates + " different types";
		
	var	selected_thing_stats			= document.createElement("div");
		selected_thing_stats.id			= "div_id_selected_thing_stats";
		selected_thing_stats.className	= "div_class_selected_thing_stats"; //css
		selected_thing_stats.appendChild(selected_thing_stats_1);
		selected_thing_stats.appendChild(selected_thing_stats_2);
		selected_thing_stats.appendChild(selected_thing_stats_3);
		selected_thing_stats.appendChild(selected_thing_stats_4);
	
	//location
	var	selected_thing_location_1				= document.createElement("p");
		selected_thing_location_1.innerHTML		= "Location markers: " + selected_thing.location.length;
	
	var	selected_thing_location				= document.createElement("div");
		selected_thing_location.id			= "div_id_selected_thing_location";
		selected_thing_location.className	= "div_class_selected_thing_location"; //css
		selected_thing_location.appendChild(selected_thing_location_1);
	
	//wikipedia links
	var	selected_thing_wikipedia_1 = document.createElement("p");
	
	if( selected_thing.detected_wikipedia_articles.length > 0 ){
		
		var selected_thing_wikipedia_1_text = "Links from Wikipedia (" +
		selected_thing.detected_wikipedia_articles.length + ")<br>";
		
		for (var w in selected_thing.detected_wikipedia_articles){
			var last_index_number_in_array = selected_thing.detected_wikipedia_articles.length - 1;
			var wiki_url_number = parseInt(w) + 1;
			var wiki_url = selected_thing.detected_wikipedia_articles[w].wikipedia_url;
			selected_thing_wikipedia_1_text += "<a href=\"" +
				wiki_url + "\" target=\"_blank\">Link " + wiki_url_number + "</a>";
			if ( w < last_index_number_in_array ) {
				selected_thing_wikipedia_1_text += "<br>";
			}
		}
		
		selected_thing_wikipedia_1.innerHTML = selected_thing_wikipedia_1_text;
	}
	
	var	selected_thing_wikipedia			= document.createElement("div");
		selected_thing_wikipedia.id			= "div_id_selected_thing_wikipedia";
		selected_thing_wikipedia.className	= "div_class_selected_thing_wikipedia"; //css
		selected_thing_wikipedia.appendChild(selected_thing_wikipedia_1);
	
	//Link to the datasource
	var	selected_thing_source			= document.createElement("div");
		selected_thing_source.id		= "div_id_selected_thing_source";
		selected_thing_source.className	= "div_class_selected_thing_source"; //css
		selected_thing_source.innerHTML	= "Data source: " + 
			"<a href=\"http://sindice.com/search/page?url=" +
			selected_thing.uri + "\" target=\"_blank\">Show RDF triples</a>";
	
	
	
	
	selected_thing_container.appendChild(selected_thing_stats);
	selected_thing_container.appendChild(selected_thing_location);
	if( selected_thing.detected_wikipedia_articles.length > 0 ){
		selected_thing_container.appendChild(selected_thing_wikipedia);
	}
	selected_thing_container.appendChild(selected_thing_source);
	
	tab.appendChild(selected_thing_container);

	return deferred;
} //END update_selected_item_tab()



function identify_supported_properties(
	new_store_array_number
){
	var identify_supported_properties_deferred = new dojo.Deferred();

	//
	// START - Define hike properties that we want to identify
	//

	// Eksempel på noko me leitar etter:
	//	owl-time:duration [
	//		owl-time:minute				"""60""" ;
	//	] ;

	var find_duration_property = { // object
			predicate:			"http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#duration",
			find_sub_property:	[ // array
				{ // object
					predicate:			"http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#minute",
					attribute_name:		"hike_duration_in_minutes"
				}
			]
		};
		
	var find_length_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#Length",
			find_sub_property:	[
				{
					predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#Kilometer",
					attribute_name:		"hike_length_in_kilometers"
				}
			]
		};
		
	var find_minimum_elevation_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#minimumElevation",
			find_sub_property:	[
				{
					predicate:			"http://purl.oclc.org/NET/muo/ucum/meter",
					attribute_name:		"hike_minimum_elevation_in_meters"
				}
			]
		};
		
	var find_maximum_elevation_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#maximumElevation",
			find_sub_property:	[
				{
					predicate:			"http://purl.oclc.org/NET/muo/ucum/meter",
					attribute_name:		"hike_maximum_elevation_in_meters"
				}
			]
		};
		
	var find_difference_in_elevation_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#differenceInElevation",
			find_sub_property:	[
				{
					predicate:			"http://purl.oclc.org/NET/muo/ucum/meter",
					attribute_name:		"hike_difference_in_elevation_in_meters"
				}
			]
		};
		
	var find_height_increase_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#heightIncrease",
			find_sub_property:	[
				{
					predicate:			"http://purl.oclc.org/NET/muo/ucum/meter",
					attribute_name:		"hike_height_increase_in_meters"
				}
			]
		};
		
	var find_height_decrease_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#heightDecrease",
			find_sub_property:	[
				{
					predicate:			"http://purl.oclc.org/NET/muo/ucum/meter",
					attribute_name:		"hike_height_decrease_in_meters"
				}
			]
		};
		
	var find_start_of_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#StartOf",
			find_sub_property:	[
				{
					predicate:			"http://www.w3.org/2003/01/geo/wgs84_pos#lat",
					attribute_name:		"hike_start_of_lat"
				},
				{
					predicate:			"http://www.w3.org/2003/01/geo/wgs84_pos#long",
					attribute_name:		"hike_start_of_long"
				},
				{
					predicate:			"http://www.w3.org/2003/01/geo/wgs84_pos#altitude",
					attribute_name:		"hike_start_of_altitude"
				}
			]
		};
		
	var find_end_of_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#EndOf",
			find_sub_property:	[
				{
					predicate:			"http://www.w3.org/2003/01/geo/wgs84_pos#lat",
					attribute_name:		"hike_end_of_lat"
				},
				{
					predicate:			"http://www.w3.org/2003/01/geo/wgs84_pos#long",
					attribute_name:		"hike_end_of_long"
				},
				{
					predicate:			"http://www.w3.org/2003/01/geo/wgs84_pos#altitude",
					attribute_name:		"hike_end_of_altitude"
				}
			]
		};
	
	var find_profile_property = {
			predicate:			"http://data.sognefjord.vestforsk.no/resource/ontology#Profile",
			attribute_name:		"hike_profile"
		};
		
	//
	// END - Define hike properties that we want to identify
	//
	
	
	
	//
	// START - Look for hike properties
	//
	
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_duration_property
		),
		function(find_duration_property_reply) {

	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_length_property
		),
		function(find_length_property_reply) {
		
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_minimum_elevation_property
		),
		function(find_minimum_elevation_property_reply) {
		
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_maximum_elevation_property
		),
		function(find_maximum_elevation_property_reply) {
		
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_difference_in_elevation_property
		),
		function(find_difference_in_elevation_property_reply) {
		
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_height_increase_property
		),
		function(find_height_increase_property_reply) {
		
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_height_decrease_property
		),
		function(find_height_decrease_property_reply) {
		
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_start_of_property
		),
		function(find_start_of_property_reply) {
		
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_end_of_property
		),
		function(find_end_of_property_reply) {
		
	dojo.when(
		query_rdf_triples_for_this_property(
			new_store_array_number,
			find_profile_property
		),
		function(find_profile_property_reply) {
			
			identify_supported_properties_deferred.resolve("ok");
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
		}
	); //END dojo.when()
		}
	); //END dojo.when()
		}
	); //END dojo.when()
		}
	); //END dojo.when()
	
	//
	// END - Look for hike properties
	//
	
	return identify_supported_properties_deferred;
} //END identify_supported_properties()




function query_rdf_triples_for_this_property(
	new_store_array_number,
	find_property
){
	var query_rdf_triples_for_this_property_deferred = new dojo.Deferred();
	
	// Første søk etter ting i dojo store skjer uavhengig om objekt er blank node eller ei.
	
	// Define the callback
	var for_each_rdf_tripel = function(rdf_tripel_item, request) {
		var for_each_rdf_tripel_deferred = new dojo.Deferred();
			
		// Denne rdf trippelen har aktuell eigenskap.

/*
console.debug(rdf_tripel_item);

Object
id: "search_nr_1_result_nr_1_triple_id_3"
matching_search: false
name: "Triple number: 3"
parent_item_id: "search_nr_1_result_nr_1"
search_result_id: 1
sindice_content_type: "explicit_content"
triple_object: "_:node16tto9idqx41007"
triple_predicate: "http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#duration"
triple_subject: "http://sognefjord.vestforsk.no/page/hike/101"
type: "itemRDFtripel"
*/

		// Sjekk at uri til parent item samsvarar med triple_subject.
		// Sindice.com legg til ekstra tripplar gjennom reasoning og desse er me ikkje interessert i.
		// Dei skal uansett vere unngått ettersom desse rdf tripplane er merka med sindice_content_type: 'implicit_content'.
		var parent_item = store.get(rdf_tripel_item.parent_item_id);
		
		//console.debug(parent_item);
/*
Object
checkbox: true
detected_wikipedia_articles: Array[0]
dojo_store_id_number: 1
id: "search_nr_1_result_nr_1"
location: Array[2]
location_markers: Array[2]
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
		if ( rdf_tripel_item.triple_subject == parent_item.uri ) {
		
			// Sjekk bestått.
			
			// Er rdf_tripel_item.triple_object ei blank node?
			if (	rdf_tripel_item.triple_object.charAt(0) != "_" &&
					rdf_tripel_item.triple_object.charAt(1) != ":"
			){
				// Nei, rdf_tripel_item.triple_object er ikkje ei blank node.

				if ( find_property.hasOwnProperty("attribute_name") == true ) {
					
					if ( parent_item.hasOwnProperty(find_property.attribute_name) == false ) {
						
						// parent_item har ikkje attribut med dette namnet.
						
						parent_item[find_property.attribute_name] = rdf_tripel_item.triple_object;	// update
						parent_item[find_property.attribute_name + "_status"] = true;				// extra update (rask løysing for å query dojo store. kan fjernast dersom ein kan query etter attribute.)
						store.put(parent_item);														// store
						for_each_rdf_tripel_deferred.resolve("true");								// resolve
					}
					else {
						// parent_item har eit attribut med dette namnet frå før.
						// Denne rdf trippelen vert defor ignorert.
						console.debug("error");
						for_each_rdf_tripel_deferred.resolve("false");
					} //END else
				}
				else {
					// Objektet find_property skal ha attributet "attribute_name" dersom rdf trippel ikkje har blank node som objekt.
					// "attribute_name" skal brukast til å lagre verdi i dojo store.
					// Denne rdf trippelen vert defor ignorert.
					console.debug("error");
					for_each_rdf_tripel_deferred.resolve("false");
				} //END else
			}
			else {
				// Ja, rdf_tripel_item.triple_object er ei blank node.
				
				if ( find_property.hasOwnProperty("find_sub_property") == true ) {
					
					var status = "false";
					
					for (var i=0; i<find_property.find_sub_property.length; i++){
						//console.debug(find_property.find_sub_property[i], " at index ", i);
						
						// Finn verdi med blank node og predikat.
						
						// Define the callback
						var for_each_blank_node_rdf_tripel = function(blank_node_rdf_tripel_item, request) {
							var for_each_blank_node_rdf_tripel_deferred = new dojo.Deferred();
								
							// Denne rdf trippelen har aktuell eigenskap.
							
/*
console.debug(blank_node_rdf_tripel_item);

Object
id: "search_nr_1_result_nr_1_triple_id_4"
matching_search: false
name: "Triple number: 4"
parent_item_id: "search_nr_1_result_nr_1"
search_result_id: 1
sindice_content_type: "explicit_content"
triple_object: "60"							<---------------- eksempel på kva me leitar etter!
triple_predicate: "http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#minute"
triple_subject: "_:node16tto9idqx41007"
type: "itemRDFtripel"
*/
							
							if ( find_property.find_sub_property[i].hasOwnProperty("attribute_name") == true ) {
								
								if ( parent_item.hasOwnProperty( find_property.find_sub_property[i].attribute_name ) == false ) {
									
									// parent_item har ikkje attribut med dette namnet.
									
									parent_item[find_property.find_sub_property[i].attribute_name] = blank_node_rdf_tripel_item.triple_object;	// update
									parent_item[find_property.find_sub_property[i].attribute_name + "_status"] = true;							// extra update (rask løysing for å query dojo store. kan fjernast dersom ein kan query etter attribute.)
									store.put(parent_item);																						// store
									

console.debug(parent_item);
/*
Object
checkbox: true
detected_wikipedia_articles: Array[0]
dojo_store_id_number: 1
duration_in_minutes: "60"			<---------------- eksempel på kva me legg inn over her!
duration_in_minutes_status: true	<---------------- brukast i query for å verifisere at denne tingen har aktuell eigenskap.
id: "search_nr_1_result_nr_1"
location: Array[2]
location_markers: Array[2]
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
__proto__: Object
*/
									for_each_blank_node_rdf_tripel_deferred.resolve("true");													// resolve
								}
								else {
									// parent_item har eit attribut med dette namnet frå før.
									// Denne rdf trippelen vert defor ignorert.
									console.debug("error");
									for_each_blank_node_rdf_tripel_deferred.resolve("false");
								}
							}
							else {
								// Objektet find_property.find_sub_property[i] skal ha attributet "attribute_name"...
								// "attribute_name" skal brukast til å lagre verdi i dojo store.
								// Denne rdf trippelen vert defor ignorert.
								console.debug("error");
								for_each_blank_node_rdf_tripel_deferred.resolve("false");
							}

							return for_each_blank_node_rdf_tripel_deferred;
						} //END for_each_blank_node_rdf_tripel
						
						dojo.when(
							store.query({
								type:						'itemRDFtripel',
								search_result_id:			new_store_array_number,
								sindice_content_type:		'explicit_content',
								triple_subject:				rdf_tripel_item.triple_object,	// blank node
								triple_predicate:			find_property.find_sub_property[i].predicate
							}).forEach(for_each_blank_node_rdf_tripel),
							function(for_each_blank_node_rdf_tripel_reply) {
								status = "true";
							}
						); //END dojo.when()
						
					} //END for()
					
					for_each_rdf_tripel_deferred.resolve(status);
				}
				else {
					// rdf_tripel_item.triple_object er ei blank node men kva predikat ein skal sjå etter manglar.
					console.debug("error");
					for_each_rdf_tripel_deferred.resolve("false");
				}
			} //END else
		}
		else {
			//Sjekk ikkje bestått. Gå vidare til neste rdf_tripel_item.
			for_each_rdf_tripel_deferred.resolve("false");
		}
		
		return for_each_rdf_tripel_deferred;
	} //END for_each_rdf_tripel = function(item, request)
		
	dojo.when(
		store.query({
			type:						'itemRDFtripel',
			search_result_id:			new_store_array_number,
			sindice_content_type:		'explicit_content',			// denne inneheld rdf tripplane som er lagt til frå kjelder, ikkje det som er lagt til ekstra av sindice.com.
			triple_predicate:			find_property.predicate
		}).forEach(for_each_rdf_tripel),
		function(for_each_rdf_tripel_reply) {
			
				
			query_rdf_triples_for_this_property_deferred.resolve("ok");
		}
	); //END dojo.when()

	return query_rdf_triples_for_this_property_deferred;
} //END query_rdf_triples_for_this_property()


function execute_reasoning_on_supported_properties(
	new_store_array_number
){
	var execute_reasoning_on_supported_properties_deferred = new dojo.Deferred();
	
	var deferred_list_array = [];
	
	// Define the callback
	var for_each_hike = function(hike_item, request) {
		
		// Kvar hike_item her har alt som skal til for reasoning.
		
		if ( // Check, check, chenk.
			hike_item.hasOwnProperty("sindice_cache_api_reply") == true &&
			hike_item.sindice_cache_api_reply.hasOwnProperty("explicit_content") == true &&
			hike_item.sindice_cache_api_reply.hasOwnProperty("implicit_content") == true
		) {
			//
			// Get n3_data_input - Dette er kva me skal kjøyre reasoning på.
			//
			
			var n3_data_input = "";
			
		//	console.debug(hike_item);
		//	console.debug(hike_item.sindice_cache_api_reply.explicit_content); //array
		//	console.debug(hike_item.sindice_cache_api_reply.implicit_content); //array
			
			for (v in hike_item.sindice_cache_api_reply.explicit_content) {
				n3_data_input = n3_data_input + hike_item.sindice_cache_api_reply.explicit_content[v] + "\n";
			} //END for()
			
			for (v in hike_item.sindice_cache_api_reply.implicit_content) {
				n3_data_input = n3_data_input + hike_item.sindice_cache_api_reply.implicit_content[v] + "\n";
			} //END for()
			

/*
			var n3_data_input = " \
@prefix sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> .	\n \
@prefix owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> .	\n \
	\n \
sf_ont:hike100          owl-time:minute          \"\"\"5\"\"\" .	\n \
sf_ont:hike101          owl-time:minute          \"\"\"10\"\"\" .	\n \
sf_ont:hike102          owl-time:minute          \"\"\"60\"\"\" .	\n \
sf_ont:hike103          owl-time:minute          \"\"\"120\"\"\" .	\n \
";
*/
		//	console.debug("n3_data_input");
		//	console.debug(n3_data_input);
			
			
			//
			// The rules
			//
			
			var rules_input = "\
@prefix sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> .			\n \
@prefix owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> .	\n \
@prefix math: <http://www.w3.org/2000/10/swap/math#> .								\n \
																					\n \
{																					\n \
	?a		owl-time:duration		?x .											\n \
     ?x     owl-time:minute          ?y .											\n \
     ?y     math:lessThan            15 .											\n \
}																					\n \
=>																					\n \
{																					\n \
     ?a     sf_ont:Difficulty     \"\"\"Easy\"\"\" .								\n \
}.																					\n \
																					\n \
{																					\n \
	?a		owl-time:duration		?x .											\n \
     ?x     owl-time:minute          ?y .											\n \
     ?y     math:equalTo             15 .											\n \
}																					\n \
=>																					\n \
{																					\n \
     ?a     sf_ont:Difficulty     \"\"\"Easy\"\"\" .								\n \
}.																					\n \
																					\n \
{																					\n \
	?a		owl-time:duration		?x .											\n \
     ?x     owl-time:minute          ?y .											\n \
     ?y     math:greaterThan         15 .											\n \
     ?y     math:lessThan            60 .											\n \
}																					\n \
=>																					\n \
{																					\n \
     ?a     sf_ont:Difficulty     \"\"\"Medium\"\"\" .								\n \
}.																					\n \
																					\n \
{																					\n \
	?a		owl-time:duration		?x .											\n \
     ?x     owl-time:minute          ?y .											\n \
     ?y     math:equalTo             60 .											\n \
}																					\n \
=>																					\n \
{																					\n \
     ?a     sf_ont:Difficulty     \"\"\"Medium\"\"\" .								\n \
}.																					\n \
																					\n \
{																					\n \
	?a		owl-time:duration		?x .											\n \
     ?x     owl-time:minute          ?y .											\n \
     ?y     math:greaterThan          60 .											\n \
}																					\n \
=>																					\n \
{																					\n \
     ?a     sf_ont:Difficulty     \"\"\"Hard\"\"\" .								\n \
}.																					\n \
			";
			
		//	console.debug("rules_input");
		//	console.debug(rules_input);
			
			//
			// Semantic Web Reasoning With EYE (Euler YAP Engine) --> http://n3.restdesc.org/
			//
			
			var options = {}; //object
				options.data = [];
				options.data.push(n3_data_input);
				options.data.push(rules_input);
				options.path = "http://eye.restdesc.org/";
				options.query = "{ ?a ?b ?c. } => { ?a ?b ?c. }.";
			
			deferred_list_array.push(eye_reasoning(options));
			
		}
		else {
			console.debug("check fail");
		}
	} //END for_each_hike
	
	dojo.when(
		store.query({
			type:						'searchResult',
			dojo_store_id_number:		new_store_array_number,
			
			// Eigenskapane tingen må ha for å gjennomføre reasoning.
			hike_duration_in_minutes_status:				true,
			hike_difference_in_elevation_in_meters_status:	true,
			hike_end_of_altitude_status:					true,
			hike_end_of_lat_status:							true,
			hike_end_of_long_status:						true,
			hike_height_decrease_in_meters_status:			true,
			hike_height_increase_in_meters_status:			true,
			hike_length_in_kilometers_status:				true,
			hike_maximum_elevation_in_meters_status:		true,
			hike_minimum_elevation_in_meters_status:		true,
			hike_profile_status:							true,
			hike_start_of_altitude_status:					true,
			hike_start_of_lat_status:						true,
			hike_start_of_long_status:						true
			
		}).forEach(for_each_hike),
		function(for_each_hike_reply) {
		
			// ...etter at foreach er ferdig.
			
			var deferred_list = new dojo.DeferredList(deferred_list_array);
				
			deferred_list.then(function(eye_result){ // "eye_result" is an array of results
			
				if ( eye_result.length > 0 ) {
				
					// for kvar item som er behandla av resoning server.
					for ( var	i = 0;
								i < eye_result.length;
								i++
					){
						if ( eye_result[i][0] == true ) { // denne er i grunn true uansett trur eg... er vell berre tenaren som seier: ja, dette er eit svar frå meg til deg.
							var lines = eye_result[i][1].split(/\n/); // tekst blir delt opp i eit array.
						if ( lines.length > 3 ) { // if lina har fleire enn tre rader er nok dette eit svar og ikkje ein error frå tenaren.
						
						//	console.debug(eye_result[i][1]);
						//	console.debug("lines");
						//	console.debug(lines.length);
							
							var the_reasoning_triples_we_are_looking_for = [];
							
							// for kvar line i tekst, frå slutt til start.
							for ( var	l = lines.length - 1;
										l >= 0;
										l = l - 1
							){
								// if line har innhold.
								if ( lines[l].length > 0 ) {
									//console.debug(l +". "+ lines[l]); // t.d. --> 55. _:node16ttmb8pjx46_1 a "Hard".
									
									// eye tenaren gir reasoning svaret på dei site linene i teksten.
									// når ein ikkje kan finne noko meir, bryt for loopen med break.
								
									// har lina det me ser etter?
									if ( lines[l].search("sf_ont:Difficulty") > 0 ) {
										
										// svaret er ja. hent ut svaret.
										
										var get_values_from_string = lines[l].split(' ');
										
										console.debug(l +". "+ lines[l]);
										console.debug(get_values_from_string);
										// døme på 2 svar:
										// ["<http://tur.bt.no/tur/105>", "sf_ont:Difficulty", ""Hard"."]
										// ["<http://sognefjord.vestforsk.no/page/hike/105>", "sf_ont:Difficulty", ""Hard"."]
										// pga sameAs har Sindice.com gjort reasoning der alle verdiane har blitt kopiert.
										// me tek derfor begge verdiane, slår deretter opp i dojo store.
										// dersom me finn uri'en, lagre trippel og reasoning svar.
										
										// console.debug(get_values_from_string[0]); // <http://sognefjord.vestforsk.no/page/hike/105>
										// console.debug(get_values_from_string[1]); // sf_ont:Difficulty
										// console.debug(get_values_from_string[2]); // "Hard".
										
										// dersom string startar med <http:// og siste bokstav er >, så er dette ein uri.
										var check_first = "<http://";
										var check_last = ">";
										// dersom den startar med noko anna vert denne n3 tripelen ignorert.
										// seinare er det kanskje ein ide at ein også støttar tomme nodar (startar med "_:").
										if (
											get_values_from_string[0].substring(0, check_first.length) === check_first &&
											get_values_from_string[0].charAt(get_values_from_string[0].length - 1)
										) {
											var reason_subject = remove_first_and_last_char_in_string(get_values_from_string[0]); // for eksempel: http://sognefjord.vestforsk.no/page/hike/105
											var reason_predicate = "http://data.sognefjord.vestforsk.no/resource/ontology#Difficulty";
											var reason_object = "";
											
											check_first = "\"";
											check_last = "\".";
											
											if (
												get_values_from_string[2].charAt(0) === check_first &&
												get_values_from_string[2].indexOf(check_last, get_values_from_string[2].length - check_last.length) !== -1
											) {
												reason_object = get_values_from_string[2].slice(1,get_values_from_string[2].length-2);
												
												if (
													reason_subject.length > 0 &&
													reason_predicate.length > 0 &&
													reason_object.length > 0
												){
													// reasoning er godkjent!
													the_reasoning_triples_we_are_looking_for.push({
														subject:	reason_subject,
														predicate:	reason_predicate,
														object:		reason_object
													});
												} //END if
											} //END if
										} //END if
									} //END if
									else {
										break; // ikkje meir å hente i denne teksten.
									}
								} //END if
							} //END for
							
							// behandle resultatet
							if ( the_reasoning_triples_we_are_looking_for.length > 0 ) {
								for ( o in the_reasoning_triples_we_are_looking_for ) {
									
									// sjekk om subject er uri til ein ting i dojo store.
									
									// Define the callback
									var for_each_reasoning_result = function(thing_object, request) {
										var for_each_reasoning_result_deferred = new dojo.Deferred();
											
											thing_object.hike_difficulty = the_reasoning_triples_we_are_looking_for[o].object;	// update
											thing_object.hike_difficulty_status = true;											// update
											store.put(thing_object);															// store
											
											// har ikkje satt inn hike_difficulty som ein eigen rdf trippel endå.
											// kan gjerast seinare.
											
											console.debug("item updated with reasoning:");
											console.debug(the_reasoning_triples_we_are_looking_for[o].subject);
											
										return for_each_reasoning_result_deferred;
									} //END for_each_reasoning_result
									
									dojo.when(
										store.query({
											type:						'searchResult',
											dojo_store_id_number:		new_store_array_number,
											uri:						the_reasoning_triples_we_are_looking_for[o].subject //t.d. http://sognefjord.vestforsk.no/page/hike/105
										}).forEach(for_each_reasoning_result),
										function(for_each_reasoning_result_reply) {
											
										}
									); //END dojo.when()
									
								} //END for
							} //END if
						} //END if
						} //END if
					} //END for()
					
					//console.debug("eye_result_array");
					console.debug(eye_result);
					execute_reasoning_on_supported_properties_deferred.resolve(for_each_hike_reply);
				}
				else {
					console.debug("nothing to reason on");
					execute_reasoning_on_supported_properties_deferred.resolve(for_each_hike_reply);
				}
				
			}); //END deferred_list
		}
	); //END dojo.when()
	
	return execute_reasoning_on_supported_properties_deferred;
} //END execute_reasoning_on_supported_properties()



function eye_reasoning(
	options
){
	var post_deferred =
	dojo.xhrPost({ //HTTP POST REQUEST
		url: "php/eye_proxy.php",
		sync: true,
		failOk: true, // Will suppress error message in console if error occurs.
		content: {
			path:	options.path,
			data:	options.data[0],
			rules:	options.data[1],
			query:	options.query
		},
		handleAs: "text",
		load: function(response, ioArgs) { // Invoked when the data is returned from the server.
			return response;
		},
		error: function(response, ioArgs) { // Invoked when an error occurs.
			return "error";
		}
	});
	
	return post_deferred;
} //END eye_reasoning()



function generate_what_box(
	fixed_input
){
	var return_status = false;
	var form_input = false;

	if ( fixed_input != undefined ) {
		form_input = fixed_input;
	}
	else {
		form_input = get_input_from_form_radio(
			"form_select_data_source"
		);
	}
	
	if ( form_input == "sindice" ) {
		// Radiobutton "sindice" is selected.

		// Fjernar denne fordi den høyrer til osm.
		var div_id_search_column_4 = document.getElementById("div_id_search_column_4");
			div_id_search_column_4.innerHTML = ""; // fjernar alt som ligg i <div> frå før

		dojo.when(
			generate_list_of_things(),
			function(list_counter) {
				console.debug("Things to search for: " + list_counter);
			}
		); //END dojo.when()

		return_status = true;
	}
	else if ( form_input == "osm" ) {
		// Radiobutton "osm" is selected.

		var show_load_icon = document.getElementById("div_id_select_ontology");
			show_load_icon.innerHTML = ""; // fjernar alt som ligg i <div> frå før
		var load_icon = document.createElement("img");
			load_icon.setAttribute('src', 'image/load_icon.gif');
			show_load_icon.appendChild(load_icon);



		dojo.when(
			generate_list_of_things_osm(),
			function(list_counter) {
				console.debug("Things to search for: " + list_counter);
			}
		); //END dojo.when()


		return_status = true;
	}
	else if ( form_input == "false" ) {
		// No radiobutton is selected.
		return_status = false;
	}
	else {
		// Something is broken.
		return_status = false;
	}

	return return_status;
} //END generate_what_box()




function get_input_from_form_radio(
	form_name
){
	var radiobutton_input = false;

	if ( form_name == "form_select_data_source" ) {

		for (var i=0; i < document.form_select_data_source.radio_select_data_source.length; i++) {
			if (document.form_select_data_source.radio_select_data_source[i].checked) {
				radiobutton_input = document.form_select_data_source.radio_select_data_source[i].value;
				// sindice or osm
				break;
			}
		}

	}
	else if ( form_name == "form_osm_everything_or_selected" ) {
		
		for (var i=0; i < document.form_osm_everything_or_selected.radio_osm_everything_or_selected.length; i++) {
			if (document.form_osm_everything_or_selected.radio_osm_everything_or_selected[i].checked) {
				radiobutton_input = document.form_osm_everything_or_selected.radio_osm_everything_or_selected[i].value;
				// search_everything or search_selected_things
				break;
			}
		}

	}
	else if ( form_name == "form_search_filter" ) {
		
		for (var i=0; i < document.form_search_filter.thing2filter4.length; i++) {
			if (document.form_search_filter.thing2filter4[i].checked) {
				radiobutton_input = document.form_search_filter.thing2filter4[i].value;
				break;
			}
		}

	} //END else if

	return radiobutton_input;
} //END get_input_from_form_radio()





function get_input_from_form_checkbox(
	form_name
){
	var checkbox_input_array = [];

	if ( form_name == "form_search_settings" ) {
		with ( document.form_search_settings ) {
			for ( var i = 0; i < thing2look4.length; i++ ) {
				if ( thing2look4[i].checked ) {
					checkbox_input_array.push({
						uri: 	thing2look4[i].value
					});
				}
			} //END for
		} //END with
	} //END if

	else if ( form_name == "form_at_least_one_or_all_property_match" ) {

		checkbox_input_array = false; // default value

		with ( document.form_at_least_one_or_all_property_match ) {
			if ( propertymustmatch.checked == true ) {
				checkbox_input_array = true;
			}
		} //END with

	} //END if

	console.debug(checkbox_input_array);
	return checkbox_input_array;
} //END get_input_from_form_checkbox()





function generate_list_of_things(){
	var generate_list_of_things_deferred = new dojo.Deferred();
	
	var query = " \
	PREFIX sf_ont:		<http://data.sognefjord.vestforsk.no/resource/ontology#> \
	PREFIX rdf:			<http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
	PREFIX rdfs:		<http://www.w3.org/2000/01/rdf-schema#> \
	PREFIX owl:			<http://www.w3.org/2002/07/owl#> \
	PREFIX geo:			<http://www.w3.org/2003/01/geo/wgs84_pos#> \
	\
	SELECT \
		?thing_type_uri \
		?thing_type_label \
		?triple_predicate \
		?triple_object \
	WHERE { \
		GRAPH <http://data.sognefjord.vestforsk.no/resource/tourism_ontology> { \
			\
			?thing_type_uri \
				\
				rdf:type					owl:Individual ; \
				rdf:type					geo:SpatialThing ; \
				rdfs:label					?thing_type_label ; \
				sf_ont:characterizedBy		?char_blank_node . \
				\
			OPTIONAL {	?char_blank_node			sf_ont:rdfTriple				?triple_blank_node } . \
			OPTIONAL {	?triple_blank_node			sf_ont:predicate				?triple_predicate } . \
			OPTIONAL {	?triple_blank_node			sf_ont:object					?triple_object } . \
		} \
	} \
	";
	
	var escaped_query = escape(query);
	escaped_query = "http://178.79.179.144:8890/sparql?default-graph-uri=&query=" + escaped_query + "&format=json";

	dojo.when(
		read_cross_domain_data(
			escaped_query,
			"query_sparql_endpoint"
		),
		function(endpoint_reply) {
	dojo.when(
		boot_up_things_to_search_for_store(),
		function(	boot_up_reply ) {
			if (	boot_up_reply == "true" ) {
			
				//
				// START - GENERATE THE HTML LIST
				//
				
				// INPUT: endpoint_reply
				
				var list_counter = 0;
				
				if ( endpoint_reply.results.bindings.length > 0 ) {
					
					for ( t in endpoint_reply.results.bindings ) {
						// kvart objekt inneheld ein RDF trippel som representerer ein eigenskap / eit kjenneteikn ved ein ting.
						
					//	console.debug(endpoint_reply.results.bindings[t]);
						
						var thing_type_uri		= endpoint_reply.results.bindings[t].thing_type_uri.value;
						var thing_type_label	= endpoint_reply.results.bindings[t].thing_type_label.value;
						var triple_predicate	= undefined;
						var triple_object		= undefined;
						
						if ( endpoint_reply.results.bindings[t].hasOwnProperty('triple_predicate') ){
							triple_predicate = endpoint_reply.results.bindings[t].triple_predicate.value;
						}
						
						if ( endpoint_reply.results.bindings[t].hasOwnProperty('triple_object') ){
							triple_object = endpoint_reply.results.bindings[t].triple_object.value;
						}
						
						if (	(triple_predicate	== undefined) &&
								(triple_object		== undefined)
						) {
							alert("Baade triple_predicate OG triple_object er undefined. Det er feil.");
						}
						else {
						
							var thing_in_store = things_to_search_for_store.get(thing_type_uri);	// get
							
							if ( thing_in_store == undefined ) {
								// tingen finst ikkje i things_to_search_for_store frå før,
								// sett ting inn i store.
								things_to_search_for_store.add({
									thing_type_uri:					thing_type_uri,
									thing_type_label:				thing_type_label,
									thing_type:						"thing_to_search_for",
									data_source: 					"sindice",
									characterized_by_rdf_triples:	[]
								});
								
								thing_in_store = things_to_search_for_store.get(thing_type_uri);
								
							} //END if()
							
							var rdf_triple_property = {};
							
							if ( triple_predicate != undefined ) {
								rdf_triple_property.triple_predicate = triple_predicate;
							}
							
							if ( triple_object != undefined ) {
								rdf_triple_property.triple_object = triple_object;
							}
							
							thing_in_store.characterized_by_rdf_triples.push(rdf_triple_property);	// update
							things_to_search_for_store.put(thing_in_store);							// store
							
						} //END else
						
					} //END for()

					//
					// Generate the DIV with id "div_id_select_ontology"
					//
					var generate_div = document.getElementById("div_id_select_ontology");
						generate_div.innerHTML = ""; // fjernar alt som ligg i <div> frå før

					var new_h2_2 = document.createElement("h2");
						new_h2_2.innerHTML = "Things in ontology";
					
					var new_p_3 = document.createElement("p");
						new_p_3.innerHTML = "Select something to look for.";

					var div_list_of_things = document.createElement("div_id_things_to_search_for");
					
					var new_form = document.createElement("form");
						new_form.name = "form_search_settings";
						new_form.action = "";

					// START - Insert option to search for everything

						list_counter = list_counter + 1;

					var input_element = document.createElement("input");
						input_element.type = "radio";
						input_element.name = "thing2look4";
						input_element.value = "everything";

					var txt = document.createTextNode("Everything");
					var br = document.createElement("br");

						new_form.appendChild(input_element);
						new_form.appendChild(txt);
						new_form.appendChild(br);

					// END - Insert option to search for everything

					things_to_search_for_store.query({
						thing_type: 	'thing_to_search_for',
						data_source: 	'sindice'
					}).forEach(function(thing_in_store){
						
						list_counter = list_counter + 1;
						
						var input_element = document.createElement("input");
							input_element.type = "radio";
							input_element.name = "thing2look4";
							input_element.value = thing_in_store.thing_type_uri;
						
						if ( list_counter == 2 ) {
							input_element.setAttribute("checked", "checked");
						}
						
						var txt = document.createTextNode(thing_in_store.thing_type_label);
						
						var br = document.createElement("br");
						
						new_form.appendChild(input_element);
						new_form.appendChild(txt);
						new_form.appendChild(br);
						
					}); //END things_to_search_for_store.query()
					//console.debug(things_to_search_for_store);


					// START - Insert option to conduct free text search
					var y = document.createElement("input");
						y.type = "radio";
						y.name = "thing2look4";
						y.value = "text_search";

					var u = document.createElement("input");
						u.type = "text";
						u.name = "input_text_search";
						u.placeholder = "Text search";
						u.onkeypress = function(){selectLastRadio(this);};

						new_form.appendChild(y);
						new_form.appendChild(u);
						new_form.appendChild(document.createElement("br"));
					// END - Insert option to conduct free text search


					div_list_of_things.appendChild(new_form);

					var d = document.createElement("div");
						d.id = "div_id_at_least_one_or_all_property_match";

					var f = document.createElement("form");
						f.name = "form_at_least_one_or_all_property_match";
						f.action = "";

					var i = document.createElement("input");
						i.type = "checkbox";
						i.name = "propertymustmatch";
						i.value = "all_properties_requiered";
						//i.setAttribute("checked", "checked");

					f.appendChild(i);
					f.appendChild(document.createTextNode("Only 100% search matches"));
					f.appendChild(document.createElement("br"));
					d.appendChild(f);

					generate_div.appendChild(new_h2_2);
					generate_div.appendChild(new_p_3);
					generate_div.appendChild(div_list_of_things);
					generate_div.appendChild(d);

				}
				else {
					alert("The endpoint did NOT return anything to search for!");
				}
				//
				// END - GENERATE THE HTML LIST
				//
				
				generate_list_of_things_deferred.resolve(list_counter);
			
			} //END if()
			else {
				alert("things_to_search_for_store did NOT boot up.");
			}
		}
	); //END dojo.when()
		}
	); //END dojo.when()
	
	return generate_list_of_things_deferred;
} //END generate_list_of_things()



function generate_list_of_things_osm(){
	var generate_list_of_things_osm_deferred = new dojo.Deferred();
	
	dojo.when(
	query_osm_ontology(),
	function(what_we_have_counter) {

		//
		// Generate the DIV with id "div_id_select_ontology"
		//

		var generate_div = document.getElementById("div_id_select_ontology");
			generate_div.innerHTML = ""; // fjernar alt som ligg i <div> frå før

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

		var new_h2_2 = document.createElement("h2");
			new_h2_2.innerHTML = "Things in ontology (" + what_we_have_counter + ")";
					
		var new_p_3 = document.createElement("p");
			new_p_3.innerHTML = "What are you looking for?";

		var new_form_3 = document.createElement("form");
			new_form_3.name = "form_osm_everything_or_selected";
			new_form_3.action = "";

		var input_element_3 = document.createElement("input");
			input_element_3.type = "radio";
			input_element_3.name = "radio_osm_everything_or_selected";
			input_element_3.value = "search_everything";
			input_element_3.onchange = function(){osm_generate_thing2look4_form();};
			input_element_3.setAttribute("checked", "checked");

			new_form_3.appendChild(input_element_3);
			new_form_3.appendChild(document.createTextNode("Everything"));
			new_form_3.appendChild(document.createElement("br"));

		var input_element_4 = document.createElement("input");
			input_element_4.type = "radio";
			input_element_4.name = "radio_osm_everything_or_selected";
			input_element_4.onchange = function(){osm_generate_thing2look4_form(true);};
			input_element_4.value = "search_selected_things";

			new_form_3.appendChild(input_element_4);
			new_form_3.appendChild(document.createTextNode("Something specific"));
			new_form_3.appendChild(document.createElement("br"));

		var div_list_of_things = document.createElement("div");
			div_list_of_things.id = "div_id_things_to_search_for";

		generate_div.appendChild(new_form_2);
		generate_div.appendChild(new_h2_2);
		generate_div.appendChild(new_p_3);
		generate_div.appendChild(new_form_3);
		generate_div.appendChild(div_list_of_things);

		//
		// SEARCH FILTER (Must be supported by SPARQL Endpoint)
		// Generate the DIV with id "div_id_search_column_4"
		//
		var div_id_search_column_4 = document.getElementById("div_id_search_column_4");
			div_id_search_column_4.innerHTML = ""; // fjernar alt som ligg i <div> frå før

		var div_id_search_column_4_3 = document.createElement("h2");
			div_id_search_column_4_3.innerHTML = "Filter";
					
		var div_id_search_column_4_4 = document.createElement("p");
			div_id_search_column_4_4.innerHTML = "Select something that must be within range.";

		var div_id_search_column_4_6 = document.createElement("input");
			div_id_search_column_4_6.id = "search_column_4_slider_txt";
			div_id_search_column_4_6.type = "text";
			div_id_search_column_4_6.value = "4 km";
			div_id_search_column_4_6.size = 1;

		var div_id_search_column_4_5 = document.createElement("input");
			div_id_search_column_4_5.id = "search_column_4_slider"
			div_id_search_column_4_5.type = "range";
			div_id_search_column_4_5.min = 1;
			div_id_search_column_4_5.max = 20;
			div_id_search_column_4_5.step = 1;
			div_id_search_column_4_5.value = 4;
			div_id_search_column_4_5.onchange = function(){copy_value('search_column_4_slider','search_column_4_slider_txt');};

		var div_id_search_column_4_1 = document.createElement("form");
			div_id_search_column_4_1.name = "form_search_filter";
			div_id_search_column_4_1.action = "";

		var div_id_search_column_4_2 = document.createElement("input");
			div_id_search_column_4_2.type = "radio";
			div_id_search_column_4_2.name = "thing2filter4";
			div_id_search_column_4_2.value = "nothing";
			div_id_search_column_4_2.setAttribute("checked", "checked");

			div_id_search_column_4_1.appendChild(div_id_search_column_4_2);
			div_id_search_column_4_1.appendChild(document.createTextNode("Nothing"));
			div_id_search_column_4_1.appendChild(document.createElement("br"));

		things_to_search_for_store.query({
			thing_type: 'thing_to_search_for',
			data_source: 'osm'
		}).forEach(function(thing_in_store){

			var div_id_search_column_4_2 = document.createElement("input");
				div_id_search_column_4_2.type = "radio";
				div_id_search_column_4_2.name = "thing2filter4";
				div_id_search_column_4_2.value = thing_in_store.thing_type_uri;
							
				div_id_search_column_4_1.appendChild(div_id_search_column_4_2);
				div_id_search_column_4_1.appendChild(document.createTextNode(thing_in_store.thing_type_label));
				div_id_search_column_4_1.appendChild(document.createElement("br"));
						
		}); //END things_to_search_for_store.query()

		div_id_search_column_4.appendChild(div_id_search_column_4_3);	// <h2>
		div_id_search_column_4.appendChild(div_id_search_column_4_4);	// <p>
		div_id_search_column_4.appendChild(div_id_search_column_4_5);	// <input>
		div_id_search_column_4.appendChild(div_id_search_column_4_6);	// <input>
		div_id_search_column_4.appendChild(div_id_search_column_4_1);	// <form>

		generate_list_of_things_osm_deferred.resolve(what_we_have_counter);
	}); //END dojo.when()
	
	return generate_list_of_things_osm_deferred;
} //END generate_list_of_things_osm()





function copy_value(slider_id, textbox_id) {
	var x = document.getElementById(textbox_id);
	var y = document.getElementById(slider_id);
	x.value = y.value + " km";
} //END function





function count_things_to_search_for_store(){
	var count_things_to_search_for_store_deferred = new dojo.Deferred();

	// Har me henta data frå endpoint før?
	var what_we_have_counter = 0; // Dersom ja vert denne større enn 0.

	things_to_search_for_store.query({
		thing_type: 'thing_to_search_for', 
		data_source: 'osm'
	}).forEach(function(thing_in_store){
		what_we_have_counter = what_we_have_counter + 1;
	}); //END things_to_search_for_store.query()

	count_things_to_search_for_store_deferred.resolve(what_we_have_counter);
	return count_things_to_search_for_store_deferred;
} //END count_things_to_search_for_store()






function query_osm_ontology(){
	var query_osm_ontology_deferred = new dojo.Deferred();

	dojo.when(
	count_things_to_search_for_store(),					// Har me henta data frå endpoint før?
	function(count_things_to_search_for_store_reply) {	// Dersom ja vert denne større enn 0.

		if ( count_things_to_search_for_store_reply <= 0 ) {
			// Dersom me ikkje har noko, spør endpoint.
		
			var query = " \
			SELECT DISTINCT \
				?thing_type_uri \
				?thing_type_label \
			FROM <http://linkedgeodata.org/110406/ontology> \
			WHERE { \
				?thing_type_uri 	<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>	<http://www.w3.org/2002/07/owl#Class> ; \
									<http://www.w3.org/2000/01/rdf-schema#label>		?thing_type_label . \
			 \
				FILTER ( lang(?thing_type_label) = 'no' ) \
			} \
			ORDER BY ?thing_type_label";

			var escaped_query = escape(query);
			escaped_query = "http://live.linkedgeodata.org/sparql?default-graph-uri=&query=" + escaped_query + "&format=json";

			dojo.when(
			read_cross_domain_data(
				escaped_query,
				"query_sparql_endpoint"
			),
			function(endpoint_reply) {

//console.debug(endpoint_reply);
/* endpoint_reply example:
Object
head: Object
link: Array[0]
vars: Array[2]
__proto__: Object
results: Object
bindings: Array[369]
[0 … 18]
0: Object
thing_type: Object
type: "uri"
value: "http://linkedgeodata.org/ontology/HighwayPlatform"
__proto__: Object
type_name: Object
type: "literal"
value: "Perrong"
xml:lang: "no"
__proto__: Object
__proto__: Object
1: Object
2: Object
3: Object
4: Object
5: Object ...
*/

				if ( endpoint_reply.results.bindings.length > 0 ) {
					for ( t in endpoint_reply.results.bindings ) {
							
						// console.debug(endpoint_reply.results.bindings[t]);
							
						var thing_type_uri		= endpoint_reply.results.bindings[t].thing_type_uri.value;
						var thing_type_label	= endpoint_reply.results.bindings[t].thing_type_label.value;
							
						var thing_in_store = things_to_search_for_store.get(thing_type_uri);	// get
								
						if ( thing_in_store == undefined ) {
							// tingen finst ikkje i things_to_search_for_store frå før,
							// sett ting inn i store.
							things_to_search_for_store.add({
								thing_type_uri:					thing_type_uri,
								thing_type_label:				thing_type_label,
								thing_type:						"thing_to_search_for",
								data_source: 					'osm'
							});
									
							thing_in_store = things_to_search_for_store.get(thing_type_uri);
									
						} //END if()
					} //END for()
				} //END if

				dojo.when(
				count_things_to_search_for_store(),	// Har me henta data frå endpoint før?
				function(recount) {					// Dersom ja vert denne større enn 0.
					query_osm_ontology_deferred.resolve(recount);
				}); //END dojo.when()
			}); //END dojo.when()
		}
		else {
			query_osm_ontology_deferred.resolve(count_things_to_search_for_store_reply);
		} //END else

	}); //END dojo.when()

	return query_osm_ontology_deferred;
} //END query_osm_ontology()





function osm_generate_thing2look4_form(input){
	var osm_generate_thing2look4_form_deferred = new dojo.Deferred();

	var div_list_of_things = document.getElementById("div_id_things_to_search_for");
		div_list_of_things.innerHTML = ""; // fjernar alt som ligg i <div> frå før

	var list_counter = 0;

	if ( input == true ) {

		var div_list_of_things_p = document.createElement("p");
			div_list_of_things_p.innerHTML = "Select something to look for.";

		var div_list_of_things_form = document.createElement("form");
			div_list_of_things_form.name = "form_search_settings";
			div_list_of_things_form.action = "";

		things_to_search_for_store.query({
			thing_type: 'thing_to_search_for',
			data_source: 'osm'
		}).forEach(function(thing_in_store){
								
			list_counter = list_counter + 1;
			var input_element = document.createElement("input");
			input_element.type = "checkbox";
			input_element.name = "thing2look4";
			input_element.value = thing_in_store.thing_type_uri;
			//if ( list_counter == 1 ) { input_element.setAttribute("checked", "checked"); }
			div_list_of_things_form.appendChild(input_element);
			div_list_of_things_form.appendChild(document.createTextNode(thing_in_store.thing_type_label));
			div_list_of_things_form.appendChild(document.createElement("br"));
								
		}); //END things_to_search_for_store.query()
		//console.debug(things_to_search_for_store);

		div_list_of_things.appendChild(div_list_of_things_p);
		div_list_of_things.appendChild(div_list_of_things_form);

	} //END if

	osm_generate_thing2look4_form_deferred.resolve(list_counter);
	return osm_generate_thing2look4_form_deferred;
} //END osm_generate_thing2look4_form()






function create_area_of_interest_border(search_result_id) {

	var rectangle = new google.maps.Rectangle();

	var rectangle_options = {
		strokeColor: "#FF0000",
		//strokeOpacity: 0.8,
		strokeWeight: 1,
		//fillColor: "#FF0000",
		fillOpacity: 0,
		map: map,
		bounds: map.getBounds(),
		search_result_id: search_result_id
	};

    rectangle.setOptions(rectangle_options);

    return rectangle;

} //END create_area_of_interest_border()




function change_area_of_interest(old_tab,new_tab) {

	// Hide area of interest boreder represented by the old tab.
	if (old_tab.hasOwnProperty("search_result_id")) {
		var search_overview = search_overview_store.get(old_tab.search_result_id);	// get
		if (
			search_overview != undefined &&
			search_overview.hasOwnProperty("area_of_interest") &&
			search_overview.area_of_interest.hasOwnProperty("map")
		) {
			search_overview.area_of_interest.setMap(null);							// update
			search_overview_store.put(search_overview);								// store
		} //END if
	} //END if

	// Display area of interest boreder represented by the new tab.
	if (new_tab.hasOwnProperty("search_result_id")) {
		var search_overview = search_overview_store.get(new_tab.search_result_id);	// get
		if (
			search_overview != undefined &&
			search_overview.hasOwnProperty("area_of_interest") &&
			search_overview.area_of_interest.hasOwnProperty("map")
		) {
			search_overview.area_of_interest.setMap(map);							// update
			search_overview_store.put(search_overview);								// store
		} //END if
	} //END if

} //END change_area_of_interest()






function get_selected_value_from_dropdownbox(dropdown_id) {
	var s = document.getElementById(dropdown_id);
	var ov = s.options[s.selectedIndex].value;
	var ot = s.options[s.selectedIndex].text;
	return {
		value: 	ov,
		text: 	ot
	};
} //END get_selected_value_from_dropdownbox()



function update_category_on_a_thing(
	search_source,
	search_result_id,
	thing_id
) {
	var dropdownbox = get_selected_value_from_dropdownbox('hc_select_id');

	if (
		search_source != undefined &&
		search_source.length > 0 &&
		thing_id != undefined &&
		thing_id.length > 0 &&
		dropdownbox.hasOwnProperty('value') &&
		dropdownbox.value.length > 0 &&
		dropdownbox.hasOwnProperty('text') &&
		dropdownbox.text.length > 0
	) {
		if (search_source == "sindice") {
			//console.debug(search_source);
			//console.debug(search_result_id);
			//console.debug(thing_id);

			var selected_thing = store.get(thing_id);
			//console.debug(selected_thing);

			// if selected_thing er i ein heatmap_category frå før
			if (
				selected_thing != undefined &&
				selected_thing.hasOwnProperty('heatmap_category_status') == true &&
				selected_thing.heatmap_category_status == true &&
				selected_thing.hasOwnProperty('heatmap_category_id') == true &&
				selected_thing.heatmap_category_id.length > 0
			) {
				// denne tingen er i ein kategori frå før.

				var previous_heatmap_category = heatmap_store.get(selected_thing.heatmap_category_id);
				//console.debug(previous_heatmap_category);

				if (
					previous_heatmap_category != undefined &&
					previous_heatmap_category.hasOwnProperty('heatmap') == true &&
					previous_heatmap_category.heatmap.hasOwnProperty('data') == true
				) {	
					var remove_this = [];

					// finn og slett alle element som tilhøyrer tingen
					previous_heatmap_category.heatmap.data.forEach(function(element, index){
						//console.debug(element);
						//console.debug(index);
						if (
							element.hasOwnProperty('search_source') == true &&
							element.search_source == search_source &&
							element.hasOwnProperty('search_result_id') == true &&
							element.search_result_id == search_result_id &&
							element.hasOwnProperty('thing_id') == true &&
							element.thing_id == thing_id
						) {
							// dette element tilhøyrer aktuell ting
							remove_this.push(index); //Lyt gjere dette fordi forEach loopen vert øydelagt dersom ein fjernar element midt i loopinga.
						} //END if
					}); //END forEach

					// OBS! Viktig å sortere index tala i array før slettinga
					// fordi sletting vil føre til at alt som kjem etter vil
					// få ny index nummer..!
					remove_this.sort(function(a,b){return b-a});

					for (i in remove_this) {
						previous_heatmap_category.heatmap.data.removeAt(remove_this[i]); // slettar element frå heatmap
					} //END for

					heatmap_store.put(previous_heatmap_category); // store
					
				} //END if

				// slett heatmap properties frå tingen.
				delete selected_thing.heatmap_category_status;
				delete selected_thing.heatmap_category_id;

				// slett group icon
				for ( m in selected_thing.location_markers ) {
					selected_thing.location_markers[m].setIcon(null); // update
				} //END for
				
				store.put(selected_thing); // store

			} //END if


			if (
				selected_thing != undefined &&
				dropdownbox.value != "none"
			) {
				// Update thing in store
				selected_thing.heatmap_category_status 	= true;														// update
				selected_thing.heatmap_category_id 		= dropdownbox.value;
				
				var selected_heatmap_category 	= heatmap_store.get(dropdownbox.value);

				// Update thing icon on map
				if (
					selected_heatmap_category != undefined &&
					selected_heatmap_category.hasOwnProperty('cat_icon') &&
					selected_thing.hasOwnProperty('location_markers') &&
					selected_thing.location_markers.length > 0 //array
				) {
					for ( m in selected_thing.location_markers ) {
						selected_thing.location_markers[m].setIcon("map_icon/"+selected_heatmap_category.cat_icon);	// update
					} //END for
				} //END if

				store.put(selected_thing);								// store

				// Create heatmap in cat if none exist
				if (
					selected_heatmap_category != undefined &&
					selected_heatmap_category.hasOwnProperty('heatmap') == false &&
					selected_heatmap_category.hasOwnProperty('gradient') == true &&
					selected_heatmap_category.hasOwnProperty('radius') == true
				) {
					var mvc_array = new google.maps.MVCArray();
					selected_heatmap_category.heatmap = new google.maps.visualization.HeatmapLayer({
						data: mvc_array
					});

					// set gradient color
					selected_heatmap_category.heatmap.setOptions({
						gradient: selected_heatmap_category.gradient
					});

					// set expand gradient color radius
					selected_heatmap_category.heatmap.setOptions({
						radius: selected_heatmap_category.radius
					});

					selected_heatmap_category.heatmap.setMap(map);
				} //END if

				// Add thing geo points to heatmap category
				if (
					selected_heatmap_category != undefined &&
					selected_heatmap_category.hasOwnProperty('heatmap') == true &&
					selected_heatmap_category.heatmap.hasOwnProperty('data') == true &&
					selected_thing.hasOwnProperty('location_markers') &&
					selected_thing.location_markers.length > 0 //array
				) {
					for ( m in selected_thing.location_markers ) {

						// set color icon
						// + ekstra verdiar for å identifisere objektet seinare ved sletting av geo punkt i heatmap.
						var marker_position = selected_thing.location_markers[m].getPosition();
							marker_position.search_source = search_source;
							marker_position.search_result_id = search_result_id;
							marker_position.thing_id = thing_id;
						selected_heatmap_category.heatmap.data.push(marker_position);

					} //END for

				} //END if

				heatmap_store.put(selected_heatmap_category); // store

			} //END if

			update_selected_item_tab(thing_id);
			update_heatmap_control_panel();








		}
		else if (search_source == "osm") {
			//console.debug(search_source);
			//console.debug(search_result_id);
			//console.debug(thing_id);

			var selected_thing = open_street_map_result_stores[search_result_id].get(thing_id);					// get
			


			// if selected_thing er i ein heatmap_category frå før
			if (
				selected_thing != undefined &&
				selected_thing.hasOwnProperty('heatmap_category_status') == true &&
				selected_thing.heatmap_category_status == true &&
				selected_thing.hasOwnProperty('heatmap_category_id') == true &&
				selected_thing.heatmap_category_id.length > 0
			) {
				// denne tingen er i ein kategori frå før.

				var previous_heatmap_category = heatmap_store.get(selected_thing.heatmap_category_id);

				if (
					previous_heatmap_category != undefined &&
					previous_heatmap_category.hasOwnProperty('heatmap') == true &&
					previous_heatmap_category.heatmap.hasOwnProperty('data') == true
				) {	
					var remove_this = [];

					// finn og slett alle element som tilhøyrer tingen
					previous_heatmap_category.heatmap.data.forEach(function(element, index){
						//console.debug(element);
						//console.debug(index);
						if (
							element.hasOwnProperty('search_source') == true &&
							element.search_source == search_source &&
							element.hasOwnProperty('search_result_id') == true &&
							element.search_result_id == search_result_id &&
							element.hasOwnProperty('thing_id') == true &&
							element.thing_id == thing_id
						) {
							// dette element tilhøyrer aktuell ting
							remove_this.push(index); //Lyt gjere dette fordi forEach loopen vert øydelagt dersom ein fjernar element midt i loopinga.
						} //END if
					}); //END forEach

					for (i in remove_this) {
						previous_heatmap_category.heatmap.data.removeAt(remove_this[i]); // slettar element frå heatmap
					} //END for

					heatmap_store.put(previous_heatmap_category); // store
					
				} //END if

				// slett heatmap properties frå tingen.
				delete selected_thing.heatmap_category_status;
				delete selected_thing.heatmap_category_id;

				// slett group icon
				for ( m in selected_thing.location_markers ) {
					selected_thing.location_markers[m].setIcon(null); // update
				} //END for
				
				open_street_map_result_stores[search_result_id].put(selected_thing); // store

			} //END if



			if (
				selected_thing != undefined &&
				dropdownbox.value != "none"
			) {
				// Update thing in store
				selected_thing.heatmap_category_status 	= true;														// update
				selected_thing.heatmap_category_id 		= dropdownbox.value;
				
				var selected_heatmap_category 	= heatmap_store.get(dropdownbox.value);

				// Update thing icon on map
				if (
					selected_heatmap_category != undefined &&
					selected_heatmap_category.hasOwnProperty('cat_icon') &&
					selected_thing.hasOwnProperty('location_markers') &&
					selected_thing.location_markers.length > 0 //array
				) {
					for ( m in selected_thing.location_markers ) {
						selected_thing.location_markers[m].setIcon("map_icon/"+selected_heatmap_category.cat_icon);	// update
					} //END for
				} //END if

				open_street_map_result_stores[search_result_id].put(selected_thing);								// store

				// Create heatmap in cat if none exist
				if (
					selected_heatmap_category != undefined &&
					selected_heatmap_category.hasOwnProperty('heatmap') == false &&
					selected_heatmap_category.hasOwnProperty('gradient') == true &&
					selected_heatmap_category.hasOwnProperty('radius') == true
				) {
					var mvc_array = new google.maps.MVCArray();
					selected_heatmap_category.heatmap = new google.maps.visualization.HeatmapLayer({
						data: mvc_array
					});

					// set gradient color
					selected_heatmap_category.heatmap.setOptions({
						gradient: selected_heatmap_category.gradient
					});

					// set expand gradient color radius
					selected_heatmap_category.heatmap.setOptions({
						radius: selected_heatmap_category.radius
					});

					selected_heatmap_category.heatmap.setMap(map);
				} //END if

				// Add thing geo points to heatmap category
				if (
					selected_heatmap_category != undefined &&
					selected_heatmap_category.hasOwnProperty('heatmap') == true &&
					selected_heatmap_category.heatmap.hasOwnProperty('data') == true &&
					selected_thing.hasOwnProperty('location_markers') &&
					selected_thing.location_markers.length > 0 //array
				) {
					for ( m in selected_thing.location_markers ) {

						// set color icon
						// + ekstra verdiar for å identifisere objektet seinare ved sletting av geo punkt i heatmap.
						var marker_position = selected_thing.location_markers[m].getPosition();
							marker_position.search_source = search_source;
							marker_position.search_result_id = search_result_id;
							marker_position.thing_id = thing_id;
						selected_heatmap_category.heatmap.data.push(marker_position);

					} //END for

				} //END if

				heatmap_store.put(selected_heatmap_category); // store
			} //END if

			osm_update_selected_item_tab(
				search_result_id,
				thing_id
			);

			update_heatmap_control_panel();

		} //END else if
	} //END if
	else { console.debug("error"); }
} //END update_category_on_a_thing()




function update_heatmap_control_panel() {

	var tab = document.getElementById("div_id_tab_heatmap_settings");
	tab.innerHTML = ""; // fjernar alt som ligg i div frå før

	var group_counter = 0;

	heatmap_store.query({
		type: 'category'
	}).forEach(function(category) {
		
		if (
			category.hasOwnProperty('heatmap') &&
			category.heatmap.hasOwnProperty('data') &&
			category.hasOwnProperty('cat_id') &&
			category.hasOwnProperty('cat_label') &&
			category.hasOwnProperty('cat_icon') &&
			category.hasOwnProperty('cat_code') &&
			category.hasOwnProperty('radius')
		) {
			var geo_points_in_heatmap = category.heatmap.data.getLength();
			if (geo_points_in_heatmap > 0) {
				console.debug(category);
				console.debug(geo_points_in_heatmap);
				group_counter = group_counter + 1;

				// create control panel for this heatmap group
				var group_div			= document.createElement("div");
					group_div.id		= "div_id_heatmap_group_" + category.cat_id;
					group_div.className	= "div_class_heatmap_group"; //css

				var tr 				= document.createElement("tr");
					tr.style.verticalAlign = "middle";
				var td0 			= document.createElement("td");
				var img 			= document.createElement("img");
					img.src 		= "map_icon/" + category.cat_icon;
					img.style.height = "25px";
					img.style.margin = "5px";
					img.style.marginLeft = "10px";
					td0.appendChild(img);
				var td1 			= document.createElement("td");
					td1.style.width = "120px";
					td1.style.paddingLeft = "5px";
					td1.innerHTML	= category.cat_label + " (" + geo_points_in_heatmap + ")";
				var td2 			= document.createElement("td");
					td2.style.width = "140px";
				var slider 			= document.createElement("input");
					slider.id = "heatmap_group_" + category.cat_id + "_slider";
					slider.type = "range";
					slider.min = 10;
					slider.max = 100;
					slider.step = 1;
					slider.value = category.radius;
					slider.onchange = function(){update_heatmap_group_slider_radius(category.cat_id);};
					td2.appendChild(slider);

				var td3 			= document.createElement("td");
					td3.style.width = "100px";
					td3.id = "heatmap_group_" + category.cat_id + "_slider_txt";
					td3.innerHTML = "(" + category.radius + ")";

				var td5 			= document.createElement("td");
					td5.style.width = "120px";
				var change_opacity = document.createElement("button");
					change_opacity.setAttribute('onclick', "change_heatmap_opacity('"+category.cat_id+"')");
					change_opacity.innerHTML = "Change opacity";
					td5.appendChild(change_opacity);

				var td4 			= document.createElement("td");
					td4.style.width = "120px";
				var toggle_heatmap = document.createElement("button");
					toggle_heatmap.setAttribute('onclick', "toggle_selected_heatmap_category('"+category.cat_id+"')");
					toggle_heatmap.innerHTML = "Toggle category";
					td4.appendChild(toggle_heatmap);

				tr.appendChild(td0);
				tr.appendChild(td1);
				tr.appendChild(td2);
				tr.appendChild(td3);
				tr.appendChild(td5);
				tr.appendChild(td4);
				group_div.appendChild(tr);
				tab.appendChild(group_div);
			} //END if
		} //END if

	}); //END forEach

	if (group_counter <= 0) {
		var p 				= document.createElement("p");
			p.innerHTML		= "In order to see a heatmap, select something and add it to a heatmap group.";
		tab.appendChild(p);
	}

} //END update_heatmap_control_panel()


function update_heatmap_group_slider_radius(heatmap_group_id) {
	var slider_element_id 		= "heatmap_group_" + heatmap_group_id + "_slider";
	var slider_text_element_id 	= "heatmap_group_" + heatmap_group_id + "_slider_txt";

	// get new radius from slider_element_id
	var slider_element = document.getElementById(slider_element_id);

	// update new radius to slider_text_element_id
	var slider_text_element = document.getElementById(slider_text_element_id);
	slider_text_element.innerHTML = "(" + slider_element.value + ")";

	console.debug(slider_element_id);
	console.debug(slider_text_element_id);

	var heatmap_group = heatmap_store.get(heatmap_group_id);

	if (
		heatmap_group != undefined &&
		heatmap_group.hasOwnProperty('radius') &&
		heatmap_group.hasOwnProperty('heatmap')
	) {
		//console.debug(heatmap_group);

		// update new radius on heatmap
		var r = parseInt(slider_element.value);
		heatmap_group.heatmap.setOptions({radius: r});
		
		// update new radius in store
		heatmap_group.radius = slider_element.value;

		// store
		heatmap_store.put(heatmap_group);

	} //END if
} //END update_heatmap_group_slider_radius()



function toggle_selected_heatmap_category(heatmap_group_id) {

	var heatmap_group = heatmap_store.get(heatmap_group_id);

	if (
		heatmap_group != undefined &&
		heatmap_group.hasOwnProperty('heatmap')
	) {
		// update
		heatmap_group.heatmap.setMap(heatmap_group.heatmap.getMap() ? null : map);

		// store
		heatmap_store.put(heatmap_group);

	} //END if
} //END toggle_selected_heatmap_category()



function change_heatmap_opacity(heatmap_group_id) {

	var heatmap_group = heatmap_store.get(heatmap_group_id);

	if (
		heatmap_group != undefined &&
		heatmap_group.hasOwnProperty('heatmap')
	) {
		// update
		heatmap_group.heatmap.setOptions({opacity: heatmap_group.heatmap.get('opacity') ? null : 0.2});

		// store
		heatmap_store.put(heatmap_group);

	} //END if
} //END change_heatmap_opacity()
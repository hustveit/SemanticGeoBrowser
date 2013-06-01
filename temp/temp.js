get_input_from_form_checkbox(form_at_least_one_or_all_property_match)


			// TODO: 444444444444444444444444444444444444444444444444 checkbox
			var all_properties_must_match = get_input_from_form_checkbox("form_at_least_one_or_all_property_match");
			console.debug("all_properties_must_match: " + all_properties_must_match);




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


			search_overview_store.add({
				search_result_id:		new_store_array_number,					// for example: 1
				search_label:			this_is_the_thing_we_are_looking_for,	// for example: Hike
				type:					'searchResultGroup',
				search_criteria:		the_rdf_triples_we_are_looking_for,
				location_icon:			use_this_google_map_icon,
				type_uri:				this_is_the_type_uri_of_the_thing_we_are_looking_for,
				area_of_interest: 		create_area_of_interest_border(new_store_array_number)
			});


DROPDOWN BOX:

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

		// <button onclick="test()">Test</button>
		var	hc_button					= document.createElement("button");
			hc_button.setAttribute('onclick', "toggle_change_heatmap_categorysation_box()");
			hc_button.innerHTML 		= "Test";
		hc_div.appendChild(hc_button);

		var	hc_label					= document.createElement("div");
			hc_label.id					= "div_id_hc_label";
			hc_label.innerHTML 			= "Not on the heatmap yet!";
		hc_div.appendChild(hc_label);

		//
		// Change heatmap categorysation
		//
		var	hc_change_w					= document.createElement("div");
			hc_change_w.id				= "div_id_hc_change_wrapper";
			hc_change_w.className		= "div_class_hc_change_wrapper"; //css

		var	hc_change_c					= document.createElement("div");
			hc_change_c.id				= "div_id_hc_change_content";
			hc_change_c.className		= "div_class_hc_change_content"; //css

		var hc_select_label 			= document.createElement("label");
			hc_select_label.setAttribute('for', 'hc_select_id');
			hc_select_label.innerHTML 	= "Category";
		hc_change_c.appendChild(hc_select_label);

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

		hc_change_c.appendChild(hc_select);
		hc_change_w.appendChild(hc_change_c);

		hc_div.appendChild(hc_change_w);
		selected_thing_container.appendChild(hc_div);

	} //END if


.div_class_heatmap_categorysation {
	background-color: #D0E9FC;
	border-style: solid;
	border-width: 1px;
	border-color: #B5BCC7;
	padding: 5px;
	-moz-box-flex: 0;
	-webkit-box-flex: 0;
	box-flex: 0;
	-moz-box-align: start;
	-webkit-box-align: start;
	box-align: start;
	color: black;
}

.div_class_hc_change_wrapper {
	overflow: hidden;
	max-height: 0px;
	-webkit-transition: max-height 0.5s;
	   -moz-transition: max-height 0.5s;
         -o-transition: max-height 0.5s;
            transition: max-height 0.5s;
}



// Denne får box til å gli opp eller igjen.
function toggle_change_heatmap_categorysation_box() {

	var element = document.getElementById("div_id_hc_change_wrapper");

	if ( element.style['max-height'].length <= 0 ) {
		// IF max-height ikkje er satt før.
		$(element).css('max-height', '500px'); // jquery
	}
	else {
		if ( element.style['max-height'] == "0px" ) {
			$(element).css('max-height', '500px');
		}
		else {
			$(element).css('max-height', '0px');
		}
	} //END else

} //END toggle_change_heatmap_categorysation_box()
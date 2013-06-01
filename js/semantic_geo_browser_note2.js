function update_selected_item_on_map(
	dojo_store_item_id
){
	var update_selected_item_on_map_deferred = new dojo.Deferred();

	var selected_thing = store.get(dojo_store_item_id);
	var search_overview = search_overview_store.get(selected_thing.dojo_store_id_number);


	// har tingen ein markør som viser ein polyline på kartet?
	if ( selected_thing.hasOwnProperty('polyline_markers') ) {

		for (var p in selected_thing.polyline_markers) {
			selected_thing.polyline_markers[p].setOptions({
				strokeColor: '#666666',
				strokeWeight:	'4'
			});
		} //END for

	} //END if


	if ( selected_thing.hasOwnProperty('location_markers') ) {

		// sett marker icon til gruppe icon dersom tingen er med i ei gruppe
		if ( selected_thing.hasOwnProperty('heatmap_category_id') ) {

			var heatmap_group = heatmap_store.get(selected_thing.heatmap_category_id);
			if (
				heatmap_group != undefined &&
				heatmap_group.hasOwnProperty('cat_icon')
			) {
				for (var l in selected_thing.location_markers) {
					selected_thing.location_markers[l].setIcon("map_icon/"+heatmap_group.cat_icon);
				} //END for
			}
			else {
				for (var l in selected_thing.location_markers) {
					selected_thing.location_markers[l].setIcon();
				} //END for
			} //END else

		}
		else if ( search_overview.hasOwnProperty('location_icon') ) {
			for (var l in selected_thing.location_markers) {
				selected_thing.location_markers[l].setIcon(search_overview.location_icon);
			} //END for
		}
		else {
			for (var l in selected_thing.location_markers) {
				selected_thing.location_markers[l].setIcon();
			} //END for
		} //END else

	} //END if
	

	// taggar selected thing så ein kan finne den igjen for unselecting
	selected_thing.selected_thing = true;

	store.put(selected_thing); //store the change

	update_selected_item_on_map_deferred.resolve(true);
	return update_selected_item_on_map_deferred;
} //END update_selected_item_on_map()




function unselect_selected_item(){
	var unselect_selected_item_deferred = new dojo.Deferred();

	closeInfos();	// close the previous info-window

	selected_item = {
		selection_status: 	false //something is selected, true or false
	};

	// Define the callback
	var for_each_selected_thing = function(selected_thing, request) {
		var for_each_selected_thing_deferred = new dojo.Deferred();

		//
		// deselect selected_thing
		//

		// har tingen ein markør som viser ein polyline på kartet?
		if ( selected_thing.hasOwnProperty('polyline_markers') ) {
			for (var p in selected_thing.polyline_markers) {
				
				// tilbakestill til standard stil
				selected_thing.polyline_markers[p].setOptions({
					strokeColor:	'#FF0000',
					strokeWeight:	'2'
				});

			} //END for
		} //END if

		// sett marker icon tilbake til gruppe icon dersom tingen er med i ei gruppe
		if ( selected_thing.hasOwnProperty('heatmap_category_id') ) {

			var heatmap_group = heatmap_store.get(selected_thing.heatmap_category_id);
			if (
				heatmap_group != undefined &&
				heatmap_group.hasOwnProperty('cat_icon')
			) {
				for (var l in selected_thing.location_markers) {
					selected_thing.location_markers[l].setIcon("map_icon/"+heatmap_group.cat_icon);
				} //END for
			} //END if

			// sett marker icon tilbake til default dersom den har nokon
			else if ( selected_thing.hasOwnProperty('location_markers') ) {
				for (var l in selected_thing.location_markers) {
					if ( selected_thing.location_markers[l].hasOwnProperty('default_icon') ) {
						selected_thing.location_markers[l].setIcon(selected_thing.location_markers[l].default_icon);
					} //END if
				} //END for
			} //END if

		} //END if

		// sett marker icon tilbake til default dersom den har nokon
		else if ( selected_thing.hasOwnProperty('location_markers') ) {
			for (var l in selected_thing.location_markers) {
				if ( selected_thing.location_markers[l].hasOwnProperty('default_icon') ) {
					selected_thing.location_markers[l].setIcon(selected_thing.location_markers[l].default_icon);
				} //END if
			} //END for
		} //END if

		// deselect thing in dojo store
		if ( selected_thing.hasOwnProperty('selected_thing') ) {
			delete selected_thing.selected_thing; // brukast for å søke i dojo store etter selected thing
		} //END if

		store.put(selected_thing); //store the change

		for_each_selected_thing_deferred.resolve(true);
		return for_each_selected_thing_deferred;
	} //END for_each_selected_thing

	// find the selected thing
	dojo.when(
		store.query({
			type:						'searchResult',
			selected_thing:				true
		}).forEach(
			for_each_selected_thing
		),
		function(reply) {

			unselect_selected_item_deferred.resolve("ok");

		}
	); //END dojo.when()

	return unselect_selected_item_deferred;
} //END unselect_selected_item()


function selectLastRadio(element) {
	var form = element.parentNode;
	var formLength = form.length - 2;
	if (form[formLength].checked != true) {
		form[formLength].checked = true;
	}
} //END selectLastRadio()
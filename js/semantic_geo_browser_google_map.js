/**
 * 
 * Author: Lars Berg Hustveit (lars.berg@hustveit.org)
 * Created: 2012.02.22
 * Last edited date:
 * 
 * OBS! Dette dokumentet er blitt inspirert av følgjande sider:
 * - http://maps.forum.nu/temp/gm_control_click.html
 *
 */

var geocoder;
var map;
var markersArray = [];
var infoWindowArray = [];
 
var map_center;
var map_zoom;
var map_bounds;
var map_bounds_south_west;
var map_bounds_north_east;

/**
 * Initialize the map (Google Maps API v3)
 */
function initialize_google_map() {
	geocoder = new google.maps.Geocoder();
	
	//var latlng = new google.maps.LatLng(60.39132458563541,5.320676266031574);
	//var latlng = new google.maps.LatLng(59.911603546761384,10.744403301554035);
	
	//http://dbpedia.org/page/American_Computer_Museum
	//var latlng = new google.maps.LatLng(45.678612,-111.040833);
	
	//http://dbpedia.org/page/National_Archaeological_Museum_(France)
	//var latlng = new google.maps.LatLng(48.89778,2.09611);
	
	//http://dbpedia.org/page/Rikshospitalet
	//var latlng = new google.maps.LatLng(59.948803,10.716319);
	
	//http://sognefjord.vestforsk.no/page/hike/hike101
	//var latlng = new google.maps.LatLng(60.488924734905524, 5.325057422393793);
	var latlng = new google.maps.LatLng(60.390327409501786, 5.321302329772943);
	
    var myOptions = {
      zoom: 15,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	
    map = new google.maps.Map(document.getElementById("sognefjord-header-map"), myOptions);
	
	//Denne rapporterar om forandringar når ein beveger på kartet eller zoomar!
	google.maps.event.addListener(map, 'bounds_changed', function(){update_google_map_status()});
	//google.maps.event.addListener(map, 'bounds_changed', function(){alert("bounds_changed")});
	//google.maps.event.addListener(map, 'zoom_changed', function(){alert("zoom_changed")});
} //END initializeMap()


function closeInfos(){
	if(infoWindowArray.length > 0){
 
		// detach the info-window from the marker
		infoWindowArray[0].set("marker",null);
	 
		// and close it
		infoWindowArray[0].close();
	 
		// blank the array
		infoWindowArray.length = 0;
	}
} //END closeInfos()

function update_google_map_status() {

	map_center = map.getCenter();
	map_zoom = map.getZoom();
	map_bounds = map.getBounds();
	
	map_bounds_south_west = map_bounds.getSouthWest();
	map_bounds_north_east = map_bounds.getNorthEast();

	var display_map_status = document.getElementById("div_id_map_status"); //id til <div> der du vil vise resultatet

	/*
	display_map_status.innerHTML = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"width: 100%;\"> \
	<tbody> \
		<tr> \
			<td style=\"width: auto;\">Map Zoom:</td> \
			<td style=\"width: auto;\">"+map_zoom+"</td> \
		</tr> \
		<tr> \
			<td style=\"width: auto;\">Map Center:</td> \
			<td style=\"width: auto;\">"+map_center+"</td> \
		</tr> \
		<tr> \
			<td style=\"width: auto;\">Map South West:</td> \
			<td style=\"width: auto;\">"+map_bounds_south_west+"</td> \
		</tr> \
		<tr> \
			<td style=\"width: auto;\">Map North East:</td> \
			<td style=\"width: auto;\">"+map_bounds_north_east+"</td> \
		</tr> \
	</tbody>"+
	"</table>";
	*/

	display_map_status.innerHTML = "<h2>Map Center</h2> \
	<p>"+map_center+"</p> \
	<h2>South West</h2> \
	<p>"+map_bounds_south_west+"</p> \
	<h2>North East</h2> \
	<p>"+map_bounds_north_east+"</p> \
	<h2>Zoom Level</h2> \
	<p>"+map_zoom+"</p>";
	
	/*
	var display_map_status_in_a_list = document.createElement("ul");
	display_map_status.appendChild(display_map_status_in_a_list);
	
	var place_item_in_search_result_list = document.createElement("li");
	display_map_status_in_a_list.appendChild(place_item_in_search_result_list);
	
	var item_to_display = document.createTextNode(map_zoom);
	place_item_in_search_result_list.appendChild(item_to_display);
	*/
} //END update_google_map_status()



function osm_markers_show_all(search_result_id) {
	open_street_map_result_stores[search_result_id].query({
		location_status:	true
	}).forEach(function(item){
		if (
			item.hasOwnProperty('location_markers') &&
			item.location_markers.length > 0
		) {
			for ( l in item.location_markers ) {
				item.location_markers[l].setMap(map); 						// update
				open_street_map_result_stores[search_result_id].put(item); 	// store
			} //END for
		} //END if
	}); //END open_street_map_result_stores[search_result_id].query()
} //END markers_show_all()


function osm_markers_hide_all(search_result_id) {
	open_street_map_result_stores[search_result_id].query({
		location_status:	true
	}).forEach(function(item){
		if (
			item.hasOwnProperty('location_markers') &&
			item.location_markers.length > 0
		) {
			for ( l in item.location_markers ) {
				item.location_markers[l].setMap(null); 						// update
				open_street_map_result_stores[search_result_id].put(item); 	// store
			} //END for
		} //END if
	}); //END open_street_map_result_stores[search_result_id].query()
} //END markers_hide_all()


function osm_markers_show_selected_thing(
	search_result_id,
	thing_uri
) {
	var item = open_street_map_result_stores[search_result_id].get(thing_uri);
	if (
		item != undefined &&
		item.hasOwnProperty('location_markers') &&
		item.location_markers.length > 0
	) {
		for ( l in item.location_markers ) {
			item.location_markers[l].setMap(map); 						// update
			open_street_map_result_stores[search_result_id].put(item); 	// store
		} //END for
	} //END if
} //END osm_markers_show_selected_thing()


function osm_show_selected_category(
	search_result_id,
	category_uri
) {
	osm_markers_hide_all(search_result_id);
	var category = osm_category_store[search_result_id].get(category_uri);
	if (
		category != undefined &&
		category.hasOwnProperty('uri') &&
		category.uri.length > 0 &&
		category.hasOwnProperty('thing_uri') &&
		category.thing_uri.length > 0
	) {
		for ( t in category.thing_uri ) {
			osm_markers_show_selected_thing(
				search_result_id,
				category.thing_uri[t]
			);
		} //END for
	} //END if
} //END osm_show_selected_category()
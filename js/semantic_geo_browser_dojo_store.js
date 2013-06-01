




var store;
var result_counter = new Array();		// array index == search number
										// array value == number of result stored

var things_to_search_for_store = false; // Lagre eigenskapane til tinga me kan søke etter.
var search_overview_store; // Lagre info om utførte søk her.
var heatmap_store; // Lagre dei forskjellige layers til heatmap her. Kvar layer er representert av ein farge.
var open_street_map_result_stores = new Array();
var osm_rdf_store = new Array();
var osm_category_store = new Array();

var selected_item; // object with info about what item that was last selected.

function boot_up_dojo_memory_store() {

	store = new dojo.store.Memory({
		data:{
			identifier:	'id',
			label:		'name',
			items:[
				{	
					id:		'test1',
					name:	'Test 1',
					type:	'test'
				},
				{	
					id:		'test2',
					name:	'Test 2',
					type:	'test'
				}
			]
		}
	});

} //END boot_up_dojo_memory_store()



function boot_up_things_to_search_for_store() {
	var boot_up_things_to_search_for_store_deferred = new dojo.Deferred();

	if ( things_to_search_for_store == false ) {
		things_to_search_for_store = new dojo.store.Memory({
			data:{
				identifier:	'thing_type_uri',
				label:		'thing_type_label',
				items:[]
			}
		});
	} //END if

	boot_up_things_to_search_for_store_deferred.resolve("true");
	return boot_up_things_to_search_for_store_deferred;
} //END boot_up_things_to_search_for_store()



function boot_up_search_overview_store() {
	var boot_up_search_overview_store_deferred = new dojo.Deferred();
	search_overview_store = new dojo.store.Memory({
		data:{
			identifier:	'search_result_id',
			label:		'search_label',
			items:[]
		}
	});
	boot_up_search_overview_store_deferred.resolve("true");
	return boot_up_search_overview_store_deferred;
} //END boot_up_search_overview_store()


function boot_up_heatmap_store() {
	var boot_up_heatmap_store_deferred = new dojo.Deferred();
	heatmap_store = new dojo.store.Memory({
		data:{
			identifier:	'cat_id',
			label:		'cat_label',
			items:[
				{	
					cat_id:			'black',
					cat_label:		'Black',
					cat_icon:		'black.png',
					cat_code: 		'000000',
					type: 			'category',
					gradient: 		[
						'rgba(51, 33, 33, 0)',
						'rgba(38, 28, 28, 1)',
						'rgba(38, 28, 28, 1)',
						'rgba(38, 28, 28, 1)',
						'rgba(33, 11, 11, 1)',
						'rgba(33, 11, 11, 1)',
						'rgba(33, 11, 11, 1)',
						'rgba(0, 0, 0, 1)',
						'rgba(0, 0, 0, 1)',
						'rgba(0, 0, 0, 1)'
					],
					radius: 		20
				},
				{	
					cat_id:			'brown',
					cat_label:		'Brown',
					cat_icon:		'brown.png',
					cat_code: 		'9E7151',
					type: 			'category',
					gradient: 		[
						'rgba(158, 113, 81, 0)',
						'rgba(158, 113, 81, 1)',
						'rgba(158, 113, 81, 1)',
						'rgba(119, 93, 75, 1)',
						'rgba(119, 93, 75, 1)',
						'rgba(119, 93, 75, 1)',
						'rgba(103, 58, 26, 1)',
						'rgba(103, 58, 26, 1)',
						'rgba(103, 58, 26, 1)',
						'rgba(103, 58, 26, 1)'
					],
					radius: 		20
				},
				{	
					cat_id:			'darkblue',
					cat_label:		'Dark blue',
					cat_icon:		'darkblue.png',
					cat_code: 		'0336D1',
					type: 			'category',
					gradient: 		[
						'rgba(3, 54, 209, 0)',
						'rgba(3, 54, 209, 1)',
						'rgba(41, 70, 157, 1)',
						'rgba(41, 70, 157, 1)',
						'rgba(1, 35, 136, 1)',
						'rgba(1, 35, 136, 1)',
						'rgba(60, 104, 232, 1)',
						'rgba(60, 104, 232, 1)',
						'rgba(106, 138, 232, 1)',
						'rgba(106, 138, 232, 1)'
					],
					radius: 		20
				},
				{	
					cat_id:			'gray',
					cat_label:		'Gray',
					cat_icon:		'gray.png',
					cat_code: 		'A8A8A8',
					type: 			'category',
					gradient: 		[
						'rgba(168, 168, 168, 0)',
						'rgba(168, 168, 168, 1)',
						'rgba(59, 59, 59, 1)',
						'rgba(59, 59, 59, 1)',
						'rgba(138, 138, 138, 1)',
						'rgba(138, 138, 138, 1)',
						'rgba(44, 44, 44, 1)',
						'rgba(44, 44, 44, 1)'
					],
					radius: 		20
				},
				{	
					cat_id:			'orange',
					cat_label:		'Orange',
					cat_icon:		'orange.png',
					cat_code: 		'EF9D3F',
					type: 			'category',
					gradient: 		[
						'rgba(239, 157, 63, 0)',
						'rgba(239, 157, 63, 1)',
						'rgba(179, 133, 80, 1)',
						'rgba(179, 133, 80, 1)',
						'rgba(247, 184, 111, 1)',
						'rgba(247, 184, 111, 1)',
						'rgba(155, 93, 20, 1)',
						'rgba(155, 93, 20, 1)',
						'rgba(155, 93, 20, 1)',
						'rgba(155, 93, 20, 1)'
					],
					radius: 		20
				},
				{	
					cat_id:			'pink',
					cat_label:		'Pink',
					cat_icon:		'pink.png',
					cat_code: 		'E14E9D',
					type: 			'category',
					gradient: 		[
						'rgba(225, 78, 157, 0)',
						'rgba(225, 78, 157, 1)',
						'rgba(225, 78, 157, 1)',
						'rgba(169, 86, 131, 1)',
						'rgba(169, 86, 131, 1)',
						'rgba(169, 86, 131, 1)',
						'rgba(146, 25, 91, 1)',
						'rgba(146, 25, 91, 1)',
						'rgba(146, 25, 91, 1)',
						'rgba(240, 122, 187, 1)'
					],
					radius: 		20
				},
				{	
					cat_id:			'purple',
					cat_label:		'Purple',
					cat_icon:		'purple.png',
					cat_code: 		'7D54FC',
					type: 			'category',
					gradient: 		[
						'rgba(125, 84, 252, 0)',
						'rgba(125, 84, 252, 1)',
						'rgba(117, 95, 189, 1)',
						'rgba(117, 95, 189, 1)',
						'rgba(60, 27, 164, 1)',
						'rgba(60, 27, 164, 1)',
						'rgba(157, 127, 254, 1)',
						'rgba(157, 127, 254, 1)',
						'rgba(183, 161, 254, 1)',
						'rgba(183, 161, 254, 1)'
					],
					radius: 		20
				},
				{	
					cat_id:			'red',
					cat_label:		'Red',
					cat_icon:		'red.png',
					cat_code: 		'FC6355',
					type: 			'category',
					gradient: 		[
						'rgba(252, 99, 85, 0)',
						'rgba(252, 99, 85, 1)',
						'rgba(252, 97, 85, 1)',
						'rgba(252, 97, 85, 1)',
						'rgba(189, 102, 95, 1)',
						'rgba(189, 102, 95, 1)',
						'rgba(164, 38, 28, 1)',
						'rgba(164, 38, 28, 1)',
						'rgba(254, 137, 128, 1)',
						'rgba(254, 137, 128, 1)'
					],
					radius: 		20
				},
				{	
					cat_id:			'teal',
					cat_label:		'Teal',
					cat_icon:		'teal.png',
					cat_code: 		'55D7D7',
					type: 			'category',
					gradient: 		[
						'rgba(85, 215, 215, 0)',
						'rgba(85, 215, 215, 1)',
						'rgba(88, 161, 161, 1)',
						'rgba(88, 161, 161, 1)',
						'rgba(28, 140, 140, 1)',
						'rgba(28, 140, 140, 1)',
						'rgba(128, 235, 235, 1)',
						'rgba(128, 235, 235, 1)',
						'rgba(157, 235, 235, 1)',
						'rgba(157, 235, 235, 1)'
					],
					radius: 		20
				},
/*
// Obs! Kvit rgba farge syner dårlig på kartet.
				{	
					cat_id:			'white',
					cat_label:		'White',
					cat_icon:		'white.png',
					cat_code: 		'ffffff',
					type: 			'category',
					gradient: 		[
						'rgba(255, 255, 255, 0)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)',
						'rgba(255, 255, 255, 1)'
					],
					radius: 		20
				},
*/
				{	
					cat_id:			'yellow',
					cat_label:		'Yellow',
					cat_icon:		'yellow.png',
					cat_code: 		'FCF356',
					type: 			'category',
					gradient: 		[
						'rgba(252, 243, 86, 0)',
						'rgba(252, 243, 86, 1)',
						'rgba(189, 184, 96, 1)',
						'rgba(189, 184, 96, 1)',
						'rgba(164, 156, 28, 1)',
						'rgba(164, 156, 28, 1)',
						'rgba(254, 247, 128, 1)',
						'rgba(254, 247, 128, 1)',
						'rgba(254, 248, 162, 1)',
						'rgba(254, 248, 162, 1)'
					],
					radius: 		20
				}
			]
		}
	});
	boot_up_heatmap_store_deferred.resolve("true");
	return boot_up_heatmap_store_deferred;
} //END boot_up_heatmap_store()



function prepare_store_for_new_search_result_input(
	search_result_id,
	number_of_rdf_triples_used_in_the_search
){
	var deferred = new dojo.Deferred();
	
	var id = "div_id_tab_search_result_" + search_result_id;
	var name = "Search " + search_result_id;
	
	// her legg me til oppsummeringa av søket
	var returning_the_id =
	store.add({
		id:						id, 
		name:					name, 
		type:					'searchResultGroup',
		search_result_id:		search_result_id,
		number_of_rdf_triples_used_in_the_search: number_of_rdf_triples_used_in_the_search
	});
	
	deferred.resolve(returning_the_id);
	return deferred;
} //END prepare_store_for_new_search_result_input()



function is_the_item_uri_added_before(
	thing_uri,
	new_store_array_number
){
	var deferred = new dojo.Deferred();
	var the_item_uri_is_added_before = false;
	
	store.query({
		uri:						thing_uri,
		type:						'searchResult',
		dojo_store_id_number:		new_store_array_number
	}).forEach(function(thing){
		the_item_uri_is_added_before = true;
	});

	deferred.resolve(the_item_uri_is_added_before);
	return deferred;
} //END is_the_item_uri_added_before()



function add_new_item_to_dojo_store(
	new_store_array_number,
	thing_uri,
	thing_title,
	thing_number_of_predicates,
	thing_predicates_array,
	result_number
){
	var deferred = new dojo.Deferred();
	
	var id = "search_nr_" + new_store_array_number +
		"_result_nr_" + result_number;
	
	var returning_the_id =
	store.add({
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
	});
	
	deferred.resolve(returning_the_id);
	return deferred;
} //END add_new_item_to_dojo_store()


function add_new_rdf_triple_to_dojo_store(
	parent_item_id,
	v,
	triple_subject,
	triple_predicate,
	triple_object,
	new_store_array_number,
	sindice_content_type
){
	var deferred = new dojo.Deferred();
	
	var triple_id = parent_item_id + "_triple_id_" + v;
	var triple_name = "Triple number: " + v;
	
	var returning_the_id =
	store.add({
		id:						triple_id,
		name:					triple_name,
		type:					'itemRDFtripel',
		triple_subject:			triple_subject,
		triple_predicate:		triple_predicate,
		triple_object:			triple_object,
		parent_item_id:			parent_item_id,
		search_result_id:		new_store_array_number,
		matching_search:		false,
		sindice_content_type:	sindice_content_type
	});
	
	deferred.resolve(returning_the_id);
	return deferred;
} //END add_new_rdf_triple_to_dojo_store()
















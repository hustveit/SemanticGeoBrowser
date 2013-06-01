<?php
//
// Created date: 12.07.2012
//
// Lars Berg Hustveit <lars.berg@hustveit.org>
//
if (
	isset($_POST['query'])
){	
	//example
	//$url = "http://test.linkedgeodata.org/sparql?query=%20SELECT%20DISTINCT%20%3Fp%20%3Fo%20FROM%20%3Chttp%3A//linkedgeodata.org%3E%20WHERE%20%7B%20%20%20%20%20%3Chttp%3A//linkedgeodata.org/triplify/node268396336%3E%09%3Fp%09%3Fo%20.%20%7D%20&output=json";
	
	$url = "http://test.linkedgeodata.org/sparql?query=" . $_POST['query'] . "&output=json";

	//Inspirert frå: http://themekraft.com/getting-json-data-with-php-curl/

	// Initializing curl
	$ch = curl_init( $url );
 
	// Configuring curl options
	$options = array(
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HTTPHEADER => array('Accept: application/json', 'Content-type: application/json')
	);
 
	// Setting curl options
	curl_setopt_array( $ch, $options );
 
	// Getting results
	$result =  curl_exec($ch);
	
    if (curl_errno($ch)) {
		//print curl_error($ch);
		echo "false"; //dersom error
    } else {
        echo $result;
    }
	curl_close($ch);

}
else {
	echo "false";
}

?>
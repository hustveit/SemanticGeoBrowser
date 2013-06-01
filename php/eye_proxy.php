<?php
//
//
//
// Lars Berg Hustveit <lars.berg@hustveit.org>
//
if (
	isset($_POST['path']) AND
	isset($_POST['data']) AND
	isset($_POST['rules']) AND
	isset($_POST['query'])
){

	/*
	echo $_POST['path'];
	echo $_POST['data'];
	echo $_POST['rules'];
	echo $_POST['query'];
	*/
	
/*
	$a = "@prefix sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> .
@prefix owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> .

sf_ont:hike100          owl-time:minute          \"\"\"5\"\"\" .
sf_ont:hike101          owl-time:minute          \"\"\"10\"\"\" .
sf_ont:hike102          owl-time:minute          \"\"\"60\"\"\" .
sf_ont:hike103          owl-time:minute          \"\"\"120\"\"\" .";
	$b = "@prefix sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> .
@prefix owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> .
@prefix math: <http://www.w3.org/2000/10/swap/math#> .

{
     ?x     owl-time:minute          ?y .
     ?y     math:lessThan            15 .
}
=>
{
     ?x     a     \"\"\"Easy\"\"\" .
}.



{
     ?x     owl-time:minute          ?y .
     ?y     math:equalTo             15 .
}
=>
{
     ?x     a     \"\"\"Easy\"\"\" .
}.



{
     ?x     owl-time:minute          ?y .
     ?y     math:greaterThan         15 .
     ?y     math:lessThan            60 .
}
=>
{
     ?x     a     \"\"\"Medium\"\"\" .
}.



{
     ?x     owl-time:minute          ?y .
     ?y     math:equalTo             60 .
}
=>
{
     ?x     a     \"\"\"Medium\"\"\" .
}.



{
     ?x     owl-time:minute          ?y .
     ?y     math:greaterThan          60 .
}
=>
{
     ?x     a     \"\"\"Hard\"\"\" .
}.";
	
	$url = "http://eye.restdesc.org/";
	$query = "{ ?a ?b ?c. } => { ?a ?b ?c. }.";
	*/



	$url = $_POST['path'];
	
	$data = "{
		\"data\": [
			". json_encode($_POST['data']) .",
			". json_encode($_POST['rules']) ."
		],
		\"query\": \"". $_POST['query'] ."\"
	} ";
	

	//Inspirert frå: http://themekraft.com/getting-json-data-with-php-curl/

	// Initializing curl
	$ch = curl_init( $url );
 
	// Configuring curl options
	$options = array(
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_HTTPHEADER => array('Content-type: application/json') ,
		CURLOPT_POSTFIELDS => $data
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

/*
$ch = curl_init();
    //curl_setopt($ch, CURLOPT_HTTPHEADERS, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_URL, $url);
    //curl_setopt($ch, CURLOPT_USERAGENT, $this->_agent);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    //curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    //curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
    //curl_setopt($ch, CURLOPT_COOKIEFILE, $this->_cookie_file_path);
    //curl_setopt($ch, CURLOPT_COOKIEJAR, $this->_cookie_file_path);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
    //curl_setopt($ch, CURLOPT_VERBOSE, TRUE);

        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode("{data: $data,query: $query}"));
        curl_setopt($ch, CURLOPT_POST, 1);

    $resulta = curl_exec($ch);
    if (curl_errno($ch)) {
        print curl_error($ch);
		//echo "false";
    } else {
        curl_close($ch);
    }
    echo $resulta;
	
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_POST, 1);
  curl_setopt($ch, CURLOPT_URL, $url);

  $data3 = serialize($data2);
  
  
  //prepare the field values being posted to the service
  $data = array(
    'data' => $data2, 
    'query' => $query, 
  );
  */
  /*
  $data = "{
  'data': [
'@prefix sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> .
@prefix owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> .

sf_ont:hike100          owl-time:minute          \"\"\"5\"\"\" .
sf_ont:hike101          owl-time:minute          \"\"\"10\"\"\" .
sf_ont:hike102          owl-time:minute          \"\"\"60\"\"\" .
sf_ont:hike103          owl-time:minute          \"\"\"120\"\"\" .',
			'@prefix sf_ont: <http://data.sognefjord.vestforsk.no/resource/ontology#> .
@prefix owl-time: <http://www.w3.org/2001/sw/BestPractices/OEP/Time-Ontology#> .
@prefix math: <http://www.w3.org/2000/10/swap/math#> .

{
     ?x     owl-time:minute          ?y .
     ?y     math:lessThan            15 .
}
=>
{
     ?x     a     \"\"\"Easy\"\"\" .
}.



{
     ?x     owl-time:minute          ?y .
     ?y     math:equalTo             15 .
}
=>
{
     ?x     a     \"\"\"Easy\"\"\" .
}.



{
     ?x     owl-time:minute          ?y .
     ?y     math:greaterThan         15 .
     ?y     math:lessThan            60 .
}
=>
{
     ?x     a     \"\"\"Medium\"\"\" .
}.



{
     ?x     owl-time:minute          ?y .
     ?y     math:equalTo             60 .
}
=>
{
     ?x     a     \"\"\"Medium\"\"\" .
}.



{
     ?x     owl-time:minute          ?y .
     ?y     math:greaterThan          60 .
}
=>
{
     ?x     a     \"\"\"Hard\"\"\" .
}.'],
            'query': '{ ?a ?b ?c. } => { ?a ?b ?c. }.'
    }";
  
  curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

  //make the request
  echo $result = curl_exec($ch);
  //echo print_r($data2);
  
  echo var_dump($result);
	
	$session = curl_init($url);

	// Don't return HTTP headers. Do return the contents of the call
	curl_setopt($session, CURLOPT_HEADER, false);
	curl_setopt($session, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($session, CURLOPT_POSTFIELDS, json_encode("{data: $data,query: $query}"));

	// Make the call
	$xml = curl_exec($session);

	// The web service returns XML. Set the Content-Type appropriately
	//header("Content-Type: text/xml");

	echo $xml;
	curl_close($session);
	
	// Open the Curl session
	$session = curl_init($request_url);

	// Don't return HTTP headers. Do return the contents of the call
	curl_setopt($session, CURLOPT_HEADER, false);
	curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

	// Make the call
	$xml = curl_exec($session);

	// The web service returns XML. Set the Content-Type appropriately
	header("Content-Type: text/xml");

	echo $xml;
	curl_close($session);
	
	$data[] = $_POST['data'];
	$data[] = $_POST['rules'];
	
	$url = $_POST['path'];
	$query = $_POST['query'];
	
	//$data = json_encode(array('data' => $data2,'query' => '{ ?a ?b ?c. } => { ?a ?b ?c. }.'), JSON_FORCE_OBJECT);
 
*/
?>
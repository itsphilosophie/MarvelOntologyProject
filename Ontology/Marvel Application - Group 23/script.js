angular.module('KRRclass', [ 'chart.js']).controller('MainCtrl', ['$scope','$http', mainCtrl]);



function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function mainCtrl($scope, $http){


// fuction to retrieve the movies
  $scope.startMyAwesomeApp = function(){

// check what input the user has given
      if ( $scope.movie1 == undefined) {
        $scope.movieValue = ""
      } else {$scope.movieValue = "FILTER( ?movie = "+ $scope.movie1+") "}

        if ( $scope.character == undefined) {
          $scope.characterValue = ""
        } else {$scope.characterValue = "FILTER( ?character = "+ $scope.character+") "}

          if ( $scope.actor == undefined) {
            $scope.actorValue = ""
          } else {$scope.actorValue = "FILTER( ?actor = "+ $scope.actor+") "}


// SPARQL query to retrieve the movies
		var query1 = " PREFIX marvel: <http://example.com/marvel_ontology#> \
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
		SELECT DISTINCT ?movie ?directorlabel ?producerlabel (GROUP_CONCAT(DISTINCT ?characterlabel; SEPARATOR = ',\\n') AS ?characterlabels)\
    (GROUP_CONCAT(DISTINCT ?actorname; SEPARATOR = ',\\n') AS ?actornames) ?plot ?language ?runtime \
     ?reviewrating ?movierating ?title ?releasedate \
			WHERE {\
			?movie rdf:type marvel:Movie. \
      ?actor (marvel:Portrays/marvel:playsARoleIn) ?movie .  ?actor foaf:name ?actorname .\
			OPTIONAL {?movie marvel:hasDirector ?director . ?director rdfs:label ?directorlabel}\
			OPTIONAL {?movie marvel:hasProducer ?producer .?producer rdfs:label ?producerlabel }\
			OPTIONAL {?movie marvel:hasPlot ?plot .}\
			OPTIONAL {?movie marvel:hasLanguage ?language.}\
			OPTIONAL {?movie marvel:hasMovieRuntime ?runtime. }\
			OPTIONAL {?movie marvel:hasReviewRating ?reviewrating. }\
			OPTIONAL {?movie marvel:hasMovieRating ?movierating. }\
			OPTIONAL {?movie marvel:hasTitle ?title.}\
			OPTIONAL {?movie marvel:hasReleaseDate ?releasedate. }\
			OPTIONAL {?movie marvel:hasCharacter ?character .  ?character marvel:isCharacter ?characterlabel\
       } FILTER(regex(str(?movie), 'http://example.com/marvel_ontology#'))\
		"+$scope.movieValue+$scope.characterValue+$scope.actorValue+" } \
    GROUP BY ?movie ?directorlabel ?producerlabel ?plot ?language ?runtime ?reviewrating ?movierating ?title ?releasedate"

		$scope.mySparqlEndpoint = 'http://localhost:7200/repositories/Marvel' ;
		$scope.mySparqlQuery = encodeURI(query1).replace(/#/g, '%23')
		$http( {
			method: "GET",
			url : $scope.mySparqlEndpoint + "?query=" + $scope.mySparqlQuery + "&format-json",
			headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
		})
		.success(function(data, status ) {
			$scope.myDisplayMessage = "We have retrieved the following movie(s) for this query:" ;
				$scope.FinalArray = [];


				// return results

				$scope.FinalData = data.results.bindings

			})

		.error(function(error ){
			console.log('Error running the input query!'+error);
		});


	};


// function to retrieve characters
  $scope.startMyAwesomeApp2 = function(){


// check what input the user has given
    if ( $scope.type == "hero" ) {
        $scope.typeValue = "?character rdf:type marvel:Hero . ";
      } else if ($scope.type == "villain"){
        $scope.typeValue = "?character rdf:type marvel:Villain . ";
      } else {$scope.typeValue = " "}
      if ( $scope.gender == "male" ) {
          $scope.genderValue = "?character rdf:type marvel:MaleCharacter . ";
        } else if ($scope.gender == "female"){
          $scope.genderValue = "?character rdf:type marvel:FemaleCharacter . ";
        } else {$scope.genderValue = " "}
        if ( $scope.status == "alive" ) {
            $scope.statusValue = "?character rdf:type marvel:AliveCharacter . ";
          } else if ($scope.status == "deceased"){
            $scope.statusValue = "?character rdf:type marvel:DeadCharacter . ";
          } else {$scope.statusValue = " "}
        if ( $scope.character == undefined) {
          $scope.characterValue = ""
        } else {$scope.characterValue = "FILTER( ?character = "+ $scope.character+") "}
        if ($scope.citizenship == undefined ) {
          $scope.citizenshipValue = ""
        } else {$scope.citizenshipValue = "FILTER( ?citizenship = "+ $scope.citizenship +")"}
        if ($scope.species == undefined ) {
          $scope.speciesValue = "" } else {
          $scope.speciesValue = "FILTER( ?species = "+ $scope.species +")"}



// select SPARQL query to retrieve characters
    var query2 = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
                PREFIX marvel: <http://example.com/marvel_ontology#>\
                SELECT DISTINCT ?name ?character ?actor ?specieslabel ?citizenshiplabel  ?status (GROUP_CONCAT(DISTINCT ?affiliation; SEPARATOR = ',\\n') AS ?affiliatons)\
                (GROUP_CONCAT(DISTINCT ?realname; SEPARATOR = ',\\n') AS ?realnames) ?gender ?rank (GROUP_CONCAT(DISTINCT ?movietitle; SEPARATOR = ',\\n') AS ?movietitles) WHERE {\
                ?character rdf:type marvel:Character.\
                ?character marvel:isCharacter ?name. \
                "+$scope.typeValue + $scope.genderValue + $scope.statusValue +"\
                ?character marvel:playsARoleIn ?movie; \
                marvel:isPortrayedBy ?actor.\
                ?movie marvel:hasTitle ?movietitle. \
                OPTIONAL{?character marvel:isSpecies ?species. ?species rdfs:label ?specieslabel}\
                OPTIONAL{?character marvel:hasCitizenship ?citizenship. ?citizenship rdfs:label ?citizenshiplabel .}\
                OPTIONAL{?character marvel:realName ?realname}\
                OPTIONAL{?character marvel:hasStatus ?status}\
                OPTIONAL{?character marvel:Affiliation ?affiliation}\
                OPTIONAL{?character marvel:hasGender ?gender}\
                OPTIONAL{?character marvel:Rank ?rank} \
                "+$scope.characterValue+ $scope.citizenshipValue + $scope.speciesValue+" FILTER(regex(str(?actor), 'http://example.com/marvel_ontology#'))\
                FILTER(regex(str(?character), 'http://example.com/marvel_ontology#')) FILTER(regex(str(?movie), 'http://example.com/marvel_ontology#'))}\
                GROUP BY ?name ?character ?actor ?specieslabel ?citizenshiplabel ?status ?gender ?rank "


    $scope.mySparqlEndpoint = 'http://localhost:7200/repositories/Marvel' ;
    $scope.mySparqlQuery = encodeURI(query2).replace(/#/g, '%23')

    $http( {
      method: "GET",
      url : $scope.mySparqlEndpoint + "?query=" + $scope.mySparqlQuery + "&format-json",
      headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
    })
    .success(function(data, status ) {
      $scope.myDisplayMessage = "We have retrieved the following character(s) for this query:" ;
        $scope.FinalArray = [];


        // return the results

        $scope.FinalData2 = data.results.bindings
      })

    .error(function(error ){
      console.log('Error running the input query!'+error);
    });
}



// function to retrieve actors
$scope.startActors = function(){


// check what input the user has given
  if ( $scope.actor == undefined) {
    $scope.actorsValue = ""
  } else {$scope.actorsValue = "FILTER( ?actor = "+ $scope.actor+") "}
  if ($scope.movie1 == undefined) {
    $scope.movieValue = ""
  } else {$scope.movieValue = "FILTER( ?movie = "+ $scope.movie1+") "}
  if ( $scope.gender == undefined ) {
    $scope.genderValue = "" }
  else if ($scope.gender == "male" ) {
      $scope.genderValue = "?actor marvel:hasGender \"male\"@en ." }
       else if ($scope.gender == "female"){
        $scope.genderValue = "?actor marvel:hasGender \"female\"@en ."  }
        else {$scope.genderValue = " "};



// select SPARQL query to retrieve characters
  var query3 =  "PREFIX marvel: <http://example.com/marvel_ontology#> \
                PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> \
                SELECT DISTINCT ?name ?charactername (GROUP_CONCAT(DISTINCT ?movietitle; SEPARATOR = ',\\n') AS ?movietitleexample) ?actor_birthdate ?gender  ?actor_abstract \
                WHERE { \
                "+$scope.genderValue+" \
                ?actor marvel:hasRealName ?name; \
                (marvel:Portrays/marvel:playsARoleIn) ?movie . ?movie marvel:hasTitle ?movietitle .\
                OPTIONAL{?actor marvel:Portrays ?character. ?character marvel:isCharacter ?charactername .} \
                OPTIONAL{?actor marvel:hasGender ?gender.} \
                OPTIONAL{?actor marvel:hasBirthdate ?actor_birthdate} \
                OPTIONAL{?actor marvel:hasAbstract ?actor_abstract} \
                "+$scope.actorsValue + $scope.movieValue +" \
                FILTER(regex(str(?actor), 'http://example.com/marvel_ontology#' ))\
                FILTER(regex(str(?character), 'http://example.com/marvel_ontology#' ))}\
                GROUP BY ?name ?charactername ?actor_birthdate ?gender ?actor_abstract"


  $scope.mySparqlEndpoint = 'http://localhost:7200/repositories/Marvel';
  $scope.mySparqlQuery = encodeURI(query3).replace(/#/g, '%23');
  $http( {
    method: "GET",
    url : $scope.mySparqlEndpoint + "?query=" + $scope.mySparqlQuery + "&format-json",
    headers : {'Accept':'application/sparql-results+json', 'Content-Type':'application/sparql-results+json'}
  })


//return results
  .success(function(data, status ) {
	  $scope.myDisplayMessage = "We have retrieved the following actor(s) for this query:" ;
    $scope.FinalData = data.results.bindings

  })

  .error(function(error ){
    console.log('Error running the input query!'+error);
  });
}; }

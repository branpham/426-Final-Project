var root_url = "http://comp426.cs.unc.edu:3001/";
var selected_dept, selected_arri;

$(document).ready(function(){
  // load AJAX log in information
  $('.collection.with-header').append('<li class="collection-item"><a href="#">test</a></li>');
  
  console.log('Searching for airport data');
  $.ajax({
    type: 'POST',
    url: root_url + 'sessions/',
    data: { "user": {
                    "username": 'KTS',
                    "password": 'COMP426'
                    }
          },
    xhrFields: {withCredentials: true},
    async: true,
    success: (response) => {
    	// build_home_interface();
    	
      	console.log('POST to sessions was a success');
    }
  });
  
	$('#date').mouseenter(function(){
		$('#date').datepicker();
	});

	$('#choose_btn').on('click', () => {
		if(selected_arri==selected_dept){
			alert("cannot fly to same place idiot");
		} else if(selected_dept!=null && selected_arri!=null){
			console.log("chosen date valid");
			build_flight_interface();
		} else {
			alert("chosen date invalid");
		}
	});

	// departure
	let deptairportcont = $('.collection.dept-with-header');
	let arriairportcont = $('.collection.arri-with-header');

	$.ajax({
    type: 'GET',
    url: root_url + 'airports',
    xhrFields: {withCredentials: true},
    success: (response) => {
    	if(response!=null){
    	let airports = response;
    	console.log('airport data accessed');
    	let testairport = airports[0];
    	console.log(testairport);
    	console.log(airports);
    	for (var i = 0; i < airports.length; i++){
    		console.log(i);
    		console.log(airports[i].name);
    		let airport_name = airports[i].name;
    		console.log(airport_name);
    		deptairportcont.append('<li class="collection-item"><a href="#">' + airport_name +'</a></li>');
    		arriairportcont.append('<li class="collection-item"><a href="#">' + airport_name +'</a></li>');

    		
	    	}
	    }
  }
  

});



$(".collection.dept-with-header").on("click", ".collection-item", function(e){
  selected_dept = (e.target.textContent);
  var input= $('#filterInput');
  input.val(selected_dept);
});

$(".collection.arri-with-header").on("click", ".collection-item", function(e) {
  selected_arri= (e.target.textContent);
  var input= $('#filterInput2');
  input.val(selected_arri);
});

var build_flight_interface = function() {
    let body = $('body');
    //make container but make sure to close container and divs
    body.append('<div class="container results-container"><div id="wrapper"></div><div id="under">');
    let rlist = $('<ul class="collection results-collection">');
    


}

// var queryFlights = function() {
// 	let body = $('body');

// 	if(selected_arri=null) AND (elected_dept!=null):
// 		body.empty();
	

// };

});




var root_url = "http://comp426.cs.unc.edu:3001/";

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
// var build_home_interface = function() {
//     let body = $('body');
// //poop
//     body.empty();
//     body.append('<nav class="navbar"><a class="navbar-item" id="home">Home</a><a class="navbar-item"></a></nav>');
//     body.append("<section class='section header-section'><div class='container header-container'><h1 class='title'>Welcome to Flights API Project</h1><h1 class='subtitle'></h1>");
//     body.append();


// }


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



$(".collection.dept-with-header").on("click", ".collection-item", (e) => {
  alert(e.target);
});

$(".collection.arri-with-header").on("click", ".collection-item", function() {
  let w= 
 alert("poop");
});





});




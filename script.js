var root_url = "http://comp426.cs.unc.edu:3001/";
var selected_dept, selected_arri;

$(document).ready(() => {
  $('#reg_btn').on('click', () => {
    let usern = $('#login_user').val();
    let pass = $('#login_pass').val();
    $.ajax(root_url + 'users', {
      type: 'POST',
      dataType: 'json',
      data: {
        "user": {
          "username": usern,
          "password": pass
        },
      },
      success: () => {
        build_navbar();
        build_home_interface();
      },
      error: () => {
        alert("sad");
      }
    });
  });

  $('#login_btn').on('click', () => {
    let usern = $('#login_user').val();
    let pass = $('#login_pass').val();

    $.ajax(root_url + 'sessions', {
      type: 'POST',
      dataType: 'json',
      data: {
        "user": {
          "username": usern,
          "password": pass
        },
      },
      success: () => {
        build_navbar();
        build_home_interface();
      },
      error: () => {
        alert('login error');
      }
    });

    $("body").on("click", "#1", function() {
      build_home_interface();
    });

    $("body").on("click", "#2", function() {
      let body = $('body');
      body.empty();
      body.append('<h1>Itinerary</h1>');
      build_navbar();
    });

    $("body").on("click", "#3", function() {
      let body = $('body');
      body.empty();
      body.append('<h1>Seat</h1>');
      build_navbar();
    });

    $("body").on("click", "departureID", function() {
      let body = $('body');
      body.empty();
      body.append('<h1>Seat</h1>');
      build_navbar();
    });
  });
});

var build_flight_interface = function() {
  let body = $('body');
  body.empty();
  body.append('<h1>Available Flights</h1>');
  build_navbar();
  //make container but make sure to close container and divs
  body.append('<div class="container results-container"><div id="wrapper"></div><div id="under">');
  let rlist = $('<ul class="collection results-collection">');

  // let arri_id = get_airport_id(selected_arri);
  console.log('selected departure name is:' + selected_dept);
  console.log(get_airport_id(selected_dept));
  let dept_id = get_airport_id(selected_dept);
  console.log(root_url + 'flights?filter[departure_id]=' + dept_id);
  console.log("final dept_id is: " + get_airport_id(selected_dept));

  $.ajax({
    type: 'GET',
    // url: root_url + 'flights?filter[departure_id]=' + dept_id + '?filter[arrival_id]=' + arri_id,
    url: root_url + 'flights?filter[departure_id]=' + dept_id,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      // console.log(response[0]);
      let departures = response;

      console.log(departures);
    }
  });
  //use LA departure and McCarran arrival
  // get_airport_name(125570);
  // get_airport_name(125718);
  // http://comp426.cs.unc.edu:3001/flights?filter[departure_id]=134872

}

function get_airport_id(airportname) {
	var airport_id;
	console.log('Getting Airport:' + airportname);
  $.ajax({
    type: 'GET',
    url: root_url + 'airports?filter[name]=' + airportname,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      console.log(response[0]);
      airport_id = Number(response[0].id);
      console.log(airportname + 'airport id :' + airport_id);
      if(144815==airport_id){
      	console.log('yeah the airport should match up to a number value');
      }
      return 144815;
    }
  });
}

var get_airport_name = function(some_airport_id) {
  $.ajax({
    type: 'GET',
    url: root_url + 'airports/' + some_airport_id,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      // console.log(response[0]);
      let this_airport_name = response.name;
      console.log(response);
    }
  });
}

var build_navbar = function() {
  let body = $('body')
  body.append('<nav><li id="1";><a>Book Flight</a></li><li id="2"><a> Itinerary</a></li><li id="3"><a> Seat</a></li><li  onClick="change_pass_btn()"><a> Change Password</a></li></nav>');
}


var build_home_interface = function() {
  
  let body = $('body')
  body.empty();
  body.append('<h1>Flight API Project</h1>');
  build_navbar();
  body.append('<br><div class="container-flight-container"><div id="wrapper"><div id="left">Departure: <input type="text" id="filterInput" placeholder="Search names..."><button id="departureID">Search</button><ul id="names" class="collection dept-with-header"></ul></div><div id="middle">Arrival: <input type="text" id="filterInput2"  placeholder="Search names..."><button id="arrivalID">Search</button><ul id="names2" class="collection arri-with-header" class="left-align"></ul></div><div id="right">Date: <input class="calendar" id="date" placeholder="Select date"></div><button onclick= " build_flight_interface"id="choose_btn">Find Flights</button></div>');
  $('#date').mouseenter(function() {
    $('#date').datepicker();
  });

  $('#choose_btn').on('click', () => {
    if (selected_arri == selected_dept) {
      alert("cannot fly to same place idiot");
    } else if (selected_dept != null && selected_arri != null) {
      console.log("chosen date valid");
      build_flight_interface();
    } else {
      alert("chosen date invalid");
    }
  });

  // departure
  let deptairportcont = $('.collection.dept-with-header');
  let arriairportcont = $('.collection.arri-with-header');

  //Populate Search with Aiports
  $.ajax({
    type: 'GET',
    url: root_url + 'airports',
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      if (response != null) {
        let airports = response;
        console.log('airport data accessed');
        let testairport = airports;
        console.log(testairport);
        console.log(airports);
        for (var i = 0; i < airports.length; i++) {
          console.log(i);
          console.log(airports[i].name);
          let airport_name = airports[i].name;
          console.log(airport_name);
          deptairportcont.append('<li class="collection-item"><a href="#">' + airport_name + '</a></li>');
          arriairportcont.append('<li class="collection-item"><a href="#">' + airport_name + '</a></li>');
        }
      }
    }
  });

  $(".collection.arri-with-header").on("click", ".collection-item", function(e) {
    selected_arri = (e.target.textContent);
    console.log(selected_arri);
    var input = $('#filterInput2');
    input.val(selected_arri);
    var keyword = e.target.textContent;
    console.log(keyword);

    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
        tags: keyword,
        tagmode: "any",
        format: "json"
      },
      function(data) {
        var rnd = Math.floor(Math.random() * data.items.length);
        var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
        $('nav').css('background-image', "url('" + image_src + "')");
      });
  });

  $(".collection.dept-with-header").on("click", ".collection-item", function(e) {
    selected_dept = (e.target.textContent);
    var input = $('#filterInput');
    input.val(selected_dept);
  });

 // Get input element
    let filterInput = document.getElementById('filterInput');
    // Add event listener
    filterInput.addEventListener('keyup', filterNames);

    function filterNames(){
      // Get value of input
      let filterValue = document.getElementById('filterInput').value.toUpperCase();
      // Get names ul
      let ul = document.getElementById('names');
      // Get lis from ul
      let li = ul.querySelectorAll('li.collection-item');
      // Loop through collection-item lis
      for(let i = 0;i < li.length;i++){
        let a = li[i].getElementsByTagName('a')[0];
        // If matched
        if(a.innerHTML.toUpperCase().indexOf(filterValue) > -1){
          li[i].style.display = '';
        } else {
          li[i].style.display = 'none';
        }
      }

    }

     // Get input element
    let filterInput2 = document.getElementById('filterInput2');
    // Add event listener
    filterInput2.addEventListener('keyup', filterNames2);

    function filterNames2(){
      // Get value of input
      let filterValue = document.getElementById('filterInput2').value.toUpperCase();

      // Get names ul
      let ul = document.getElementById('names2');
      // Get lis from ul
      let li = ul.querySelectorAll('li.collection-item');

      // Loop through collection-item lis
      for(let i = 0;i < li.length;i++){
        let a = li[i].getElementsByTagName('a')[0];
        // If matched
        if(a.innerHTML.toUpperCase().indexOf(filterValue) > -1){
          li[i].style.display = '';
        } else {
          li[i].style.display = 'none';
        }
      }

    }

}


var change_pass_btn = function() {
  let body = $('body')
  body.empty();
  body.append('<h1>Change Password</h1>');
  build_navbar();
  body.append('<div id="Newpass_div">User: <input type="text" id="login_user" value="b"><br>Password: <input type="text" id="login_pass" placeholder="Old Password"><br>New Password: <input type="text" id="login_Newpass" placeholder="New Password"><br></br><button id="newPass_btn"> Set New Password</button></div>');

  $('#newPass_btn').on('click', () => {
    let usern = $('#login_user').val();
    let pass = $('#login_pass').val();
    let newPass = $('#login_Newpass').val();

    $.ajax(root_url + 'passwords', {
      type: 'PUT',
      dataType: 'json',
      data: {
        "user": {
          "username": usern,
          "old_password": pass,
          "new_password": newPass
        },
      },
      success: () => {
        alert("Successful Login")
      },
      error: () => {
        alert("Login Failed");
      }
    });
  });
}



$(".collection.arri-with-header").on("click", ".collection-item", function(e) {
  selected_arri = (e.target.textContent);
  console.log('penis');
  var input = $('#filterInput2');
  input.val(selected_arri);

  var keyword = e.target.textContent;
  console.log(keyword);

  $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
      tags: keyword,
      tagmode: "any",
      format: "json"
    },
    function(data) {
      var rnd = Math.floor(Math.random() * data.items.length);
      var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
      $('nav').css('background-image', "url('" + image_src + "')");
    });
});

$(".collection.dept-with-header").on("click", ".collection-item", function(e) {
  selected_dept = (e.target.textContent);
  var input = $('#filterInput');
  input.val(selected_dept);
});

// var queryFlights = function() {
// 	let body = $('body');

// 	if(selected_arri=null) AND (elected_dept!=null):
// 		body.empty();


// };

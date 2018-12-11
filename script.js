var root_url = "http://comp426.cs.unc.edu:3001/";
var selected_dept, selected_arri;
cnt = 0; 
var itineraryTable =  $(`<table id="itinerary"><tr>
  <th onclick="sortTable2(0)" style="cursor:pointer">Name</th>
  <th onclick="sortTable2(1)" style="cursor:pointer">Logistics</th>
  <th onclick="sortTable2(2)" style="cursor:pointer">Flight</th>
  <th onclick="sortTable2(3)" style="cursor:pointer">Confirmation Number</th>
  </tr></table>`);

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
      build_itinerary_interface();
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
  var currentDate = $( "#date" ).val();
  let date = moment(currentDate).format('YYYY-MM-DD')

  body.empty();
  body.append('<h1>Available Flights</h1>');
  build_navbar();

  body.append('<div class="dTitle"><h2>Departure Airport: </h2><p id="departTitle"></p></div>');
  body.append('<div class="aTitle"><h2>Arrival Airport: </h2><p id="arriTitle">Arrival Airport</p></div>');
  document.getElementById("departTitle").innerHTML = selected_dept;
  document.getElementById("arriTitle").innerHTML = selected_arri;

  body.append('<div><input type="text" id="firstname" value="Ketan " placeholder="First Name"><br><input type="text" id="lastname" value="Mayer-Patel" placeholder="Last Name">')

  //make container but make sure to close container and divs
  body.append('<div class="container results-container"><div id="wrapper"></div><div id="under">');
  let flightdetails = $(`<table id="flights"><tr>
  <th onclick="sortTable(0)" style="cursor:pointer">Airline</th>
  <th onclick="sortTable(1)" style="cursor:pointer">Flight Number</th>
  <th onclick="sortTable(2)" style="cursor:pointer">Departure Time</th>
  <th onclick="sortTable(3)" style="cursor:pointer">Arrival Time</th>
  <th onclick="sortTable(4)" style="cursor:pointer">Date</th>
  <th onclick="sortTable(5)" style="cursor:pointer">Book</th>
  </tr></table>`);

  body.append(flightdetails);

  let arri_id = get_airport_id(selected_arri);
  let dept_id = get_airport_id(selected_dept);
  console.log(root_url + 'flights?filter[departure_id]=' + dept_id);
  console.log("final dept_id is: " + get_airport_id(selected_dept));

  $.ajax({
    type: 'GET',
    global: false,
    url: root_url + 'flights?filter[departure_id]=' + dept_id + '?filter[arrival_id]=' + arri_id,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      let resultflights = response;
      let refinedflights = new Array();
      let refinedinstances = new Array();
      console.log(resultflights[0].id)
      for (var i = 0; i < resultflights.length; i++){

        // console.log(resultflights[i].id);
        instances = getInstance(resultflights[i].id,date)
        if(instances.length != 0){
          // console.log('non empty instance :' + instances[0].flight_id)

          // if theres multiple instances
          // for (var k = 0; k > instances.length; k++){}
          refinedflights.push(getFlight(instances[0].flight_id))
          refinedinstances.push(instances[0].id);
          console.log(refinedflights)
        }
      }
      
      
      for (var j = 0; j < refinedflights.length; j++){

        // hour conversion
      let dep_time = new Date(refinedflights[j].departs_at);
      let conv_dep_time = moment(dep_time).format('HH:mm')
      let arr_time = new Date(refinedflights[j].arrives_at);
      let conv_arr_time = moment(arr_time).format('HH:mm')
      let airline = getAirline(refinedflights[j].airline_id)
      let firstName = $('#firstname').val()
      let lastName = $('#lastname').val()
      
      let airlinename = airline.name
        
      $('#flights').append('<tr><td>'  + airlinename
      + '</td><td>' + refinedflights[j].id + '</td><td>' + conv_dep_time + '</td><td>' +
       conv_arr_time + '</td><td>' + date + '</td><td onClick="book(\'' + refinedflights[j].id + '\',\'' + airline.id + '\',\'' + conv_dep_time + '\',\'' + conv_arr_time + '\',\'' + date + '\',\'' + firstName + '\',\'' + lastName + '\',\'' + refinedinstances[j] +'\')"> Book this shit! </td></tr>');     
      }   
    }
  });
}


var book = function(flight_id, airline_id, arrivaltime, departtime, date, fname, lname, instance){
  let firstName = $('#firstname').val();
  let lastName = $('#lastname').val();
  
  if(fname == undefined || lname == undefined){
    return alert('name not specificied');
  } 

  console.log('this shit is booked!:' + flight_id)
  let dept_airport = getAirport(getFlight(flight_id).departure_id);
  let arri_airport = getAirport(getFlight(flight_id).arrival_id);
  let thisairline = getAirline(airline_id);
  let thisflight = getFlight(flight_id);
  let thisinstance = getInstance(flight_id, date)
  let instanceid = getInstanceID(flight_id, date)
  let thisticket = getTicket(thisinstance.id)
  console.log(fname +  lname)
  // postTicket(instanceid, firstName, lastName);

  console.log('this ticket id is : '+ thisticket)
  console.log(thisinstance);
  console.log(instanceid)
  console.log(root_url + 'tickets?filter[instance_id]=' + instanceid)

 
  
  flighttuple = `<tr>
  <td>` + firstName + ' ' + lastName + `</td>
  <td>Departure: ` + dept_airport.name + `<br> Departure Time: ` + departtime + 
  '<br>Arrival: ' + arri_airport.name + `<br>Arrival Time: ` + arrivaltime + `</td>
  <td>` + 'Flight Number: ' + thisairline.name + ' ' + thisflight.number + `</td>
  <td>` + conf[cnt]+ `</td>

  </tr>`
  cnt += 1;
  build_itinerary_interface();
  $('#itinerary').append(flighttuple);
}

var build_itinerary_interface = function(){
  let body = $('body');
  body.empty();
  body.append('<h1>Itinerary</h1>');
  build_navbar();
  body.append('<h3>Your booked flights</h3>');

  body.append(itineraryTable);

  let firstName;
  let lastName;
}

function postTicket(instance_id, fname, lname){
  $.ajax(root_url + "tickets",
  {
    type: 'POST',
    xhrFields: {withCredentials: true},
    data: {
      ticket: {
        instance_id: instance_id,
        first_name: fname,
        last_name: lname
      }
    },
    success: (response) => {
       console.log('added ticket');
      } 
  });

}

function makeItinerary(itinerary_id){
  $.ajax({
    type: 'POST',
    url: root_url + 'itineraries/' + itinerary_id,
    global: false,
    async: false,
    xhrFields: {
      withCredentials: true
    },
    dataType: 'json',
      data: {
        "itinerary": {
          "ticket_id": ticket_id,
          "last_name": lname,
          "is_purchased": true
        },
      },
    success: (response) => {
      itinerary = response;
	    }
  });
}


function getTicket(instance_id){
  let ticket;
  $.ajax({
    type: 'GET',
    url: root_url + 'tickets?filter[instance_id]=' + instance_id,
    global: false,
    async: false,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      ticket = response;
	    }
  });
  return ticket;
}

function getFlight(flight_id){
  let thisflight;
  $.ajax({
    type: 'GET',
    url: root_url + 'flights/' + flight_id,
    global: false,
    async: false,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      thisflight = response;
      // console.log( 'instance results would be :' + instance[0].flight_id.toString());
      // console.log(root_url + 'instances?filter[date]=' + date + '&filter[flight_id]=' + flight_id)
	    }
  });
  return thisflight;
}

function getInstanceID(flight_id, date){
  let instance;
  $.ajax({
    type: 'GET',
    url: root_url + 'instances?filter[date]=' + date + '&filter[flight_id]=' + flight_id,
    global: false,
    async: false,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      instance = response[0].id;
      // console.log( 'instance results would be :' + instance[0].flight_id.toString());
      // console.log(root_url + 'instances?filter[date]=' + date + '&filter[flight_id]=' + flight_id)
	    }
  });
  return instance;
}


function getInstance(flight_id, date){
  let instance;
  $.ajax({
    type: 'GET',
    url: root_url + 'instances?filter[date]=' + date + '&filter[flight_id]=' + flight_id,
    global: false,
    async: false,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      instance = response;
      // console.log( 'instance results would be :' + instance[0].flight_id.toString());
      // console.log(root_url + 'instances?filter[date]=' + date + '&filter[flight_id]=' + flight_id)
	    }
  });
  return instance;
}

function getAirline(airline_id){
  let airline;
  $.ajax({
    type: 'GET',
    url: root_url + 'airlines/' + airline_id,
    global: false,
    async: false,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      airline = response;
	    }
  });
  return airline;
}


function getAirport(paraairportid) {
	let airport_id;
  $.ajax({
    type: 'GET',
    url: root_url + 'airports/' + paraairportid,
    global: false,
    async: false,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      airport_id = response;	
    }
  });
  return airport_id;
}; 

function get_airport_id(airportname) {
	let airport_id = 0;
	console.log('Getting Airport:' + airportname);
  $.ajax({
    type: 'GET',
    url: root_url + 'airports?filter[name]=' + airportname,
    global: false,
    async: false,
    xhrFields: {
      withCredentials: true
    },
    success: (response) => {
      console.log(response[0]);
      airport_id = Number(response[0].id);
      console.log(airportname + 'airport id :' + airport_id);
	
    }
  });
  console.log("result would be" + airport_id);
  return airport_id;
};


function numcheck(num){
	if(!Number.isNaN(num)){
      	console.log('yeah the airport should match up to a number value');
      } else {
      	console.log('this airport id is not a number');
      }
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
  body.append('<nav><li id="1";><a>Book Flight</a></li><li id="2"><a> Itinerary</a></li><li  onClick="change_pass_btn()"><a> Change Password</a></li></nav>');
}


var build_home_interface = function() { 
  let body = $('body')
  body.empty();
  body.append('<h1>Flight API Project</h1>');
  build_navbar();
  body.append('<div class="flicker-api"></div><br><div class="container-flight-container"><div id="wrapper"><div id="left">Departure: <input type="text" id="filterInput" placeholder="Search names..."><ul id="names" class="collection dept-with-header"></ul></div><div id="middle">Arrival: <input type="text" id="filterInput2"  placeholder="Search names..."><ul id="names2" class="collection arri-with-header" class="left-align"></ul></div><div id="right">Date: <input class="calendar" id="date" placeholder="Select date"></div><button id="choose_btn">Find Flights</button></div>');
  $('#date').mouseenter(function() {
    $('#date').datepicker();
  });

  $('#choose_btn').on('click', () => {
    var currentDate = $( ".selector" ).datepicker( "getDate" );
    if (selected_arri == selected_dept) {
      alert("cannot fly to same place idiot");
    } else if (selected_dept != null && selected_arri != null && currentDate != null) {
      console.log("chosen date valid");
      build_flight_interface();
    } else {
      alert("chosen date invalid" + currentDate);
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
        for (var i = 0; i < airports.length; i++) {
          let airport_name = airports[i].name;
          deptairportcont.append('<li class="collection-item"><a href="#"><span>' + airport_name + '</span></a></li>');
          arriairportcont.append('<li class="collection-item"><a href="#"><span>' + airport_name + '</span></a></li>');        }
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

    // flickr api
    $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?", {
        tags: keyword,
        tagmode: "any",
        format: "json"
      },
      function(data) {
        var rnd = Math.floor(Math.random() * data.items.length);
        var image_src = data.items[rnd]['media']['m'].replace("_m", "_b");
        $('.flicker-api').css('background-image', "url('" + image_src + "')");
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
  body.append('<div id="passbackground"><div id="Newpass_div">User: <input type="text" id="login_user" value="b"><br>Password: <input type="text" id="login_pass" placeholder="Old Password"><br>New Password: <input type="text" id="login_Newpass" placeholder="New Password"><br></br><button id="newPass_btn"> Set New Password</button></div></div>');

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


conf = new Array('C42JO', 'S42KO', 'Z20SM', 'Q43JO', 'S10JO', 'L20KD');

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("flights");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
function sortTable2(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("itinerary");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
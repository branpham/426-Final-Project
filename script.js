var root_url = "http://comp426.cs.unc.edu:3001/";

$(document).ready(function(){
  // load AJAX log in information
  $.ajax({
    type: 'POST',
    url: root_url + 'sessions/',
    data: { "user": {
                    "username": 'b',
                    "password": 'password'
                    }
          },
    xhrFields: {withCredentials: true},
    async: true,
    success: (response) => {
    	build_home_interface();
      console.log('POST to sessions was a success');
    }
  });

var build_home_interface = function() {
    let body = $('body');

    body.empty();
    body.append('<nav class="navbar"><a class="navbar-item" id="home">Home</a><a class="navbar-item"></a></nav>');
    body.append("<section class='section header-section'><div class='container header-container'><h1 class='title'>Welcome to Flights API Project</h1><h1 class='subtitle'></h1>");
    body.append();


}


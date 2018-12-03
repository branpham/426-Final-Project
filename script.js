var root_url = "http://comp426.cs.unc.edu:3001/";

$(document).ready(() => {
    // $('#login_btn').on('click', () => {
	
	
	// let user = $('#login_user').val();
	// let pass = $('#login_pass').val();

	// console.log(user);
	// console.log(pass);
	
	$.ajax({
		   type: 'POST',
		   url: root_url + 'sessions/',
		   data: { "user": {
		       "username": 'b',
		       "password": 'password'
		   		}	
		   },
		   xhrFields: {withCredentials: true},
		   success: (response) => {
		       if (response.status) {
			   // build_home_interface();
			   alert('worked');
		       } else {
			   $('#mesg_div').html("Login failed. Try again.");
		       }
		   },
		   error: () => {
		       alert('error');
		   }
		});
	});
// }); 

var build_home_interface = function() {
    let body = $('body');
//poop
    body.empty();
    body.append('<nav class="navbar"><a class="navbar-item" id="home">Home</a><a class="navbar-item"></a></nav>');
    body.append("<section class='section header-section'><div class='container header-container'><h1 class='title'>Welcome to Flights API Project</h1><h1 class='subtitle'></h1>");
    body.append();


}
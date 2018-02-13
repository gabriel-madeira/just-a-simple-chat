
var current_mode = 0;
function switchLogin(mode) {
	if (mode == "login") {
		if (current_mode == 1){
			login();
		}else{
			document.getElementById("btn-login").style.display = "";
			document.getElementById("login-form-div").style.display = "";
			document.getElementById("btn-back").style.display = "";
			document.getElementById("btn-register").style.display = "none";
			document.getElementById("register-form-div").style.display = "none";
			current_mode = 1;
		}
	}
	if (mode == "register") {
		if (current_mode == 2){
			register();
		}else{
			document.getElementById("btn-login").style.display = "none";
			document.getElementById("login-form-div").style.display = "none";
			document.getElementById("btn-back").style.display = "";
			document.getElementById("btn-register").style.display = "";
			document.getElementById("register-form-div").style.display = "";
			current_mode = 2;
		}
		
	}
	if (mode == "back") {
		document.getElementById("btn-login").style.display = "";
		document.getElementById("login-form-div").style.display = "none";
		document.getElementById("btn-back").style.display = "none";
		document.getElementById("btn-register").style.display = "";
		document.getElementById("register-form-div").style.display = "none";
		document.getElementById("error-login").innerHTML = ""
		document.getElementById("id-login").value = "";
		document.getElementById("password-login").value = "";
		document.getElementById("id-register").value = "";
		document.getElementById("password-register").value = "";
		document.getElementById("confirm-password-register").value = "";
		current_mode = 0;
	}
}

function register() {
	if((document.getElementById("id-register").value != "") && (document.getElementById("password-register").value != "") && (document.getElementById("confirm-password-register").value != "")) {
		var id = document.getElementById("id-register").value;
		var password = document.getElementById("password-register").value;
		var confirm_password = document.getElementById("confirm-password-register").value;
		if(password != confirm_password){
			document.getElementById("error-login").innerHTML = "Passwords do not match!";
			setTimeout(function(){ document.getElementById("error-login").innerHTML = "" }, 5000);
		}else{
			if((id.length > 16) || (id.length < 4) || (password.length > 16) || (password.length < 4)) {
				document.getElementById("error-login").innerHTML = "The ID and password must contain between 4 and 16 characters!";
				setTimeout(function(){ document.getElementById("error-login").innerHTML = "" }, 5000);
			}else{
				var dataString = { id: id , password: password , operation: "register" };
				$.ajax({
					type: "post",
					url: "operations.php",
					data: dataString,
					cache: false,
					success: function(html){
						if (html == "ok"){
							checkStatus();
							document.getElementById("id-register").value = "";
							document.getElementById("password-register").value = "";
							document.getElementById("confirm-password-register").value = "";
							current_mode = 0;
						}else if(html == "error"){
							document.getElementById("error-login").innerHTML = "Existing ID!";
							setTimeout(function(){ document.getElementById("error-login").innerHTML = "" }, 5000);
						}
						
					}
				});
			}
			
		}
	}else{
		document.getElementById("error-login").innerHTML = "Fill in all the fields!";
		setTimeout(function(){ document.getElementById("error-login").innerHTML = "" }, 5000);	
	}
	
}

function login() {
	if((document.getElementById("id-login").value != "") && (document.getElementById("password-login").value != "")){
		var id = document.getElementById("id-login").value;
		var password = document.getElementById("password-login").value;
		var dataString = { id: id , password: password , operation: "login" };
		$.ajax({
			type: "post",
			url: "operations.php",
			data: dataString,
			cache: false,
			success: function(html){
				if(html == "ok"){
					checkStatus();
					document.getElementById("id-login").value = "";
					document.getElementById("password-login").value = "";
					current_mode = 0;
				}else if(html == "error"){
					document.getElementById("error-login").innerHTML = "User not found or password incorrect!";
					setTimeout(function(){ document.getElementById("error-login").innerHTML = "" }, 5000);	
				}

				
			}
		});
	}else{
		document.getElementById("error-login").innerHTML = "Fill in ID and Password!";
		setTimeout(function(){ document.getElementById("error-login").innerHTML = "" }, 5000);
	}
	
}

function checkStatus() {
	var dataString = { operation: "checkStatus" };
	$.ajax({
		type: "post",
		url: "operations.php",
		data: dataString,
		cache: false,
		success: function(html){
			var status = html.split("-");
			if(status[0] == "on"){
				document.getElementById("register-login-div").style.display = "none";
				document.getElementById("chat").style.display = "";
				document.getElementById("chat-div").scrollTo(0,document.getElementById("chat-div").scrollHeight);
				document.getElementById("user-id").innerHTML = status[1];
			}else{
				document.getElementById("register-login-div").style.display = "";
				document.getElementById("btn-login").style.display = "";
				document.getElementById("login-form-div").style.display = "none";
				document.getElementById("btn-back").style.display = "none";
				document.getElementById("btn-register").style.display = "";
				document.getElementById("register-form-div").style.display = "none";
				document.getElementById("chat").style.display = "none";
				document.getElementById("id-login").value = "";
				document.getElementById("password-login").value = "";
				document.getElementById("id-register").value = "";
				document.getElementById("password-register").value = "";
				document.getElementById("confirm-password-register").value = "";
				current_mode = 0;
			}
		}
	});
}

function sendMessage() { 
	checkStatus();
	if((document.getElementById("chat-input").value != "") && (document.getElementById("chat-input").value.replace(/ /g, "") != "")) {
		var dataString = { message: document.getElementById("chat-input").value , operation: "sendMessage" };
		$.ajax({
			type: "post",
			url: "operations.php",
			data: dataString,
			cache: false,
			success: function(html){
				document.getElementById("chat-input").value = "";
				refreshChat();
			}
		});	
	} 
	
}

var messages = [];
function refreshChat() { 

	var dataString = { operation: "refreshChat" };
	$.ajax({
		type: "post",
		url: "operations.php",
		data: dataString,
		dataType: "json",
		cache: false,
		success: function(html){
			for (var i = 0; i < html.length; i++) {
				if(messages.find(function(id){ return id == html[i].id}) == undefined) {
					var date = new Date(html[i].date_time + ' UTC');
					//var div1 = html[i].date_time.split(" ");
					//var date_div = div1[0].split("-");
					//var time_div = div1[1].split(":");
					//var date_time = time_div[0]+":"+time_div[1]+" "+date_div[1]+"/"+date_div[2]+"/"+date_div[0];
					var date_time =
					    ("0" + (date.getMonth()+1)).slice(-2) + "/" +
					    ("0" + date.getDate()).slice(-2) + "/" +
					    date.getFullYear() + " " +
					    ("0" + date.getHours()).slice(-2) + ":" +
					    ("0" + date.getMinutes()).slice(-2);
					messages.push(html[i].id);
			    	document.getElementById("chat-div").innerHTML += "<div class='chat-message'>"+html[i].user+": "+html[i].message+"</div><div class='chat-message-time'>"+date_time+"</div>";
					document.getElementById("chat-div").scrollTo(0,document.getElementById("chat-div").scrollHeight);
				}
				
			}
			
		}
	});
}

function userLogout() {
	var dataString = { operation: "userLogout" };
	$.ajax({
		type: "post",
		url: "operations.php",
		data: dataString,
		cache: false,
		success: function(html){
			checkStatus();
		}
	});
}

function textFormat(key) {
    key = (key) ? key : window.event;
    var charCode = (key.which) ? key.which : key.keyCode;
    if ((charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 122) || (charCode >= 65 && charCode <= 90) || charCode == 95 || charCode == 13) {
        return true;
    }
    document.getElementById("error-login").innerHTML = "Available characters: (0-9) (A-Z) (a-z) _";
	setTimeout(function(){ document.getElementById("error-login").innerHTML = "" }, 5000);	
    return false;
}

setInterval(refreshChat, 1000);
setInterval(checkStatus, 60000);

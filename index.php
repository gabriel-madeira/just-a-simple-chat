<!DOCTYPE html>
<html>
	<head>
		<title>Just a Simple Chat</title>
		<link rel="stylesheet" href="css/style.css">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<script src="js/jquery-3.3.1.min.js"></script>
		<script src="js/functions.js"></script>
	</head>
	<body onload="checkStatus(); refreshChat();">
		<div class="title-div">
			<div class="title">Just a Simple Chat v0.1</div> 
		</div>
		
		<div id="register-login-div" class="register-login-div">
			<div id="error-login" class="error-login"></div>
			<div id="login-form-div" class="form-1" style="display: none;">
				<label>ID</label> 
				<input id="id-login" type="text" onkeydown="if (event.keyCode == 13){ switchLogin('login'); }" onkeypress="return textFormat(event);" maxlength="16">
				<label>PASSWORD</label> 
				<input id="password-login" type="password" onkeydown="if (event.keyCode == 13){ switchLogin('login'); }" onkeypress="return textFormat(event);" maxlength="16">
			</div>
			<div id="register-form-div" class="form-1" style="display: none;">
				<label>ID</label> 
				<input id="id-register" type="text" onkeydown="if (event.keyCode == 13){ switchLogin('register'); }" onkeypress="return textFormat(event);" maxlength="16">
				<label>PASSWORD</label> 
				<input id="password-register" type="password" onkeydown="if (event.keyCode == 13){ switchLogin('register'); }" onkeypress="return textFormat(event);" maxlength="16">
				<label>CONFIRM PASSWORD</label> 
				<input id="confirm-password-register" type="password" onkeydown="if (event.keyCode == 13){ switchLogin('register'); }" onkeypress="return textFormat(event);" maxlength="16">
			</div>
			<br>
			<input type="submit" value="LOGIN" id="btn-login" class="btn-1" style="display: none;" onclick="switchLogin('login');">
			<input type="submit" value="REGISTER" id="btn-register" class="btn-1" style="display: none;" onclick="switchLogin('register');">
			<button id="btn-back" class="btn-1" style="display: none;" onclick="switchLogin('back');">BACK</button>
		</div>

		<div id="chat" class="chat" style="display: none;">
			<div id="chat-user" class="chat-user">
				<div id="chat-user-id-logout" class="chat-user-id-logout">User: <span id="user-id"></span> <button id="user-logout" class="btn-2" onclick="userLogout();">LOGOUT</button></div>
			</div>
			<div id="chat-div" class="chat-div">
			</div>
			<div class="chat-div-input">
				<input id="chat-input"  type="text" class="chat-input" onkeydown="if (event.keyCode == 13){ sendMessage(); }" maxlength="500">
			</div>
		</div>
	</body>
</html>
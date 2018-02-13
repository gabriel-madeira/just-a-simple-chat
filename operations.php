<?php 
	$error = 0;
	if(!isset($_POST['operation']) || (($_POST['operation'] != "register") && ($_POST['operation'] != "login") && ($_POST['operation'] != "checkStatus") && ($_POST['operation'] != "sendMessage") && ($_POST['operation'] != "refreshChat") && ($_POST['operation'] != "userLogout"))){
		$error = 1;
	}else{
		if(($_POST['operation'] == "register") || ($_POST['operation'] == "login")){
			if((!isset($_POST['id'])) || (!isset($_POST['password']))){
				$error = 1;
			}else{
				if(((strlen($_POST['id']) || (strlen($_POST['password']))) < 4) || ((strlen($_POST['id']) || (strlen($_POST['password']))) > 16)){
					$error = 1;
				}else{
					if ((preg_match('/[^A-Za-z0-9_]/', $_POST['id']) == 1) || (preg_match('/[^A-Za-z0-9_]/', $_POST['password']) == 1)){
						$error = 1;
					}
				}
			}
		}
		session_start();
		if((($_POST['operation'] == "sendMessage") || ($_POST['operation'] == "refreshChat") || ($_POST['operation'] == "userLogout")) && ($_SESSION["status"] != 1)){
			$error = 1;
		}
		if(($_POST['operation'] == "sendMessage") && !isset($_POST['message'])){
			$error = 1;
		}elseif(($_POST['operation'] == "sendMessage") && isset($_POST['message'])){
			if($_POST['message'] == ""){
				$error = 1;
			}
		}
	}

	if($error == 0){

		$operation = $_POST['operation'];

		$link = @mysqli_connect("localhost", "root", null, "jsc") or die(mysqli_connect_error());
		mysqli_set_charset($link, "utf8") or die(mysqli_error($link));

		if($operation == "register"){
			$id = mysqli_real_escape_string($link, $_POST['id']);
			$result = mysqli_query($link,"SELECT * FROM user WHERE (id = '".$id."'); ");
			if (mysqli_num_rows($result) != 1){
				$password = mysqli_real_escape_string($link, $_POST['password']);
				$sql = "INSERT INTO user (id, password)
		            VALUES ('".$id."','".md5($password)."')";
				mysqli_query ($link, $sql);

				$_SESSION["id"] = $id;
				$_SESSION["password"] = md5($password);
				$_SESSION["status"] = "1";
				echo "ok";
			}else{
				echo "error";
			}
		}

		if($operation == "login"){
			$id = mysqli_real_escape_string($link, $_POST['id']);
			$password = mysqli_real_escape_string($link, $_POST['password']);

			$result = mysqli_query($link,"SELECT * FROM user WHERE (id = '".$id."') AND (password = '".md5($password)."'); ");
			if (mysqli_num_rows($result) == 1){
				echo "ok";
				
				$_SESSION["id"] = $id;
				$_SESSION["password"] = md5($password);
				$_SESSION["status"] = "1";

			}else{
				echo "error";
			}
		}

		if($operation == "checkStatus"){

			if((!isset($_SESSION["status"])) || ($_SESSION["status"] == "0")){
				echo "off-null";
			}elseif((isset($_SESSION["status"])) && ($_SESSION["status"] == "1")){
				if((isset($_SESSION["id"])) && (isset($_SESSION["password"]))){
					$result = mysqli_query($link,"SELECT * FROM user WHERE (id = '".$_SESSION["id"]."') AND (password = '".$_SESSION["password"]."'); ");
					if (mysqli_num_rows($result) == 1){
						echo "on-".$_SESSION["id"];
					}else{
						echo "off-null";
						$_SESSION["id"] = "";
						$_SESSION["password"] = "";
						$_SESSION["status"] = "0";
					}
				}else{
					echo "off-null";
					$_SESSION["status"] = "0";
				}
				
			}
		}

		if($operation == "sendMessage"){
			//date_default_timezone_set("America/Sao_Paulo");
			$message = mysqli_real_escape_string($link, $_POST['message']);
			$sql = "INSERT INTO message (content, date_time, room, user)
	            VALUES ('".$message."', '".date("Y-m-d H:i:s")."', '0', '".$_SESSION["id"]."')";
			mysqli_query ($link, $sql);

		}

		if($operation == "refreshChat"){
			$result = mysqli_query($link,"SELECT * FROM message WHERE room = 0 ");

			while($row = mysqli_fetch_assoc($result)){
				$table_data[]= array("id"=>$row['id'], "message"=>htmlentities($row['content']), "date_time"=>$row['date_time'], "user"=>$row['user']);
			}
			echo json_encode($table_data);
		}

		if($operation == "userLogout"){

			$_SESSION["id"] = "";
			$_SESSION["password"] = "";
			$_SESSION["status"] = "0";
		}

		
		mysqli_close($link);
	}

	

?>
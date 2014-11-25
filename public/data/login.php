<?php
require_once('config.php'); 

$secret = SECRET;
$tokenSeed = TOKEN_SEED;

$postdata = file_get_contents("php://input");
$arrPostData = json_decode($postdata);

$message = "";
$token = "";
$result = false;
  
  
// Create connection
$con=mysqli_connect(HOST,DB_USER,DB_PASS,"homebrew");

// Check connection
if (mysqli_connect_errno()){ 
  $message = "Failed to connect to MySQL: " . mysqli_connect_error();
}
else{
  //Connection OK. Get username and password hash
  $username = $arrPostData->username;

  $query = "SELECT password FROM users WHERE username = '".$username."'";
  $sqlResult = mysqli_query($con,$query);

  while($row = mysqli_fetch_array($sqlResult)) {
    $passwordHash = $row['password'];
  }
  
  if($passwordHash == sha1($arrPostData->password . $secret)){
    $message = "OK";
    $token = sha1($username . $tokenSeed . $secret . time());
    $result = true;
    
    $query = "UPDATE users SET last_login = '".time()."', token = '".$token."' WHERE username = '".$username."'";
    $sqlResult = mysqli_query($con,$query);
  }
  else{
    $message = "Mismatch";
  }

}

mysqli_close($con);



header('Content-Type: application/json');
$arrResponse = Array("result"=>$result, "message"=>$message, "token"=>$token);
echo json_encode($arrResponse);

?>
<?php
require_once('config.php');

$postdata = file_get_contents("php://input");

$arrPostData = json_decode($postdata);
if($arrPostData->username === null || $arrPostData->data === null || $arrPostData->recipeName === null || $arrPostData->token === null)
{
  exit;
}
$username = $arrPostData->username;
$id = $arrPostData->data->commonValues->id;

$data = json_encode($arrPostData->data);
$recipeName = $arrPostData->recipeName;
$token = $arrPostData->token;
    
$message = "";
$result = false;
$tokenValid = true;
$code = 0;

// Create connection
$con=mysqli_connect(HOST,DB_USER,DB_PASS,"homebrew");

// Check connection
if (mysqli_connect_errno()){ 
  $message = "Failed to connect to MySQL: " . mysqli_connect_error();
}
else{

  //Check token
  $query = "SELECT token, last_login FROM users WHERE username = '".$username."'";
  $sqlResult = mysqli_query($con,$query);
  
  while($row = mysqli_fetch_array($sqlResult)) {
    $dbToken = $row['token'];
    $lastLogin = $row['last_login'];
    
    if($dbToken !== $token){
      $tokenValid = false;
      $message = "Token invalid";
      $code = 202;
    }
    
    if($lastLogin + TOKEN_EXPIRY < time()){
      $tokenValid = false;
      $message = "Token expired";
      $code = 201;
    }
  }
  
  if($tokenValid)
  {

    //$query = "SELECT id FROM recipes WHERE username = '".$username."' AND recipe_name = '".$recipeName."'";
    $query = "SELECT id FROM recipes WHERE username = '".$username."' AND id = '".$id."'";
    $sqlResult = mysqli_query($con,$query);
  
    $id = null;
    while($row = mysqli_fetch_array($sqlResult)) {
      $id = $row['id'];
    }
    if($id){
      //Recipe exists in DB already
      $query = "UPDATE recipes SET username='".$username."', data='".$data."', recipe_name='".$recipeName."' WHERE id = ".$id."";
      $sqlResult = mysqli_query($con,$query);
    }
    else{
      $query = "INSERT INTO recipes (username, data, recipe_name) VALUES ('".$username."', '".$data."', '".$recipeName."') ";
      $sqlResult = mysqli_query($con,$query);
      $id = mysqli_insert_id($con);
    }

    

    if($sqlResult){
      $message = "Save complete";
      $result = true;
    }
    else{
      $message = "Database write failed";
      $code = 202;
    }
    
  }

}

mysqli_close($con);


header('Content-Type: application/json');
$arrResponse = Array("result"=>$result, "message"=>$message, "code"=>$code, "id"=>$id);
echo json_encode($arrResponse);
?>
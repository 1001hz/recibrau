<?php
require_once('config.php');

function query($query){
  $success = false;
  $sqlResult = null;
  $message = "";
  
  
  // Create connection
  $con=mysqli_connect(HOST,DB_USER,DB_PASS,"homebrew");

  // Check connection
  if (mysqli_connect_errno()){ 
    $message = "Failed to connect to MySQL: " . mysqli_connect_error();
  }
  else{
    $sqlResult = mysqli_query($con,$query);
    $success = true;
  }
  
  mysqli_close($con);
  
  return Array("sqlResult"=>$sqlResult, "success"=>$success, "message"=>$message);

}

?>
<?php
require_once('config.php');
require_once('database_helper.php');

function isLoggedIn($objPostData){
  $loggedIn = false;
  if($objPostData->token !== null && $objPostData->username)
  {
    $query = "SELECT token, last_login FROM users WHERE username = '".$objPostData->username."'";
    $sqlResult = query($query);
    
    if($sqlResult["success"]){
      while($row = mysqli_fetch_array($sqlResult["sqlResult"])) {
        $dbToken = $row['token'];
        $lastLogin = $row['last_login'];
    
        if($lastLogin + TOKEN_EXPIRY < time()){
          $tokenValid = false;
          $message = "Token expired";
          $code = 201;
        }
        else if($dbToken !== $objPostData->token){
          $tokenValid = false;
          $message = "Token invalid";
          $code = 202;
        }
        else{
          $tokenValid = true;
          $message = "Token OK";
          $code = 0;
          $loggedIn = true;
        }
      }
    }
  }
  return Array("loggedIn"=>$loggedIn, "code"=>$code, "message"=>$message, "tokenValid"=>$tokenValid);
}
?>
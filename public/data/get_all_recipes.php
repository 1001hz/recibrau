<?php
try{
  require_once('config.php');
  require_once('authentication_helper.php');
  require_once('database_helper.php');

  $result = Array();
  $message = "";
  $code = -1;

  $postdata = file_get_contents("php://input");
  $objPostData = json_decode($postdata);

  $loginResponse = isLoggedIn($objPostData);
  if($loginResponse["loggedIn"]){
    $query = "SELECT recipe_name, updated, id FROM recipes WHERE username = '".$objPostData->username."'";
    $sqlResult = query($query);
    if($sqlResult["success"]){
      while($row = mysqli_fetch_array($sqlResult["sqlResult"])) {
        $date = new DateTime($row['updated']);
        $resultParts = Array('name'=>$row['recipe_name'], 'updated'=>$date->format('d/m/Y'), 'id'=>$row['id']);
        array_push($result, $resultParts);
      }
      $message = "Results OK";
      $code = 0;
    }
    
  }
  else{
    $message = $loginResponse["message"];
    $code = $loginResponse["code"];
  }

}
catch(Exception $e){
  $message = $e->getMessage();
}

header('Content-Type: application/json');
$arrResponse = Array("result"=>$result, "message"=>$message, "code"=>$code);
echo json_encode($arrResponse);

?>
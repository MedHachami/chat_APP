<?php

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");

  // Respond with a 200 OK status
  http_response_code(200);
  exit;
}

  require_once '../app/bootstrap.php';

  // Init Core Library
  $init = new Core;
 
  
?>
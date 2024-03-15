<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
error_reporting(E_ALL);
require_once '../app/SocketServer.php';
require_once '../vendor/autoload.php';
require_once '../app/controllers/Chat.php';
require_once '../app/config/config.php';

spl_autoload_register(function($className){
    require_once '../app/libraries/' . $className . '.php';
  });

 $server = new SocketServer();
 $server->run();
//  echo "running server";  
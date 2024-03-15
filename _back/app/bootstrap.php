<?php
  // Load Config
  require_once 'config/config.php';

  
  require_once 'middleware/AuthMiddleware.php';
  require_once 'models/JwtAuth.php';
  require_once 'SocketServer.php';

  require_once '../vendor/autoload.php';

 

  // Autoload Core Libraries
  spl_autoload_register(function($className){
    require_once 'libraries/' . $className . '.php';
  });
  
?>
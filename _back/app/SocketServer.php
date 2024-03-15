<?php

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;


#[\AllowDynamicProperties]

Class SocketServer{

    public function __construct(){
        echo "running on";
    }

     public function run()
    {
        $server = IoServer::factory(
            new HttpServer(
                new WsServer(
                    new Chat()
                )
            ),
            8081
        );

        echo "WebSocket server started at 0.0.0.0:8081\n";

        $server->run();
    }
}
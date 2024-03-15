<?php

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
require_once  dirname(dirname(__FILE__)) . "\libraries\Controller.php" ;

class Chat extends Controller implements MessageComponentInterface
{
    protected $clients;
    protected $rooms;

    protected $userModel;


    public function __construct()
    {
        $this->clients = new \SplObjectStorage();
        $this->userModel = $this->model('User');

    }

    public function onOpen(ConnectionInterface $conn )
    {

        $this->clients->attach($conn);
        $conn->send(json_encode(["resourceId" => $conn->resourceId]));
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = json_decode($msg, true);

        if($data == null){
            return;
        }
        $room = $data['room'];
        $userId = isset($data['user_id']) ? $data['user_id'] : null;
        $type = isset($data['type']) ? $data['type'] : null;


        if (!empty($room)) {
            switch ($data['type']) {
                case 'join':
                    $this->joinRoom($from, $room);
                    break;
                case 'msg':
                    $this->broadcastToRoom($data , $from);
                     $this->userModel->addNewMessageToRoom($data);

                    break;

                default:
                    # code...
                    break;
            }

        }



    }


    function broadcastToRoom($data ,$sender){
        $ressourceId = $data['ressourceId'];
        $userId = $data['user_id'];
        $room = $data['room'];
        $content = $data['content'];
        $user_img = $data['user_img'];
        $encodedMessage = json_encode(
            [
            'ressourceId'=>$ressourceId,
            'content' => $content,
             'room' => $room,
              'user_id'=>$userId,
              'type'=>'msg',
                'user_img'=>$user_img,
            ]);

        foreach ($this->rooms[$room] as $client) {
            if ($client !== $sender) {
                echo "Broadcasting to room: $room, Sender: $sender->resourceId, Recipient: $client->resourceId\n";
                $client->send($encodedMessage);
            }
        }²      

    }

    protected function joinRoom(ConnectionInterface $conn, $room)
    {
        if (!isset($this->rooms[$room])) {
            $this->rooms[$room] = new \SplObjectStorage();
        }

        $this->rooms[$room]->attach($conn);


        $numClients = count($this->rooms[$room]);
        echo "Client {$conn->resourceId} joined room {$room}. Total clients in room: {$numClients}\n";
    }


    protected function leaveRoom(ConnectionInterface $conn, $room)
    {
        $this->rooms[$room]->detach($conn);
        if ($this->rooms[$room]->count() === 0) {
            unset($this->rooms[$room]);
        }
    }


    public function onClose(ConnectionInterface $conn)
    {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";

        // Remove the client from all rooms
        foreach ($this->rooms as $room => $clients) {
            $this->rooms[$room]->detach($conn);

            // If there are no more clients in the room, remove the room
            if ($this->rooms[$room]->count() === 0) {
                unset($this->rooms[$room]);
            }
        }
    }

    public function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }




}

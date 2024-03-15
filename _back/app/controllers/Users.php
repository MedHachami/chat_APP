<?php

Class Users extends Controller{
    private $userModel;
    public function __construct()
    {
       $this->userModel = $this->model('User');
      

    }
    public function index()
    {
        echo json_encode("hello");
    }

    public function register(){
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // $postData = file_get_contents("php://input");
            // $data = json_decode($postData, true);
            
            
            if (!empty($_POST['email']) && !empty($_POST['full_name']) && !empty($_POST['password'])&& isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                // var_dump($_FILES['image']);
                $data = [
                    'email'=>trim($_POST['email']),
                    'full_name'=>trim($_POST['full_name']),
                    'password'=>trim($_POST['password']),

                ];
                // print_r($data);
                $emailExist = $this->userModel->findUserByEmail($data['email']);
                if($emailExist){
                    echo json_encode(["message_1"=>"Email already exists"]);
                }else{
                    
                    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

                    
                    if (in_array($_FILES['image']['type'], $allowedTypes)) {
                    
                        $imagePath = $this->uploadImage($_FILES['image']);
                        $data['image'] = $imagePath;
                        if($imagePath){
                            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
                            $registerUser = $this->userModel->register($data);
                            if($registerUser){
                                $token = JwtAuth::createToken(
                                    [
                                        'email' =>$data['email'] ,
                                        'full_name' =>$data['full_name'],
                                        // 'image_url' =>$data['image'],
                                    
                                    ]);
                                echo json_encode(['message_2' => 'You registered successfully']);
                            }
                        }
                    } else {
                        echo json_encode('Invalid file type. Please upload a JPEG, PNG, or GIF image.');
                    }
                
                }     
            } else {
                http_response_code(400); 
                echo json_encode(['error' => 'Invalid JSON payload']);
            }
           
            
        }
    }

    public function login(){
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $postData = file_get_contents("php://input");
            $data = json_decode($postData, true);
            if ($data !== null) {
                // var_dump($data);
                $chekUser = $this->userModel->findUserByEmail($data['email']);
                if($chekUser){
                    $logUser = $this->userModel->login($data['email'] , $data['password']);
                    if($logUser){
                        // var_dump($logUser);
                        // die();
                        $token = JwtAuth::createToken(
                            $logUser);
                        echo json_encode(['token' => $token]);
                    }else{
                        echo json_encode(["message"=>"Email or password is incorrect"]);
                    }
                }else{
                    echo json_encode(["message"=>"Email or password is incorrect"]);
                }
            }
            else {
               
                http_response_code(400); 
                echo json_encode(['error' => 'Invalid JSON payload']);
            }
        }
        
    }


    private function uploadImage($file) {
        $target_dir = APPROOT . "/../public/store/";
        $target_file = $target_dir . basename($file["name"]);
    
        // Ensure the directory exists, create it if not
        if (!is_dir($target_dir)) {
            mkdir($target_dir, 0755, true);
        }
    
        move_uploaded_file($file["tmp_name"], $target_file);
        return basename($file["name"]);
    }

    

    public function filter($filterBy , $userId){
        AuthMiddleware::authenticate();
        switch (true) {
            case ($filterBy == 'all') :
                $users = $this->userModel->getNormalUser($userId);
                echo json_encode($users);
            break;
            case ($filterBy == 'already') :
                $users = $this->userModel->getAlreadySentRequest($userId);
                echo json_encode($users);
            break;
            case ($filterBy == 'myfriends') :
                $users = $this->userModel->getMyFriends($userId);
                echo json_encode($users);
            break;

      }
    }

    public function userSendRequest($userId){
        AuthMiddleware::authenticate();
        $users = $this->userModel->getuserSendRequest($userId);
        echo json_encode($users);
    }

    public function userRooms($userId){
        // AuthMiddleware::authenticate();
        $rooms = $this->userModel->getUserRooms($userId);
        echo json_encode($rooms);
    }



    public function acceptRequest($senderId, $revceiverId){
        AuthMiddleware::authenticate();
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $accepted  = $this->userModel->accepting($senderId , $revceiverId);
            if($accepted){
                echo json_encode(['message' => true]);
            }else{
                echo json_encode(['message' => false]);
            }
        }
    }

    public function declineRequest($senderId, $revceiverId){
        AuthMiddleware::authenticate();
        if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $declined  = $this->userModel->declining($senderId , $revceiverId);
            if($declined){
                echo json_encode(['message' => true]);
            }else{
                echo json_encode(['message' => false]);
            }
        }
    }

    public function sendRequest($senderId,$reveiverId){
        AuthMiddleware::authenticate();
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $newFriendShip = $this->userModel->addFriendShip($senderId,$reveiverId);
            if($newFriendShip){
                echo json_encode(['message' => true]);
            }else{
                echo json_encode(['message' => false]);
            }
        }

    }

    public function chatMessage($roomId){
        // AuthMiddleware::authenticate();
        $messages = $this->userModel->getMessages($roomId);
        echo json_encode($messages);

    }


}
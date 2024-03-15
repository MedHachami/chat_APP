
const profileImg = localStorage.getItem("image");
const id = localStorage.getItem("id");
const fullName = localStorage.getItem("fullName");
const token = localStorage.getItem('token');

function hasToken() {
    const token = localStorage.getItem('token');
    return token !== null && token !== undefined;
}
function isTokenExpired() {
    const token = localStorage.getItem('token');
    const decodedToken = decodeJWT(token);

    return decodedToken && decodedToken.exp && decodedToken.exp * 1000 < Date.now();
}


function redirectToLogin() {
    window.location.href = 'login.html';
}


if (!hasToken() || isTokenExpired()) {
    redirectToLogin();
}

function logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('image');
    window.location.href = '/login.html';
}

function decodeJWT(token) {
    
    const [header, payload, signature] = token.split('.');
    const decodedPayload = JSON.parse(atob(payload));
  
    
    return decodedPayload;
}



function generateSideBar() {
    
    return `
    
    <div class="menu mt-48 flex-col ">
        <a  class="min-h-16 block py-10 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black" href="/">
            <span class="inline-block align-text-bottom mr-2">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-8 h-8"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            </span>
            
        </a>
        <a class="min-h-16 block py-10 px-12 border-l-4 border-gray-800 bg-gray-300 text-black hover:bg-gray-300 hover:text-black" href="../Chat.html">
            <span class="inline-block align-text-bottom mr-2">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-8 h-8"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </span>
            
        </a>
        
        <a class="min-h-16 mb-20 block py-10 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black" href="../friend-request.html">
            <img src="../assets/friend-request-icon.png" alt="" srcset="">  
            <span class="bg-red-700 w-10 h-10w-10 p-2 text-black relative bottom-6 left-8 rounded-3xl" id="rqtSent"></span>
        </a>
        <a class="mt-16 py-10 px-12 ">
            <img src="${imgStore}${profileImg}" class="w-16 h-16 relative left-7 rounded-xl" alt="" srcset="">  
        </a>
        <a class=" min-h-16 block py-10 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black" onclick="logOut()">
            <img src="../assets/logout-icon.png" alt="" srcset="">  
        </a>
    </div>
    

  
    `;
}
// inject the navbar 
document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    
    if (sidebar) {
        sidebar.innerHTML = generateSideBar();
    }   
});
const apiUrl = "http://localhost/med_hachami_chat/";
const imgStore = "http://localhost/med_Hachami_chat/public/store/";
const  ws = new WebSocket('ws://localhost:8081');




const connectWebSocket = () => {
    return new Promise((resolve) => {
        ws.addEventListener('open', (event) => {
            console.log('WebSocket connection opened:', event);

            ws.addEventListener('message', (response) => {
                
                const data = JSON.parse(response.data);
                if(data.resourceId){
                    ressourceId = data.resourceId;
                    localStorage.setItem("resourceId",ressourceId)
                    resolve(); 
                }
                
            });
        });
    });
};


connectWebSocket().then(() => {
    
});

// enter inside the room
let display = false
function openRoom(room) {
    localStorage.setItem("openedRoom",room);
    
    let chat1 = document.querySelector(".chat-area1");
    let chat2 = document.querySelector(".chat-area2");
    
        chat1.classList.add("hidden");
        chat2.classList.remove("hidden");
   
        dislFetchedMessage(room);
    
    
        
    
    //displaying the chat interface
    let ressourceid = localStorage.getItem("resourceId");
    if (!ressourceid) {
        console.error('Ressource ID is not available');
        return;
    }

    const message = {
        "ressourceId": ressourceid,
        "room": room,
        "type": "join",
    }
    
    ws.send(JSON.stringify(message));
  
}
let room = localStorage.getItem('openedRoom');

// send message to the room
function sendMessage(){
    let messageInput = document.getElementById("message");
    let content =messageInput.value; 
    let ressourceid = localStorage.getItem("resourceId");
    const message = {
        "ressourceId":ressourceid,
        "sender_id":id,
        "receiver_id":"",
        "room": room,
        "type":"msg",
        "content":content,
        "user_img":profileImg,
    }
    console.log(message);
   ws.send(JSON.stringify(message));
   displayMessage(message);
   messageInput.value = '';

}
ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    // console.log(message);
    displayMessage(message);
    
});
// {content: 'heyyy', room: 'salma_med', sentBy: 467, type: 'msg'}
function displayMessage(message) {
    const msgSentByMeContainer = document.getElementById("msgContainer");
            const right = `
                <div class="message me mb-4 flex text-right">
                <div class="flex-1 px-2" id="msgSentByMeContainer">
                    <div class="flex-1 px-2">
                    <div class="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700">
                        <span>${message.content}</span>
                    </div>
                    <div class="pl-4"><small class="text-gray-500">15 April</small></div>
                    </div>
                </div>
            </div>
    
    `
    const left = `
        <div class="message mb-4 flex" id="msgSentByRoomMatesContainer">
        <div class="message me mb-4 flex text-left">
            <div class="flex-2">
                <div class="w-12 h-12 relative">
                    <img class="w-12 h-12 rounded-full mx-auto" src="${imgStore}${message.user_img}" alt="chat-user" id="userImg" />
                    <span class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                </div>
            </div>
            <div class="flex-1 px-2" id="msgSentByMeContainer">
                <div class="flex-1 px-2">
                <div class="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700">
                    <span>${message.content}.</span>
                </div>
                <div class="pl-4"><small class="text-gray-500">15 April</small></div>
                </div>
            </div>  
        </div>
    </div>

    `
    if(message.type === 'msg'  ){
        if(message.user_id == id){
            
            msgSentByMeContainer.innerHTML += right;

        }else{
        
        msgSentByMeContainer.innerHTML += left;
        }
    }

}
function dislFetchedMessage(room){
    console.log("isnide display");
    fetch(`${apiUrl}` + 'Users/chatMessage/'+`${room}` ,{
        method: 'GET',
        headers: {
            'Authorization': token, 
            'Content-Type': 'application/json'
        }
        })
    .then(response => response.json())
    .then(data => {
        let messages = data;
        console.log(messages);
        const msgSentByMeContainer = document.getElementById("chatContainer");
        msgSentByMeContainer.innerHTML ="";
    
        messages.forEach(message => {
                        
    
            if(message.senderId == id){
                const right = `
                    <div class="message me mb-4 flex text-right">
                    <div class="flex-1 px-2" >
                        <div class="flex-1 px-2">
                        <div class="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700">
                            <span>${message.content}</span>
                        </div>
                        <div class="pl-4"><small class="text-gray-500">15 April</small></div>
                        </div>
                    </div>
                </div>
        
            `
            msgSentByMeContainer.innerHTML += right;
            }else{
                const left = `
                <div class="message mb-4 flex" >
                <div class="message me mb-4 flex text-left">
                    <div class="flex-2">
                        <div class="w-12 h-12 relative">
                            <img class="w-12 h-12 rounded-full mx-auto" src="${imgStore}${message.senderImg}" alt="chat-user" id="userImg" />
                            <span class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                        </div>
                    </div>
                    <div class="flex-1 px-2" id="msgSentByMeContainer">
                        <div class="flex-1 px-2">
                        <div class="inline-block bg-gray-300 rounded-full p-2 px-6 text-gray-700">
                            <span>${message.content}.</span>
                        </div>
                        <div class="pl-4"><small class="text-gray-500">15 April</small></div>
                        </div>
                    </div>  
                </div>
            </div>
    
            `
            msgSentByMeContainer.innerHTML += left;
               
            }
            
           
        });
         
        let  chatDiv = `
       
        
                                       <div class="messages flex-1 " id="msgContainer">
                                           
                                       </div>
                                       <div class="flex-2 pt-4 pb-10">
                                           <div class="write bg-white shadow flex rounded-lg">
                                               <div class="flex-3 flex content-center items-center text-center p-4 pr-0">
                                                   <span class="block text-center text-gray-400 hover:text-gray-800">
                                                       <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" class="h-6 w-6"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                   </span>
                                               </div>
                                               <div class="flex-1">
                                                   <textarea id="message" name="message" class="w-full block outline-none py-4 px-4 bg-transparent" rows="1" placeholder="Type a message..." autofocus></textarea>
                                               </div>
                                               <div class="flex-2 w-32 p-2 flex content-center items-center">
                                                   <div class="flex-1 text-center">
                                                       <span class="text-gray-400 hover:text-gray-800">
                                                           <span class="inline-block align-text-bottom">
                                                               <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor" viewBox="0 0 24 24" class="w-6 h-6"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                                           </span>
                                                       </span>
                                                   </div>
                                                   <div class="flex-1">
                                                       <button class="bg-blue-400 w-10 h-10 rounded-full inline-block" onclick="sendMessage()">
                                                           <span class="inline-block align-text-bottom">
                                                               <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4 text-white"><path d="M5 13l4 4L19 7"></path></svg>
                                                           </span>
                                                       </button>
                                                   </div>
                                               </div>
                                           </div>
                                       </div>
                                   
       
       
       `
       chatContainer.innerHTML += chatDiv;
        

        
    })
    .catch(error => {
        
        console.error('Error:', error);
    });
   
}








fetch(`${apiUrl}` + 'Users/userSendRequest/'+`${id}` ,{
    method: 'GET',
    headers: {
        'Authorization': token, 
        'Content-Type': 'application/json'
    }
    })
  .then(response => response.json())
  .then(data => {
    
    userSendRequest = data;
    let rqtSent = document.getElementById("rqtSent");
    userSendRequest.length>0
     ? rqtSent.textContent = userSendRequest.length
     : rqtSent.style.display = "none";
    
  })
  .catch(error => {
    
    console.error('Error:', error);
  });

  /// fetch roooms

document.addEventListener('DOMContentLoaded',()=>{
    
    fetch(`${apiUrl}` + 'Users/userRooms/' + `${id}` ,{
        method: 'GET',
        headers: {
            'Authorization': token, 
            'Content-Type': 'application/json'
        }
        })
      .then(response => response.json())
      .then(data => {
        rooms = data;
        
        const roomConatiner = document.getElementById("roomConatiner");
        
        const roomItem = rooms.map((room) => {
           
           return (
                `
                <div class="entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md" data-room-id="false" onclick="openRoom('${room.roomId}')">
                    <div class="flex-2">
                        <div class="w-12 h-12 relative">
                            <img class="w-12 h-12 rounded-full mx-auto" src="${imgStore}${room.userImg_in_room}" alt="chat-user" />
                            <span class="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                        </div>
                    </div>
                    <div class="flex-1 px-2">
                        <div class="truncate w-32"><span class="text-gray-800">${room.userName_in_room}${room.roomId}</span></div>
                        <div><small class="text-gray-600">Yea, Sure!</small></div>
                    </div>
                    <div class="flex-2 text-right">
                        <div><small class="text-gray-500">15 April</small></div>
                        <div>
                            <small class="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                                23
                            </small>
                        </div>
                    </div>
                </div>
    
                `
           ) 
        });
    
        roomConatiner.innerHTML = roomItem;

        
       
      })
      .catch(error => {
        
        console.error('Error:', error);
      });

});

  
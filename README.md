# SocketIOMathsGameV1.01

# Introduction
This is a basic multiplayer game that demonstrates the use of node to create a web server and utilizes socket.io. This is the library that
allows communication (both ways) between the node web server and the client (users web browser).

# The game logic
- This game is very simple, the first player to correctly answer 10 questions wins. When a user answers a question correctly, then a new
question is created and displayed to all players. When a new user joins the game they wait until there are enough players to start the game. Currently the number of players required to start the game is 2. Therefore when there are two players the waiting screen disapears and the game begins. 

- When the user submits an answer, it is sent to the node server. The node server then compares the subitted answer against the actual answer that has been calculated in the baclground. If the answer is correct then the users score is increased by 1 and a new question is displayed to al players. If the user answers the question incorrectly then their score remains the same and the question is not updated.

# The use of Socket.io
- This is a library that is extremelly useful as it allows for communication between the client and the server with little work needed by the programmer to set it up. Furthermore it minimizes lag time so makes real time multiplayer games possible. See code for setup including installation of socket.io using the npm (node package manager) 

- There are essentialy two components to the communication:

- Firstly there are emits. An emit is a sending of information. The emit has two components, a label that identifies the emit and there is the data that is actually being transmitted (this data could be an array, a string etc.)

- Secondly there are the listeners. A listener listens for an emit. It is important to understand that the lister only listens for a particular emit with a given label. When the emit with this listener is transmitted from the node server, the data sent in the emit is recieved by the listener.

- There are two types of emit messages that the node server can use. Firstly there are emits that are transmitted to all connected users and look like this: io.sockets.emit(label, data). Secondly there are emits that are transmitted to one specific user and look like this:
socket.emit(label, data).

- When it is a emit to one user, you may be confused as to how the server knows which user to send the emit to. When a new socket connection is established, a socket object unique to that user is created and can be passed into a function:

io.sockets.on('connection', function(socket){
...
}

- As long as your socket.emit(label, data) is declared within the function body above, then the emit will be sent to that specific user  identified by this socket.

# The use of Node js




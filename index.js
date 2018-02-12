// Contains node js code

// Function that will serve the page.HTML to the users on connection
// The function sends the page.HTML to the browser

//var handler = function(req, res) {
//	fs.readFile('./page.html', function (err, data) {
//	    if(err) throw err;
//	    res.writeHead(200);
//		res.end(data);
//	});
//}

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var Moniker = require('moniker');

// Now define the main variables of the application and
// start the http server

app.get('/', function(req,res) {
	res.sendFile(__dirname + '/page.HTML');
});
server.listen(process.env.PORT || 8080);
console.log('aok');

// You can test game here...

// Communication with client side

io.sockets.on('connection', function(socket){
	// Given a new connection...
	console.log("Successful Connection!");

	var user = addUser();
	updateWidth();
	socket.emit("Welcome", user);
	socket.on('disconnect', function(){
		removeUser(user);
	});

	
	

	// This event is triggered when a user submits an answer and contains a conditional to check is the answer submitted
	// is correct
	socket.on('mathAnswer', function(data) {

		console.log(data);

		if(data == Gl_ans){
			user.score +=1;
			io.sockets.emit("corr_ans", { message: "<strong>" + user.name + "</strong> got it correct!" } );
			updateQuestion();
			
		};


		// First user to answer 10 questions correctly wins the game
		if(user.score == 10){
			io.sockets.emit("gameWon", { message: "<strong>" + user.name + "</strong> won the game!" });

		};

		updateUsers();

	});

});

// What happens in the above connection code
// When a new user visits the game, a listener is added
// The socket object passed in is for that specific user
// Therefore to send something to this user only you would use socket.emit
// Then a new user object is created through the calling of the addUser() function which will hold the username of the user and the number of clicks
// for that user
// There is a disconnect event that is fired when the user closes the tab or window
// There is a click event which is fired when the user clicks on the green block on the front end
// io.sockets.emit is used to broadcast a message to all the users in the game


// Initialise variables that will hold the games state
var initialWidth = 50;
var currentWidth = initialWidth;
var winWidth = 600;
var users = [];
var Gl_ans = 0;



// Function for adding a new user to the game
var addUser = function() {
		var user = {
		name: Moniker.choose(),
		clicks: 0,
		score: 0
	}
	
	users.push(user);
	updateUsers();

	// Start Game When 5 players have joined
	if(users.length == 2){


		// The code to start a game in a chatroom like environment can go here 
		// Game logic and variables for those two players may have to be put in a function that is called 'inside'
		// the chatroom like environment and then the outer users.length could be reset to 0 for the next two players to
		// join and so on


	startGame();
	//updateQuestion();
}

	return user;
};

// Function to remove a user from the game when they have disconnnected
var removeUser = function(user){
	for(var i=0; i<users.length; i++){
		// Iterate through list of users until correct user is identified...
		if(user.name === users[i].name){
			// Removing user entry from list of users...
			users.splice(i,1);
			console.log("User: " + user.name + " has left the game");
			updateUsers();
			
		};
	};

	if(users.length == 1){
		
	endGame();
	return;
};


// Check for when there is only one user left in the game when all other users have closed or in some other 
// way exited the game



};

// Function to update every user in the game of various changes in the state of the game
var updateUsers = function(){
	var str = '';
	var gUsers = [];
	for(var i=0; i<users.length; i++){
		var user = users[i];
		str += user.name + ' (' + user.clicks + ' clicks)' + ' (' + user.score + ' score)';
		gUsers.push(user.name);
		gUsers.push(user.score);
		console.log("..." + user.score);
	};
	// Broadcast all the user names of the users that are in the game to all of the users
	//io.sockets.emit("users", {users: str});
	io.sockets.emit("users", {users: gUsers});
}

// Function to update all users with the current width of the div
var updateWidth = function() {
	io.sockets.emit("update", {currentWidth: currentWidth});
}

// What happens in the above functions

// The addUser function creates a new user with a unique random name and appends it to the array called users
// The removeUser function removes a given user form the array called users
// The updateUsers function sends a string containing a list of all the current users in the game
// The updateWidth function sends the current width of the div to all the current users in the game


// This function generate a simple random maths question that contains either a +, -, * or / operation
// The function also calculates the correct answer so that it can be compared with users so that we know
// when the user has achieved the correct answer and update the game state accordingly
function updateQuestion(){
	console.log("");
	var a = Math.floor(Math.random() * 10) + 1;
	var b = Math.floor(Math.random() * 10) + 1;
	var op = ["*", "+", "/", "-"];
	var opChoice = [Math.floor(Math.random()*4)]
	var answer = eval(a + op[opChoice] + b);
	console.log("How much is " + a + " " + op[opChoice] + " " + b + "?");
	console.log(answer);
	Gl_ans = answer;
	io.sockets.emit("newQuestion", "How much is " + a + " " + op[opChoice] + " " + b + "?");
}

// The function emits a message informing all users that the game has started which causes users 
// loading screens to dissapear and for the first question to be displayed
function startGame(){
	io.sockets.emit("gameStarted", true);
	updateQuestion();
}

function endGame(){
	console.log("endGame() is called");
	io.sockets.emit("gameEnded", true);
}
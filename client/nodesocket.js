function NodeSocket(game) {
	this.ws = null;
	this.game = game;
	this.connect();
	return this;
};

NodeSocket.prototype.connect = function() {
	console.log('trying to connect ...');
	this.ws = new WebSocket("ws://localhost:8080/defense");
	var socket = this;
	this.ws.onmessage = function(e) { socket.onmessage(e); };
	this.ws.onclose   = function(e) { socket.onclose(e); };
	this.ws.onopen    = function(e) { socket.onopen(e); };
};

NodeSocket.prototype.onopen = function() {
	console.log('Connection Opened!');
	this.ws.send('START');
};

NodeSocket.prototype.onclose = function() {
	console.log('Connection Closed!');
};

NodeSocket.prototype.onmessage = function(e) {
	var jsonData = JSON.parse(e.data);
	// var jsonData = e.data;
	// console.log('Connection OnMessage!');
	// console.log(jsonData);
	// console.log(jsonData[0]);
	// console.log(typeof(jsonData));
	var action  = jsonData.method;
	var data    = jsonData.args;
	console.log(jsonData);
	console.log(action);
	console.log(data);
	if (this.game.nodeHandlers[action]) {
		this.game.nodeHandlers[action](data);
	} else {
		console.log('handler not found');
	};
};

// NodeSocket.prototype.handlers = {
// 	pong: function(data) {
// 		console.log('data', data);
//   }
// };

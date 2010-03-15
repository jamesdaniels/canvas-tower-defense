function NodeSocket(game) {
	this.ws = null;
	this.game = game;
	this.connect();
	return this;
};

NodeSocket.prototype.connect = function() {
	console.log('trying to connect ...');
	this.ws = new WebSocket("ws://localhost:8080/defense");
	this.ws.onmessage = function() { this.onmessage; };
	this.ws.onclose   = function() { this.onclose; };
	this.ws.onopen    = function() { this.onopen; };
};

NodeSocket.prototype.onopen = function() {
	console.log('Connection Opened!', this.ws);
	this.ws.send('OPEN');
};

NodeSocket.prototype.onclose = function() {
	console.log('Connection Closed!', this.ws);
	this.ws.send('CLOSE');
};

NodeSocket.prototype.onmessage = function(e) {
	console.log('Connection OnMessage!', this.ws);
	var jsonData = JSON.parse(e.data);
	console.log(jsonData);
	// var action  = jsonData[0];
	// var data    = jsonData[1];
	// if (this.handlers[action]) {
	// 	this.handlers[action](data);
	// } else {
	// 	console.log('handler not found');
	// };
};

NodeSocket.prototype.handlers = {
	pong: function(data) {
		console.log('data', data);
  }
};

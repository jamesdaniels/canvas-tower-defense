function NodeSocket(game) {
	this.ws = null;
	this.game = game;
	this.connect();
	return this;
};

NodeSocket.prototype.connect = function() {
	console.log('trying to connect ...');
	this.ws = new WebSocket("ws://localhost:8080/towerdefense");
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
	var json = JSON.parse(e.data);
	var action  = json.action;
	var data    = json.args;
	if (this.game.nodeHandlers[action]) {
		this.game.nodeHandlers[action].apply(this.game, Array(data));
	} else {
		console.log('handler not found');
	};
};
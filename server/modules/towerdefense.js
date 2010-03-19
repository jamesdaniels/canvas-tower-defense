
// ----------------------------------------------------------------------------
// connection: 
// is the instance of websocket::Connection
// data: 
// is received JSON encoded, it should be parsed before use
// ----------------------------------------------------------------------------
	
var logger = require('../log');

var Enemy     = require('../../client/enemy').Enemy;
var Tower     = require('../../client/tower').Tower;
var GameState = require('../../client/game-state').GameState;
var ServerHandler = require('../../client/serverHandler').ServerHandler;

var Module = this.Module = function(data, connection){
	this.server = null;
	this.game_state = new GameState();
	this.server_handler = new ServerHandler(this.game_state);
};

Module.prototype.onData = function(data, connection){
  this.server = connection.server;
	if (typeof(this.server.connections) == "undefined") {
    this.server.connections    = [];
    this.server.nextIdToAssign = 0;
  };
	switch (data) {
		case 'START':
			logger.store('START CONNECTION');
			this.addConnection(connection);
			var that = this;
			function gameLoop() {
				that.broadcast({"action": "spawn_enemy", "args": null});
			};
			setInterval(gameLoop, 2000);
			break;
		default:
			var json_data = JSON.parse(data);
			if (this.server_handler[json_data.action](json_data.args))
				this.broadcast(json_data);
	};
};

Module.prototype.broadcast = function(data) {
	var json = JSON.stringify(data);
	this.server.connections.forEach(function(connection) {
		connection.send(json);
	});
};

Module.prototype.addConnection = function(connection) {
	this.server.connections.push(connection);
	connection.id = this.server.nextIdToAssign++;
};

Module.prototype.removeConnection = function(connection) {
	var position = this.server.connections.indexOf(connection);
	if (position) { this.server.connections.splice(position,1); };
};

Module.prototype.onDisconnect = function(connection){
	this.removeConnection(connection);
};
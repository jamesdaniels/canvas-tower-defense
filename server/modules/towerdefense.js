
// ----------------------------------------------------------------------------
// connection: 
// is the instance of websocket::Connection
// data: 
// is received JSON encoded, it should be parsed before use
// ----------------------------------------------------------------------------
	
var logger = require('../log');

var Module = this.Module = function(data, connection){
	this.server = null;
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
			break;
		default:
			logger.store(data);
			this.broadcast(JSON.parse(data));
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
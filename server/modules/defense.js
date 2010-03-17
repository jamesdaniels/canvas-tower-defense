
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
	// var data = JSON.parse(data);
	// logger.store("~~~~~~");
	logger.store(data);
	// logger.store(JSON.parse(data));
	// logger.store(JSON.stringify(data));
	// logger.store("~~~~~~");
	switch (data) {
		case 'START':
			this.addConnection(connection);
			break;
		default:
			this.broadcast(data);
	};
};

Module.prototype.broadcast = function(data) {
	logger.store(data);
	var data = JSON.stringify(data)
	this.server.connections.forEach(function(connection) {
		connection.send(data);
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
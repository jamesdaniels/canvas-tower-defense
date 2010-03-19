try {
	var Enemy = require('./enemy').Enemy;
} catch(e) {}

function ServerHandler(state) {
	this.state = state;
	return this;
};

ServerHandler.prototype.place_tower = function(coordinates) {
	this.state.place_tower( coordinates );
	var xy = this.state.spawn_point;
	if ((new Enemy(this.state, xy[0], xy[1])).path) {
		return true;
	} else {
		this.state.remove_tower( coordinates );
		return false;
	}
};

ServerHandler.prototype.remove_tower = function(coordinates) {
	if (this.state.has_tower(coordinates)) {
		this.state.remove_tower(coordinates);
		return true;
	} else {
		return false;
	}
};

try {
	exports.ServerHandler = ServerHandler;
} catch(e) {}
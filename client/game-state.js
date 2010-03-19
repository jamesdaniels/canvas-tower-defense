try {
	var Tower = require('./tower').Tower;
	var Enemy = require('./enemy').Enemy;
} catch(e) {}

function GameState() {
	this.towers  = [];
	this.enemies = [];
	
	this.spawn_point = [0, 9];
	this.exit_point  = [19, 9];
	this.dimensions  = [20, 20];
	
	this.init();
	return this;
};

GameState.prototype.has_tower = function(xy) {
	return (this.towers[xy[0]][xy[1]] != null);
};

GameState.prototype.has_enemy = function(xy) {
	return (this.enemies.filter(function(e) {return e.x == xy[0] && e.y == xy[1]}).length > 0);
}

GameState.prototype.init = function() {
	for (var x = 0; x < this.dimensions[0]; x++) {
		this.towers[x] = [];
		for (var y = 0; y < this.dimensions[1]; y++) {
			this.towers[x][y] = null;
		};
	};
};

GameState.prototype.spawn_enemy = function() {
	var xy = this.spawn_point;
	this.enemies = this.enemies.filter(function(e) {return e.in_play;});
	this.enemies.push(new Enemy(this, xy[0], xy[1]));
	return true;
};

GameState.prototype.place_tower = function(xy) {
	if (this.has_tower(xy)) {
		return false;
	} else {
		this.towers[xy[0]][xy[1]] = new Tower(this, xy[0], xy[1]);
		return true;
	};
};

GameState.prototype.remove_tower = function(xy) {
	if (this.has_tower(xy)) {
		this.towers[xy[0]][xy[1]] = null;
		return true;
	} else {
		return false;
	};
};

try {
	exports.GameState = GameState;
} catch(e) {}
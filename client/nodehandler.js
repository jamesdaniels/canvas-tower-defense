function NodeHandler(game) {
	this.game = game;
	return this;
};

NodeHandler.prototype.place_tower = function(coordinates) {
	this.game.state.place_tower( coordinates );
	this.game.state.enemies.forEach(function(e) {e.recalculate_path();});
	var xy = this.game.state.spawn_point;
	if (this.game.state.enemies.every(function(e) {return e.new_path;}) && (new Enemy(this.game.state, xy[0], xy[1])).path) {
		console.log('Placed tower at ' + coordinates[0] + ',' + coordinates[1]);
		this.game.state.enemies.forEach(function(e) {e.commit_path();});
	} else {
		console.log('ILLEGAL MOVE!');
		this.game.state.remove_tower( coordinates );
	}
	this.game.update_controls();
};

NodeHandler.prototype.remove_tower = function(coordinates) {
	this.game.state.remove_tower(coordinates);
	this.game.update_controls();
};

NodeHandler.prototype.spawn_enemy = function() {
	this.game.state.spawn_enemy();
};
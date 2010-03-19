function NodeHandler(game) {
	this.game = game;
	return this;
};

NodeHandler.prototype.placeTower = function(data) {
	this.game.board.placeTower(data);
	this.game.state.enemies.forEach(function(e) {e.recalculate_path();});
	if (this.game.state.enemies.every(function(e) {return e.new_path;}) && (new Enemy(this.game.board)).path) {
		console.log('Placed tower at ' + data[0] + ',' + data[1]);
		this.game.state.enemies.forEach(function(e) {e.commit_path();});
	} else {
		console.log('ILLEGAL MOVE!');
		this.game.board.removeTower(data);
	};
};

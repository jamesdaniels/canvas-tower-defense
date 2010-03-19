function Game() {
	this.node    = new NodeSocket(this);
	this.board   = new Board(this, 15);
	this.score   = 0;
	this.element = $('content');
	this.state   = new GameState();
	this.init();
	return this;
};

Game.prototype.inc_score = function() {
	this.score += 1;
	if (this.score == 10) console.log('You lose!');
};

Game.prototype.sync_state = function() {
}

Game.prototype.update_controls = function() {
	document.getElementById('build_tower'  ).disabled =  this.board.tower_at(this.board.selected);
	document.getElementById('sell_tower'   ).disabled = !this.board.tower_at(this.board.selected);
}

Game.prototype.init = function() {
	var game = this;
	this.board.generateHTML(this.element);
	document.onclick = function(e) { game.triggerSelected(e); };
	setInterval("game.board.draw()", 100);
	setInterval("game.spawnEnemy()", 2000);
};

Game.prototype.spawnEnemy = function() {
	this.board.spawnEnemy();
};

Game.prototype.triggerSelected = function(e) {
	if (this.board.setSelected( this.board.translateXY(e.pageX, e.pageY) ))
		this.update_controls();
};

Game.prototype.placeTower = function() {
	var coordinates = this.board.selected;
	this.board.placeTower( coordinates );
	this.state.enemies.forEach(function(e) {e.recalculate_path();});
	if (this.state.enemies.every(function(e) {return e.new_path;}) && (new Enemy(this.board)).path) {
		console.log('Placed tower at ' + coordinates[0] + ',' + coordinates[1]);
		this.state.enemies.forEach(function(e) {e.commit_path();});
	} else {
		console.log('ILLEGAL MOVE!');
		this.board.removeTower( coordinates );
	}
	this.update_controls();
};

Game.prototype.removeTower = function() {
	this.board.removeTower(this.board.selected);
	this.update_controls();
};


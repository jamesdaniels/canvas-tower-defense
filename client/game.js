function Game() {
	this.node    = new NodeSocket(this);
	this.board   = new Board(15);
	this.score   = 0;
	this.element = $('content');
	this.init();
	return this;
};

Game.prototype.inc_score = function() {
	this.score += 1;
	// if (this.score == 10) alert('You lose!');
};

Game.prototype.init = function() {
	var game = this;
	this.board.generateHTML(this.element);
	document.onmousemove = function(e) { game.mouseMove(e); };
	document.onclick     = function(e) { game.placeTower(e); };
	// game.board.draw();
	// game.spawnEnemy();
	// setInterval("game.board.draw()", 66);
	// setInterval("game.spawnEnemy()", 2000);
};

Game.prototype.spawnEnemy = function() {
	this.board.spawnEnemy();
};

Game.prototype.mouseMove = function(e) {
	this.board.setSelected( this.board.translateXY(e.pageX, e.pageY) );
};

Game.prototype.placeTower = function(e) {
	this.board.placeTower( this.board.translateXY(e.pageX, e.pageY) );
};


function Game() {
	this.node    = new NodeSocket(this);
	this.board   = new Board(15);
	this.enemies = [];
	this.score   = 0;
	this.element = $('content');
	this.init();
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
	setInterval("game.draw()", 66);
	setInterval("game.newEnemy()", 2000);
};

Game.prototype.draw = function() {
	this.board.clear();
	this.board.generateGrid();
	for (var x = 0; x < this.enemies.length; x++) {
		this.enemies[x].move();
		this.enemies[x].draw(this.board.ctx);
	};
	this.enemies = this.enemies.filter(inPlay);
};

Game.prototype.newEnemy = function() {
	this.enemies.push(new Enemy());
};

Game.prototype.mouseMove = function(e) {
	this.board.set_selected( this.board.translateXY(e.pageX, e.pageY) );
};

Game.prototype.placeTower = function(e) {
	this.board.place_tower( this.board.translateXY(e.pageX, e.pageY) );
};


function Enemy(board) {
	this.board   = board;
	this.x       = 30;
	this.y       = 218;
	this.speed   = 5;
	this.in_play = true;
	return this;
};

Enemy.prototype.draw = function(ctx) {
	ctx.beginPath();
	ctx.fillStyle = '#ffffff';
	ctx.arc(this.x, this.y, 3, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
};

Enemy.prototype.move = function() {
	this.x += this.speed;
	if (this.board.exit_point.compare(this.board.translateXY(this.x, this.y))) {
		console.log('out of play!');
		this.board.game.inc_score();
		this.in_play = false;
	};
};

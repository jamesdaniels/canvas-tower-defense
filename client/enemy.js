var Enemy = function() {
	this.x = 30;
	this.y = 218;
	this.speed = 5;
	this.in_play = true;
	
	this.draw = function() {
		game.board.ctx.beginPath();
		game.board.ctx.fillStyle = '#ffffff';
		game.board.ctx.arc(this.x, this.y, 3, 0, Math.PI*2, true);
		game.board.ctx.closePath();
		game.board.ctx.fill();
	};
	
	this.move = function() {
		this.x += this.speed;
		if (game.board.exit_point.compare(translateXY(this.x, this.y))) {
			console.log('out of play!');
			game.inc_score();
			this.in_play = false;
		};
	};
};
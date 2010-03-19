function Tower(board, x, y) {
	this.board   = board;
	this.x       = x;
	this.y       = y;
	this.angle   = 0;
	this.in_play = true;
	return this;
};

Tower.prototype.draw = function(ctx) {
	console.log('object');
	ctx.beginPath();
	ctx.fillStyle = '#000000';
	ctx.arc(this.x, this.y, 3, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
};

Tower.prototype.move = function() {
	if (this.angle < 360) {
		this.angle += 1;	
	} else { 
		this.angle = 0;
	}
};

try {
	exports.Tower = Tower;
} catch(e) {}
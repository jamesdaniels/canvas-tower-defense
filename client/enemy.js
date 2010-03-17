function Enemy(board) {
	this.board   = board;
	this.x       = this.board.spawn_point[0];
	this.y       = this.board.spawn_point[1];
	this.path    = [];
	this.speed   = 5;
	this.in_play = true;
	this.recalculate_path();
	return this;
};

Enemy.prototype.draw = function(ctx) {
	//ctx.beginPath();
	//ctx.fillStyle = '#ffffff';
	//ctx.arc(this.x, this.y, 3, 0, Math.PI*2, true);
	//ctx.closePath();
	//ctx.fill();
};

Enemy.prototype.move = function() {
	//this.x += this.speed;
	//if (this.board.exit_point.compare(this.board.translateXY(this.x, this.y))) {
	//	console.log('out of play!');
	//	this.board.game.inc_score();
	//	this.in_play = false;
	//};
	new_location = this.path.pop();
	if (new_location) {
		this.x = new_location[0];
		this.y = new_location[1];
	} else {
		this.in_play = false;
	}
};

Enemy.prototype.recalculate_path = function() {
	var current = [this.x, this.y];
	this.path = this.path_to(current, this.board.exit_point).slice(1).reverse();
};

Enemy.prototype.path_to = function(from, to) {
	var directions = [[1,0], [0,-1], [-1, 0], [0, 1]];
	if (from[1] % 2 == 0)
		directions.concat([[-1,-1], [-1, 1]]);
	else
		directions.concat([[1,1], [1, -1]]);
	var paths = [[from]];
	var seen = [from];
	if (from.compare(to)) {
		return path;
	} else {
		while (paths.length > 0) {
			var new_paths = [];
			for (var x = 0; x < paths.length; x++) {
				var start = paths[x][paths[x].length-1];
				for (var i = 0; i < directions.length; i++) {
					var new_point = [start[0]+directions[i][0], start[1]+directions[i][1]];
					if (new_point[0] >= 0 && new_point[1] >= 0 && new_point[0] < 20 && new_point[1] < 20) {
						if (this.board.game.state.towers[new_point[1]] == undefined || this.board.game.state.towers[new_point[1]][new_point[0]] == undefined) {
							if (seen.filter(function(e) {return e.compare(new_point)}).length == 0) {
								seen.push(new_point);
								var new_path = paths[x].slice(0);
								new_path.push(new_point);
								if (new_point.compare(to)) {
									return new_path;
								}
								new_paths.push(new_path);
							}
						}
					}
				}
			}
			paths = new_paths.splice(0);
		}
		return false;
	}
}

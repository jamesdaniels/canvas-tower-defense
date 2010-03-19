function Enemy(board, x, y) {
	this.board   = board;
	this.x       = x;
	this.y       = y;
	this.path    = [];
	this.new_path = [];
	this.speed   = 5;
	this.in_play = true;
	this.recalculate_path();
	this.commit_path();
	return this;
};

Enemy.prototype.move = function() {
	if (this.path) {
		new_location = this.path.pop();
		if (new_location) {
			this.x = new_location[0];
			this.y = new_location[1];
		} else {
			this.in_play = false;
		}
	};
};

Enemy.prototype.recalculate_path = function() {
	var current = [this.x, this.y];
	this.new_path = this.path_to(current, this.board.exit_point);
	if (this.new_path != false)
		this.new_path = this.new_path.reverse();
};

Enemy.prototype.commit_path = function() {
	this.path = this.new_path;
};

Enemy.prototype.path_to = function(from, to) {
	var directions = [
		[[1,0], [0,-1], [-1, 0], [0, 1], [-1,-1], [-1, 1]],
		[[1,0], [0,-1], [-1, 0], [0, 1], [ 1, 1], [1, -1]]
	];
	var paths = [[from]];
	var seen = [from];
	if (from.compare(to)) {
		return [[to]];
	} else {
		while (paths.length > 0) {
			var new_paths = [];
			for (var x = 0; x < paths.length; x++) {
				var start = paths[x][paths[x].length-1];
				for (var i = 0; i < directions[0].length; i++) {
					var new_point = [start[0]+directions[start[1] % 2][i][0], start[1]+directions[start[1] % 2][i][1]];
					if (new_point[0] >= 0 && new_point[1] >= 0 && new_point[0] < 20 && new_point[1] < 20) {
						if (!this.board.has_tower(new_point)) {
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

try {
exports.Enemy = Enemy;
} catch(e) {}
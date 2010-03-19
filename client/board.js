function Board(game, radius) {
	this.game        = game;
	this.width       = document.body.clientWidth;
	this.height      = document.body.clientHeight;
	this.center      = [Math.floor(this.width/2), Math.floor(this.height/2)];
	this.ctx         = null;
	this.canvas_id   = 'canvas';
	this.radius      = radius;
	this.cell_height = Math.sin(1/12*Math.PI)*radius*2;
	this.cell_hwidth = Math.cos(1/12*Math.PI)*radius*0.92;
	this.selected    = [-1,-1];
	this.spawn_point = [0, 9];
	this.exit_point  = [19, 9];
	this.dimensions  = [20, 20];
};

Board.prototype.tower_at = function(coordinates) {
	return (this.game.state.towers[coordinates[1]] != undefined && 
	        this.game.state.towers[coordinates[1]][coordinates[0]] != undefined && 
	        this.game.state.towers[coordinates[1]][coordinates[0]] != null);
};

Board.prototype.spawnEnemy = function() {
	this.game.state.enemies.push(new Enemy(this));
	this.game.sync_state();
};

Board.prototype.placeTower = function(coordinates) {
	var x = coordinates[0];
	var y = coordinates[1];
	if (!(!!this.game.state.towers[y])) {
		this.game.state.towers[y] = [];
	};
	if (this.game.state.towers[y][x] == undefined || this.game.state.towers[y][x] == null) {
		this.game.state.towers[y][x] = new Tower(this, x, y);
	} else {
		console.log('cannot placeTower: ', this.game.state.towers[y][x]);
	};
};

Board.prototype.removeTower = function(coordinates) {
	var x = coordinates[0];
	var y = coordinates[1];
	if (!(!!this.game.state.towers[y])) {
		return false;
	};
	if (this.game.state.towers[y][x] != undefined && this.game.state.towers[y][x] != null) {
		this.game.state.towers[y][x] = null;
		return true;
	} else {
		return false;
	};
};

Board.prototype.color = function(x, y) {
	if (this.spawn_point.compare([x, y])) {
		return [0, 255, 0];
	} else if (this.exit_point.compare([x, y])) {
		return [0, 0, 255];
	} else if (this.selected.compare([x, y])) {
		return [255, 0, 0];
	} else if (this.game.state.towers[y] != undefined && this.game.state.towers[y][x] != undefined) {
		return [255, 255, 255];
	} else {
		if (this.game.state.enemies.filter(function(e) {return e.x == x && e.y == y}).length > 0) {
			return [255, 255, 0];
		} else {
			return [40, 40, 40];
		}
	};
};

Board.prototype.generateHTML = function(parent) {
	parent.innerHTML = '<canvas id="' + this.canvas_id + '" width="' + this.width + '" height="' + this.height + '"></canvas>';
	this.ctx = $(this.canvas_id).getContext("2d");
};

Board.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

Board.prototype.setSelected = function(new_val) {
	if (new_val[0] >= 0 && new_val[1] >= 0 && new_val[0] < this.dimensions[0] && new_val[1] < this.dimensions[1]) {
		this.selected = new_val;
		return true;
	} else {
		return false;
	}
};

Board.prototype.draw = function() {
	this.clear();
	this.drawGrid();
	this.drawSprites();
};

Board.prototype.drawSprites = function() {
	for (var x = 0; x < this.game.state.enemies.length; x++) {
		this.game.state.enemies[x].move();
		this.game.state.enemies[x].draw(this.ctx);
	};
	this.game.state.enemies = this.game.state.enemies.filter(inPlay);
	// TODO: draw and update towers here
};

// grid related ---------------------------------------------------------------

Board.prototype.drawGrid = function() {
	var r = this.radius;
	var h = this.cell_height;
	var w = this.cell_hwidth;
	
	for (var x = 0; x < this.dimensions[0]; x++) {
		for (var y = 0; y < this.dimensions[1]; y++) {
			this.drawHex(w+x*(2*w)+(y%2*w), w+y*(h+r), r, this.color(x,y));
		}
	}
};

Board.prototype.drawHex = function(x, y, r, color) {
	this.ctx.beginPath();
	this.ctx.fillStyle = 'rgb('+color[0]+', '+color[1]+', '+color[2]+')';
	this.ctx.moveTo(x+Math.cos(0.5*Math.PI)*r, y+Math.sin(0.5*Math.PI)*r);
	for (var v = 1; v < 7; v++) {
		this.ctx.lineTo(x+Math.cos((v/3+0.5)*Math.PI)*r, y+Math.sin((v/3+0.5)*Math.PI)*r); 
	}
	this.ctx.fill();
};

Board.prototype.translateXY = function(x, y) {
	//pseudo Code!!!
	var sectX    = x / (2 * this.cell_hwidth);
	var sectY    = y / (this.cell_height + this.radius);
	var sectPxlX = x % (2 * this.cell_hwidth);
	var sectPxlY = y % (this.cell_height + this.radius);
	var m        = this.cell_height / this.radius;
	var arrayX   = 0;
	var arrayY   = 0;

	if (Math.floor(sectY % 2) == 1) {
		// B type
		//pseudo Code!!!
		// right side
		if (sectPxlX  >= this.radius) {
		  if (sectPxlY < (2 * this.cell_height - sectPxlX * m)) {
		    arrayY = sectY - 1;
		    arrayX = sectX;
		  } else {
		    arrayY = sectY;
		    arrayX = sectX;
		  }
		} else {
		  if (sectPxlY < (sectPxlX * m)) {
		    arrayY = sectY - 1;
		    arrayX = sectX;   
		  } else {
		    arrayY = sectY;
		    arrayX = sectX - 1;
		  }
		}
	} else {
		// A type
		//pseudo Code!!!
		// middle
		arrayY = sectY;
		arrayX = sectX;
		// left Edge
		if (sectPxlY < (this.cell_height - sectPxlX * m)) {
		  arrayY = sectY - 1;
		  arrayX = sectX - 1;
		} else if (sectPxlY < (-1*this.cell_height + sectPxlX * m)) {
		  arrayY = sectY - 1;
		  arrayX = sectX;
		}
	}
	
	return [Math.floor(arrayX), Math.floor(arrayY)];
};

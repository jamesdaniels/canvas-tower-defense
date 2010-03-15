function Board(radius) {
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
	this.towers      = [];
};

Board.prototype.place_tower = function(coordinates) {
	var x = coordinates[0];
	var y = coordinates[1];
	if (!(!!this.towers[y])) {
		this.towers[y] = [];
	};
	this.towers[y][x] = 'a';
};

Board.prototype.color = function(x, y) {
	if (this.spawn_point.compare([x, y])) {
		return [0, 255, 0];
	} else if (this.exit_point.compare([x, y])) {
		return [0, 0, 255];
	} else if (this.selected.compare([x, y])) {
		return [255, 0, 0];
	} else if (this.towers[y] != undefined && this.towers[y][x] != undefined) {
		return [255, 255, 255];
	} else {
		return [40, 40, 40];
	};
};

Board.prototype.generateHTML = function(parent) {
	parent.innerHTML = '<canvas id="'+this.canvas_id+'" width="'+this.width+'" height="'+this.height+'"></canvas>';
	this.ctx = $(this.canvas_id).getContext("2d");
};

Board.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

Board.prototype.set_selected = function(new_val) {
	this.selected = new_val;
};

Board.prototype.generateGrid = function() {
	var s = this.radius;
	var h = this.cell_height;
	var r = this.cell_hwidth;
	
	for (var x = 0; x < 20; x++) {
		for (var y = 0; y < 20; y++) {
			this.drawHex(r+x*(2*r)+(y%2*r), r+y*(h+s), s, this.color(x,y));
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

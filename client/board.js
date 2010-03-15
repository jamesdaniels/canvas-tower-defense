var Board = function(radius) {
	this.width = document.body.clientWidth;
	this.height = document.body.clientHeight;
	this.center = [Math.floor(this.width/2), Math.floor(this.height/2)];
	this.ctx = null;
	this.canvas_id = 'canvas';
	this.radius = radius;
	this.cell_height = Math.sin(1/12*Math.PI)*radius*2;
	this.cell_hwidth = Math.cos(1/12*Math.PI)*radius*0.92;
	this.selected = [-1,-1];
	this.spawn_point = [0, 9];
	this.exit_point = [19, 9];
	this.towers = [];
	//this.game_state = new GameState;
	
	this.place_tower = function(coordinates) {
		var x = coordinates[0];
		var y = coordinates[1];
		if (!(!!this.towers[y])) {
			this.towers[y] = [];
		}
		this.towers[y][x] = 'a';
	};
	
	this.color = function(x,y) {
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
	
	this.generateHTML = function(parent) {
		parent.innerHTML = '<canvas id="'+this.canvas_id+'" width="'+this.width+'" height="'+this.height+'"></canvas>';
		this.ctx = $(this.canvas_id).getContext("2d");
	};
	
	this.clear = function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	};
	
	this.set_selected = function(new_val) {
		this.selected = new_val;
	};
	
	this.generateGrid = function() {
		var s = this.radius;
		var h = this.cell_height;
		var r = this.cell_hwidth;
		
		for (var x = 0; x < 20; x++) {
			for (var y = 0; y < 20; y++) {
				this.drawHex(r+x*(2*r)+(y%2*r), r+y*(h+s), s, this.color(x,y));
			}
		}
	};
	
	this.drawHex = function(x, y, r, color) {
		this.ctx.beginPath();
		this.ctx.fillStyle = 'rgb('+color[0]+', '+color[1]+', '+color[2]+')';
		this.ctx.moveTo(x+Math.cos(0.5*Math.PI)*r, y+Math.sin(0.5*Math.PI)*r);
		for (var v = 1; v < 7; v++) {
			this.ctx.lineTo(x+Math.cos((v/3+0.5)*Math.PI)*r, y+Math.sin((v/3+0.5)*Math.PI)*r); 
		}
		this.ctx.fill();
	};
};
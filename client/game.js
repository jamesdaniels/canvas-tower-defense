var Game = function() {
	this.board = new Board(15);
	this.score = 0;
	
	this.inc_score = function() {
		this.score += 1;
		if (this.score == 10) {
			alert('You lose!');
		}
	}
	
	this.init = function(parent) {
		this.board.generateHTML(parent);
	};
};

function draw() {
	game.board.clear();
	game.board.generateGrid();
	for (var x = 0; x < enemies.length; x++) {
		enemies[x].move();
		enemies[x].draw();
	}
	enemies = enemies.filter(inPlay);
}

function inPlay(object) {
	return object.in_play;
}

function $(id) {
	return document.getElementById(id);
};

var game = null;
var enemies = [];	

function init() {
	game = new Game();
	game.init($('content'));
	document.onmousemove = mouseMove;
	document.onclick = placeTower;
	setInterval(draw, 10);
	setInterval(newEnemy, 2000);
	return true
};

function newEnemy() {
	enemies.push(new Enemy());
}

function mouseMove(e) {
	game.board.set_selected( translateXY(e.pageX, e.pageY) );
}

function placeTower(e) {                        
	game.board.place_tower( translateXY(e.pageX, e.pageY) );
}

function translateXY(x, y) {
	
	//pseudo Code!!!
	var sectX = x / (2 * game.board.cell_hwidth);
	var sectY = y / (game.board.cell_height + game.board.radius);
	var sectPxlX = x % (2 * game.board.cell_hwidth);
	var sectPxlY = y % (game.board.cell_height + game.board.radius);
    
	var m = game.board.cell_height / game.board.radius;

	var arrayX = 0;
	var arrayY = 0;

	if (Math.floor(sectY % 2) == 1) {
		// B type
		//pseudo Code!!!
		// right side
		if (sectPxlX  >= game.board.radius) {
		  if (sectPxlY < (2 * game.board.cell_height - sectPxlX * m)) {
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
		if (sectPxlY < (game.board.cell_height - sectPxlX * m)) {
		  arrayY = sectY - 1;
		  arrayX = sectX - 1;
		} else if (sectPxlY < (-1*game.board.cell_height + sectPxlX * m)) {
		  arrayY = sectY - 1;
		  arrayX = sectX;
		}
	}
	
	return [Math.floor(arrayX), Math.floor(arrayY)];
};
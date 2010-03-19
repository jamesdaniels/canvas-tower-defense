function Game() {
	this.node    = new NodeSocket(this);
	this.handler = new NodeHandler(this);
	this.board   = new Board(this, 15);
	this.score   = 0;
	this.element = $('content');
	this.state   = new GameState();
	this.init();
	return this;
};

Game.prototype.inc_score = function() {
	this.score += 1;
	if (this.score == 10) console.log('You lose!');
};

Game.prototype.sync_state = function() {
	// this.node.ws.send('sync_state');
};

Game.prototype.sendToNode = function(action, args) {
	var jsonData = JSON.stringify({ "action": action, "args": args });
	if (this.node.ws) {
		this.node.ws.send(jsonData);
	} else {
		console.log('trying to send, but not connected');
	};
};

Game.prototype.update_controls = function() {
	document.getElementById('build_tower'  ).disabled =  this.board.tower_at(this.board.selected);
	document.getElementById('sell_tower'   ).disabled = !this.board.tower_at(this.board.selected);
};

Game.prototype.init = function() {
	var game = this;
	this.board.generateHTML(this.element);
	document.onclick = function(e) { game.triggerSelected(e); };
	setInterval("game.board.draw()", 100);
	setInterval("game.spawnEnemy()", 2000);
};

Game.prototype.spawnEnemy = function() {
	this.board.spawnEnemy();
};

Game.prototype.triggerSelected = function(e) {
	if (this.board.setSelected( this.board.translateXY(e.pageX, e.pageY) ))
		this.update_controls();
};

Game.prototype.placeTower = function() {
	this.sendToNode("placeTower", this.board.selected);
};

Game.prototype.removeTower = function() {
	this.sendToNode("removeTower", this.board.selected);
};


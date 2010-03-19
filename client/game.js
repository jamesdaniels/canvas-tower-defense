function Game() {
	this.node    = new NodeSocket(this);
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

Game.prototype.nodeHandlers = {
	placeTower: function(data) {
		console.log('handler:', 'placeTower', data);
		this.board.placeTower(data);
	}
};

Game.prototype.init = function() {
	var game = this;
	this.board.generateHTML(this.element);
	document.onmousemove = function(e) { game.mouseMove(e); };
	document.onclick     = function(e) { game.placeTower(e); };
	setInterval("game.board.draw()", 66);
	setInterval("game.spawnEnemy()", 2000);
};

Game.prototype.spawnEnemy = function() {
	this.board.spawnEnemy();
};

Game.prototype.mouseMove = function(e) {
	this.board.setSelected( this.board.translateXY(e.pageX, e.pageY) );
};

Game.prototype.placeTower = function(e) {
	this.sendToNode("placeTower", this.board.translateXY(e.pageX, e.pageY));
};


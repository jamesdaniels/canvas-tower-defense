function Game() {
	this.node    = new NodeSocket(this);
	this.handler = new NodeHandler(this);
	this.score   = 0;
	this.element = $('content');
	this.state   = new GameState();
	this.board   = new Board(this, 15);
	this.init();
	return this;
};

Game.prototype.inc_score = function() {
	this.score += 1;
	if (this.score == 10) console.log('You lose!');
};

Game.prototype.send_to_node = function(action, args) {
	var json_data = JSON.stringify({ "action": action, "args": args });
	if (this.node.ws) {
		this.node.ws.send(json_data);
	} else {
		console.log('trying to send, but not connected');
	};
};

Game.prototype.update_controls = function() {
	document.getElementById('build_tower').disabled =  this.state.has_tower(this.board.selected);
	document.getElementById('sell_tower' ).disabled = !this.state.has_tower(this.board.selected);
};

Game.prototype.init = function() {
	var game = this;
	this.board.generate_html(this.element);
	document.onclick = function(e) { game.trigger_selected(e); };
	setInterval("game.board.draw()", 100);
};

Game.prototype.trigger_selected = function(e) {
	if (this.board.set_selected( this.board.translate_xy(e.pageX, e.pageY) ))
		this.update_controls();
};

Game.prototype.place_tower = function() {
	this.send_to_node("place_tower", this.board.selected);
};

Game.prototype.remove_tower = function() {
	this.send_to_node("remove_tower", this.board.selected);
};

try {
exports.Game = Game;
} catch(e) {}
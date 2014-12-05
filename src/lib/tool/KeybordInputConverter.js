var EventEmitter = require('events').EventEmitter,
	// Declare keyApiMap of control keys 
	controlKeyEventMap = {
		27: 'ESC',
		46: 'DEL',
		37: 'LEFT',
		39: 'RIGHT'
	},
	convertKeyEvent = function(keyCode) {
		if (65 <= keyCode && keyCode <= 90) {
			// From a to z, convert 'A' to 'Z'
			return String.fromCharCode(keyCode);
		} else if (controlKeyEventMap[keyCode]) {
			// Control keys, like ESC, DEL ...
			return controlKeyEventMap[keyCode];
		}
	},
	getKeyCode = function(e) {
		return e.keyCode;
	};

// Observe key-input events and convert events to readable code.
module.exports = function(keyInputHandler) {
	var emitter = new EventEmitter(),
		eventHandler = function(e) {
			var key = convertKeyEvent(getKeyCode(e));
			emitter.emit('input', key);
		},
		onKeyup = eventHandler;

	// Observe key-input
	$(document).on('keyup', function(event) {
		onKeyup(event);
	});

	// Disable/Enable key-input When a jquery-ui dialog is opened/closeed
	$('body').on('dialogopen', '.ui-dialog', function() {
		onKeyup = function() {};
	}).on('dialogclose', '.ui-dialog', function() {
		onKeyup = eventHandler;
	});

	return emitter;
};
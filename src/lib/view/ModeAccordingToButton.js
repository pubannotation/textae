var reduce2hash = require('../util/reduce2hash'),
	extendBindable = require('../util/extendBindable'),
	Button = function(eventEmitter, buttonName) {
		// Button state is true when the button is pushed.
		var state = false,
			value = function(newValue) {
				if (newValue !== undefined) {
					state = newValue;
					propagate();
				} else {
					return state;
				}
			},
			toggle = function toggleButton() {
				state = !state;
				propagate();
			},
			// Propagate button state to the tool.
			propagate = function() {
				eventEmitter.trigger('textae.control.button.push', {
					buttonName: buttonName,
					state: state
				});
			};

		return {
			name: buttonName,
			value: value,
			toggle: toggle,
			propagate: propagate
		};
	},
	buttonList = [
		'replicate-auto',
		'relation-edit-mode',
		'negation',
		'speculation'
	],
	propagateStateOf = function(buttons) {
		buttons
			.map(function(button) {
				return button.propagate;
			})
			.forEach(function(propagate) {
				propagate();
			});
	};

module.exports = function() {
	var eventEmitter = extendBindable({}),
		toButton = _.partial(Button, eventEmitter),
		buttons = buttonList.map(toButton),
		propagateStateOfAllButtons = _.partial(propagateStateOf, buttons),
		buttonHash = buttons.reduce(reduce2hash, {});

	return _.extend(
		buttonHash,
		eventEmitter, {
			propagate: propagateStateOfAllButtons
		}
	);
};
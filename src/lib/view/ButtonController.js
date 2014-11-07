var ModeAccordingToButton = function(editor) {
		var reduce2hash = require('../util/reduce2hash'),
			Button = function(buttonName) {
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
						editor.eventEmitter.trigger('textae.control.button.push', {
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
			};

		var buttons = [
				'replicate-auto',
				'relation-edit-mode',
				'negation',
				'speculation'
			].map(Button),
			propagateStateOfAllButtons = function() {
				buttons
					.map(function(button) {
						return button.propagate;
					})
					.forEach(function(propagate) {
						propagate();
					});
			};

		// The public object.
		var api = buttons.reduce(reduce2hash, {});

		return _.extend(api, {
			propagate: propagateStateOfAllButtons
		});
	},
	ButtonEnableStates = function(editor) {
		var states = {},
			set = function(button, enable) {
				states[button] = enable;
			},
			propagate = function() {
				editor.eventEmitter.trigger('textae.control.buttons.change', states);
			};

		return {
			set: set,
			propagate: propagate
		};
	},
	UpdateButtonState = function(model, buttonEnableStates, clipBoard) {
		// Short cut name 
		var s = model.selectionModel,
			doPredicate = function(name) {
				return _.isFunction(name) ? name() : s[name].some();
			},
			and = function() {
				for (var i = 0; i < arguments.length; i++) {
					if (!doPredicate(arguments[i])) return false;
				}

				return true;
			},
			or = function() {
				for (var i = 0; i < arguments.length; i++) {
					if (doPredicate(arguments[i])) return true;
				}

				return false;
			},
			hasCopy = function() {
				return clipBoard.clipBoard.length > 0;
			},
			sOrE = _.partial(or, 'span', 'entity'),
			eOrR = _.partial(or, 'entity', 'relation');


		// Check all associated anntation elements.
		// For exapmle, it should be that buttons associate with entitis is enable,
		// when deselect the span after select a span and an entity.
		var predicates = {
			replicate: function() {
				return !!s.span.single();
			},
			entity: s.span.some,
			'delete': s.some, // It works well on relation-edit-mode if relations are deselect brefore an entity is select.
			copy: sOrE,
			paste: _.partial(and, hasCopy, 'span'),
			pallet: eOrR,
			'change-label': eOrR,
			negation: eOrR,
			speculation: eOrR
		};

		return function(buttons) {
			buttons.forEach(function(buttonName) {
				buttonEnableStates.set(buttonName, predicates[buttonName]());
			});
		};
	},
	UpdateModificationButtons = function(model, modeAccordingToButton) {
		var doesAllModificaionHasSpecified = function(specified, modificationsOfSelectedElement) {
				return modificationsOfSelectedElement.length > 0 && _.every(modificationsOfSelectedElement, function(m) {
					return _.contains(m, specified);
				});
			},
			updateModificationButton = function(specified, modificationsOfSelectedElement) {
				// All modification has specified modification if exits.
				modeAccordingToButton[specified.toLowerCase()]
					.value(doesAllModificaionHasSpecified(specified, modificationsOfSelectedElement));
			};

		return function(selectionModel) {
			var modifications = selectionModel.all().map(function(e) {
				return model.annotationData.getModificationOf(e).map(function(m) {
					return m.pred;
				});
			});

			updateModificationButton('Negation', modifications);
			updateModificationButton('Speculation', modifications);
		};
	},
	ButtonStateHelper = function(model, modeAccordingToButton, buttonEnableStates, updateButtonState, updateModificationButtons) {
		var allButtons = ['delete'],
			spanButtons = allButtons.concat(['replicate', 'entity', 'copy', 'paste']),
			relationButtons = allButtons.concat(['pallet', 'change-label', 'negation', 'speculation']),
			entityButtons = relationButtons.concat(['copy']),
			propagate = _.compose(modeAccordingToButton.propagate, buttonEnableStates.propagate),
			propagateAfter = _.partial(_.compose, propagate);

		return {
			propagate: propagate,
			enabled: propagateAfter(buttonEnableStates.set),
			updateBySpan: propagateAfter(_.partial(updateButtonState, spanButtons)),
			updateByEntity: _.compose(
				propagate,
				_.partial(updateModificationButtons, model.selectionModel.entity),
				_.partial(updateButtonState, entityButtons)
			),
			updateByRelation: _.compose(
				propagate,
				_.partial(updateModificationButtons, model.selectionModel.relation),
				_.partial(updateButtonState, relationButtons)
			)
		};
	};

module.exports = function(editor, model, clipBoard) {
	// Save state of push control buttons.
	var modeAccordingToButton = new ModeAccordingToButton(editor),
		// Save enable/disable state of contorol buttons.
		buttonEnableStates = new ButtonEnableStates(editor),
		updateButtonState = new UpdateButtonState(model, buttonEnableStates, clipBoard),
		// Change push/unpush of buttons of modifications.
		updateModificationButtons = new UpdateModificationButtons(model, modeAccordingToButton),
		// Helper to update button state. 
		buttonStateHelper = new ButtonStateHelper(
			model,
			modeAccordingToButton,
			buttonEnableStates,
			updateButtonState,
			updateModificationButtons
		);

	return {
		// Modes accoding to buttons of control.
		modeAccordingToButton: modeAccordingToButton,
		buttonStateHelper: buttonStateHelper,
	};
};
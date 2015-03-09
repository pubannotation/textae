import {
    EventEmitter as EventEmitter
}
from 'events';

var ButtonEnableStates = function() {
        var states = {},
            set = function(button, enable) {
                states[button] = enable;
            },
            eventEmitter = new EventEmitter(),
            propagate = function() {
                eventEmitter.emit('change', states);
            };

        return _.extend(eventEmitter, {
            set: set,
            propagate: propagate
        });
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
    var modeAccordingToButton = require('./ModeAccordingToButton')(),
        // Save enable/disable state of contorol buttons.
        buttonEnableStates = new ButtonEnableStates(),
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

    // Proragate events.
    modeAccordingToButton.on('change', function(data) {
        editor.eventEmitter.trigger('textae.control.button.push', data);
    });

    buttonEnableStates.on('change', function(data) {
        editor.eventEmitter.trigger('textae.control.buttons.change', data);
    });

    return {
        // Modes accoding to buttons of control.
        modeAccordingToButton: modeAccordingToButton,
        buttonStateHelper: buttonStateHelper,
    };
};

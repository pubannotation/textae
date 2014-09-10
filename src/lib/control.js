var TitleDom = function() {
        return $('<span>')
            .addClass('textae-control__title')
            .append($('<a>')
                .attr('href', 'http://bionlp.dbcls.jp/textae/')
                .text('TextAE'));
    },
    ButtonDom = function(buttonType, title) {
        return $('<span>')
            .addClass('textae-control__icon')
            .addClass('textae-control__' + buttonType + '-button')
            .attr('title', title);
    },
    SeparatorDom = function() {
        return $('<span>').addClass('textae-control__separator');
    },
    makeButtons = function($control, buttonMap) {
        var buttonContainer = {},
            // Make a group of buttons that is headed by the separator. 
            icons = _.flatten(buttonMap.map(function(params) {
                var buttons = _.map(params, function(title, buttonType) {
                    var button = new ButtonDom(buttonType, title);

                    buttonContainer[buttonType] = {
                        instance: button,
                        eventValue: 'textae.control.button.' + buttonType.replace(/-/g, '_') + '.click'
                    };

                    return button;
                });

                return [new SeparatorDom()]
                    .concat(buttons);
            }));

        $control
            .append(new TitleDom())
            .append($('<span>').append(icons));

        return buttonContainer;
    },
    // Utility functions to change appearance of bunttons.
    cssUtil = {
        enable: function($button) {
            $button.removeClass('textae-control__icon--disabled');
        },
        disable: function($button) {
            $button.addClass('textae-control__icon--disabled');
        },
        isDisable: function($button) {
            return $button.hasClass('textae-control__icon--disabled');
        },
        push: function($button) {
            $button.addClass('textae-control__icon--pushed');
        },
        unpush: function($button) {
            $button.removeClass('textae-control__icon--pushed');
        },
        isPushed: function($button) {
            return $button.hasClass('textae-control__icon--pushed');
        }
    },
    setButtonApearanceAndEventHandler = function(button, enable, eventHandler) {
        var event = 'click';

        // Set apearance and eventHandler to button.
        if (enable === true) {
            button
                .off(event)
                .on(event, eventHandler);
            cssUtil.enable(button);
        } else {
            button.off(event);
            cssUtil.disable(button);
        }
    },
    // A parameter can be spesified by object like { 'buttonName1': true, 'buttonName2': false }.
    updateButtons = function(buttonContainer, clickEventHandler, buttonEnables) {
        _.each(buttonEnables, function(enable, buttonName) {
            var button = buttonContainer[buttonName],
                eventHandler = function() {
                    clickEventHandler(button.eventValue);
                    return false;
                };

            if (button) setButtonApearanceAndEventHandler(button.instance, enable, eventHandler);
        });
    };

// The control is a control bar to edit.
// This can controls mulitple instance of editor.
module.exports = function($control) {
    // This contains buttons and event definitions like as {'buttonName' : { instance: $button, eventValue : 'textae.control.button.read.click' }}
    var buttonContainer = makeButtons($control, [{
            'read': 'Access [A]',
            'write': 'Save [S]'
        }, {
            'undo': 'Undo [Z]',
            'redo': 'Redo [X]'
        }, {
            'replicate': 'Replicate span annotation [R]',
            'replicate-auto': 'Auto replicate (Toggle)',
            'relation-edit-mode': 'Edit Relation'
        }, {
            'entity': 'New entity [E]',
            'pallet': 'Select label [Q]',
            'change-label': 'Change label [W]'
        }, {
            'negation': 'Negation',
            'speculation': 'Speculation'
        }, {
            'delete': 'Delete [D]',
            'copy': 'Copy [C]',
            'paste': 'Paste [V]'
        }, {
            'setting': 'Setting'
        }, {
            'help': 'Help [H]',
            'about': 'About'
        }]),
        triggrControlClickEvent = $control.trigger.bind($control, 'textae.control.click'),
        triggrButtonClickEvent = $control.trigger.bind($control, 'textae.control.button.click'),
        // A function to enable/disable button.
        enableButton = _.partial(updateButtons, buttonContainer, triggrButtonClickEvent),
        // Buttons that always eanable.
        alwaysEnables = {
            'read': true,
            'setting': true,
            'help': true,
            'about': true
        },
        // Update all button state when an instance of textEditor is changed.
        updateAllButtonEnableState = function(disableButtons) {
            // Make buttons in a disableButtons disalbed, and other buttons in the buttonContainer enabled.
            enableButton(_.extend({}, buttonContainer, alwaysEnables, disableButtons));
        },
        // Update button push state.
        updateButtonPushState = function(bottonName, isPushed) {
            var button = buttonContainer[bottonName].instance;

            if (isPushed) {
                cssUtil.push(button);
            } else {
                cssUtil.unpush(button);
            }
        };

    // To close information dialogs.
    $control.on('click', triggrControlClickEvent);

    // Public API
    $control.updateAllButtonEnableState = updateAllButtonEnableState;
    $control.updateButtonPushState = updateButtonPushState;

    return $control;
};
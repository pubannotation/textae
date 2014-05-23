    // The contorol is a contorl bar to edit.
    // This can controls mulitple instace of editor.
    var control = function() {
        // Utility functions to change appearance of bunttons.
        var buttonAppearanceUtil = {
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
        };

        // Make dom element.
        var buildElement = function($self) {
            var makeTitle = function() {
                return $('<span>')
                    .addClass('textae-control__title')
                    .append($('<a>')
                        .attr('href', 'http://bionlp.dbcls.jp/textae/')
                        .text('TextAE'));
            };
            var makeIconBar = function() {
                var btn = function(buttonType, title) {
                    var $button = $('<span>')
                        .addClass('textae-control__icon')
                        .addClass('textae-control__' + buttonType + '-button')
                        .attr('title', title);

                    buttonCache[buttonType] = {
                        instance: $button,
                        eventName: 'textae.control.button.' + buttonType.replace(/-/g, '_') + '.click'
                    };
                    return $button;
                };

                // Make a group of buttons that is headed by the separator. 
                var btnGroup = function(params) {
                    var group = [$('<span>').addClass('textae-control__separator')];
                    $.each(params, function(buttonType, title) {
                        group.push(btn(buttonType, title));
                    });
                    return group;
                };

                return $('<span>').append(
                    [{
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
                        'delete': 'Delete [D]',
                        'copy': 'Copy [C]',
                        'paste': 'Paste [V]'
                    }, {
                        'setting': 'Setting'
                    }, {
                        'help': 'Help [H]',
                        'about': 'About'
                    }].map(btnGroup).reduce(function(x, y) {
                        // [[A, B],[C, D]] > [A, B, C, D]
                        return x.concat(y);
                    }));
            };

            $self.append(makeTitle())
                .append(makeIconBar());
        };

        // A function to enable/disable button.
        var enableButton = function(buttonName, enable) {
            if (arguments.length === 1) {
                // A parameter can be spesified by object like { 'buttonName': true }.
                $.each(arguments[0], function(buttonName, enable) {
                    enableButton(buttonName, enable);
                });
            } else if (arguments.length === 2) {
                // Set apearance and eventHandler to button.
                var button = buttonCache[buttonName];
                var event = 'click';
                var eventHandler = function(e) {
                    // The buttonClick is an eventHandler appended by the tool.
                    this.buttonClick(button.eventName);
                }.bind(this);

                if (button) {
                    if (enable) {
                        button.instance
                            .off(event)
                            .on(event, eventHandler);
                        buttonAppearanceUtil.enable(button.instance);
                    } else {
                        button.instance.off(event);
                        buttonAppearanceUtil.disable(button.instance);
                    }
                }
            }
        }.bind(this);

        // Update all button state, because an instance of textEditor maybe change.
        // Make buttons in a disableButtons disalbed, and other buttons enabled.
        // Values in a disableButtois are ignored.  
        var updateAllButtonEnableState = function(disableButtons) {
            enableButton($.extend({}, buttonCache, disableButtons));
        };

        // Update button push state.
        var updateButtonPushState = function(bottonName, isPushed) {
            var buttonInstance = buttonCache[bottonName].instance;
            if (isPushed) {
                buttonAppearanceUtil.push(buttonInstance);
            } else {
                buttonAppearanceUtil.unpush(buttonInstance);
            }
        };

        // Cashe has refarence to buttons.
        // This contains buttons and event definitions like as {'buttonName' : { instance: $button, eventName : 'textae.control.button.read.click' }}
        var buttonCache = {};

        // Build elements
        buildElement(this);

        // Make Function to push button.

        // Enable buttons that always eanable.
        enableButton({
            'read': true,
            'replicate-auto': true,
            'help': true,
            'about': true
        });

        // Public API
        this.updateAllButtonEnableState = updateAllButtonEnableState;
        this.updateButtonPushState = updateButtonPushState;

        return this;
    };
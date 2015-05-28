import {
    EventEmitter as EventEmitter
}
from 'events';

// Ovserve and record mouse position to return it.
var getMousePoint = function() {
        var lastMousePoint = {},
            recordMousePoint = function(e) {
                lastMousePoint = {
                    top: e.clientY,
                    left: e.clientX
                };
            },
            onMousemove = _.debounce(recordMousePoint, 30);

        $('html').on('mousemove', onMousemove);

        return function() {
            return lastMousePoint;
        };
    }(),
    KeybordInputConverter = require('./tool/KeybordInputConverter'),
    // Observe window-resize event and redraw all editors.
    observeWindowResize = function(editors) {
        // Bind resize event
        $(window).on('resize', _.debounce(function() {
            // Redraw all editors per editor.
            editors.forEach(function(editor) {
                _.defer(editor.api.redraw);
            });
        }, 500));
    },
    helpDialog = require('./component/HelpDialog')(),
    ControlBar = function() {
        var control = null;
        return {
            setInstance: function(instance) {
                control = instance;
            },
            changeButtonState: function(enableButtons) {
                if (control) {
                    control.updateAllButtonEnableState(enableButtons);
                }
            },
            push: function(buttonName, push) {
                if (control) control.updateButtonPushState(buttonName, push);
            }
        };
    },
    KeyInputHandler = function(helpDialog, editors) {
        return function(key) {
            if (key === 'H') {
                helpDialog();
            } else {
                if (editors.getSelected()) {
                    editors.getSelected().api.handleKeyInput(key, getMousePoint());
                }
            }
        };
    },
    ControlButtonHandler = function(helpDialog, editors) {
        return function(name) {
            switch (name) {
                case 'textae.control.button.help.click':
                    helpDialog();
                    break;
                default:
                    if (editors.getSelected()) {
                        editors.getSelected().api.handleButtonClick(name, getMousePoint());
                    }
            }
        };
    };

// The tool manages interactions between components.
module.exports = function() {
    var controlBar = new ControlBar(),
        editors = require('./tool/EditorContainer')(),
        handleControlButtonClick = new ControlButtonHandler(helpDialog, editors);

    // Start observation at document ready, because this function may be called before body is loaded.
    $(function() {
        var handleKeyInput = new KeyInputHandler(helpDialog, editors);

        new KeybordInputConverter().on('input', handleKeyInput);
        observeWindowResize(editors);
    });

    return {
        // Register a control to tool.
        setControl: function(instance) {
            instance
                .on('textae.control.button.click', function() {
                    handleControlButtonClick.apply(null, _.rest(arguments));
                });

            controlBar.setInstance(instance);
        },
        // Register editors to tool
        pushEditor: function(editor) {
            editors.push(editor);

            // Add an event emitter to the editer.
            var emitter = new EventEmitter()
                .on('textae.editor.select', _.partial(editors.select, editor))
                .on('textae.control.button.push', function(data) {
                    if (editor === editors.getSelected()) controlBar.push(data.buttonName, data.state);
                })
                .on('textae.control.buttons.change', function(enableButtons) {
                    if (editor === editors.getSelected()) controlBar.changeButtonState(enableButtons);
                });

            $.extend(editor, {
                editorId: editors.getNewId(),
                eventEmitter: emitter
            });
        },
        // Select the first editor
        selectFirstEditor: function() {
            // Disable all buttons.
            controlBar.changeButtonState();

            editors.selectFirst();
        },
    };
}();

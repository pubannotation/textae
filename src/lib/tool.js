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
    // Observe key-input events and convert events to readable code.
    observeKeybordInput = function(keyInputHandler) {
        // Declare keyApiMap of control keys 
        var controlKeyEventMap = {
            27: 'ESC',
            46: 'DEL',
            37: 'LEFT',
            39: 'RIGHT'
        };

        var convertKeyEvent = function(keyCode) {
            if (65 <= keyCode && keyCode <= 90) {
                // From a to z, convert 'A' to 'Z'
                return String.fromCharCode(keyCode);
            } else if (controlKeyEventMap[keyCode]) {
                // Control keys, like ESC, DEL ...
                return controlKeyEventMap[keyCode];
            }
        };

        var getKeyCode = function(e) {
            return e.keyCode;
        };

        // EventHandlers for key-input.
        var eventHandler = _.compose(keyInputHandler, convertKeyEvent, getKeyCode);

        // Observe key-input
        var onKeyup = eventHandler;
        $(document).on('keyup', function(event) {
            onKeyup(event);
        });

        // Disable/Enable key-input When a jquery-ui dialog is opened/closeed
        $('body').on('dialogopen', '.ui-dialog', function() {
            onKeyup = function() {};
        }).on('dialogclose', '.ui-dialog', function() {
            onKeyup = eventHandler;
        });
    },
    // Observe window-resize event and redraw all editors. 
    observeWindowResize = function(editors) {
        // Bind resize event
        $(window).on('resize', _.debounce(function() {
            // Redraw all editors per editor.
            editors.forEach(function(editor) {
                console.log(editor.editorId, 'redraw');
                _.defer(editor.api.redraw);
            });
        }, 500));
    },
    openDialog = function() {
        var ToolDialog = require('./util/dialog/GetToolDialog'),
            helpDialog = new ToolDialog(
                'textae-control__help',
                'Help (Keyboard short-cuts)', {
                    height: 315,
                    width: 438
                },
                $('<div>').addClass('textae-tool__key-help')),
            aboutDialog = new ToolDialog(
                'textae-control__about',
                'About TextAE (Text Annotation Editor)', {
                    height: 500,
                    width: 600
                },
                $('<div>')
                .html('<p>今ご覧になっているTextAEはPubAnnotationで管理しているアノテーションのビューアもしくはエディタです。</p>' +
                    '<p>PubAnnotationではPubMedのアブストラクトにアノテーションを付けることができます。</p>' +
                    '<p>現在はEntrez Gene IDによる自動アノテーションおよびそのマニュアル修正作業が可能となっています。' +
                    '今後は自動アノテーションの種類を増やす計画です。</p>' +
                    '<p>間違ったアノテーションも目に付くと思いますが、それを簡単に直して自分のプロジェクトにセーブできるのがポイントです。</p>' +
                    '<p>自分のアノテーションを作成するためにはPubAnnotation上で自分のプロジェクトを作る必要があります。' +
                    '作成したアノテーションは後で纏めてダウンロードしたり共有することができます。</p>' +
                    '<p>まだ開発中のサービスであり、実装すべき機能が残っています。' +
                    'ユーザの皆様の声を大事にして開発していきたいと考えておりますので、ご意見などございましたら教えていただければ幸いです。</p>'));

        return {
            help: helpDialog.open,
            about: aboutDialog.open
        };
    }();

// The tool manages interactions between components. 
module.exports = function() {
    // Components to be managed
    var components = function() {
        var switchActiveClass = function(editors, selected) {
            var activeClass = 'textae-editor--active';

            // Remove activeClass from others than selected.
            _.reject(editors, function(editor) {
                return editor === selected;
            }).forEach(function(others) {
                others.removeClass(activeClass);
                console.log('deactive', others.editorId);
            });

            // Add activeClass to the selected.
            selected.addClass(activeClass);
            console.log('active', selected.editorId);
        };

        return {
            control: null,
            // A container of editors that is extended from Array. 
            editors: $.extend([], {
                getNewId: function() {
                    return 'editor' + this.length;
                },
                select: function(editor) {
                    switchActiveClass(this, editor);
                    this.selected = editor;
                },
                selectFirst: function() {
                    var first = this[0];
                    this.select(first);
                    eventDispatcher.handleEditor.public.changeButtonState(first);
                },
                selected: null,
            })
        };
    }();

    // Decide "which component handles certain event.""
    var eventDispatcher = {
        handleKeyInput: function(key) {
            if (key === 'H') {
                openDialog.help();
            } else {
                if (components.editors.selected) {
                    components.editors.selected.api.handleKeyInput(key, getMousePoint());
                }
            }
        },
        handleButtonClick: function(name) {
            switch (name) {
                case 'textae.control.button.help.click':
                    openDialog.help();
                    break;
                case 'textae.control.button.about.click':
                    openDialog.about();
                    break;
                default:
                    if (components.editors.selected) {
                        components.editors.selected.api.handleButtonClick(name, getMousePoint());
                    }
            }
        },
        // Methods for editor to call tool.
        handleEditor: {
            // A method to public bind an editor instance.
            select: function(editor) {
                components.editors.select(editor);
            },
            // Methods to public as is.
            public: {
                changeButtonState: function(editor, disableButtons) {
                    if (components.control && editor === components.editors.selected) {
                        components.control.updateAllButtonEnableState(disableButtons);
                    }
                },
                push: function(buttonName, push) {
                    if (components.control) components.control.updateButtonPushState(buttonName, push);
                }
            }
        },
    };

    // The controller observes user inputs.
    var controller = function() {
        // Start observation at document ready, because this function may be called before body is loaded.
        observeWindowResize(components.editors);
        observeKeybordInput(eventDispatcher.handleKeyInput);
    }();

    return {
        // Register a control to tool.
        setControl: function(control) {
            control
                .on('textae.control.button.click', function() {
                    eventDispatcher.handleButtonClick.apply(null, _.rest(arguments));
                });

            components.control = control;
        },
        // Register editors to tool
        pushEditor: function(editor) {
            components.editors.push(editor);

            $.extend(editor, {
                editorId: components.editors.getNewId(),
                tool: $.extend({
                    selectMe: _.partial(eventDispatcher.handleEditor.select, editor),
                }, eventDispatcher.handleEditor.public),
            });
        },
        // Select the first editor
        selectFirstEditor: function() {
            components.editors.selectFirst();
        },
    };
}();
    // The tool manages interactions between components. 
    var tool = function() {
        // Components to be managed
        var components = function() {
            var helpDialog = textAeUtil.makeInformationModal({
                    className: 'textae-control__help',
                    addContentsFunc: function() {
                        this
                            .append($('<h3>').text('Help (Keyboard short-cuts)'))
                            .append($('<div>').addClass('textae-tool__key-help'));
                    }
                }),
                aboutDialog = textAeUtil.makeInformationModal({
                    className: 'textae-control__about',
                    addContentsFunc: function() {
                        this
                            .html('<h3>About TextAE (Text Annotation Editor)</h3>' +
                                '<p>今ご覧になっているTextAEはPubAnnotationで管理しているアノテーションのビューアもしくはエディタです。</p>' +
                                '<p>PubAnnotationではPubMedのアブストラクトにアノテーションを付けることができます。</p>' +
                                '<p>現在はEntrez Gene IDによる自動アノテーションおよびそのマニュアル修正作業が可能となっています。' +
                                '今後は自動アノテーションの種類を増やす計画です。</p>' +
                                '<p>間違ったアノテーションも目に付くと思いますが、それを簡単に直して自分のプロジェクトにセーブできるのがポイントです。</p>' +
                                '<p>自分のアノテーションを作成するためにはPubAnnotation上で自分のプロジェクトを作る必要があります。' +
                                '作成したアノテーションは後で纏めてダウンロードしたり共有することができます。</p>' +
                                '<p>まだ開発中のサービスであり、実装すべき機能が残っています。' +
                                'ユーザの皆様の声を大事にして開発していきたいと考えておりますので、ご意見などございましたら教えていただければ幸いです。</p>');
                    }
                });

            return {
                control: null,
                // A container of editors that is extended from Array. 
                editors: $.extend([], {
                    getNewId: function() {
                        return 'editor' + this.length;
                    },
                    select: function(editor) {
                        this.selected = editor;
                        console.log(editor.editorId);
                    },
                    selectFirst: function() {
                        this.select(this[0]);
                    },
                    selected: null,
                }),
                infoModals: {
                    help: helpDialog,
                    about: aboutDialog,
                    hideAll: _.compose(helpDialog.hide, aboutDialog.hide)
                }
            };
        }();

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
        }();

        // Decide "which component handles certain event.""
        var eventDispatcher = {
            handleKeyInput: function(key) {
                if (key === 'H') {
                    components.infoModals.help.show();
                } else {
                    if (components.editors.selected) {
                        components.editors.selected.api.handleKeyInput(key, getMousePoint());
                    }
                    if (key === 'ESC') {
                        components.infoModals.hideAll();
                    }
                }
            },
            handleButtonClick: function(name) {
                switch (name) {
                    case 'textae.control.button.help.click':
                        components.infoModals.help.show();
                        break;
                    case 'textae.control.button.about.click':
                        components.infoModals.about.show();
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
                    cancel: function() {
                        components.infoModals.hideAll();
                    },
                    changeButtonState: function(disableButtons) {
                        components.control.updateAllButtonEnableState(disableButtons);
                    },
                    pushReplicateAuto: function(push) {
                        components.control.updateReplicateAutoButtonPushState(push);
                    },
                    push: function(buttonName, push) {
                        components.control.updateButtonPushState(buttonName, push);
                    }
                }
            },
        };

        // The controller observes user inputs.
        var controller = function() {
            // Observe key-input events and convert events to readable code.
            var observeKeybordInput = function() {
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
                var eventHandler = _.compose(eventDispatcher.handleKeyInput, convertKeyEvent, getKeyCode);

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
            };

            // Observe window-resize event and redraw all editors. 
            var observeWindowResize = function() {
                // Bind resize event
                $(window).on('resize', _.debounce(function() {
                    // Redraw all editors per editor.
                    components.editors.forEach(function(editor) {
                        _.defer(editor.api.redraw);
                    });
                }, 20));
            };

            // Start observation at document ready, because this function may be called before body is loaded.
            $(_.compose(observeWindowResize, observeKeybordInput));
        }();

        return {
            // Register a control to tool.
            setControl: function(control) {
                control.on('textae.control.button.click', function() {
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
                        selectMe: eventDispatcher.handleEditor.select.bind(null, editor),
                    }, eventDispatcher.handleEditor.public),
                });
            },
            // Select the first editor
            selectFirstEditor: function() {
                components.editors.selectFirst();
            },
        };
    }();
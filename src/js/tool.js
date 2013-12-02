    // tool manage interactions between components. 
    var tool = function() {
        // components to manage
        var components = {
            control: null,
            // a container of editors that is extended from Array. 
            editors: $.extend([], {
                getNewId: function() {
                    return "editor" + this.length;
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
            infoDialogs: {
                //help dialog
                help: textAeUtil.makeInformationDialog({
                    className: "textae-control__help",
                    addContentsFunc: function() {
                        this
                            .append($("<h3>").text("Help (Keyboard short-cuts)"))
                            .append($("<img>").attr("src", "images/keyhelp.png"));
                    }
                }),
                //about dialog
                about: textAeUtil.makeInformationDialog({
                    className: "textae-control__about",
                    addContentsFunc: function() {
                        this
                            .html("<h3>About TextAE (Text Annotation Editor)</h3>" +
                                "<p>今ご覧になっているTextAEはPubAnnotationで管理しているアノテーションのビューアもしくはエディタです。</p>" +
                                "<p>PubAnnotationではPubMedのアブストラクトにアノテーションを付けることができます。</p>" +
                                "<p>現在はEntrez Gene IDによる自動アノテーションおよびそのマニュアル修正作業が可能となっています。" +
                                "今後は自動アノテーションの種類を増やす計画です。</p>" +
                                "<p>間違ったアノテーションも目に付くと思いますが、それを簡単に直して自分のプロジェクトにセーブできるのがポイントです。</p>" +
                                "<p>自分のアノテーションを作成するためにはPubAnnotation上で自分のプロジェクトを作る必要があります。" +
                                "作成したアノテーションは後で纏めてダウンロードしたり共有することができます。</p>" +
                                "<p>まだ開発中のサービスであり、実装すべき機能が残っています。" +
                                "ユーザの皆様の声を大事にして開発していきたいと考えておりますので、ご意見などございましたら教えていただければ幸いです。</p>");
                    }
                }),
                hideAll: function() {
                    components.infoDialogs.help.hide();
                    components.infoDialogs.about.hide();
                },
            },
        };

        // decide "which component handles certain event.""
        var eventDispatcher = {
            handleKeyInput: function(key) {
                if (key === "H") {
                    components.infoDialogs.help.show();
                } else {
                    if (components.editors.selected) {
                        components.editors.selected.api.handleKeyInput(key);
                    }
                    if (key === "ESC") {
                        components.infoDialogs.hideAll();
                    }
                }
            },
            handleButtonClick: function(event) {
                switch (event.name) {
                    case "textae.control.button.help.click":
                        components.infoDialogs.help.show();
                        break;
                    case "textae.control.button.about.click":
                        components.infoDialogs.about.show();
                        break;
                    default:
                        if (components.editors.selected) {
                            components.editors.selected.api.handleButtonClick(event);
                        }
                }
            },
            //methods for editor to call tool.
            handleEditor: {
                select: function(editor) {
                    components.editors.select(editor);
                },
                cancel: function() {
                    components.infoDialogs.hideAll();
                },
                changeButtonState: function(disableButtons) {
                    components.control.updateAllButtonEnableState(disableButtons);
                },
                pushReplicateAuto: function(push) {
                    components.control.updateReplicateAutoButtonPushState(push);
                },
            },
        };

        //controller observe user input.
        var controller = function() {
            // observe key-input events and convert events to readable code.
            var observeKeybordInput = function() {
                //declare keyApiMap of cotorol keys 
                var controlKeyEventMap = {
                    27: "ESC",
                    46: "DEL",
                    37: "LEFT",
                    39: "RIGHT"
                };
                var convertKeyEvent = function(keyCode) {
                    if (65 <= keyCode && keyCode <= 90) {
                        //from a to z, convert "A" to "Z"
                        return String.fromCharCode(keyCode);
                    } else if (controlKeyEventMap[keyCode]) {
                        //control key, like ESC, DEL ...
                        return controlKeyEventMap[keyCode];
                    }
                };

                //observe key-input event
                var isActive = true;
                var onKeyup = function(e) {
                    if (isActive) {
                        eventDispatcher.handleKeyInput(convertKeyEvent(e.keyCode));
                    }
                };
                $(document).on("keyup", onKeyup);

                //keybord disable/enable if jquery ui dialog is open/close
                $("body").on("dialogopen", ".ui-dialog", function() {
                    isActive = false;
                }).on("dialogclose", ".ui-dialog", function() {
                    isActive = true;
                });
            };

            // observe window-resize event and redraw all editors. 
            var observeWindowResize = function() {
                // bind resize event
                $(window).on("resize", function() {
                    components.editors.forEach(function(e) {
                        e.api.redraw();
                    });
                });
            };

            //start observe at document ready, because this function may be called before body is loaded.
            $(function() {
                observeKeybordInput();
                observeWindowResize();
            });
        }();

        return {
            // register a control to tool.
            setControl: function(control) {
                $.extend(control, {
                    buttonClick: function(buttonEvent) {
                        eventDispatcher.handleButtonClick(buttonEvent);
                    },
                });

                components.control = control;
            },
            // register editors to tool
            pushEditor: function(editor) {
                components.editors.push(editor);

                $.extend(editor, {
                    editorId: components.editors.getNewId(),
                    tool: {
                        selectMe: eventDispatcher.handleEditor.select.bind(this, editor),
                        cancelSelect: eventDispatcher.handleEditor.cancel,
                        changeButtonState: eventDispatcher.handleEditor.changeButtonState,
                        pushReplicateAuto: eventDispatcher.handleEditor.pushReplicateAuto,
                    },
                });
            },
            // select first editor
            selectFirstEditor: function() {
                components.editors.selectFirst();
            },
        };
    }();
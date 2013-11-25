    var tool = function() {
        // get the url parameters: beginning of the program
        var urlParams = textAeUtil.getUrlParameters(location.search);

        // components to manage
        var components = {
            control: null,
            editors: [],
            selectedEditor: null
        };

        // decide "is which controller handle certain event.""
        var traficController = {
            handleInputKey: function(key) {
                if (key === "H") {
                    helpDialog.show();
                } else {
                    if (components.selectedEditor) {
                        components.selectedEditor.api.handleInputKey(key);
                    }
                }
            },
        };

        // keyboradController observe key-input events and convert events to readable code.
        var keyboardController = function() {
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
                    traficController.handleInputKey(convertKeyEvent(e.keyCode));
                }
            };
            $(document).on("keyup", onKeyup);

            //keybord disable/enable if jquery ui dialog is open/close
            //start observe at document ready, because this function may be called before body is loaded.
            $(function() {
                $("body").on("dialogopen", ".ui-dialog", function() {
                    isActive = false;
                }).on("dialogclose", ".ui-dialog", function() {
                    isActive = true;
                });
            });
        }();

        //help dialog
        var helpDialog = textAeUtil.makeInformationDialog({
            className: "textae-control__help",
            addContentsFunc: function() {
                return this
                    .append($("<h3>").text("Help (Keyboard short-cuts)"))
                    .append($("<img>").attr("src", "images/keyhelp.png"));
            }
        });

        //about dialog
        var aboutDialog = textAeUtil.makeInformationDialog({
            className: "textae-control__about",
            addContentsFunc: function() {
                return this
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
        });

        // bind textaeCotnrol eventhandler
        var bindTextaeControlEventhandler = function(control) {
            var getEditor = function() {
                return components.selectedEditor;
            };

            if (control) {
                var buttons = control.buttons;
                // object leteral treat key as string, so set controlEvents after declare.
                var controlEvents = {};
                // access by square brancket because property names include "-". 
                controlEvents[buttons.read.ev] = function() {
                    getEditor().api.showAccess();
                };
                controlEvents[buttons.write.ev] = function() {
                    getEditor().api.showSave();
                };
                controlEvents[buttons.undo.ev] = function() {
                    getEditor().api.undo();
                };
                controlEvents[buttons.redo.ev] = function() {
                    getEditor().api.redo();
                };
                controlEvents[buttons.replicate.ev] = function() {
                    getEditor().api.replicate();
                };
                controlEvents[buttons["replicate-auto"].ev] = function() {
                    getEditor().api.toggleReplicateAuto();
                };
                controlEvents[buttons.entity.ev] = function() {
                    getEditor().api.createEntity();
                };
                controlEvents[buttons["new-label"].ev] = function() {
                    getEditor().api.newLabel();
                };
                controlEvents[buttons.pallet.ev] = function(controlEvent, buttonEvent) {
                    getEditor().api.showPallet(controlEvent, buttonEvent);
                };
                controlEvents[buttons.delete.ev] = function() {
                    getEditor().api.removeElements();
                };
                controlEvents[buttons.copy.ev] = function() {
                    getEditor().api.copyEntities();
                };
                controlEvents[buttons.paste.ev] = function() {
                    getEditor().api.pasteEntities();
                };
                textAeUtil.bindEvents(control, controlEvents);
            }
        };

        return {
            setControl: function(control) {
                control.on(control.buttons.help.ev, helpDialog.show);
                control.on(control.buttons.about.ev, aboutDialog.show);

                $("body").on("textae.select.cancel", function() {
                    helpDialog.hide();
                    aboutDialog.hide();
                });

                $("body")
                    .on("textae.editor.buttonState.change", function(e, data) {
                        // console.log(data);
                        control.updateAllButtonEnableState(data);
                    })
                    .on("textae.editor.button.repulicateAuto.push", function(e, data) {
                        control.updateReplicateAutoButtonPushState(data);
                    });

                bindTextaeControlEventhandler(control);

                components.control = control;
            },
            pushEditor: function(editor) {
                editor.urlParams = urlParams;

                components.editors.push(editor);
                editor.editorId = "editor" + components.editors.length;
                editor.saySelectMeToTool = function() {
                    components.selectedEditor = editor;
                };

                // bind Dialog eventhandler
                var saveLoadDialogEvents = {
                    "textae.dialog.localfile.load": function(e, data) {
                        editor.api.loadAnnotation(data);
                    },
                    "textae.dialog.loadurl.select": function(e, data) {
                        editor.api.getAnnotationFromServer(data);
                    },
                    "textae.dialog.localfile.save": function(e, data) {
                        editor.api.saveAnnotation();
                    },
                    "textae.dialog.saveurl.select": function(e, data) {
                        editor.api.saveAnnotationToServer(data);
                    },
                };
                textAeUtil.bindEvents($("body"), saveLoadDialogEvents);

                // bind resize event
                $(window).on("resize", function() {
                    editor.api.redraw();
                });
            }
        };
    }();
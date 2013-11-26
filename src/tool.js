    var tool = function() {
        // get the url parameters: beginning of the program
        var urlParams = textAeUtil.getUrlParameters(location.search);

        // components to manage
        var components = {
            control: null,
            editors: [],
            selectedEditor: null,
            selectFirstEditor: function() {
                this.selectedEditor = this.editors[0];
            },
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
                    if (key === "ESC") {
                        helpDialog.hide();
                        aboutDialog.hide();
                    }
                }
            },
            handleInputButton: function(event) {
                switch (event.name) {
                    case "textae.control.button.help.click":
                        helpDialog.show();
                        break;
                    default:
                        if (event.name === "textae.control.button.help.click") {
                            helpDialog.show();
                        } else if (event.name === "textae.control.button.about.click") {
                            aboutDialog.show();
                        } else {
                            if (components.selectedEditor) {
                                components.selectedEditor.api.handleInputButton(event);
                            }
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
                this
                    .append($("<h3>").text("Help (Keyboard short-cuts)"))
                    .append($("<img>").attr("src", "images/keyhelp.png"));
            }
        });

        //about dialog
        var aboutDialog = textAeUtil.makeInformationDialog({
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
        });

        return {
            setControl: function(control) {
                $("body")
                    .on("textae.editor.buttonState.change", function(e, data) {
                        // console.log(data);
                        control.updateAllButtonEnableState(data);
                    })
                    .on("textae.editor.button.repulicateAuto.push", function(e, data) {
                        control.updateReplicateAutoButtonPushState(data);
                    });

                control.buttonClick = function(buttonEvent) {
                    traficController.handleInputButton(buttonEvent);
                };

                components.control = control;
            },
            pushEditor: function(editor) {
                editor.urlParams = urlParams;

                components.editors.push(editor);
                editor.editorId = "editor" + components.editors.length;
                $.extend(editor, {
                    saySelectMeToTool: function() {
                        components.selectedEditor = editor;
                    },
                    sayCanselSelectToTool: function() {
                        helpDialog.hide();
                        aboutDialog.hide();
                    },
                })

                // bind resize event
                $(window).on("resize", function() {
                    editor.api.redraw();
                });
            },
            selectFirstEditor: function() {
                components.selectFirstEditor();
            },
        };
    }();
    var god = function() {
        // get the url parameters: beginning of the program
        var urlParams = textAeUtil.getUrlParameters(location.search);

        //keyboard shortcut
        var keyboard = function() {
            //cache element
            var $body = $("body");

            //declare keyboardEvents of cotorol keys 
            var controlKeysEvents = {
                27: "ESC",
                46: "DEL",
                37: "LEFT",
                39: "RIGHT"
            };

            var dispatchKeyEvents = function(e) {
                var triggerBody = function(key) {
                    $body.trigger("textae.keyboard." + key + ".click");
                };

                //from a to z, like "textae.keyboard.A.click"
                if (65 <= e.keyCode && e.keyCode <= 90) {
                    triggerBody(String.fromCharCode(e.keyCode));
                    return;
                }

                //control key, like "textae.keyboard.ESC.click"
                if (controlKeysEvents[e.keyCode]) {
                    triggerBody(controlKeysEvents[e.keyCode]);
                    return;
                }
            };

            return {
                enable: function(enable) {
                    //undefined is true
                    if (enable === false) {
                        $(document).off("keyup", dispatchKeyEvents);
                    } else {
                        $(document).on("keyup", dispatchKeyEvents);
                    }
                }
            };
        }();

        var helpDialog = textAeUtil.makeInformationDialog({
            className: "textae-control__help",
            addContentsFunc: function() {
                return this
                    .append($("<h3>").text("Help (Keyboard short-cuts)"))
                    .append($("<img>").attr("src", "images/keyhelp.png"));
            }
        });

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
        var bindTextaeControlEventhandler = function(control, editor) {
            if (control && editor) {
                var buttons = control.buttons;
                // object leteral treat key as string, so set controlEvents after declare.
                var controlEvents = {};
                // access by square brancket because property names include "-". 
                controlEvents[buttons["read"].ev] = function() {
                    editor.api.showAccess();
                };
                controlEvents[buttons["write"].ev] = function() {
                    editor.api.showSave();
                };
                controlEvents[buttons["undo"].ev] = function() {
                    editor.api.undo();
                };
                controlEvents[buttons["redo"].ev] = function() {
                    editor.api.redo();
                };
                controlEvents[buttons["replicate"].ev] = function() {
                    editor.api.replicate();
                };
                controlEvents[buttons["replicate-auto"].ev] = function() {
                    editor.api.toggleReplicateAuto();
                };
                controlEvents[buttons["entity"].ev] = function() {
                    editor.api.createEntity();
                };
                controlEvents[buttons["new-label"].ev] = function() {
                    editor.api.newLabel();
                };
                controlEvents[buttons["pallet"].ev] = function() {
                    editor.api.showPallet();
                };
                controlEvents[buttons["delete"].ev] = function() {
                    editor.api.removeElements();
                };
                controlEvents[buttons["copy"].ev] = function() {
                    editor.api.copyEntities();
                };
                controlEvents[buttons["paste"].ev] = function() {
                    editor.api.pasteEntities();
                };
                textAeUtil.bindEvents(control, controlEvents);
            }
        };

        var cachedControl = null;
        var editors = [];
        var isFirstEditor = function() {
            return editors.length === 1;
        };

        return {
            setControl: function(control) {
                control.on(control.buttons["help"].ev, helpDialog.show);
                control.on(control.buttons["about"].ev, aboutDialog.show);

                $("body").on("textae.select.cancel", function() {
                    helpDialog.hide();
                    aboutDialog.hide();
                });

                $("body")
                    .on("textae.editor.buttonState.change", function(e, data) {
                        console.log(data);
                        control.disableButtons(data);
                    })
                    .on("textae.editor.button.repulicateAuto.push", function(e, data) {
                        if (data) {
                            buttonUtil.push(control.buttons["replicate-auto"].obj);
                        } else {
                            buttonUtil.unpush(control.buttons["replicate-auto"].obj);
                        }
                    });

                editors.forEach(function(editor) {
                    bindTextaeControlEventhandler(control, editor);
                })

                cachedControl = control;
            },
            pushEditor: function(editor) {
                editor.urlParams = urlParams;

                editors.push(editor);

                if (isFirstEditor) {
                    keyboard.enable();

                    var disableKeyboardIfDialogOpen = {
                        //keybord disable/enable if jquery ui dialog is open/close
                        "dialogopen": {
                            selector: ".ui-dialog",
                            func: function() {
                                keyboard.enable(false);
                            }
                        },
                        "dialogclose": {
                            selector: ".ui-dialog",
                            func: function() {
                                keyboard.enable();
                            }
                        }
                    };
                    textAeUtil.bindEvents($("body"), disableKeyboardIfDialogOpen);
                }

                //api call in method, because api will is set after this.
                var keyboardEvents = {
                    "textae.keyboard.A.click": function() {
                        editor.api.showAccess();
                    },
                    "textae.keyboard.C.click": function() {
                        editor.api.copyEntities();
                    },
                    "textae.keyboard.D.click textae.keyboard.DEL.click": function() {
                        editor.api.removeElements();
                    },
                    "textae.keyboard.E.click": function() {
                        editor.api.createEntity();
                    },
                    "textae.keyboard.H.click": helpDialog.show,
                    "textae.keyboard.Q.click": function() {
                        editor.api.showPallet();
                    },
                    "textae.keyboard.R.click": function() {
                        editor.api.replicate();
                    },
                    "textae.keyboard.S.click": function() {
                        editor.api.showSave();
                    },
                    "textae.keyboard.V.click": function() {
                        editor.api.pasteEntities();
                    },
                    "textae.keyboard.W.click": function() {
                        editor.api.newLabel();
                    },
                    "textae.keyboard.X.click textae.keyboard.Y.click": function() {
                        editor.api.redo();
                    },
                    "textae.keyboard.Z.click": function() {
                        editor.api.undo();
                    },
                    "textae.keyboard.ESC.click": function() {
                        editor.api.cancelSelect();
                    },
                    "textae.keyboard.LEFT.click": function() {
                        editor.api.selectLeftEntity();
                    },
                    "textae.keyboard.RIGHT.click": function() {
                        editor.api.selectRightEntity();
                    },
                };
                textAeUtil.bindEvents($("body"), keyboardEvents);

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
                }
                textAeUtil.bindEvents($("body"), saveLoadDialogEvents);

                // bind resize event
                $(window).on("resize", function() {
                    editor.api.redraw();
                });

                bindTextaeControlEventhandler(cachedControl, editor);
            }
        };
    };
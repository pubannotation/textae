//like a jQuery plugin
(function(jQuery) {
    var editor = function() {
        var $textaeEditor = this;

        //cursor
        var setupWait = function(self) {
            var wait = function() {
                $textaeEditor.css('cursor', 'wait');
            };
            var endWait = function() {
                $textaeEditor.css('cursor', 'auto');
            }
            self.startWait = wait;
            self.endWait = endWait;
        };

        //entityTypes
        var entityTypes = function() {
            var types = {},
                defaultType = "",
                getColor = function() {
                    return this.color ? this.color : "#77DDDD";
                };

            return {
                setDefaultType: function(nameOfEntityType) {
                    defaultType = nameOfEntityType;
                },
                getDefaultType: function() {
                    return defaultType || entityTypes.getType(entityTypes.getSortedNames()[0]).name;
                },
                getType: function(nameOfEntityType) {
                    return types[nameOfEntityType] = types[nameOfEntityType] || {
                        getColor: getColor
                    };
                },
                set: function(newEntityTypes) {
                    // expected newEntityTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
                    types = {};
                    defaultType = "";
                    if (newEntityTypes !== undefined) {
                        newEntityTypes.forEach(function(newEntity) {
                            newEntity.getColor = getColor;
                            types[newEntity.name] = newEntity;
                            if (newEntity.
                                default === true) {
                                defaultType = newEntity.name;
                            }
                        });
                    }
                },
                //save number of type, to sort by numer when show entity pallet.
                incrementNumberOfTypes: function(nameOfEntityType) {
                    //access by square brancket, because nameOfEntityType is user input value, maybe 'null', '-', and other invalid indentifier name.
                    var type = entityTypes.getType(nameOfEntityType);
                    type.count = (type.count || 0) + 1;
                },
                getSortedNames: function() {
                    //sort by number of types
                    var typeNames = Object.keys(types);
                    typeNames.sort(function(a, b) {
                        return types[b].count - types[a].count;
                    });
                    return typeNames;
                }
            }
        }();

        //load/saveDialog
        var loadSaveDialog = function() {
            var getLoadDialog = function() {
                $body = $("body");
                var $dialog = $body.find("#textae.dialog.load");

                //make unless exists
                if ($dialog.length === 0) {
                    $dialog = $('<div id="textae.dialog.load" title="Load document with annotation.">')
                        .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                        .append('<div>Local :<input type="file"　/></div>');

                    //bind event handler
                    var onFileChange = function() {
                        var reader = new FileReader();
                        reader.onload = function() {
                            var annotation = JSON.parse(this.result);
                            $("body").trigger("textae.dialog.localfile.load", annotation);
                            $dialog.dialog("close");
                        };
                        reader.readAsText(this.files[0]);
                    }

                    $body.append($dialog);
                    $dialog.hide()
                    $dialog.find("input[type='file']").on("change", onFileChange);
                    $dialog.find("input[type='button']")
                        .on("click", function() {
                            var url = $dialog.find("input[type='text']").val();
                            $("body").trigger("textae.dialog.loadurl.select", url);
                            $dialog.dialog("close");
                        });
                }

                return $dialog;
            };
            return {
                showAccess: function(targetUrl) {
                    var $dialog = getLoadDialog();
                    $dialog
                        .find("input[type='text']")
                        .val(targetUrl);
                    $dialog
                        .dialog({
                            resizable: false,
                            width: 550,
                            height: 220,
                            modal: true,
                            buttons: {
                                Cancel: function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                },
                showSave: function(url, content) {
                    var getSaveDialog = function() {
                        $body = $("body");
                        var $dialog = $body.find("#textae.dialog.save");
                        if ($dialog.length === 0) {
                            $dialog = $('<div id="textae.dialog.save" title="Save document with annotation.">')
                                .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                                .append('<div>Local :<span class="span_link_place"><a target="_blank"/></span></div>');

                            $body.append($dialog);
                            $dialog.hide();
                            $dialog
                                .on("click", "a", function() {
                                    $("body").trigger("textae.dialog.localfile.save");
                                    $dialog.dialog("close");
                                })
                                .on("click", "input[type='button']", function() {
                                    $("body").trigger("textae.dialog.saveurl.select", $dialog.find("input[type='text']").val());
                                    $dialog.dialog("close");
                                });

                        }

                        return $dialog;
                    };

                    var createFileLink = function(contents, $save_dialog) {
                        var $fileInput = getLoadDialog().find("input[type='file']");

                        var file = $fileInput.prop("files")[0]
                        var name = file ? file.name : "annotations.json";
                        var blob = new Blob([contents], {
                            type: 'application/json'
                        });
                        var link = $save_dialog.find('a')
                            .text(name)
                            .attr("href", URL.createObjectURL(blob))
                            .attr("download", name);
                    };

                    var $dialog = getSaveDialog();

                    //create local link
                    createFileLink(content, $dialog);

                    //open dialog
                    $dialog
                        .find("input[type='text']")
                        .val(url);
                    $dialog
                        .dialog({
                            resizable: false,
                            width: 550,
                            height: 220,
                            modal: true,
                            buttons: {
                                Cancel: function() {
                                    $(this).dialog("close");
                                }
                            }
                        });
                }
            };
        }();

        //public to use on textae.js
        setupWait(this);
        this.entityTypes = entityTypes;
        this.loadSaveDialog = loadSaveDialog;

        return this;
    };

    var control = function() {
        var $self = this;
        var buttonCache = {};

        var makeTitle = function() {
            return $('<span>')
                .addClass('textae-control__title')
                .append($('<a>')
                    .attr('href', "http://bionlp.dbcls.jp/textae/")
                    .text('TextAE'));
        };

        var makeIconBar = function() {
            var makeSeparator = function() {
                return $('<span>')
                    .addClass("separator");
            };

            var makeButton = function(buttonType, title) {
                var $button = $('<span>')
                    .addClass('textae-control__icon-bar__icon')
                    .addClass('textae-control__icon-bar__' + buttonType + '-button')
                    .attr('title', title);

                // button cache and event definition.
                buttonCache[buttonType] = {
                    obj: $button,
                    ev: "textae.control.button." + buttonType + ".click"
                };
                return $button;
            };

            return $($('<span>')
                .addClass("textae-control__icon-bar")
                .append(makeSeparator())
                .append(makeButton('read', 'Access [A]'))
                .append(makeButton('write', "Save [S]"))
                .append(makeSeparator())
                .append(makeButton('undo', "Undo [Z]"))
                .append(makeButton('redo', "Redo [X]"))
                .append(makeSeparator())
                .append(makeButton('replicate', "Replicate span annotation [R]"))
                .append(makeButton('replicate-auto', "Auto replicate (Toggle)"))
                .append(makeSeparator())
                .append(makeButton('entity', "New entity [E]"))
                .append(makeButton('pallet', "Select label [Q]"))
                .append(makeButton('new-label', "Enter label [W]"))
                .append(makeSeparator())
                .append(makeButton('delete', "Delete [D]"))
                .append(makeButton('copy', "Copy [C]"))
                .append(makeButton('paste', "Paste [V]"))
                .append(makeSeparator())
                .append(makeButton('help', "Help [H]"))
                .append(makeButton('about', "About"))
                .append(makeSeparator())
            );
        };

        var CLICK = "click";
        // function to enable/disable button
        var enableButton = function(button_name, enable) {
            var button = buttonCache[button_name];

            if (button) {
                if (enable) {
                    button.obj
                        .off(CLICK)
                        .on(CLICK, function(e) {
                            $self.trigger(button.ev, e);
                        });
                    buttonUtil.enable(button.obj);
                } else {
                    button.obj.off(CLICK);
                    buttonUtil.disable(button.obj);
                }
            }
        };

        // update all button state, because an instance of textEditor maybe change.
        var disableButtons = function(disableButtons) {
            for (buttonType in buttonCache) {
                enableButton(buttonType, !disableButtons.hasOwnProperty(buttonType));
            }
        }

        // build elements
        this.append(makeTitle())
            .append(makeIconBar());

        // buttons always eanable.
        enableButton("read", true);
        enableButton("replicateAuto", true);
        enableButton("help", true);
        enableButton("about", true);

        // public
        this.disableButtons = disableButtons;
        this.buttons = buttonCache;

        return this;
    };

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
                textAeUtil.bindEvents($textaeControl, controlEvents);
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

                $("body").on("textae.editor.buttonState.change", function(e, data) {
                    console.log(data);
                    control.disableButtons(data);
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

    jQuery.fn.textae = (function() {
        var texaeGod,
            initGod = function() {
                //init management object
                if (texaeGod === undefined) {
                    texaeGod = god();
                }
            };

        return function() {
            initGod();

            if (this.hasClass("textae-editor")) {
                var e = editor.apply(this);
                texaeGod.pushEditor(e);
                return e;
            } else if (this.hasClass("textae-control")) {
                var c = control.apply(this);
                texaeGod.setControl(c);
                return c;
            }
        };
    })();
})(jQuery);
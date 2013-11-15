// this is dummy file for test grunt-contrib-concat

// utility functions
(function() {
    window.textAeUtil = {
        //bind event according to object like { event : function }
        //if use selector { event : {selector : selector , func : function } }
        bindEvents : function($target, events){
            var isFunction = function(func) {
                return func && {}.toString.call(func) === '[object Function]';
            };

            var value;
            for(event in events){
                value = events[event];
                if(value){
                    if(isFunction(value)){
                        $target.on(event, value);
                    }else if(value.selector && value.func){
                        $target.on(event, value.selector, value.func);
                    }
                }
            }
        },

        // ajax wrapper
        ajaxAccessor : function(){
            var isEmpty = function(str){
                return !str || str === ""
            };
            return {
                getSync : function(url){
                    if(isEmpty(url)){
                        return;
                    }

                    var result = null;
                    $.ajax({
                        type: "GET",
                        url: url,
                        async: false
                    }).done(function(data){
                        result = data;
                    });
                    return result;
                },

                getAsync : function(url, dataHandler, finishHandler) {
                    if(isEmpty(url)){
                        return;
                    }

                    $.ajax({
                        type: "GET",
                        url: url,
                        cache: false
                    })
                    .done(function(data) {
                        if(dataHandler !== undefined){
                            dataHandler(data);
                        }
                    })
                    .fail(function(res, textStatus, errorThrown){
                        alert("connection failed.");
                    })
                    .always(function(data){
                        if(finishHandler !== undefined){
                            finishHandler();
                        }
                    });
                },

                post : function(url, data, successHandler, failHandler) {
                    if(isEmpty(url)){
                        return;
                    }

                    $.ajax({
                        type: "post",
                        url: url,
                        data: {annotations:data}
                    }).done(successHandler).fail(failHandler);
                }
            };
        }(),

        // set arg1 location.serach
        getUrlParameters: function(url_query) {
            //if exists convert to string and parse
            var querys = url_query ? ("" + url_query).slice(1).split('&') : [];
            var targetUrl = "";
            var configUrl = "";
            var debug = false;

            querys
                .map(function(param) {
                    // convert string "key=value" to object.
                    var vals = param.split("=");
                    return {
                        key: vals[0],
                        val: vals[1]
                    };
                })
                .forEach(function(q) {
                    // parse parameters
                    switch (q.key) {
                        case 'target':
                            targetUrl = q.val;
                            break;
                        case 'config':
                            configUrl = q.val;
                            break;
                        case 'debug':
                            debug = true;
                            break;
                    }
                });

            return {
                target: targetUrl,
                config: configUrl,
                debug: debug
            };
        },

        makeInformationDialog: function() {
            var makeBasicDialog = function() {
                $dialog = $("<div>")
                    .addClass("textae__information-dialog")
                    .addClass(this.className)
                    .hide()
                    .on('mouseup', function() {
                        hide(className);
                    });
                $dialog.addContents = this.addContentsFunc;

                return $dialog;
            };

            var makeDialog = function() {
                return makeBasicDialog.call(this)
                    .addContents();
            }

            var showDialog = function(className, obj) {
                var getDialog = function() {
                    var p = $("." + this.className);
                    // add dialog unless exists
                    if (p.length === 0) {
                        p = makeDialog.call(this);
                        $("body").append(p);
                    }
                    return p;
                }

                var setPositionCenter = function() {
                    var $window = $(window);
                    this.css({
                        "position": "absolute",
                        "top": ($window.height() - this.height()) / 2 + $window.scrollTop(),
                        "left": ($window.width() - this.width()) / 2 + $window.scrollLeft()
                    });
                };

                //close other dialogs
                $(".textae__information-dialog").hide();

                //show at center
                var dialog = getDialog.call(this);
                setPositionCenter.call(dialog);
                dialog.show();

                return false;
            };

            var hideDialog = function(className) {
                $("." + this.className).hide();
                return false;
            };

            var bindMethods = function(param) {
                return {
                    show: showDialog.bind(param),
                    hide: hideDialog.bind(param)
                }
            };

            return bindMethods;
        }()
    };
})();
    //utility functions for button
    //TODO: both main and this plugnin independent global object below. 
    window.buttonUtil = {
        enable: function($button) {
            $button.removeClass('textae-control__icon-bar__icon--disabled');
        },
        disable: function($button) {
            $button.addClass('textae-control__icon-bar__icon--disabled');
        },
        isDisable: function($button) {
            return $button.hasClass('textae-control__icon-bar__icon--disabled');
        },
        push: function($button) {
            $button.addClass('textae-control__icon-bar__icon--pushed');
        },
        unpush: function($button) {
            $button.removeClass('textae-control__icon-bar__icon--pushed');
        },
        isPushed: function($button) {
            return $button.hasClass('textae-control__icon-bar__icon--pushed');
        }
    };
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
// Application main
$(document).ready(function() {
    var mode = 'span';  // screen mode: view | span(default) | relation
    var replicateAuto = false;

    var sourceDoc;
    var pars;

    // selected slements
    var modificationIdsSelected;
    var relationIdsSelected;

    var clipBoard = [];

    // opacity of connectors
    var connOpacity = 0.6;

    // curviness parameters
    var xrate = 0.6;
    var yrate = 0.05;

    // curviness offset
    var c_offset = 20;

    // spanConfig data
    var spanConfig = {
        delimiterCharacters: null,
        nonEdgeCharacters: null,
        defaults: {
                "delimiter characters": [
                    " ",
                    ".",
                    "!",
                    "?",
                    ",",
                    ":",
                    ";",
                    "-",
                    "/",
                    "&",
                    "(",
                    ")",
                    "{",
                    "}",
                    "[",
                    "]",
                    "+",
                    "*",
                    "\\",
                    "\"",
                    "'",
                    "\n",
                    "–"
                ],
                "non-edge characters": [
                    " ",
                    "\n"
                ]
            },
        set: function(config){
            var settings = $.extend({}, this.defaults, config)

            if (settings['delimiter characters'] != undefined) {
                this.delimiterCharacters = settings['delimiter characters'];
            }

            if (settings['non-edge characters'] != undefined) {
                this.nonEdgeCharacters = settings['non-edge characters'];
            }
        },
        isNonEdgeCharacter: function(char){
            return (this.nonEdgeCharacters.indexOf(char) >= 0);
        },
        isDelimiter: function(char){
            return (this.delimiterCharacters.indexOf(char) >= 0);
        }
    };

    var relationTypes;
    var modificationTypes;

    var relationTypeDefault;
    var modificationTypeDefault;

    // annotation data (Objects)
    var annotation_data = function(){
        var updateSpanIds = function(){
            // sort the span IDs by the position
            var spanIds = Object.keys(annotation_data.spans); // maintained sorted by the position.
            var byPosition = function (a, b) {
                var spans = annotation_data.spans;
                return(spans[a].begin - spans[b].begin || spans[b].end - spans[a].end);
            };
            spanIds.sort(byPosition);
            annotation_data.spanIds = spanIds;
        };

        return {
            spans : null,
            entities : null,
            relations : null,
            spanIds: null,
            reset: function(){
                annotation_data.spans     = {};
                annotation_data.entities  = {};
                annotation_data.relations = {};
            },
            //expected span is like { "begin": 19, "end": 49 }
            addSpan: function(span){
                var spanId = getSid(span.begin, span.end);
                annotation_data.spans[spanId] = {begin:span.begin, end:span.end};
                updateSpanIds();
            },
            getSpan: function(spanId){
                return annotation_data.spans[spanId];
            },
            removeSpan: function(spanId){
                delete annotation_data.spans[spanId];
                updateSpanIds();
            },
            //expected denotations Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
            parseDenotations :function(denotations){
                 if (denotations) {
                    denotations.forEach(function(d){
                        var span = d.span;
                        var spanId = getSid(span.begin, span.end);
                        annotation_data.spans[spanId] = {begin:span.begin, end:span.end};
                        var entityType = d.obj;
                        annotation_data.entities[d.id] = {span:spanId, type:entityType};
                    });
                }
                updateSpanIds();
            },
            parseRelations : function(relations){
                if (relations) {
                    relations.forEach(function(r){
                        annotation_data.relations[r.id] = r;
                    });
                };
            },
            getRelationIds :function(){
                return Object.keys(annotation_data.relations);
            },
            toJason : function(){
                var denotations = [];
                for (var e in annotation_data.entities) {
                    var span = {'begin':annotation_data.spans[annotation_data.entities[e]['span']].begin, 'end':annotation_data.spans[annotation_data.entities[e]['span']].end};
                    denotations.push({'id':e, 'span':span, 'obj':annotation_data.entities[e]['type']});
                }

                return  JSON.stringify({
                    "text": sourceDoc,
                    "denotations": denotations
                });
            }
        };
    }();

    var modifications;

    var connectors;
    var connectorTypes;

    // index
    var typesPerSpan;
    var entitiesPerType;
    var relationsPerEntity;

    // target URL
    var targetUrl = '';

    // constant values
    var CONSTS = {
        BLOCK_THRESHOLD : 100,
        TYPE_MARGIN_TOP : 18,
        TYPE_MARGIN_BOTTOM : 2,
        PALLET_HEIGHT_MAX : 100
    };

    // will be API of texteaEditor
    startEdit = function() {
        var setTypeConfig = function(config){
            $textaeEditor.entityTypes.set(config['entity types']);

            relationTypes = {};
            relationTypeDefault = null;
            if (config['relation types'] != undefined) {
                var relation_types = config['relation types'];
                for (var i in relation_types) {
                    relationTypes[relation_types[i]["name"]] = relation_types[i];
                    if (relation_types[i]["default"] == true) {relationTypeDefault = relation_types[i]["name"];}
                }
                if (!relationTypeDefault) {relationTypeDefault = relation_types[0]["name"];}
            }

            connectorTypes = {};

            modificationTypes = {};
            modificationTypeDefault = null;
            if (config['modification types'] != undefined) {
                var mod_types = config['modification types'];
                for (var i in mod_types) {
                    modificationTypes[mod_types[i]["name"]] = mod_types[i];
                    if (mod_types[i]["default"] == true) {modificationTypeDefault = mod_types[i]["name"];}
                }
                if (!modificationTypeDefault) {modificationTypeDefault = mod_types[0]["name"];}
            }

            if (config["css"] != undefined) {
                $('#css_area').html('<link rel="stylesheet" href="' + config["css"] + '"/>');
            }
        };

        var initializeState = function(){
            $('#body').off('mouseup', doMouseup).on('mouseup', doMouseup);

            editHistory.init(editHistoryChanged);
            changeButtonStateReplicate();
            changeButtonStateEntity();
            changeButtonStateDelete();
            changeButtonStatePallet();
            changeButtonStateNewLabel();
            changeButtonStateCopy();
            changeButtonStatePaste();
        };

        initializeState();

        // read default spanConfig
        spanConfig.set();

        if ($textaeEditor.urlParams.debug) {
            //no file is get from server, if debug.
            var types_for_debug = {
                "span types": [{
                    "color": "#0000FF",
                    "name": "Protein",
                    "default": true
                }, {
                    "color": "#FF0000",
                    "name": "Cell"
                }, {
                    "color": "#00FF00",
                    "name": "Transcription"
                }, {
                    "color": "#FFFF00",
                    "name": "Gene_expression"
                }, {
                    "color": "#FF00FF",
                    "name": "Negative_regulation"
                }, {
                    "color": "#00FFFF",
                    "name": "Positive_regulation"
                }, {
                    "color": "#FFFF66",
                    "name": "Regulation"
                }],
                "relation types": [{
                    "color": "#5CFF0A",
                    "name": "locatedAt"
                }, {
                    "color": "#FF0000",
                    "name": "themeOf"
                }, {
                    "color": "#0000FF",
                    "name": "equivalentTo"
                }]
            };
            setTypeConfig(types_for_debug);
        } else {
            if ($textaeEditor.urlParams.config != "") {
                // load sync, because load annotation after load config. 
                var data = textAeUtil.ajaxAccessor.getSync($textaeEditor.urlParams.config); 
                if(data !== null){
                    spanConfig.set(data);
                    setTypeConfig(data);

                    businessLogic.getAnnotationFromServer($textaeEditor.urlParams.target);
                }else{
                    alert('could not read the span configuration from the location you specified.');
                }
            } else {
                businessLogic.getAnnotationFromServer($textaeEditor.urlParams.target);
            }
        }
    }

    function setConnectorTypes() {
        for (var name in relationTypes) {
            var c     = relationColor(name);
            var rgba0 = colorTrans(c, connOpacity);
            var rgba1 = colorTrans(c, 1);

            connectorTypes[name]               = {paintStyle:{strokeStyle:rgba0, lineWidth:1}, hoverPaintStyle:{strokeStyle:rgba1, lineWidth:3}};
            connectorTypes[name + '_selected'] = {paintStyle:{strokeStyle:rgba1, lineWidth:3}, hoverPaintStyle:{strokeStyle:rgba1, lineWidth:3}};
        }
        // jsPlumb.registerConnectionTypes(connectorTypes);
    }

    var buttonState = function(){
        var disableButtons = {};

        return {
            change : function(button, enable){
                if(enable){
                    delete disableButtons[button]
                }else{
                    disableButtons[button] = true;
                }
                $("body").trigger("textae.editor.buttonState.change", disableButtons);

                console.log(button, disableButtons);
            },
        };
    }();

    function changeButtonStateEntity() {
        buttonState.change("entity", numSpanSelection() > 0);
    }

    function changeButtonStatePallet() {
        buttonState.change("pallet", numEntitySelection() > 0);
    }

    function changeButtonStateNewLabel() {
        buttonState.change("newLabel", numEntitySelection() > 0);
    }

    function changeButtonStateDelete() {
        buttonState.change("delete", numSpanSelection() > 0 || $(".ui-selected").length > 0);
    }

    function changeButtonStateCopy() {
        buttonState.change("copy", $(".ui-selected").length > 0);
    }

    function changeButtonStatePaste() {
        buttonState.change("paste", clipBoard.length > 0 && numSpanSelection() > 0);
    }

    function changeButtonStateReplicate() {
        buttonState.change("replicate", numSpanSelection() == 1);
    }

    // histories of edit to undo and redo.
    var editHistory = function (){
        var lastSaveIndex = -1,
            lastEditIndex = -1,
            history = [],
            onChangeFunc,
            trigger = function(){ onChangeFunc && onChangeFunc(); };
        
        return {
            init : function(onChange){
                lastSaveIndex = -1;
                lastEditIndex = -1;
                history = [];
           
                if(onChange !== undefined){
                    onChangeFunc = onChange.bind(this);
                }
                trigger();
            },
            push :function(edits){
                history.push(edits);
                lastEditIndex++;
                trigger();
            },
            next :function(){
                lastEditIndex++;
                trigger();
                return history[lastEditIndex];
            },
            prev :function(){
                var lastEdit = history[lastEditIndex]; 
                lastEditIndex--;
                trigger();
                return lastEdit;
            },
            saved: function(){
                lastSaveIndex = lastEditIndex;
                trigger();
            },
            hasAnythingToUndo : function(){
                return lastEditIndex > -1;
            },
            hasAnythingToRedo : function(){
                return lastEditIndex < history.length - 1;
            },
            hasAnythingToSave : function(){
                return lastEditIndex != lastSaveIndex;
            }
        };
    }();

    //action when editHistory is changed.
    var editHistoryChanged = function(){
        var leaveMessage = function() {
            return "There is a change that has not been saved. If you leave now, you will lose it.";
        };

        //change button state
        buttonState.change("write", this.hasAnythingToSave());
        buttonState.change("undo", this.hasAnythingToUndo());
        buttonState.change("redo", this.hasAnythingToRedo());

        //change leaveMessage show
        if (this.hasAnythingToSave()) {
            $(window).off('beforeunload', leaveMessage).on('beforeunload', leaveMessage);
        } else {
            $(window).off('beforeunload', leaveMessage);
        }
    };

    function parseAnnotationJson(data) {
        //validate
        if(data.text === undefined){
            alert("read failed.");
            return;
        }

        //parse
        sourceDoc = data.text;

        annotation_data.reset();
        annotation_data.parseDenotations(data.denotations);
        annotation_data.parseRelations(data.relations);

        entitiesPerType = {};
        typesPerSpan = {};
        relationsPerEntity = {};
        positions = {};
        connectors = {};

        if (data.denotations != undefined) {
            data.denotations.forEach(function(d){
                //expected d is like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }
                var span = d.span;
                var spanId = getSid(span.begin, span.end);
                var entityType = d.obj;

                $textaeEditor.entityTypes.incrementNumberOfTypes(entityType);

                var tid = getTid(spanId, entityType);
                if (typesPerSpan[spanId]) {
                    if (typesPerSpan[spanId].indexOf(tid) < 0) typesPerSpan[spanId].push(tid);
                }else{
                    typesPerSpan[spanId] = [tid];
                }

                if (entitiesPerType[tid]){
                    entitiesPerType[tid].push(d['id']);
                }else{
                    entitiesPerType[tid] = [d['id']];
                }
            })
        }

        if (data.relations != undefined) {
            data.relations.forEach(function(r){
                if (!relationTypes[r.pred]) {
                    relationTypes[r.pred] = {};
                }

                if (relationTypes[r.pred].count) {
                    relationTypes[r.pred].count++;
                }else {
                    relationTypes[r.pred].count = 1;
                }

                if (relationsPerEntity[r.subj]) {
                    if (relationsPerEntity[r.subj].indexOf(r.id) < 0) {
                        relationsPerEntity[r.subj].push(r.id);
                    }
                } else {
                    relationsPerEntity[r.subj] = [r.id];
                }

                if (relationsPerEntity[r.obj]) {
                    if (relationsPerEntity[r.obj].indexOf(r.id) < 0) {
                        relationsPerEntity[r.obj].push(r.id);
                    }
                } else {
                    relationsPerEntity[r.obj] = [r.id];
                }
            })
        }

        relationIdsSelected = [];
        modificationIdsSelected = [];
    }

    // span Id
    function getSid(begin, end) {
        return begin + '-' + end;
    }

    // type id
    function getTid(sid, type) {
        return sid + '-' + type;
    }

    function indexPositionSpans(ids) {
        for (var i in ids) indexPositionSpan(ids[i]);
    }

    function indexPositionSpan(id) {
        var e = $('#' + id);
        positions[id] = {};
        positions[id].top    = e.get(0).offsetTop;
        positions[id].left   = e.get(0).offsetLeft;
        positions[id].width  = e.outerWidth();
        positions[id].height = e.outerHeight();
        positions[id].center = positions[id].left + positions[id].width/2;
    }

    function indexPositionEntities() {
        Object.keys(annotation_data.entities).forEach(function(id){
            indexPositionEntity(id);
        });
    }

    function indexPositionEntity(id) {
        var gid = 'G' + annotation_data.entities[id].span;
        var e = $('#' + id);
        positions[id] = {};
        positions[id].top    = positions[gid].top + e.get(0).offsetTop;
        positions[id].left   = positions[gid].left + e.get(0).offsetLeft;
        positions[id].width  = e.outerWidth();
        positions[id].height = e.outerHeight();
        positions[id].center = positions[id].left + positions[id].width/2;
    }

    function renderAnnotation() {
        container = document.getElementById("body");
        docArea = document.getElementById("text_box");

        docArea.innerHTML = sourceDoc;
        var lines = docArea.getClientRects();
        var lineSpace = lines[1].top - lines[0].bottom;
        container.style.paddingTop = lineSpace/2 + 'px';

        //set sroucedoc tagged <p> per line.
        docArea.innerHTML = sourceDoc.split("\n").map(function(par){return '<p>' + par + '</p>'}).join("\n");
        pars = {};
        var pid = 0;
        var pre_len = 0;
        $('#text_box p').each(function(){
            // var len = $(this).context.innerText.length;
            var len = $(this).text().length;
            pars['P' + pid] = {begin:pre_len, end:pre_len + len};
            pre_len += len + 1;
            $(this).attr('id', 'P' + pid++);
        });

        $('#annotation_box').empty();

        renderSpans(annotation_data.spanIds);
        indexPositionSpans(annotation_data.spanIds);

        renderEntitiesOfSpans(annotation_data.spanIds);
        renderRelations();
    }

    function relationColor(type) {
        if (relationTypes && relationTypes[type] && relationTypes[type].color) return relationTypes[type].color;
        return "#555555";
    }

    function renderSpans(sids) {
        for (var i = 0; i < sids.length; i++) {
            renderSpan(sids[i], sids.slice(0, i));
        }
    }

    // assume the annotation_data.spanIds are sorted by the position.
    // when there are embedded annotation_data.spans, the embedding ones comes earlier then embedded ones.
    function renderSpan(sid, arguments_spanIds) {
        function getPidBySid(sid) {
            var span = annotation_data.getSpan(sid);
            for (var pid in pars) {

                if ((span.begin >= pars[pid].begin) && (span.end <= pars[pid].end)) return pid;
            }
            return null;
        }

        var element = document.createElement('span');
        element.setAttribute('id', sid);
        element.setAttribute('title', sid);
        element.setAttribute('class', 'span');

        var pid = getPidBySid(sid);
        var beg = annotation_data.spans[sid].begin;
        var end = annotation_data.spans[sid].end;
        var len = end - beg;

        var range = document.createRange();

        var c = arguments_spanIds.indexOf(sid); // index of current span
        if (c < 0) c = arguments_spanIds.length;

        // determine the begin node and offset
        var begnode, begoff;

        // when there is no preceding span in the paragraph
        if ((c == 0) || (getPidBySid(arguments_spanIds[c - 1]) != pid)) {
            var refnode = document.getElementById(pid).childNodes[0];
            if (refnode.nodeType == 1) range.setStartBefore(refnode); // element node
            else if (refnode.nodeType == 3) { // text node
                begnode = refnode;
                begoff  = beg - pars[pid].begin;
                range.setStart(begnode, begoff);
            }
            else alert("unexpected type of node:" + refnode.nodeType + ". please consult the developer.");
        }

        else {
            var p = c - 1; // index of preceding span

            // when the previous span includes the region
            if (annotation_data.spans[arguments_spanIds[p]].end > beg) {
                var refnode = document.getElementById(arguments_spanIds[p]).childNodes[0];
                if (refnode.nodeType == 1) range.setStartBefore(refnode); // element node
                else if (refnode.nodeType == 3) { // text node
                    begnode = refnode;
                    begoff  = beg - annotation_data.spans[arguments_spanIds[p]].begin
                    range.setStart(begnode, begoff);
                }
                else alert("unexpected type of node:" + refnode.nodeType + ". please consult the developer.");
            }

            else {
                // find the outermost preceding span
                var pnode = document.getElementById(arguments_spanIds[p]);
                while (pnode.parentElement &&
                        annotation_data.spans[pnode.parentElement.id] &&
                        annotation_data.spans[pnode.parentElement.id].end > annotation_data.spans[pnode.id].begin &&
                        annotation_data.spans[pnode.parentElement.id].end < end) {pnode = pnode.parentElement}

                begnode = pnode.nextSibling;
                begoff = beg - annotation_data.spans[pnode.id].end;
                range.setStart(begnode, begoff);
            }
        }


        // if there is an embedded span, find the rightmost one.intervening span
        if ((c < arguments_spanIds.length - 1) && (end > annotation_data.spans[arguments_spanIds[c + 1]].begin)) {
            var i = c + 1;  // index of the rightmost embedded span

            // if there is a room for further intervening
            while (i < arguments_spanIds.length - 1) {
                // find the next span at the same level
                var n = i + 1;
                while ((n < arguments_spanIds.length) && (annotation_data.spans[arguments_spanIds[n]].begin < annotation_data.spans[arguments_spanIds[i]].end)) n++;
                if (n == arguments_spanIds.length) break;
                if (end > annotation_data.spans[arguments_spanIds[n]].begin) i = n;
                else break;
            }

            var renode = document.getElementById(arguments_spanIds[i]); // rightmost intervening node
            if (renode.nextSibling) range.setEnd(renode.nextSibling, end - annotation_data.spans[arguments_spanIds[i]].end);
            else range.setEndAfter(renode);
        }

        else {
            range.setEnd(begnode, begoff + len);
        }

        range.surroundContents(element);

        $('#' + sid).off('mouseup', spanClicked).on('mouseup', spanClicked);
    }

    function spanClicked(e) {
        presentationLogic.hidePallet();
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);

        // if drag, bubble up
        if (!selection.isCollapsed) {
            return true;
        }

        if (mode == "span") {
            var id = $(this).attr('id');

            if (e.ctrlKey) {
                if (isSelected(id)) {deselect(id)}
                else {select(id)}
            }

            else if (e.shiftKey && numSpanSelection() == 1) {
                var firstId = popSpanSelection();
                var secondId = $(this).attr('id');

                dismissBrowserSelection();
                clearSelection();

                var firstIndex = annotation_data.spanIds.indexOf(firstId);
                var secondIndex = annotation_data.spanIds.indexOf(secondId);

                if (secondIndex < firstIndex) {
                    var tmpIndex = firstIndex;
                    firstIndex = secondIndex;
                    secondIndex = tmpIndex;
                }

                for (var i = firstIndex; i <= secondIndex; i++) {
                    select(annotation_data.spanIds[i]);
                }
            }

            else {
                clearSelection();
                select(id);
            }
        }

        else if (mode == "relation") {
            var id = $(this).attr('id').split('_')[1];  // in clone area, clone_id

            clearRelationSelection();

            if (numSpanSelection() == 0 && numEntitySelection() == 0) {
                select(id);
            }
            else {
                // make connection
                var rid = "R" + (getMaxConnId() + 1);
                var oid = id;

                var sid;
                if (numSpanSelection() > 0) {sid = getSpanSelection()}
                else {sid = getEntitySelection()}

                makeEdits([{action:'new_relation', id:rid, pred:relationTypeDefault, subj:sid, obj:oid}]);

                // star chanining
                if (e.ctrlKey) {}

                else { 
                    clearSelection();

                    // continuous chaining
                    if (e.shiftKey) {select(oid)}
                }
            }
        }

        changeButtonStateReplicate();
        changeButtonStateEntity();
        changeButtonStateDelete();
        changeButtonStatePaste();
        return false;
    }

    function destroySpan(sid) {
        var span = document.getElementById(sid);
        var parent = span.parentNode;
        while(span.firstChild) {
            parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
        parent.normalize();
    }

    // adjust the beginning position of a span
    function adjustSpanBegin(beginPosition) {
        var pos = beginPosition;
        while (spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos))) {pos++}
        while (!spanConfig.isDelimiter(sourceDoc.charAt(pos)) && pos > 0 && !spanConfig.isDelimiter(sourceDoc.charAt(pos - 1))) {pos--}
        return pos;
    }

    // adjust the end position of a span
    function adjustSpanEnd(endPosition) {
        var pos = endPosition;
        while (spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos - 1))) {pos--}
        while (!spanConfig.isDelimiter(sourceDoc.charAt(pos)) && pos < sourceDoc.length) {pos++}
        return pos;
    }


    // adjust the beginning position of a span for shortening
    function adjustSpanBegin2(beginPosition) {
        var pos = beginPosition;
        while ((pos < sourceDoc.length) && (spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos)) || !spanConfig.isDelimiter(sourceDoc.charAt(pos - 1)))) {pos++}
        return pos;
    }

    // adjust the end position of a span for shortening
    function adjustSpanEnd2(endPosition) {
        var pos = endPosition;
        while ((pos > 0) && (spanConfig.isNonEdgeCharacter(sourceDoc.charAt(pos - 1)) || !spanConfig.isDelimiter(sourceDoc.charAt(pos)))) {pos--}
        return pos;
    }


    function doMouseup(e) {
        var selection = window.getSelection();
        if (selection) {
            var range = selection.getRangeAt(0);

            if (
                // when the whole div is selected by e.g., triple click
                (range.startContainer == $('#text_box').get(0)) ||
                // when Shift is pressed
                (e.shiftKey) ||
                // when nothing is selected
                (selection.isCollapsed)
                )
            {
                // bubbles go up
                cancelSelect();
                dismissBrowserSelection();
                return true;
            }

            var anchorPosition = getAnchorPosition(selection);
            var focusPosition = getFocusPosition(selection);

            // no boundary crossing: normal -> create a entity
            if (selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id) {
                clearSelection();

                // switch the position when the selection is made from right to left
                if (anchorPosition > focusPosition) {
                    var tmpPos = anchorPosition;
                    anchorPosition = focusPosition;
                    focusPosition = tmpPos;
                }

                // when the whole text is selected by e.g., triple click (Chrome)
                if ((anchorPosition == 0) && (focusPosition == sourceDoc.length)) {
                    // do nothing. bubbles go up
                    return true;
                }

                var beginPosition = adjustSpanBegin(anchorPosition);
                var endPosition = adjustSpanEnd(focusPosition);
                var sid = getSid(beginPosition, endPosition);

                if (!annotation_data.spans[sid]) {
                    if (endPosition - beginPosition > CONSTS.BLOCK_THRESHOLD) {
                        makeEdits([{action:'new_span', id:sid, begin:beginPosition, end:endPosition}]);
                    }

                    else {
                        var edits = [{action:'new_span', id:sid, begin:beginPosition, end:endPosition}];

                        if (replicateAuto) {
                            var replicates = getSpanReplicates({begin:beginPosition, end:endPosition});
                            edits = edits.concat(replicates);
                        }
                        if (edits.length > 0) makeEdits(edits);
                    }
                }
            }

            // boundary crossing: exception
            else {
                if (selection.anchorNode.parentNode.parentNode == selection.focusNode.parentNode) {
                    clearSelection();
                    expandSpan(selection.anchorNode.parentNode.id, selection);
                }
                else if (selection.anchorNode.parentNode == selection.focusNode.parentNode.parentNode) {
                    clearSelection();
                    shortenSpan(selection.focusNode.parentNode.id, selection);
                }
                else if (numSpanSelection() == 1) {
                    var sid = popSpanSelection();
                    
                    // drag began inside the selected span (expansion)
                    if ((anchorPosition > annotation_data.spans[sid].begin) && (anchorPosition < annotation_data.spans[sid].end)) {
                        // The focus node should be at one level above the selected node.
                        if ($('#' + sid).get(0).parentNode.id == selection.focusNode.parentNode.id) expandSpan(sid, selection);
                        else {
                            select(sid);
                            alert('A span cannot be expanded to make a boundary crossing.');
                        }
                    }

                    // drag ended inside the selected span (shortening)
                    else if ((focusPosition > annotation_data.spans[sid].begin) && (focusPosition < annotation_data.spans[sid].end)) {
                        if ($('#' + sid).get(0).id == selection.focusNode.parentNode.id) shortenSpan(sid, selection);
                        else {
                            select(sid);
                            alert('A span cannot be shrinked to make a boundary crossing.');
                        }
                    }

                    else alert('It is ambiguous for which span you want to adjust the boundary. Reselect the span, and try again.');
                }
                else {
                    alert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
                }
            }
        }

        dismissBrowserSelection();
        cancelBubble(e);
        return false;
    }


    function cancelBubble(e) {
        e = e || window.event;
        e.cancelBubble = true;
        e.bubbles=false;
        if (e.stopPropagation) e.stopPropagation();
    }


    // get the max value of the connector Id
    function getMaxConnId() {
        var maxIdNum = 0;
        for (var rid in annotation_data.relations) {
            var idNum = parseInt(rid.slice(1));
            if (idNum > maxIdNum) {
                maxIdNum = idNum;
            }
        }
        return maxIdNum;
    }

    // get the max value of the entity Id
    function getMaxEntityId() {
        var maxIdNum = 0;
        for (var eid in annotation_data.entities) {
            var idNum = parseInt(eid.slice(1));
            if (idNum > maxIdNum) {
                maxIdNum = idNum;
            }
        }
        return maxIdNum;
    }

    function cancelSelect(e) {
        // if drag, bubble up
        if (!window.getSelection().isCollapsed) {
            dismissBrowserSelection();
            return true;
        }

        clearSelection();
        clearRelationSelection();
        clearModificationSelection();
        presentationLogic.hidePallet();
        changeButtonStateReplicate();
        changeButtonStateEntity();
        changeButtonStateDelete();
        changeButtonStatePallet();
        changeButtonStateNewLabel();
        changeButtonStateCopy();
        changeButtonStatePaste();

        $("body").trigger("textae.select.cancel");
    }


    function expandSpan(sid, selection) {
        var edits = [];

        var focusPosition = getFocusPosition(selection);

        var range = selection.getRangeAt(0);
        var anchorRange = document.createRange();
        anchorRange.selectNode(selection.anchorNode);

        // expand to the left
        if (range.compareBoundaryPoints(Range.START_TO_START, anchorRange) < 0) {
            var newBegin = adjustSpanBegin(focusPosition);
            var new_sid = getSid(newBegin, annotation_data.spans[sid]['end']);
            if (!annotation_data.spans[new_sid]) {
                edits.push({action:'new_span', id:new_sid, begin:newBegin, end:annotation_data.spans[sid]['end']});
                for (var t in typesPerSpan[sid]) {
                    var tid = typesPerSpan[sid][t];
                    for (var e in entitiesPerType[tid]) {
                        var eid  = entitiesPerType[tid][e];
                        var type = annotation_data.entities[eid].type;
                        edits.push({action:'remove_denotation', id:eid, span:sid, type:type});
                        edits.push({action:'new_denotation', id:eid, span:new_sid, type:type});
                    }
                }
                edits.push({action:'remove_span', id:sid});
            }
        }

        // expand to the right
        else {
            var newEnd = adjustSpanEnd(focusPosition);
            var new_sid = getSid(annotation_data.spans[sid]['begin'], newEnd);
            if (!annotation_data.spans[new_sid]) {
                edits.push({action:'new_span', id:new_sid, begin:annotation_data.spans[sid]['begin'], end:newEnd});
                for (var t in typesPerSpan[sid]) {
                    var tid = typesPerSpan[sid][t];
                    for (var e in entitiesPerType[tid]) {
                        var eid  = entitiesPerType[tid][e];
                        var type = annotation_data.entities[eid].type;
                        edits.push({action:'remove_denotation', id:eid, span:sid, type:type});
                        edits.push({action:'new_denotation', id:eid, span:new_sid, type:type});
                    }
                }
                edits.push({action:'remove_span', id:sid});
            }
        }
        if (edits.length > 0) makeEdits(edits);
    }


    function shortenSpan(sid, selection) {
        var edits = [];

        var focusPosition = getFocusPosition(selection);

        var range = selection.getRangeAt(0);
        var focusRange = document.createRange();
        focusRange.selectNode(selection.focusNode);

        // shorten the right boundary
        if (range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {
            var newEnd = adjustSpanEnd2(focusPosition);

            if (newEnd > annotation_data.spans[sid]['begin']) {
                var new_sid = getSid(annotation_data.spans[sid]['begin'], newEnd);
                if (annotation_data.spans[new_sid]) {
                    edits.push({action:'remove_span', id:sid});
                }
                else {
                    edits.push({action:'new_span', id:new_sid, begin:annotation_data.spans[sid]['begin'], end:newEnd});
                    for (var t in typesPerSpan[sid]) {
                        var tid = typesPerSpan[sid][t];
                        for (var e in entitiesPerType[tid]) {
                            var eid  = entitiesPerType[tid][e];
                            var type = annotation_data.entities[eid].type;
                            edits.push({action:'remove_denotation', id:eid, span:sid, type:type});
                            edits.push({action:'new_denotation', id:eid, span:new_sid, type:type});
                        }
                    }
                    edits.push({action:'remove_span', id:sid});
                }
            }
            else {
                select(sid);
                businessLogic.removeElements();
            }
        }

        // shorten the left boundary
        else {
            var newBegin = adjustSpanBegin2(focusPosition);

            if (newBegin < annotation_data.spans[sid]['end']) {
                var new_sid = getSid(newBegin, annotation_data.spans[sid]['end']);
                if (annotation_data.spans[new_sid]) {
                    edits.push({action:'remove_span', id:sid});
                }
                else {
                    edits.push({action:'new_span', id:new_sid, begin:newBegin, end:annotation_data.spans[sid]['end']});
                    for (var t in typesPerSpan[sid]) {
                        var tid = typesPerSpan[sid][t];
                        for (var e in entitiesPerType[tid]) {
                            var eid  = entitiesPerType[tid][e];
                            var type = annotation_data.entities[eid].type;
                            edits.push({action:'remove_denotation', id:eid, span:sid, type:type});
                            edits.push({action:'new_denotation', id:eid, span:new_sid, type:type});
                        }
                    }
                    edits.push({action:'remove_span', id:sid});
                }
            }
            else {
                select(sid);
                businessLogic.removeElements();
            }
        }
        if (edits.length > 0) makeEdits(edits);
    }

    
    // search same strings
    // both ends should be delimiter characters
    function findSameString(startPos, endPos) {
        var oentity = sourceDoc.substring(startPos, endPos);
        var strLen = endPos - startPos;

        var ary = new Array();
        var from = 0;
        while (true) {
            var sameStrPos = sourceDoc.indexOf(oentity, from);
            if (sameStrPos == -1) break;

            if (!isOutsideDelimiter(sourceDoc, sameStrPos, sameStrPos + strLen)) {
                var obj = {};
                obj['begin'] = sameStrPos;
                obj['end'] = sameStrPos + strLen;

                var isExist = false;
                for(var sid in annotation_data.spans) {
                    if(annotation_data.spans[sid]['begin'] == obj['begin'] && annotation_data.spans[sid]['end'] == obj['end'] && annotation_data.spans[sid].category == obj.category) {
                        isExist = true;
                        break;
                    }
                }

                if(!isExist && startPos != sameStrPos) {
                    ary.push(obj);
                }
            }
            from = sameStrPos + 1;
        }
        return ary;
    }


    function getFocusPosition(selection) {
        // assumption: text_box only includes <p> elements that contains <span> elements that represents annotation_data.spans.
        var cid = selection.focusNode.parentNode.id
        var pos = (cid == 'text_box')? 0 :
                  (cid.charAt(0) == 'P')? pars[cid].begin : annotation_data.spans[cid].begin;

        var childNodes = selection.focusNode.parentElement.childNodes;
        for (var i = 0; childNodes[i] != selection.focusNode; i++) { // until the focus node
            pos += (childNodes[i].nodeName == "#text")? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
        }

        return pos += selection.focusOffset;
    }


    function getAnchorPosition(selection) {
        // assumption: text_box only includes <p> elements that contains <span> elements that represents annotation_data.spans.
        var cid = selection.anchorNode.parentNode.id
        var pos = (cid == 'text_box')? 0 :
                  (cid.charAt(0) == 'P')? pars[cid].begin : annotation_data.spans[cid].begin;

        var childNodes = selection.anchorNode.parentNode.childNodes;
        for (var i = 0; childNodes[i] != selection.anchorNode; i++) { // until the anchor node
            pos += (childNodes[i].nodeName == "#text")? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
        }

        return pos + selection.anchorOffset;
    }


    // check the bondaries: used after replication
    function isOutsideDelimiter(document, startPos, endPos) {
        var precedingChar = document.charAt(startPos-1);
        var followingChar = document.charAt(endPos);

        if (!spanConfig.isDelimiter(precedingChar) || !spanConfig.isDelimiter(followingChar)) {return true}
        else {return false}
    }


    // dismiss the default selection by the browser
    function dismissBrowserSelection() {
        if (window.getSelection){
            var selection = window.getSelection();
            selection.collapse(document.body, 0);
        } else {
            var selection = document.selection.createRange();
            selection.setEndPoint("EndToStart", selection);
            selection.select();
        }
    }

    function isSelected(id) {
        return ($('#' + id + '.ui-selected').length > 0);
    }

    function select(id) {
        $('#' + id).addClass('ui-selected');
        changeButtonStatePallet();
        changeButtonStateNewLabel();
        changeButtonStateDelete();
        changeButtonStateCopy();
    }

    function deselect(id) {
        $('#' + id).removeClass('ui-selected');
        changeButtonStatePallet();
        changeButtonStateNewLabel();
        changeButtonStateDelete();
        changeButtonStateCopy();
    }

    function clearSelection() {
        $('.ui-selected').removeClass('ui-selected');
        changeButtonStatePallet();
        changeButtonStateNewLabel();
        changeButtonStateDelete();
        changeButtonStateCopy();
    }

    function numSpanSelection() {
        return $('.span.ui-selected').length;
    }

    function popSpanSelection() {
        var ss = $('.span.ui-selected')
        if (ss.length == 1) {
            ss.removeClass('ui-selected');
            return ss.attr('id');
        }
        else return null;
    }

    function getSpanSelection() {
        return $('.span.ui-selected').attr('id');
    }


    function selectEntity(eid) {
        $('#' + eid).addClass('ui-selected');
    }

    function clearEntitySelection() {
        $('.entity.ui-selected').removeClass('ui-selected');
    }

    function numEntitySelection() {
        return $('.entity.ui-selected').length;
    }

    function getSpanSelection() {
        return $('.entity.ui-selected').attr('id');
    }

    function createModification(pred) {
        var i;

        if (mode == "relation") {
            return;

            for(i = 0; i <  relationIdsSelected.length; i++) {
                var conn = relationIdsSelected[i];

                var obj = {};
                obj['pred'] = pred;
                obj['obj'] = conn.getParameter('connId');
                obj['id'] = 'M' + (getMaxModificationId() + 1);
                obj['created_at'] = (new Date()).getTime();

                modifications.push(obj);

                // add to selection
                modificationIdsSelected.push(obj["id"]);
            }

            relationIdsSelected.length = 0;

        } else if (mode == "span") {
            var edits = [];

            var maxIdNum = getMaxModificationId(); 
            for (i = 0; i < instanceIdsSelected.length; i++) {
                var iid = instanceIdsSelected[i];
                if ($('#' + iid + ' .modification.' + pred).length) continue;
                var mid = "M" + (++maxIdNum);
                edits.push({action:'new_modification', id:mid, obj:iid, pred:pred});
            }

            if (edits.length > 0) makeEdits(edits);
        }
    }

    function modificationClicked(e) {
        if (mode == 'span' || mode == 'relation') {
            cancelBubble(e);
            var id = $(this).attr('id');

            if (e.ctrlKey) {
                if (isModificationSelected(id)) {deselectModification(id)}
                else {selectModification(id)}
            }

            else {
                clearSelection();
                clearModificationSelection();
                selectModification(id);
            }
        }
    }


    //user event to edit model
    var businessLogic = {
        loadAnnotation : function(annotation) {
            var initJsPlumb = function () {
                jsPlumb.reset();
                jsPlumb.setRenderMode(jsPlumb.SVG);
                jsPlumb.Defaults.Container = $("#annotation_box");
                jsPlumb.importDefaults({
                    ConnectionsDetachable:false,
                    Endpoint:[ "Dot", { radius:1 } ]
                });
                setConnectorTypes();
            };

            parseAnnotationJson(annotation);
            editHistory.init();

            initJsPlumb();
            renderAnnotation();
            presentationLogic.showTarget(targetUrl);
        },

        getAnnotationFromServer : function(url) {
            targetUrl = url;
            $textaeEditor.startWait();
            textAeUtil.ajaxAccessor.getAsync(url, businessLogic.loadAnnotation, function(){$textaeEditor.endWait()});
        },
        saveAnnotationToServer : function(url) {
            $textaeEditor.startWait();
            var postData = annotation_data.toJason();
            textAeUtil.ajaxAccessor.post(url, postData, function(){
                $('#message').html("annotation saved").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    presentationLogic.showTarget(targetUrl);
                });
                editHistory.saved();
                $textaeEditor.endWait();
            },function(){
                $('#message').html("could not save").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    presentationLogic.showTarget(targetUrl);
                });
                $textaeEditor.endWait();
            });
        },
        undo : function() {
            clearSelection();
            clearRelationSelection();
            clearModificationSelection();

            revertEdits(editHistory.prev());
        },

        redo : function() {
            clearSelection();
            clearRelationSelection();
            clearModificationSelection();

            makeEdits(editHistory.next(), 'redo');

            return false;
        },

        replicate : function() {
            if (numSpanSelection() == 1) {
                makeEdits(getSpanReplicates(annotation_data.spans[getSpanSelection()]));
            }
            else alert('You can replicate span annotation when there is only span selected.');
        },

        toggleReplicateAuto : function() {
            $button = $textaeControl.buttons.replicateAuto.obj;
            if (!buttonUtil.isDisable($button)) {
                if(buttonUtil.isPushed($button)){
                    buttonUtil.unpush($button);
                    replicateAuto = false;
                    console.log("unpush");
                }else{
                    buttonUtil.push($button);
                    replicateAuto = true;
                    console.log("push");
                }
            }
        },

        createEntity : function() {
            clearEntitySelection();

            var maxIdNum = getMaxEntityId()
            while (numSpanSelection() > 0) {
                sid = popSpanSelection();
                var id = "E" + (++maxIdNum);
                makeEdits([{action:'new_denotation', id:id, span:sid, type:$textaeEditor.entityTypes.getDefaultType()}]);
            }
        },
    
        newLabel : function() {
            if ($(".entity.ui-selected").length > 0) {
                var new_type = prompt("Please enter a new label","");

                var edits = [];
                $(".entity.ui-selected").each(function() {
                    var eid = this.id;
                    edits.push({action:'change_entity_type', id:eid, old_type:annotation_data.entities[eid].type, new_type:new_type});
                });
                if (edits.length > 0) makeEdits(edits);
            }
            return false;
        },

        removeElements : function() {
            var spanRemoves = new Array();
            $(".span.ui-selected").each(function() {
                var sid = this.id;
                spanRemoves.push({action:'remove_span', id:sid});
                for (var t in typesPerSpan[sid]) {
                    var tid = typesPerSpan[sid][t];
                    for (var e in entitiesPerType[tid]) {
                        var eid = entitiesPerType[tid][e];
                        selectEntity(eid);
                    }
                }
            });

            var entityRemoves = new Array();
            $(".entity.ui-selected").each(function() {
                var eid = this.id;
                entityRemoves.push({action:'remove_denotation', id:eid, span:annotation_data.entities[eid].span, type:annotation_data.entities[eid].type});
                for (var r in relationsPerEntity[eid]) {
                    var rid = relationsPerEntity[eid][r];
                    selectRelation(rid);
                }
            });

            var relationRemoves = new Array();
            while (relationIdsSelected.length > 0) {
                rid = relationIdsSelected.pop();
                relationRemoves.push({action:'remove_relation', id:rid, subj:annotation_data.relations[rid].subj, obj:annotation_data.relations[rid].obj, pred:annotation_data.relations[rid].pred});
            }

            var modificationRemoves = new Array();
            while (modificationIdsSelected.length > 0) {
                mid = modificationIdsSelected.pop();
                modificationRemoves.push({action:'remove_modification', id:mid, obj:modifications[mid].obj, pred:modifications[mid].pred});
            }

            var edits = modificationRemoves.concat(relationRemoves, entityRemoves, spanRemoves);

            if (edits.length > 0) makeEdits(edits);
        },

        copyEntities : function() {
            clipBoard.length = 0;
            $(".ui-selected").each(function() {
                 clipBoard.push(this.id);
             });
        },

        pasteEntities : function() {
            var edits = new Array();
            var maxIdNum = getMaxEntityId()
            while (sid = popSpanSelection()) {
                for (var e in clipBoard) {
                    var id = "E" + (++maxIdNum);
                    edits.push({action:'new_denotation', id:id, span:sid, type:annotation_data.entities[clipBoard[e]].type});
                }
            }
            if (edits.length > 0) makeEdits(edits);
        },

        // set the default type of denoting object
        setEntityTypeDefault:function () {
            $textaeEditor.entityTypes.setDefaultType($(this).attr('label'));
            return false;
        },

        // set the type of an entity
        setEntityType:function() {
            var new_type = $(this).attr('label')
            var edits = [];
            $(".entity.ui-selected").each(function() {
                var eid = this.id;
                edits.push({action:'change_entity_type', id:eid, old_type:annotation_data.entities[eid].type, new_type:new_type});
            });
            if (edits.length > 0) makeEdits(edits);
            return false;
        }
    };

    //user event that does not change data.
    var presentationLogic = {
        showTarget :function(targetUrl) {
            if (targetUrl != "") {
                var targetDoc = targetUrl.replace(/\/annotations\.json$/, '');
                $('#message').html("(Target: <a href='" + targetDoc + "'>" + targetDoc + "</a>)");
            }
        },

        showPallet : function(controlEvent, buttonEvent) {
            //create table contents for entity type.
            var makeEntityTypeOfEntityTypePallet = function(entityTypes){
                return entityTypes.getSortedNames().map(function(t){
                    var type = entityTypes.getType(t);
                    var row = '<tr class="textae-control__entity-pallet__entity-type" style="background-color:' + type.getColor() + '">';

                    row += '<th><input type="radio" name="etype" class="textae-control__entity-pallet__entity-type__radio" label="' + t + '"';
                    row += (t == entityTypes.getDefaultType())? ' title="default type" checked' : '';
                    row += '/></th>';

                    row += '<td class="textae-control__entity-pallet__entity-type__label" label="' + t + '">' + t + '</td>';

                    row += '<th title="' + uri + '">';

                    var uri = type["uri"];
                    if (uri) {
                        row += '<a href="' + uri + '" target="_blank"><img src="images/link.png"/></a>'
                    };

                    row += '</th>'

                    row += '</tr>';
                    return row;
                }).join();
            };

            //return a Pallet that created if not exists.
            var getEmptyPallet = function() {
                var $pallet = $('.textae-control__entity-pallet');
                if ($pallet.length === 0){
                    //setup new pallet
                    $pallet = $('<div>')
                        .addClass("textae-control__entity-pallet")
                        .append($('<table>'))
                        .css({
                            'position': 'absolute',
                            'display': 'none'
                        })
                        .on('mouseup', '.textae-control__entity-pallet__entity-type__radio', businessLogic.setEntityTypeDefault)
                        .on('mouseup', '.textae-control__entity-pallet__entity-type__label', businessLogic.setEntityType);

                    //for show on top append to body.
                    $("body").append($pallet);
                }else{
                    $pallet.find('table').empty();
                    $pallet.css('width', 'auto');                   
                }
                return $pallet;
            };

            var $pallet　= getEmptyPallet();
            $pallet.find("table")
                .append(makeEntityTypeOfEntityTypePallet($textaeEditor.entityTypes));

            //limti max height.
            if ($pallet.outerHeight() > CONSTS.PALLET_HEIGHT_MAX) {
                $pallet.css('height', CONSTS.PALLET_HEIGHT_MAX);
                $pallet.css('width', $pallet.outerWidth() + 15);
            }

            //if open by mouseevent
            if(arguments.length === 2){
                $pallet.css('top', buttonEvent.clientY - controlEvent.target.offsetTop);
                $pallet.css('left', buttonEvent.clientX - controlEvent.target.offsetLeft);
            }
            $pallet.css('display', 'block');
            return false;
        },

        hidePallet :function(){
            $('.textae-control__entity-pallet').css('display', 'none');
        },

        redraw : function() {
            indexPositionSpans(annotation_data.spanIds);
            positionGrids(annotation_data.spanIds);

            indexPositionEntities();
            renewConnections();
        },
    };

    function getSpanReplicates(span) {
        var startPos = span['begin'];
        var endPos   = span['end'];

        var cspans = findSameString(startPos, endPos); // candidate annotation_data.spans

        var nspans = new Array(); // new annotation_data.spans
        for (var i = 0; i < cspans.length; i++) {
            cspan = cspans[i];

            // check boundary crossing
            var crossing_p = false;
            for (var sid in annotation_data.spans) {
                if (
                    (cspan['begin'] > annotation_data.spans[sid]['begin'] && cspan['begin'] < annotation_data.spans[sid]['end'] && cspan['end'] > annotation_data.spans[sid]['end'])
                    ||
                    (cspan['begin'] < annotation_data.spans[sid]['begin'] && cspan['end'] > annotation_data.spans[sid]['begin'] && cspan['end'] < annotation_data.spans[sid]['end'])
                   ) {
                   crossing_p = true;
                   break;
                }
            }

            if(!crossing_p) {
                nspans.push(cspan);
            }
        }

        var edits = new Array();
        for (var i = 0; i < nspans.length; i++) {
            var nspan = nspans[i];
            var id = getSid(nspan['begin'], nspan['end']);
            edits.push({action: "new_span", id:id, begin:nspan['begin'], end:nspan['end']});
        }

        return edits;
    }

    function makeEdits(edits, context) {
        switch (context) {
            case 'undo' :
            case 'redo' :
                clearSelection();
                clearRelationSelection();
                break;
            default :
        }

        for (var i in edits) {
            var edit = edits[i];
            switch (edit.action) {
                // span operations
                case 'new_span' :
                    // model
                    annotation_data.addSpan({begin:edit.begin, end:edit.end});
                    typesPerSpan[edit.id] = new Array();
                    // rendering
                    renderSpan(edit.id, annotation_data.spanIds);
                    indexPositionSpan(edit.id);
                    // select
                    select(edit.id);
                    break;
                case 'remove_span' :
                    //save span potision for undo
                    var span = annotation_data.getSpan(edit.id);
                    edit.begin = span.begin;
                    edit.end = span.end;
                    //model
                    annotation_data.removeSpan(edit.id);
                    delete typesPerSpan[edit.id];
                    //rendering
                    destroySpan(edit.id);
                    break;

                // entity operations
                case 'new_denotation' :
                    // model
                    annotation_data.entities[edit.id] = {id:edit.id, span:edit.span, type:edit.type};
                    var tid = getTid(edit.span, edit.type);
                    if (typesPerSpan[edit.span].indexOf(tid) < 0) {
                        typesPerSpan[edit.span].push(tid);
                        entitiesPerType[tid] = new Array();
                        renderGridAsso(edit.span);
                    }
                    entitiesPerType[tid].push(edit.id);
                    // rendering
                    renderEntity(edit.id);
                    // select
                    selectEntity(edit.id);
                    break;
                case 'remove_denotation' :
                    //model
                    delete annotation_data.entities[edit.id];
                    var tid = getTid(edit.span, edit.type);
                    var arr = entitiesPerType[tid];
                    arr.splice(arr.indexOf(edit.id), 1);
                    //rendering
                    destroyEntity(edit.id);
                    positionEntities(edit.span, edit.type);
                    // consequence
                    if (entitiesPerType[tid].length == 0) {
                        delete entitiesPerType[tid];
                        arr = typesPerSpan[edit.span];
                        arr.splice(arr.indexOf(tid), 1);
                        destroyType(tid);
                        renderGridAsso(edit.span);
                    }
                    break;
                case 'change_entity_type' :
                    //model
                    annotation_data.entities[edit.id].type = edit.new_type;
                    //rendering
                    renderEntity(edit.id);
                    break;

                // relation operations
                case 'new_relation' :
                    // model
                    annotation_data.relations[edit.id] = {id:edit.id, subj:edit.subj, obj:edit.obj, pred:edit.pred};
                    if (relationsPerEntity[edit.subj]) {
                        if (relationsPerEntity[edit.subj].indexOf(edit.id) < 0) relationsPerEntity[edit.subj].push(edit.id);
                    } 
                    else relationsPerEntity[edit.subj] = [edit.id];

                    if (relationsPerEntity[edit.obj]) {
                        if (relationsPerEntity[edit.obj].indexOf(edit.id) < 0) relationsPerEntity[edit.obj].push(edit.id);
                    } 
                    else relationsPerEntity[edit.obj] = [edit.id];
                    // rendering
                    connectors[edit.id] = renderRelation(edit.id);
                    // selection
                    selectRelation(edit.id);
                    break;
                case 'remove_relation' :
                    // model
                    delete annotation_data.relations[edit.id];
                    var arr = relationsPerEntity[edit.subj];
                    arr.splice(arr.indexOf( edit.id ), 1);
                    if (arr.length == 0) delete relationsPerEntity[edit.subj]
                    arr = relationsPerEntity[edit.obj];
                    arr.splice(arr.indexOf( edit.id ), 1);
                    if (arr.length == 0) delete relationsPerEntity[edit.obj]
                    // rendering
                    destroyRelation(edit.id);
                    break;
                case 'change_relation_pred' :
                    // model
                    annotation_data.relations[edit.id].pred = edit.new_pred;
                    // rendering
                    connectors[edit.id].setPaintStyle(connectorTypes[edit.new_pred+"_selected"]["paintStyle"]);
                    connectors[edit.id].setHoverPaintStyle(connectorTypes[edit.new_pred+"_selected"]["hoverPaintStyle"]);
                    connectors[edit.id].setLabel('[' + edit.id + '] ' + edit.new_pred);
                    // selection
                    selectRelation(edit.id);
                    break;

                // modification operations
                case 'new_modification' :
                    // model
                    modifications[edit.id] = {id:edit.id, obj:edit.obj, pred:edit.pred};
                    // rendering
                    renderModification(edit.id);
                    break;
                case 'remove_modification' :
                    // model
                    delete modifications[edit.id];
                    // rendering
                    destroyModification(edit.id);
                    break;
                default :
                    // do nothing
            }
        }

        // update rendering
        presentationLogic.redraw();

        switch (context) {
            case 'undo' :
            case 'redo' :
                break;
            default :
                editHistory.push(edits);
                changeButtonStateReplicate();
                changeButtonStateEntity();
                changeButtonStateDelete();
                changeButtonStatePallet();
                changeButtonStateNewLabel();
                changeButtonStateCopy();
                changeButtonStatePaste();
        }
    }


    function revertEdits(edits) {
        var redits = new Array();
        for (var i = edits.length - 1; i >= 0; i--) {
            edit = edits[i];
            var redit = cloneEdit(edit);
            switch (edit.action) {
                case 'new_span' :
                    redit.action = 'remove_span';
                    break;
                case 'remove_span' :
                    redit.action = 'new_span';
                    break;
                case 'new_denotation' :
                    redit.action = 'remove_denotation';
                    break;
                case 'remove_denotation' :
                    redit.action = 'new_denotation';
                    break;
                case 'change_entity_type' :
                    redit.old_type = edit.new_type;
                    redit.new_type = edit.old_type;
                    break;
                case 'new_relation' :
                    redit.action = 'remove_relation';
                    break;
                case 'remove_relation' :
                    redit.action = 'new_relation';
                    break;
                case 'change_relation_subj' :
                    redit.old_subj = edit.new_subj;
                    redit.new_subj = edit.old_subj;
                    break;
                case 'change_relation_obj' :
                    redit.old_obj = edit.new_obj;
                    redit.new_obj = edit.old_obj;
                    break;
                case 'change_relation_pred' :
                    redit.old_pred = edit.new_pred;
                    redit.new_pred = edit.old_pred;
                    break;
                case 'new_modification' :
                    redit.action = 'remove_modification';
                    break;
                case 'remove_modification' :
                    redit.action = 'new_modification';
                    break;
            }
            redits.push(redit);
        }
        makeEdits(redits, 'undo');
    }

    function cloneEdit(e) {
        c = {};
        for (p in e) {c[p] = e[p]}
        return c;
    }

    // conversion from HEX to RGBA color
    function colorTrans(color, opacity) {
        var c = color.slice(1);
        var r = c.substr(0,2);
        var g = c.substr(2,2);
        var b = c.substr(4,2);
        r = parseInt(r, 16);
        g = parseInt(g, 16);
        b = parseInt(b, 16);

        return 'rgba(' + r + ', ' +  g + ', ' + b + ', ' + opacity + ')';
    }

    function renderRelations() {
        var rids = annotation_data.getRelationIds();
        jsPlumb.reset();

        rids.forEach(function(rid){
            connectors[rid] = renderRelation(rid);
        });
    }

    var determineCurviness = function(sourceId, targetId){
        var sourceX = positions[sourceId].center;
        var targetX = positions[targetId].center;

        var sourceY = positions[sourceId].top;
        var targetY = positions[targetId].top;

        var xdiff = Math.abs(sourceX - targetX);
        var ydiff = Math.abs(sourceY - targetY);
        var curviness = xdiff * xrate + ydiff * yrate + c_offset;
        curviness /= 2.4;

        return curviness;
    };

    function renewConnections() {
        var rids = annotation_data.getRelationIds();

        rids.forEach(function(rid){
            // recompute curviness
            var sourceId = annotation_data.relations[rid].subj;
            var targetId = annotation_data.relations[rid].obj;
            var curviness = determineCurviness(sourceId, targetId);

            if (sourceId == targetId) curviness = 30;

            var conn = connectors[rid];
            var label = conn.getLabel();
            conn.endpoints[0].repaint();
            conn.endpoints[1].repaint();
            conn.setConnector(["Bezier", {curviness:curviness}]);
        });
    }

    function renderRelation (rid) {
        var sourceId = annotation_data.relations[rid].subj;
        var targetId = annotation_data.relations[rid].obj;
        var curviness = determineCurviness(sourceId,targetId);

        //  Determination of anchor points
        var sourceAnchor = "TopCenter";
        var targetAnchor = "TopCenter";

        // In case of self-reference
        if (sourceId == targetId) {
            sourceAnchor = [0.5, 0, -1, -1];
            targetAnchor = [0.5, 0, 1, -1];
            curviness = 30;
        }

        // make connector
        var pred = annotation_data.relations[rid]['pred'];
        var rgba = colorTrans(relationColor(pred), connOpacity);
        var sourceElem = $('#' + sourceId);
        var targetElem = $('#' + targetId);

        var label = '[' + rid + '] ' + pred;

        var conn = jsPlumb.connect({
            source:sourceElem,
            target:targetElem,
            anchors:[sourceAnchor, targetAnchor],
            connector:[ "Bezier", {curviness:curviness}],
            paintStyle: connectorTypes[pred]["paintStyle"],
            hoverPaintStyle: connectorTypes[pred]["hoverPaintStyle"],
            tooltip:'[' + rid + '] ' + pred,
            parameters:{"id":rid, "label":label}
        });

        conn.addOverlay(["Arrow", { width:10, length:12, location:1 }]);
        conn.setLabel({label:label, cssClass:"label"});
        conn.bind("click", connectorClicked);
        return conn;       
    }

    function connectorClicked (conn, e) {
        var rid  = conn.getParameter("id");

        clearSelection();

        if (isRelationSelected(rid)) {
            deselectRelation(rid);
        } else {
            if (!e.ctrlKey) {clearRelationSelection()}
            selectRelation(rid);
        }

        cancelBubble(e);
        return false;
    }

    function isRelationSelected(rid) {
        return (relationIdsSelected.indexOf(rid) > -1);
    }

    function selectRelation(rid) {
        if (!isRelationSelected(rid)) {
            connectors[rid].setPaintStyle(connectorTypes[annotation_data.relations[rid].pred + "_selected"]["paintStyle"]);
            relationIdsSelected.push(rid);
        }
    }

    function deselectRelation(rid) {
        var i = relationIdsSelected.indexOf(rid);
        if (i > -1) {
            connectors[rid].setPaintStyle(connectorTypes[annotation_data.relations[rid].pred]["paintStyle"]);
            relationIdsSelected.splice(i, 1);
        }
    }

    function clearRelationSelection() {
        while (relationIdsSelected.length > 0) {
            var rid = relationIdsSelected.pop();
            connectors[rid].setPaintStyle(connectorTypes[annotation_data.relations[rid].pred]["paintStyle"]);
        }
    }

    function destroyRelation(rid) {
        var c = connectors[rid];
        jsPlumb.detach(c);
        // var endpoints = c.endpoints;
        // jsPlumb.deleteEndpoint(endpoints[0]);
        // jsPlumb.deleteEndpoint(endpoints[1]);
    }

    var renderSize = {
        gridWidthGap : 0,
        typeHeight : 0,
        entityWidth : 0,
        mesure : function() {
            var div = '<div id="temp_grid" class="grid" style="width:10px; height:auto"></div>';
            $('#annotation_box').append(div);

            div = '<div id="temp_type" class="type" title="[Temp] Temp" >T0</div>';
            $('#temp_grid').append(div);

            div = '<div id="temp_entity_pane" class="entity_pane"><div id="temp_entity" class="entity"></div></div>';
            $('#temp_type').append(div);

            renderSize.gridWidthGap = $('#temp_grid').outerWidth() - 10;
            renderSize.typeHeight   = $('#temp_type').outerHeight();
            renderSize.entityWidth  = $('#temp_entity').outerWidth();
            $('#temp_grid').remove();
        }
    };

    function renderEntitiesOfSpans(sids) {
        renderSize.mesure();

        sids.forEach(function(sid){
            renderEntitiesOfSpan(sid);
        });
    }

    function renderEntitiesOfSpan(sid) {
        renderGrid(sid);
        for (var t in typesPerSpan[sid]) {
            var tid = typesPerSpan[sid][t];
            for (var e in entitiesPerType[tid]) {
                var eid = entitiesPerType[tid][e];
                renderEntity(eid);
            }
        }
    }

    function isSpanEmbedded(s1, s2) {
        return (s1.begin >= s2.begin) && (s1.end <= s2.end)
    }

    // render the entity pane of a given span and its dependent annotation_data.spans.
    function renderGridAsso(sid) {
        renderGrid(sid);

        // see if the pane of the parent node needs to be updated
        var pnode = document.getElementById(sid).parentElement;
        while (pnode && pnode.id && annotation_data.spans[pnode.id]) {
            renderGridAsso(pnode.id);
            pnode = pnode.parentElement;
        }
    }

    function renderGrid(sid) {
        var id = 'G' + sid;

        if (typesPerSpan[sid].length < 1) {
            var grid = $('#' + id);
            if (grid.length > 0) {
                grid.remove();
                delete positions[id];
            }
            return null;
        }
        else {
            // decide the offset
            var offset = CONSTS.TYPE_MARGIN_BOTTOM;

            // check the following annotation_data.spans that are embedded in the current span.
            var c = annotation_data.spanIds.indexOf(sid)
            for (var f = c + 1; (f < annotation_data.spanIds.length) && isSpanEmbedded(annotation_data.spans[annotation_data.spanIds[f]], annotation_data.spans[annotation_data.spanIds[c]]); f++) {
                var cid = 'G' + annotation_data.spanIds[f];
                if (positions[cid] && ((positions[cid].offset + positions[cid].height) < offset)) offset = (positions[cid].offset + positions[cid].height) + CONSTS.TYPE_MARGIN_TOP + CONSTS.TYPE_MARGIN_BOTTOM;
            }

            var n = typesPerSpan[sid].length;
            var gridHeight = n * (renderSize.typeHeight + CONSTS.TYPE_MARGIN_BOTTOM + CONSTS.TYPE_MARGIN_TOP);

            positions[id]        = {}
            positions[id].offset = offset;
            positions[id].top    = positions[sid].top - offset - gridHeight;
            positions[id].left   = positions[sid].left;
            positions[id].width  = positions[sid].width - renderSize.gridWidthGap;
            positions[id].height = gridHeight;

            if ($('#' + id).length == 0) {
                createDiv(id, 'grid', positions[id].top, positions[id].left, positions[id].width, positions[id].height);
                $('#' + id).off('mouseover mouseout', gridMouseHover).on('mouseover mouseout', gridMouseHover);
                // $('#' + id).off('mouseup', doNothing).on('mouseup', doNothing);
            } else {
                var grid = $('#' + id);
                grid.css('top',    positions[id].top);
                grid.css('left',   positions[id].left);
                grid.css('width',  positions[id].width);
                grid.css('height', positions[id].height);
            }
            return id;
        }
    }

    function gridMouseHover(e) {
        var grid = $(this);
        var id = grid.attr('id');

        if (e.type == 'mouseover') {
            grid.css('height', 'auto');
            if (grid.outerWidth() < positions[id]['width']) grid.css('width', positions[id]['width']);
            // grid.css('z-index', '254');
        }
        else {
            grid.css('height', positions[id]['height']);
            // grid.css('z-index', '');
        }
    }

    function positionGrids(sids) {
        for (var s = sids.length - 1; s >= 0; s--) positionGrid(annotation_data.spanIds[s]);
    }

    function positionGrid(sid) {
        var gid = 'G' + sid
        var grid = $('#' + gid);
        if (grid.length > 0) {
            positions[gid].top  = positions[sid].top - positions[gid].offset - positions[gid].height;
            positions[gid].left = positions[sid].left;
            grid.css('top',  positions[gid].top);
            grid.css('left', positions[sid].left);
        }
    }

    function destroyGrid(sid) {
        $('#G' + sid).remove();
    }

    function createDiv(id, cls, top, left, width, height, title) {
        $('#annotation_box').append('<div id="' + id + '"></div');
        var div = $('#' + id);
        div.addClass(cls);
        div.attr('title', title);
        div.css('position', 'absolute');
        div.css('top', top);
        div.css('left', left);
        div.css('width', width);
        div.css('height', height);
        return id;
    }

    //label over span
    function renderType(type, sid) {
        var tid = getTid(sid, type);

        if ($('#' + tid).length == 0) {
            $('#G' + sid).append('<div id="' + tid +'"></div>');
            var t = $('#' + tid);
            t.addClass('type');
            t.css('background-color', $textaeEditor.entityTypes.getType(type).getColor());
            t.css('margin-top', CONSTS.TYPE_MARGIN_TOP);
            t.css('margin-bottom', CONSTS.TYPE_MARGIN_BOTTOM);
            t.attr('title', type);
            t.append('<div id="P-' + tid + '" class="entity_pane"></div>');
            t.append('<div class="type_label">' + type + '</div>');
        }

        return tid;
    }

    function destroyType(tid) {
        $('#' + tid).remove();
    }

    //a circle on Type
    function renderEntity(eid) {
        if ($('#' + eid).length == 0) {
            var entity = annotation_data.entities[eid];
            var type = entity['type'];
            var sid  = entity['span'];
            var tid = renderType(type, sid);
            var div = '<div id="' + eid +'" class="entity" />';

            var p = $('#P-' + tid);
            p.append(div);
            p.css('left', (positions['G' + sid].width - (renderSize.entityWidth * entitiesPerType[tid].length)) / 2);

            var e = $('#' + eid);
            e.attr('title', eid);
            e.css('display: inline-block');
            e.css('border-color', $textaeEditor.entityTypes.getType(type).getColor());
            e.off('mouseup', entityClicked).on('mouseup', entityClicked);
            indexPositionEntity(eid);
        }
    }

    function positionEntities(sid, type) {
        var tid = getTid(sid, type);
        $('#P-' + tid).css('left', (positions['G' + sid].width - (renderSize.entityWidth * entitiesPerType[tid].length)) / 2);
    }

    // event handler (entity is clicked)
    function entityClicked(e) {
        var id = $(this).attr('id');

        if (mode == "span") {
            if (e.ctrlKey) {
                if (isSelected(id)) {deselect(id)}
                else {select(id)}
            }
            else {
                clearSelection();
                select(id);
            }
        }

        else if (mode == "relation") {
            clearRelationSelection();

            if (numSpanSelection() == 0 && numEntitySelection() == 0) {
                selectEntity(id);
            }
            else {
                // make connection
                var rid = "R" + (getMaxConnId() + 1);
                var oid = id;

                var sid;
                if (numSpanSelection() > 0) {sid = getSpanSelection()}
                else {sid = getEntitySelection()}

                makeEdits([{action:'new_relation', id:rid, pred:relationTypeDefault, subj:sid, obj:oid}]);

                // star chanining
                if (e.ctrlKey) {}

                else { 
                    clearSelection();

                    // continuous chaining
                    if (e.shiftKey) {select(oid)}
                }
            }
        }

        cancelBubble(e);
        return false;
    }

    function destroyEntity(eid) {
        $('#' + eid).remove();
    }

    function renderModifications(mids) {
        for(var i = 0; i < mids.length; i++) {
            renderModification(mids[i]);
        }
    }

    function renderModification(mid) {
        var pred = modifications[mid]["pred"];
        var oid = modifications[mid]['obj'];
        var symbol;
        if (pred == "Negation") {
            symbol = 'X';
        } else if (pred == "Speculation") {
            symbol = '?';
        }
        $('#' + oid).append('<entity class="modification" id="' + mid + '">' + symbol + '</entity>');
        $('#' + mid).off('click', modificationClicked).on('click', modificationClicked);
    }


    function destroyModification(mid) {
        $('#' + mid).remove();
    }

    function isModificationSelected(mid) {
        return (modificationIdsSelected.indexOf(mid) > -1);
    }

    function selectModification(mid) {
        if (!isModificationSelected(mid)) {
            $('#' + mid).addClass('selected');
            modificationIdsSelected.push(mid);
        }
    }

    function deselectModification(mid) {
        var i = spanIdsSelected.indexOf(mid);
        if (i > -1) {
            $('#' + mid).removeClass('selected');
            modificationIdsSelected.splice(i, 1);
        }
    }

    function clearModificationSelection() {
        $('modification.selected').removeClass('selected');
        modificationIdsSelected.length = 0;
    }


    function changeConnectionOpacity(opacity) {
        connOpacity = opacity;
        setConnectorTypes();

        for (var rid in annotation_data.relations) {
            var rtype = annotation_data.relations[rid]["pred"];
            connectors[rid].setPaintStyle(connectorTypes[rtype]["paintStyle"]);
        }

        for (var i = 0; i < relationIdsSelected; i++) {
            var id = relationIdsSelected[i];
            var type = annotation_data.relations[id]["pred"];
            connectors[id].setPaintStyle(connectorTypes[type+"_selected"]["paintStyle"]);
        }
    }

    // public funcitons of editor
    var editorApi = {
        loadAnnotation: businessLogic.loadAnnotation,
        getAnnotationFromServer: businessLogic.getAnnotationFromServer,
        saveAnnotation: function(){editHistory.saved();},
        saveAnnotationToServer: businessLogic.saveAnnotationToServer,
        createEntity: businessLogic.createEntity,
        removeElements: businessLogic.removeElements,
        copyEntities: businessLogic.copyEntities,
        pasteEntities: businessLogic.pasteEntities,
        replicate: businessLogic.replicate,
        toggleReplicateAuto: businessLogic.toggleReplicateAuto,
        showPallet: presentationLogic.showPallet,
        showAccess: function(){ $textaeEditor.loadSaveDialog.showAccess(targetUrl);},
        showSave: function(){$textaeEditor.loadSaveDialog.showSave(targetUrl, annotation_data.toJason());},
        newLabe: businessLogic.newLabe,
        redo: function(){if (editHistory.hasAnythingToRedo()) { businessLogic.redo();}},
        undo: function(){if (editHistory.hasAnythingToUndo()) {businessLogic.undo();}},
        cancelSelect: cancelSelect,
        selectLeftEntity: function(){
                //TODO presentation logic?
                if (numSpanSelection() == 1) {
                    var spanIdx = annotation_data.spanIds.indexOf(popSpanSelection());
                    clearSelection()
                    spanIdx--;
                    if (spanIdx < 0) {spanIdx = annotation_data.spanIds.length - 1}
                    select(annotation_data.spanIds[spanIdx]);
                }
            },
        selectRightEntity: function(){
                if (numSpanSelection() == 1) {
                    var spanIdx = annotation_data.spanIds.indexOf(popSpanSelection());
                    clearSelection()
                    spanIdx++;
                    if (spanIdx > annotation_data.spanIds.length - 1) {spanIdx = 0}
                    select(annotation_data.spanIds[spanIdx]);
                }                
            },
        redraw: presentationLogic.redraw,
        start : startEdit,
    };

    //main
    (function() {
        //setup contorl
        window.$textaeControl = $(".textae-control").textae();

        //setup editor
        window.$textaeEditor = $(".textae-editor").textae();

        //set reference to see from god.
        $textaeEditor.api = editorApi;

        //start application
        $textaeEditor.api.start();
    })();
});

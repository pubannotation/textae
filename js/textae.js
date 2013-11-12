// this is dummy file for test grunt-contrib-concat

// utility functions
(function() {
    window.textAeUtil = {
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
        var $textae_container = this;
        
        //cursor
        var setupWait = function setuoWait(self) {
            var wait = function() {
                $textae_container.css('cursor', 'wait');
            };
            var endWait = function() {
                $textae_container.css('cursor', 'auto');
            }
            self.startWait = wait;
            self.endWait = endWait;
        }

        //init
        setupWait(this);

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
            )
                .append($('<div id="dialog_load_file" title="Load document with annotation.">')
                    .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                    .append('<div>Local :<input type="file"　/></div>')
            )
                .append($('<div id="dialog_save_file" title="Save document with annotation.">')
                    .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                    .append('<div>Local :<span class="span_link_place"></span></div>')
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

        //help 
        var publicateHelpDialog = function publicateHelpDialog(self) {
            var helpDialog = textAeUtil.makeInformationDialog({
                className: "textae-control__help",
                addContentsFunc: function() {
                    return this
                        .append($("<h3>").text("Help (Keyboard short-cuts)"))
                        .append($("<img>").attr("src", "images/keyhelp.png"));
                }
            });

            self.showHelp = helpDialog.show;
            self.hideHelp = helpDialog.hide;
        };

        //about
        var publicateAboutDialog = function setupAbout(self) {
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

            self.showAbout = aboutDialog.show;
            self.hideAbout = aboutDialog.hide;
        };

        // build elements
        this.append(makeTitle())
            .append(makeIconBar());

        // buttons always eanable.
        enableButton("read", true);
        enableButton("replicateAuto", true);
        enableButton("help", true);
        enableButton("about", true);

        // bind button event
        var self = this;
        this.on(buttonCache["about"].ev, function(){
            console.log("AAA");
            self.showAbout();
        });

        // public
        this.enableButton = enableButton;
        this.buttons = buttonCache;
        publicateHelpDialog(this);
        publicateAboutDialog(this);

        return this;
    };

    jQuery.fn.textae = function() {
        if (this.hasClass("textae-editor")) {
            return editor.apply(this);
        } else if (this.hasClass("textae-control")) {
            return control.apply(this);
        }
    };
})(jQuery);
// Application main
$(document).ready(function() {
    var mode = 'span';  // screen mode: view | span(default) | relation
    var replicateAuto = false;

    var sourceDoc;
    var pars;

    var spanIds;

    // selected slements
    var modificationIdsSelected;
    var relationIdsSelected;

    var clipBoard;

    // opacity of connectors
    var connOpacity = 0.6;

    // curviness parameters
    var xrate = 0.6;
    var yrate = 0.05;

    // curviness offset
    var c_offset = 20;

    // configuration data
    var configuration = {
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

    var entityTypes;
    var relationTypes;
    var modificationTypes;

    var blockTypeDefault = 'block';
    var entityTypeDefault;
    var relationTypeDefault;
    var modificationTypeDefault;

    // annotation data (Objects)
    var annotation_data = {
        spans : null,
        entities : null,
        relations : null
    };
    var modifications;

    var blockThreshold = 100;

    var connectors;
    var connectorTypes;

    // index
    var typesPerSpan;
    var entitiesPerType;
    var relationsPerEntity;

    // target URL
    var targetUrl = '';

    var typeHeight = 0;
    var gridWidthGap = 0;
    var typeMarginTop = 18;
    var typeMarginBottom = 2;
    var PALLET_HEIGHT_MAX = 100;

    var lineHeight = 600;

    function setLineHeight() {
        $('#text_box').css('line-height', $('#line-height').val() + '%');
        // redraw();
    }

    $( "#line-height" ).spinner({
        step: 50,
        change: setLineHeight,
        stop: setLineHeight
    }).spinner("value", lineHeight);

    function getSizes() {
        var div = '<div id="temp_grid" class="grid" style="width:10px; height:auto"></div>';
        $('#annotation_box').append(div);

        div = '<div id="temp_type" class="type" title="[Temp] Temp" >T0</div>';
        $('#temp_grid').append(div);

        div = '<div id="temp_entity_pane" class="entity_pane"><div id="temp_entity" class="entity"></div></div>';
        $('#temp_type').append(div);

        gridWidthGap = $('#temp_grid').outerWidth() - 10;
        typeHeight   = $('#temp_type').outerHeight();
        entityHeight = $('#temp_entity').outerHeight();
        entityWidth  = $('#temp_entity').outerWidth();
        $('#temp_grid').remove();
    }

    var localFile = {
        $fileInput: null,//target element which is "input type="file".

        init: function(load_dialog_selector, fileParseFunc, save_dialog_selector){
            //setup load dialog
            var $load_dialog = $(load_dialog_selector);
            $load_dialog.hide()

            //cache target element
            this.$fileInput = $load_dialog.find("input[type='file']"); 

            var close_load = function(){
                $load_dialog.dialog("close");
                keyboard.enableShortcut();
            };

            //bind event handler
            var onFileChange = function(){
                var reader = new FileReader();
                reader.onload = function(){ 
                    fileParseFunc(this.result);
                    close_load();
                };
                reader.readAsText(this.files[0]);
            }
            this.$fileInput.on("change", onFileChange);

            $load_dialog.find("input[type='button']")
                .on("click", function(){
                    var $input_text = $load_dialog.find("input[type='text']");
                    getAnnotationFrom($input_text.val());
                    close_load();
                });

            //setup save dialog
            var $save_dialog = $(save_dialog_selector);
            $save_dialog.hide();

            var close_save = function(){
                $save_dialog.dialog("close");
                keyboard.enableShortcut();
            },
            saveAnnotationTo = function(location) {
                $textae.startWait();

                var postData = annotationDataToJson(annotation_data);

                $.ajax({
                    type: "post",
                    url: location,
                    data: {annotations:JSON.stringify(postData)},
                    crossDomain: true,
                    xhrFields: {withCredentials: true}
                }).done(function(res){
                    $('#message').html("annotation saved").fadeIn().fadeOut(5000, function() {
                        $(this).html('').removeAttr('style');
                        showTarget();
                    });
                    editHistory.saved();
                    $textae.endWait();
                }).fail(function(res, textStatus, errorThrown){
                    $('#message').html("could not save").fadeIn().fadeOut(5000, function() {
                        $(this).html('').removeAttr('style');
                        showTarget();
                    });
                    $textae.endWait();
                });
            };

            $save_dialog.find("input[type='button']")
                .on("click", function(){
                    var $input_text = $save_dialog.find("input[type='text']");
                    var location = $input_text.val();
                    if(location != null && location != ""){
                        saveAnnotationTo(location);
                    }
                    close_save();
                });

            this.$save_dialog = $save_dialog; //cache element
            this.close_save = close_save;
        },
        getLocalFileName: function(){
            var file = this.$fileInput.prop("files")[0] 
            return file ? file.name : "annotations.json";
        },
        createFileLink: function(name, contents){
            var blob = new Blob([contents],{type:'application/json'});
            var link = $('<a>')
                .text(name)
                .attr("href",URL.createObjectURL(blob))
                .attr("target", "_blank")
                .attr("download", name)
                .on("click", this.close_save);

            this.$save_dialog.find("span")
                .empty()
                .append(link);
        }
    };

    // get the url parameters: beginning of the program
    function parseUrlParameters() {
        var url_params = textAeUtil.getUrlParameters(location.search);

        // read default configuration
        configuration.set();

        if (url_params.debug) {
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
            setTypes(types_for_debug);
            initialize();
        } else {
            if (url_params.config != "") {
                $.ajax({
                    type: "GET",
                    url: url_params.config,
                    dataType: "json",
                    crossDomain: true
                }).done(function(data){
                    configuration.set(data);
                    setTypes(data);
                    getAnnotationFrom(url_params.target);
                }).fail(function(){
                    alert('could not read the configuration from the location you specified.');
                });
            } else {
                getAnnotationFrom(url_params.target);
            }
        }
    }

    function showTarget() {
        if (targetUrl != "") {
            var targetDoc = targetUrl.replace(/\/annotations\.json$/, '');
            $('#message').html("(Target: <a href='" + targetDoc + "'>" + targetDoc + "</a>)");
        }
    }

    function setTypes(config){
        entityTypes = {};
        entityTypeDefault = null;
        if (config['entity types'] != undefined) {
            var entity_types = config['entity types'];
            for (var i in entity_types) {
                entityTypes[entity_types[i]["name"]] = entity_types[i];
                if (entity_types[i]["default"] == true) {entityTypeDefault = entity_types[i]["name"];}
            }
        }

        relationTypes = new Object();
        relationTypeDefault = null;
        if (config['relation types'] != undefined) {
            var relation_types = config['relation types'];
            for (var i in relation_types) {
                relationTypes[relation_types[i]["name"]] = relation_types[i];
                if (relation_types[i]["default"] == true) {relationTypeDefault = relation_types[i]["name"];}
            }
            if (!relationTypeDefault) {relationTypeDefault = relation_types[0]["name"];}
        }

        connectorTypes = new Object();

        modificationTypes = new Object();
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
    }

    function initJsPlumb() {
        jsPlumb.reset();
        jsPlumb.setRenderMode(jsPlumb.SVG);
        jsPlumb.Defaults.Container = $("#annotation_box");
        jsPlumb.importDefaults({
            ConnectionsDetachable:false,
            Endpoint:[ "Dot", { radius:1 } ]
        });
        setConnectorTypes();
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

    function getAnnotationFrom(url) {
        if (url) {targetUrl = url}
        if (targetUrl != null && targetUrl != "") {
            $textae.startWait();
            $.ajax({
                type: "GET",
                url: targetUrl,
                dataType: "json",
                crossDomain: true,
                cache: false
            })
            .done(function(annotation) {
                if (annotation.text != undefined) {
                    loadAnnotation(annotation);
                } else {
                    alert("read failed.");
                }
            })
            .fail(function(res, textStatus, errorThrown){
                alert("connection failed.");
            })
            .always(function(data){
                $textae.endWait();
            });
        }
        else {
            initialize();
        }
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
                history = [],
                onChangeFunc = onChange.bind(this);

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
        //change button state
        $textaeControl.enableButton("write", this.hasAnythingToSave());
        $textaeControl.enableButton("undo", this.hasAnythingToUndo());
        $textaeControl.enableButton("redo", this.hasAnythingToRedo());

        //change leaveMessage show
        if (this.hasAnythingToSave()) {
            $(window).off('beforeunload', leaveMessage).on('beforeunload', leaveMessage);
        } else {
            $(window).off('beforeunload', leaveMessage);
        }
    };

    //keyboard shortcut
    var keyboard = {
        onKeydown : function(e) {
            switch (e.keyCode) {
                case 27: // 'ESC' key
                    cancelSelect();
                    break;
                case 65: // 'a' key
                    businessLogic.getAnnotation();
                    break;
                case 83: // 's' key
                    businessLogic.saveAnnotation();
                    break;
                case 46: // win delete / mac fn + delete
                case 68: // 'd' key
                    businessLogic.removeElements();
                    break;
                case 69: // 'e' key
                    businessLogic.createEntity();
                    break;
                case 72: // 'h' key
                    presentationLogic.showHelp();
                    break;
                case 67: // 'c' key
                    businessLogic.copyEntities();
                    break;
                case 86: // 'v' key
                    businessLogic.pasteEntities();
                    break;
                case 81: // 'q' key
                    // show type selector
                    presentationLogic.showPallet();
                    break;
                case 87: // 'w' key
                    // show type selector
                    businessLogic.newLabel();
                    break;
                case 82: // 'r' key:
                    // replicate span annotatino
                    replicate();
                    break;
                // case 191: // '?' key
                //     if (mode == 'span') {
                //         createModification("Speculation");
                //     }
                //     break;
                // case 88: // 'x' key
                //     if (mode == 'span') {
                //         if (!e.ctrlKey) {createModification("Negation")}
                //     }
                //     break;
                case 90: // 'z' key
                    if (editHistory.hasAnythingToUndo()) {
                        businessLogic.undo();
                    }
                    break;
                case 88: // 'x' key
                case 89: // 'y' key
                    if (editHistory.hasAnythingToRedo()) { 
                        businessLogic.redo();
                    }
                    break;
                case 37: // left arrow key: move the span selection backward
                    if (numSpanSelection() == 1) {
                        var spanIdx = spanIds.indexOf(popSpanSelection());
                        clearSelection()
                        spanIdx--;
                        if (spanIdx < 0) {spanIdx = spanIds.length - 1}
                        select(spanIds[spanIdx]);
                    }
                    break;
                case 39: //right arrow key: move the span selection forward
                    if (numSpanSelection() == 1) {
                        var spanIdx = spanIds.indexOf(popSpanSelection());
                        clearSelection()
                        spanIdx++;
                        if (spanIdx > spanIds.length - 1) {spanIdx = 0}
                        select(spanIds[spanIdx]);
                    }
                    break;
            }
        },
        enableShortcut : function(){
            $(document).on("keydown", keyboard.onKeydown);
        },
        disableShortcut : function(){
            $(document).off("keydown", keyboard.onKeydown);
        }
    };

    //setup
    (function() {
        //setup contorl
        window.$textaeControl = $(".textae-control").textae();
        localFile.init("#dialog_load_file", function(file_contents){
            var annotation = JSON.parse(file_contents);
            loadAnnotation(annotation);
        },"#dialog_save_file");

        //setup editor
        window.$textae = $(".textae-editor").textae();
        parseUrlParameters();

        keyboard.enableShortcut();
    })();

    function initialize() {
        $('#body').off('mouseup', doMouseup).on('mouseup', doMouseup);

        relationIdsSelected = new Array();
        modificationIdsSelected = new Array();

        clipBoard = new Array();

        bindTextaeControlEventhandler();

        editHistory.init(editHistoryChanged);
        changeButtonStateReplicate();
        changeButtonStateEntity();
        changeButtonStateDelete();
        changeButtonStatePallet();
        changeButtonStateNewLabel();
        changeButtonStateCopy();
        changeButtonStatePaste();

        showTarget();
    }

    function loadAnnotation(annotation) {
        parseAnnotationJson(annotation);
        initJsPlumb();
        renderAnnotation();
        initialize();
    }

    function parseAnnotationJson(data) {
        sourceDoc = data.text;

        annotation_data.spans     = new Object();
        annotation_data.entities  = new Object();
        annotation_data.relations = new Object();

        entitiesPerType = new Object();
        typesPerSpan = new Object();
        relationsPerEntity = new Object();
        positions = new Object();
        connectors = new Object();

        if (data.denotations != undefined) {
            for (var i in data.denotations) {
                var d = data.denotations[i];

                var sid = getSid(d['span']['begin'], d['span']['end']);
                annotation_data.spans[sid] = {begin:d['span']['begin'], end:d['span']['end']};

                annotation_data.entities[d.id] = {span:sid, type:d['obj']};

                if (!entityTypes[d['obj']]) entityTypes[d['obj']] = {};
                if (entityTypes[d['obj']]['count']) entityTypes[d['obj']]['count']++;
                else entityTypes[d['obj']]['count'] = 1;

                var tid = getTid(sid, d['obj']);
                if (typesPerSpan[sid]) {
                    if (typesPerSpan[sid].indexOf(tid) < 0) typesPerSpan[sid].push(tid);
                } 
                else typesPerSpan[sid] = [tid];

                if (entitiesPerType[tid]) entitiesPerType[tid].push(d['id']);
                else entitiesPerType[tid] = [d['id']];
            }
        }

        spanIds = Object.keys(annotation_data.spans); // maintained sorted by the position.
        sortSpanIds(spanIds);

        if (data.relations != undefined) {
            for (var i in data.relations) {
                var r = data.relations[i];
                annotation_data.relations[r.id] = r;

                if (!relationTypes[r.pred]) relationTypes[r.pred] = {};
                if (relationTypes[r.pred].count) relationTypes[r.pred].count++;
                else relationTypes[r.pred].count = 1;

                if (relationsPerEntity[r.subj]) {
                    if (relationsPerEntity[r.subj].indexOf(r.id) < 0) relationsPerEntity[r.subj].push(r.id);
                } 
                else relationsPerEntity[r.subj] = [r.id];

                if (relationsPerEntity[r.obj]) {
                    if (relationsPerEntity[r.obj].indexOf(r.id) < 0) relationsPerEntity[r.obj].push(r.id);
                } 
                else relationsPerEntity[r.obj] = [r.id];
            }
        }
        relationIds = Object.keys(annotation_data.relations);
    }

    // span Id
    function getSid(begin, end) {
        return begin + '-' + end;
    }

    // type id
    function getTid(sid, type) {
        return sid + '-' + type;
    }

    function indexPositions(ids) {
        for (var i in ids) indexPosition(ids[i]);
    }

    function indexPosition(id) {
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

        renderSpans(spanIds);
        indexPositions(spanIds);

        getSizes();
        renderEntitiesOfSpans(spanIds);
        renderRelations(relationIds);
    }

    function indexRelationSize(rids) {
        for (var i in rids) {
            rid = rids[i];
            var sourceX = positions[annotation_data.relations[rid].subj].center;
            var targetX = positions[annotation_data.relations[rid].obj].center;
            annotation_data.relations[rid].size = Math.abs(sourceX - targetX);
        }
    }

    function sortRelationIds(rids) {
        function compare(a, b) {
            return (annotation_data.relations[b].size - annotation_data.relations[a].size);
        }
        rids.sort(compare);
    }

    // sort the span IDs by the position
    function sortSpanIds(sids) {
        function compare(a, b) {
            return((annotation_data.spans[a]['begin'] - annotation_data.spans[b]['begin']) || (annotation_data.spans[b]['end'] - annotation_data.spans[a]['end']));
        }
        sids.sort(compare);
    }

    function getPidBySid(sid) {
        for (var pid in pars) {
            if ((annotation_data.spans[sid].begin >= pars[pid].begin) && (annotation_data.spans[sid].end <= pars[pid].end)) return pid;
        }
        return null;
    }

    function changeButtonStateEntity() {
        $textaeControl.enableButton("entity", numSpanSelection() > 0);
    }

    function changeButtonStatePallet() {
        $textaeControl.enableButton("pallet", numEntitySelection() > 0);
    }

    function changeButtonStateNewLabel() {
        $textaeControl.enableButton("newLabel", numEntitySelection() > 0);
    }

    function typeColor(type) {
        if (entityTypes && entityTypes[type] && entityTypes[type].color) return entityTypes[type].color;
        return "#77DDDD";
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

    // assume the spanIds are sorted by the position.
    // when there are embedded annotation_data.spans, the embedding ones comes earlier then embedded ones.
    function renderSpan(sid, spanIds) {
        var element = document.createElement('span');
        element.setAttribute('id', sid);
        element.setAttribute('title', sid);
        element.setAttribute('class', 'span');

        var pid = getPidBySid(sid);
        var beg = annotation_data.spans[sid].begin;
        var end = annotation_data.spans[sid].end;
        var len = end - beg;

        var range = document.createRange();

        var c = spanIds.indexOf(sid); // index of current span
        if (c < 0) c = spanIds.length;

        // determine the begin node and offset
        var begnode, begoff;

        // when there is no preceding span in the paragraph
        if ((c == 0) || (getPidBySid(spanIds[c - 1]) != pid)) {
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
            if (annotation_data.spans[spanIds[p]].end > beg) {
                var refnode = document.getElementById(spanIds[p]).childNodes[0];
                if (refnode.nodeType == 1) range.setStartBefore(refnode); // element node
                else if (refnode.nodeType == 3) { // text node
                    begnode = refnode;
                    begoff  = beg - annotation_data.spans[spanIds[p]].begin
                    range.setStart(begnode, begoff);
                }
                else alert("unexpected type of node:" + refnode.nodeType + ". please consult the developer.");
            }

            else {
                // find the outermost preceding span
                var pnode = document.getElementById(spanIds[p]);
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
        if ((c < spanIds.length - 1) && (end > annotation_data.spans[spanIds[c + 1]].begin)) {
            var i = c + 1;  // index of the rightmost embedded span

            // if there is a room for further intervening
            while (i < spanIds.length - 1) {
                // find the next span at the same level
                var n = i + 1;
                while ((n < spanIds.length) && (annotation_data.spans[spanIds[n]].begin < annotation_data.spans[spanIds[i]].end)) n++;
                if (n == spanIds.length) break;
                if (end > annotation_data.spans[spanIds[n]].begin) i = n;
                else break;
            }

            var renode = document.getElementById(spanIds[i]); // rightmost intervening node
            if (renode.nextSibling) range.setEnd(renode.nextSibling, end - annotation_data.spans[spanIds[i]].end);
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

                var firstIndex = spanIds.indexOf(firstId);
                var secondIndex = spanIds.indexOf(secondId);

                if (secondIndex < firstIndex) {
                    var tmpIndex = firstIndex;
                    firstIndex = secondIndex;
                    secondIndex = tmpIndex;
                }

                for (var i = firstIndex; i <= secondIndex; i++) {
                    select(spanIds[i]);
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
        while (configuration.isNonEdgeCharacter(sourceDoc.charAt(pos))) {pos++}
        while (!configuration.isDelimiter(sourceDoc.charAt(pos)) && pos > 0 && !configuration.isDelimiter(sourceDoc.charAt(pos - 1))) {pos--}
        return pos;
    }

    // adjust the end position of a span
    function adjustSpanEnd(endPosition) {
        var pos = endPosition;
        while (configuration.isNonEdgeCharacter(sourceDoc.charAt(pos - 1))) {pos--}
        while (!configuration.isDelimiter(sourceDoc.charAt(pos)) && pos < sourceDoc.length) {pos++}
        return pos;
    }


    // adjust the beginning position of a span for shortening
    function adjustSpanBegin2(beginPosition) {
        var pos = beginPosition;
        while ((pos < sourceDoc.length) && (configuration.isNonEdgeCharacter(sourceDoc.charAt(pos)) || !configuration.isDelimiter(sourceDoc.charAt(pos - 1)))) {pos++}
        return pos;
    }

    // adjust the end position of a span for shortening
    function adjustSpanEnd2(endPosition) {
        var pos = endPosition;
        while ((pos > 0) && (configuration.isNonEdgeCharacter(sourceDoc.charAt(pos - 1)) || !configuration.isDelimiter(sourceDoc.charAt(pos)))) {pos--}
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
                    if (endPosition - beginPosition > blockThreshold) {
                        makeEdits([{action:'new_span', id:sid, begin:beginPosition, end:endPosition, block:true, type:blockTypeDefault}]);
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


    function newSpan(id, begin, end, block, type) {
        annotation_data.spans[id] = {begin:begin, end:end, block:block, type:type};
        return id;
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
        presentationLogic.hideHelp();
        presentationLogic.hideAbout();
        changeButtonStateReplicate();
        changeButtonStateEntity();
        changeButtonStateDelete();
        changeButtonStatePallet();
        changeButtonStateNewLabel();
        changeButtonStateCopy();
        changeButtonStatePaste();
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
                edits.push({action:'remove_span', id:sid, begin:annotation_data.spans[sid]['begin'], end:annotation_data.spans[sid]['end']});
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
                edits.push({action:'remove_span', id:sid, begin:annotation_data.spans[sid]['begin'], end:annotation_data.spans[sid]['end']});
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
                    edits.push({action:'remove_span', id:sid, begin:annotation_data.spans[sid]['begin'], end:annotation_data.spans[sid]['end']});
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
                    edits.push({action:'remove_span', id:sid, begin:annotation_data.spans[sid]['begin'], end:annotation_data.spans[sid]['end']});
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
                    edits.push({action:'remove_span', id:sid, begin:annotation_data.spans[sid]['begin'], end:annotation_data.spans[sid]['end']});
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
                    edits.push({action:'remove_span', id:sid, begin:annotation_data.spans[sid]['begin'], end:annotation_data.spans[sid]['end']});
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
                var obj = new Object();
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

        if (!configuration.isDelimiter(precedingChar) || !configuration.isDelimiter(followingChar)) {return true}
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

    function changeButtonStateDelete() {
        $textaeControl.enableButton("delete", numSpanSelection() > 0 || $(".ui-selected").length > 0);
    }

    function changeButtonStateCopy() {
        $textaeControl.enableButton("copy", $(".ui-selected").length > 0);
    }

    function changeButtonStatePaste() {
        $textaeControl.enableButton("paste", clipBoard.length > 0 && numSpanSelection() > 0);
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

                var obj = new Object();
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
       getAnnotation : function() {
            var $dialog = $("#dialog_load_file");
            $dialog
                .find("input[type='text']")
                .val(targetUrl);
            keyboard.disableShortcut();
            $dialog
                .dialog({
                    resizable: false,
                    width:550,
                    height:220,
                    modal: true,
                    buttons: {
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                });
        },

        saveAnnotation : function() {
            //create local link
            var filename = localFile.getLocalFileName();
            var json = JSON.stringify(annotationDataToJson(annotation_data));
            localFile.createFileLink(filename, json);

            //open dialog
            var $dialog = $("#dialog_save_file");
            $dialog
                .find("input[type='text']")
                .val(targetUrl);
            keyboard.disableShortcut();
            $dialog
                .dialog({
                    resizable: false,
                    width:550,
                    height:220,
                    modal: true,
                    buttons: {
                        Cancel: function() {
                            $( this ).dialog( "close" );
                        }
                    }
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

        pushButtonReplicateAuto : function() {
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
                makeEdits([{action:'new_denotation', id:id, span:sid, type:entityTypeDefault}]);
            }
        },
    
        newLabel : function() {
            if ($(".entity.ui-selected").length > 0) {
                var new_type = prompt("Please enter a new label","");
                if (entityTypes[new_type] == undefined) {
                    entityTypes[new_type] = {};
                }

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
                spanRemoves.push({action:'remove_span', id:sid, begin:annotation_data.spans[sid].begin, end:annotation_data.spans[sid].end, obj:annotation_data.spans[sid].obj});
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
            entityTypeDefault = $(this).attr('label');
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
        showPallet : function(controlEvent, buttonEvent) {
            //create table contents for entity type.
            var makeEntityTypeOfEntityTypePallet = function(entityTypes, entityTypeDefault){
                var row = "";
                var types = Object.keys(entityTypes);
                types.sort(function(a,b) {
                    return (entityTypes[b].count - entityTypes[a].count);
                });
                
                if (!entityTypeDefault) {
                    entityTypeDefault = types[0];
                }
                for (var i = 0; i < types.length; i++) {
                    var t = types[i];
                    var uri = entityTypes[t]["uri"];

                    row += '<tr class="textae-control__entity-pallet__entity-type"';
                    row += typeColor(t)? ' style="background-color:' + typeColor(t) + '"' : '';
                    row += '>';

                    row += '<th><input type="radio" name="etype" class="textae-control__entity-pallet__entity-type__radio" label="' + t + '"';
                    row += (t == entityTypeDefault)? ' title="default type" checked' : '';
                    row += '/></th>';

                    row += '<td class="textae-control__entity-pallet__entity-type__label" label="' + t + '">' + t + '</td>';

                    if (uri) row += '<th title="' + uri + '">' + '<a href="' + uri + '" target="_blank"><img src="images/link.png"/></a></th>';

                    row += '</tr>';
                }

                return row;
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
                .append(makeEntityTypeOfEntityTypePallet(entityTypes, entityTypeDefault));

            //limti max height.
            if ($pallet.outerHeight() > PALLET_HEIGHT_MAX) {
                $pallet.css('height', PALLET_HEIGHT_MAX);
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

        showHelp : function() {
            $textaeControl.showHelp();
        },

        hideHelp : function() {
            $textaeControl.hideHelp();
        },

        showAbout : function() {
            $textaeControl.showAbout();
        },

        hideAbout : function () {
            $textaeControl.hideAbout();
        }
    };

    // bind textaeCotnrol eventhandler
    function bindTextaeControlEventhandler() {
        // access by square brancket because property names include "-". 
        $textaeControl.on($textaeControl.buttons["read"].ev, businessLogic.getAnnotation);
        $textaeControl.on($textaeControl.buttons["write"].ev, businessLogic.saveAnnotation);
        $textaeControl.on($textaeControl.buttons["undo"].ev, businessLogic.undo);
        $textaeControl.on($textaeControl.buttons["redo"].ev, businessLogic.redo);
        $textaeControl.on($textaeControl.buttons["replicate"].ev, businessLogic.replicate);
        $textaeControl.on($textaeControl.buttons["replicate-auto"].ev, businessLogic.pushButtonReplicateAuto);
        $textaeControl.on($textaeControl.buttons["entity"].ev, businessLogic.createEntity);
        $textaeControl.on($textaeControl.buttons["new-label"].ev, businessLogic.newLabel);
        $textaeControl.on($textaeControl.buttons["pallet"].ev, presentationLogic.showPallet);
        $textaeControl.on($textaeControl.buttons["delete"].ev, businessLogic.removeElements);
        $textaeControl.on($textaeControl.buttons["copy"].ev, businessLogic.copyEntities);
        $textaeControl.on($textaeControl.buttons["paste"].ev, businessLogic.pasteEntities);
        $textaeControl.on($textaeControl.buttons["help"].ev, presentationLogic.showHelp);
        $textaeControl.on($textaeControl.buttons["about"].ev, presentationLogic.showAbout);
    }

    function annotationDataToJson(annotation_data){
        var denotations = [];
        for (var e in annotation_data.entities) {
            var span = {'begin':annotation_data.spans[annotation_data.entities[e]['span']].begin, 'end':annotation_data.spans[annotation_data.entities[e]['span']].end};
            denotations.push({'id':e, 'span':span, 'obj':annotation_data.entities[e]['type']});
        }

        return {
            "text": sourceDoc,
            "denotations": denotations
        };
    }

    function changeButtonStateReplicate() {
        $textaeControl.enableButton("replicate", numSpanSelection() == 1);
    }

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
                    newSpan(edit.id, edit.begin, edit.end, edit.block, edit.type);
                    spanIds = Object.keys(annotation_data.spans);
                    sortSpanIds(spanIds);
                    typesPerSpan[edit.id] = new Array();
                    // rendering
                    renderSpan(edit.id, spanIds);
                    indexPosition(edit.id);
                    // select
                    select(edit.id);
                    break;
                case 'remove_span' :
                    //model
                    delete annotation_data.spans[edit.id];
                    delete typesPerSpan[edit.id];
                    spanIds = Object.keys(annotation_data.spans);
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    break;
                case 'change_span_begin' :
                    //model
                    new_sid = getSid(edit.new_begin, annotation_data.spans[edit.id].end);
                    annotation_data.spans[new_sid] = annotation_data.spans[edit.id];
                    annotation_data.spans[new_sid].begin = edit.new_begin;
                    typesPerSpan[new_sid] = typesPerSpan[edit.id];
                    delete annotation_data.spans[edit.id];
                    delete typesPerSpan[edit.id];
                    spanIds = Object.keys(annotation_data.spans);
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    renderSpan(new_sid, spanIds);
                    // select
                    select(new_sid);
                    // for undo
                    edit.id = new_sid;
                    break;
                case 'change_span_end' :
                    //model
                    new_sid = getSid(annotation_data.spans[edit.id].begin, edit.new_end);
                    annotation_data.spans[new_sid] = annotation_data.spans[edit.id];
                    annotation_data.spans[new_sid].end = edit.new_end;
                    typesPerSpan[new_sid] = typesPerSpan[edit.id];
                    delete annotation_data.spans[edit.id];
                    delete typesPerSpan[edit.id];
                    spanIds = Object.keys(annotation_data.spans);
                    sortSpanIds(spanIds);
                    //rendering
                    destroySpan(edit.id);
                    renderSpan(new_sid, spanIds);
                    // select
                    select(new_sid);
                    // for undo
                    edit.id = new_sid;
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
        redraw();

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
                case 'change_span_begin' :
                    redit.old_begin = edit.new_begin;
                    redit.new_begin = edit.old_begin;
                    break;
                case 'change_span_end' :
                    redit.old_end = edit.new_end;
                    redit.new_end = edit.old_end;
                    break;
                case 'change_span_obj' :
                    redit.old_obj = edit.new_obj;
                    redit.new_obj = edit.old_obj;
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
        c = new Object();
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


    function renderRelations(rids) {
        indexRelationSize(rids);
        sortRelationIds(rids);
        jsPlumb.reset();

        for(var i in rids) connectors[rids[i]] = renderRelation(rids[i]);
    }


    function renderRelation (rid) {
        var sourceId = annotation_data.relations[rid].subj;
        var targetId = annotation_data.relations[rid].obj;

        // Determination of curviness
        var sourceX = positions[sourceId].center;
        var targetX = positions[targetId].center;

        var sourceY = positions[sourceId].top;
        var targetY = positions[targetId].top;

        var xdiff = Math.abs(sourceX - targetX);
        var ydiff = Math.abs(sourceY - targetY);
        var curviness = xdiff * xrate + ydiff * yrate + c_offset;
        curviness /= 2.4;

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

    function renewConnections (rids) {
        indexRelationSize(rids);
        sortRelationIds(rids);

        for (var i in rids) {
            var rid = rids[i];

            // recompute curviness
            var sourceId = annotation_data.relations[rid].subj;
            var targetId = annotation_data.relations[rid].obj;

            var sourceX = positions[sourceId].center;
            var targetX = positions[targetId].center;

            var sourceY = positions[sourceId].top;
            var targetY = positions[targetId].top;

            var xdiff = Math.abs(sourceX - targetX);
            var ydiff = Math.abs(sourceY - targetY);
            var curviness = xdiff * xrate + ydiff * yrate + c_offset;
            curviness /= 2.4;

            if (sourceId == targetId) curviness = 30;

            var conn = connectors[rid];
            var label = conn.getLabel();
            conn.endpoints[0].repaint();
            conn.endpoints[1].repaint();
            conn.setConnector(["Bezier", {curviness:curviness}]);
        }
    }

    function destroyRelation(rid) {
        var c = connectors[rid];
        jsPlumb.detach(c);
        // var endpoints = c.endpoints;
        // jsPlumb.deleteEndpoint(endpoints[0]);
        // jsPlumb.deleteEndpoint(endpoints[1]);
    }

    function renderEntitiesOfSpans(sids) {
        for (var s = sids.length - 1; s >= 0; s--) renderEntitiesOfSpan(sids[s]);
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
            var offset = typeMarginBottom;

            // check the following annotation_data.spans that are embedded in the current span.
            var c = spanIds.indexOf(sid)
            for (var f = c + 1; (f < spanIds.length) && isSpanEmbedded(annotation_data.spans[spanIds[f]], annotation_data.spans[spanIds[c]]); f++) {
                var cid = 'G' + spanIds[f];
                if (positions[cid] && ((positions[cid].offset + positions[cid].height) < offset)) offset = (positions[cid].offset + positions[cid].height) + typeMarginTop + typeMarginBottom;
            }

            var n = typesPerSpan[sid].length;
            var gridHeight = n * (typeHeight + typeMarginBottom + typeMarginTop);

            positions[id]        = {}
            positions[id].offset = offset;
            positions[id].top    = positions[sid].top - offset - gridHeight;
            positions[id].left   = positions[sid].left;
            positions[id].width  = positions[sid].width - gridWidthGap;
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
        for (var s = sids.length - 1; s >= 0; s--) positionGrid(spanIds[s]);
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

    function renderType(type, sid) {
        var tid = getTid(sid, type);

        if ($('#' + tid).length == 0) {
            $('#G' + sid).append('<div id="' + tid +'"></div>');
            var t = $('#' + tid);
            t.addClass('type');
            t.css('background-color', typeColor(type));
            t.css('margin-top', typeMarginTop);
            t.css('margin-bottom', typeMarginBottom);
            t.attr('title', type);
            t.append('<div id="P-' + tid + '" class="entity_pane"></div>');
            t.append('<div class="type_label">' + type + '</div>');
        }

        return tid;
    }

    function destroyType(tid) {
        $('#' + tid).remove();
    }

    function renderEntity(eid) {
        if ($('#' + eid).length == 0) {
            var entity = annotation_data.entities[eid];
            var type = entity['type'];
            var sid  = entity['span'];
            var tid = renderType(type, sid);
            var div = '<div id="' + eid +'" class="entity" />';

            var p = $('#P-' + tid);
            p.append(div);
            p.css('left', (positions['G' + sid].width - (entityWidth * entitiesPerType[tid].length)) / 2);

            var e = $('#' + eid);
            e.attr('title', eid);
            e.css('display: inline-block');
            e.css('border-color', typeColor(type));
            e.off('mouseup', entityClicked).on('mouseup', entityClicked);
            indexPositionEntity(eid);
        }
    }

    function positionEntities(sid, type) {
        var tid = getTid(sid, type);
        $('#P-' + tid).css('left', (positions['G' + sid].width - (entityWidth * entitiesPerType[tid].length)) / 2);
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

    $(window).resize(function(){
      redraw();
    });

    function redraw() {
        indexPositions(spanIds);
        positionGrids(spanIds);

        indexPositionEntities();
        renewConnections(Object.keys(annotation_data.relations));
    }

    function leaveMessage() {
        return "There is a change that has not been saved. If you leave now, you will lose it.";
    }

});

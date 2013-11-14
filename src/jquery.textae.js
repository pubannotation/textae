//like a jQuery plugin
(function(jQuery) {
    var editor = function() {
        var $$textaeEditor = this;

        //cursor
        var setupWait = function(self) {
            var wait = function() {
                $$textaeEditor.css('cursor', 'wait');
            };
            var endWait = function() {
                $$textaeEditor.css('cursor', 'auto');
            }
            self.startWait = wait;
            self.endWait = endWait;
        };

        //localFileDialog
        var setupLocalFileDialog = function(self) {
            self.append($('<div id="dialog_load_file" title="Load document with annotation.">')
                .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                .append('<div>Local :<input type="file"　/></div>')
            )
                .append($('<div id="dialog_save_file" title="Save document with annotation.">')
                    .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                    .append('<div>Local :<span class="span_link_place"></span></div>')
            );
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

        //init
        setupWait(this);
        setupLocalFileDialog(this);
        this.entityTypes = entityTypes;

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

        // build elements
        this.append(makeTitle())
            .append(makeIconBar());

        // buttons always eanable.
        enableButton("read", true);
        enableButton("replicateAuto", true);
        enableButton("help", true);
        enableButton("about", true);

        // public
        this.enableButton = enableButton;
        this.buttons = buttonCache;

        return this;
    };

    var god = function() {
        // get the url parameters: beginning of the program
        var urlParams = textAeUtil.getUrlParameters(location.search);

        return {
            setControl: function(control) {
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

                control.on(control.buttons["help"].ev, helpDialog.show);
                control.on(control.buttons["about"].ev, aboutDialog.show);

                $("body").on("textae.select.cancel", function() {
                    helpDialog.hide();
                    aboutDialog.hide();
                });
            },
            pushEditor: function(editor) {
                editor.urlParams = urlParams;
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
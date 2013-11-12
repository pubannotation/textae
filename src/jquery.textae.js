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

    jQuery.fn.textae = function() {
        //init management object
        if (window.texaeGod === undefined) {
            window.texaeGod = {
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

                }
            };
        }

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
})(jQuery);
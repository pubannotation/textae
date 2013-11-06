// textae control plugin
(function(jQuery) {
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

    jQuery.fn.textaeControl = function() {
        var $title = $('<span class="textae-control__title">')
            .append('<a href="http://bionlp.dbcls.jp/textae/">TextAE</a>'),
            $icon_bar = $($('<span class = "textae-control__icon-bar">')
                .append('<span class="separator"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__read-button" title="Access [A]"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__write-button" title="Save [S]"></span>')
                .append('<span class="separator"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__undo-button" title="Undo [Z]"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__redo-button" title="Redo [X]"></span>')
                .append('<span class="separator"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__replicate-button" title="Replicate span annotation [R]"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__replicate-auto-button" title="Auto replicate (Toggle)"></span>')
                .append('<span class="separator"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__entity-button" title="New entity [E]"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__pallet-button" title="Select label [Q]"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__new-label-button" title="Enter label [W]"></span>')
                .append('<span class="separator"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__delete-button" title="Delete [D]"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__copy-button" title="Copy [C]"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__paste-button" title="Paste [V]"></span>')
                .append('<span class="separator"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__help-button" title="Help [H]"></span>')
                .append('<span class="textae-control__icon-bar__icon textae-control__icon-bar__about-button" title="About"></span>')
                .append('<span class="separator"></span>')
            )
                .append($('<div id="dialog_load_file" title="Load document with annotation.">')
                    .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                    .append('<div>Local :<input type="file"　/></div>')
            )
                .append($('<div id="dialog_save_file" title="Save document with annotation.">')
                    .append('<div>Sever :<input type="text" style="width:345px"/><input type="button" value="OK" /></div>')
                    .append('<div>Local :<span class="span_link_place"></span></div>')
            );

        this.append($title)
            .append($icon_bar);

        // button cache and event definition.
        var buttons = {
            read: {
                obj: this.find(".textae-control__icon-bar__read-button"),
                ev: "textae.control.button.read.click"
            },
            write: {
                obj: this.find(".textae-control__icon-bar__write-button"),
                ev: "textae.control.button.write.click"
            },
            undo: {
                obj: this.find(".textae-control__icon-bar__undo-button"),
                ev: "textae.control.button.undo.click"
            },
            redo: {
                obj: this.find(".textae-control__icon-bar__redo-button"),
                ev: "textae.control.button.redo.click"
            },
            replicate: {
                obj: this.find(".textae-control__icon-bar__replicate-button"),
                ev: "textae.control.button.replicate.click"
            },
            replicateAuto: {
                obj: this.find(".textae-control__icon-bar__replicate-auto-button"),
                ev: "textae.control.button.replicate-auto.click"
            },
            entity: {
                obj: this.find(".textae-control__icon-bar__entity-button"),
                ev: "textae.control.button.entity.click"
            },
            pallet: {
                obj: this.find(".textae-control__icon-bar__pallet-button"),
                ev: "textae.control.button.pallet.click"
            },
            newLabel: {
                obj: this.find(".textae-control__icon-bar__new-label-button"),
                ev: "textae.control.button.new-label.click"
            },
            delete: {
                obj: this.find(".textae-control__icon-bar__delete-button"),
                ev: "textae.control.button.delete.click"
            },
            copy: {
                obj: this.find(".textae-control__icon-bar__copy-button"),
                ev: "textae.control.button.copy.click"
            },
            paste: {
                obj: this.find(".textae-control__icon-bar__paste-button"),
                ev: "textae.control.button.paste.click"
            },
            help: {
                obj: this.find(".textae-control__icon-bar__help-button"),
                ev: "textae.control.button.help.click"
            },
            about: {
                obj: this.find(".textae-control__icon-bar__about-button"),
                ev: "textae.control.button.about.click"
            }
        };
        this.buttons = buttons;

        var $self = this,
            CLICK = "click";
        // function to enable/disable button
        this.enableButton = function(button_name, enable) {
            var button = buttons[button_name];

            if (button) {
                if (enable) {
                    button.obj
                        .off(CLICK)
                        .on(CLICK, function() {
                            $self.trigger(button.ev);
                        });
                    buttonUtil.enable(button.obj);
                } else {
                    button.obj.off(CLICK);
                    buttonUtil.disable(button.obj);
                }
            }
        };

        // buttons always eanable.
        this.enableButton("read", true);
        this.enableButton("replicateAuto", true);
        this.enableButton("help", true);
        this.enableButton("about", true);

        return this;
    };
})(jQuery);
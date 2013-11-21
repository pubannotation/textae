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
            for (var buttonType in buttonCache) {
                enableButton(buttonType, !disableButtons.hasOwnProperty(buttonType));
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
        this.disableButtons = disableButtons;
        this.buttons = buttonCache;

        return this;
    };
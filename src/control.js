    var control = function() {
        var buttonUtil = {
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

        // function to enable/disable button
        var enableButton = function(CLICK, $self) {
            return function(buttonName, enable) {
                var button = buttonCache[buttonName];

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
        }("click", this);

        // update all button state, because an instance of textEditor maybe change.
        // expected disableButtons is an object has keys that is a name of buttons.  
        var updateAllButtonEnableState = function(disableButtons) {
            for (var buttonName in buttonCache) {
                enableButton(buttonName, !disableButtons.hasOwnProperty(buttonName));
            }
        };

        var updateReplicateAutoButtonPushState = function(state) {
            if (state) {
                buttonUtil.push(buttonCache["replicate-auto"].obj);
            } else {
                buttonUtil.unpush(buttonCache["replicate-auto"].obj);
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
        this.updateAllButtonEnableState = updateAllButtonEnableState;
        this.updateReplicateAutoButtonPushState = updateReplicateAutoButtonPushState;
        this.buttons = buttonCache;

        return this;
    };
    var control = function() {
        var buttonUtil = {
            enable: function($button) {
                $button.removeClass('textae-control__icon--disabled');
            },
            disable: function($button) {
                $button.addClass('textae-control__icon--disabled');
            },
            isDisable: function($button) {
                return $button.hasClass('textae-control__icon--disabled');
            },
            push: function($button) {
                $button.addClass('textae-control__icon--pushed');
            },
            unpush: function($button) {
                $button.removeClass('textae-control__icon--pushed');
            },
            isPushed: function($button) {
                return $button.hasClass('textae-control__icon--pushed');
            }
        };

        var buttonCache = {};

        var makeTitle = function() {
            return $('<span>')
                .addClass('textae-control__title')
                .append($('<a>')
                    .attr('href', 'http://bionlp.dbcls.jp/textae/')
                    .text('TextAE'));
        };

        var makeIconBar = function() {
            var makeSeparator = function() {
                return $('<span>')
                    .addClass('textae-control__separator');
            };

            var makeButton = function(buttonType, title) {
                var $button = $('<span>')
                    .addClass('textae-control__icon')
                    .addClass('textae-control__' + buttonType + '-button')
                    .attr('title', title);

                // button cache and event definition.
                buttonCache[buttonType] = {
                    obj: $button,
                    eventName: 'textae.control.button.' + buttonType.replace(/-/g, '_') + '.click'
                };
                return $button;
            };

            return $($('<span>')
                .append(makeSeparator())
                .append(makeButton('read', 'Access [A]'))
                .append(makeButton('write', 'Save [S]'))
                .append(makeSeparator())
                .append(makeButton('undo', 'Undo [Z]'))
                .append(makeButton('redo', 'Redo [X]'))
                .append(makeSeparator())
                .append(makeButton('replicate', 'Replicate span annotation [R]'))
                .append(makeButton('replicate-auto', 'Auto replicate (Toggle)'))
                .append(makeSeparator())
                .append(makeButton('entity', 'New entity [E]'))
                .append(makeButton('pallet', 'Select label [Q]'))
                .append(makeButton('new-label', 'Enter label [W]'))
                .append(makeSeparator())
                .append(makeButton('delete', 'Delete [D]'))
                .append(makeButton('copy', 'Copy [C]'))
                .append(makeButton('paste', 'Paste [V]'))
                .append(makeSeparator())
                .append(makeButton('setting', 'Setting'))
                .append(makeSeparator())
                .append(makeButton('help', 'Help [H]'))
                .append(makeButton('about', 'About'))
            );
        };

        var $self =this;

        // function to enable/disable button
        var enableButton = function(event, $self) {
            return function(buttonName, enable) {
                var button = buttonCache[buttonName];
                var buttonClicked = function(e) {
                    $self.buttonClick({
                        name: button.eventName,
                        point: {
                            top: e.clientY - $self.get(0).offsetTop,
                            left: e.clientX - $self.get(0).offsetLeft
                        }
                    });
                };

                if (button) {
                    if (enable) {
                        button.obj
                            .off(event)
                            .on(event, buttonClicked);
                        buttonUtil.enable(button.obj);
                    } else {
                        button.obj.off(event);
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
        enableButton('read', true);
        enableButton('replicateAuto', true);
        enableButton('help', true);
        enableButton('about', true);

        // public
        this.updateAllButtonEnableState = updateAllButtonEnableState;
        this.updateReplicateAutoButtonPushState = updateReplicateAutoButtonPushState;

        return this;
    };
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
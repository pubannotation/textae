// Add or Remove class to indicate selected state.
module.exports = function() {
    var addClass = function($target) {
            return $target.addClass('ui-selected');
        },
        removeClass = function($target) {
            return $target.removeClass('ui-selected');
        };

    return {
        addClass: addClass,
        removeClass: removeClass
    };
}();
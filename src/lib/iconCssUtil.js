// Utility functions to change appearance of bunttons.
export function enable($control, buttonType) {
    $control
        .find('.' + buttonType)
        .removeClass('textae-control__icon--disabled');
}

export function disable($control, buttonType) {
    $control
        .find('.' + buttonType)
        .addClass('textae-control__icon--disabled');
}

export function push($button) {
    $button.addClass('textae-control__icon--pushed');
}

export function unpush($button) {
    $button.removeClass('textae-control__icon--pushed');
}

export function isPushed($button) {
    return $button.hasClass('textae-control__icon--pushed');
}

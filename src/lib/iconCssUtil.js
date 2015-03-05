// Utility functions to change appearance of bunttons.
export function enable($button) {
    $button.removeClass('textae-control__icon--disabled');
}

export function disable($button) {
    $button.addClass('textae-control__icon--disabled');
}

export function isDisable($button) {
    return $button.hasClass('textae-control__icon--disabled');
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

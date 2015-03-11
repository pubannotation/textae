import jQuerySugar from '../jQuerySugar';

export default function (displayInstance, $dialog) {
    jQuerySugar.enabled(toTypeGap($dialog), displayInstance.showInstance());
    return $dialog;
}

function toTypeGap($content) {
    return $content.find('.type-gap');
}

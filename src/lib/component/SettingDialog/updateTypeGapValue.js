import jQuerySugar from '../jQuerySugar';

export default function (displayInstance, $dialog) {
    return jQuerySugar.setValue(
        $dialog,
        '.type-gap',
        displayInstance.getTypeGap
    );
}

import cssUtil from './iconCssUtil';

const EVENT = 'click';

// A parameter can be spesified by object like { 'buttonType1': true, 'buttonType2': false }.
export default function($control, buttonList, buttonEnables) {
    Object.keys(buttonEnables)
        .filter(buttonType => buttonList[buttonType])
        .forEach(buttonType => setButtonApearanceAndEventHandler(
            $control,
            buttonType,
            buttonEnables[buttonType]
        ));
}

function enableButton($control, buttonType) {
    let eventHandler = () => {
        $control.trigger(
            'textae.control.button.click',
            `textae.control.button.${buttonType.replace(/-/g, '_')}.click`
        );
        return false;
    };

    $control
        .off(EVENT, '.' + buttonType)
        .on(EVENT, '.' + buttonType, eventHandler);

    cssUtil.enable($control, buttonType);
}

function disableButton($control, buttonType) {
    $control
        .off(EVENT, '.' + buttonType);

    cssUtil.disable($control, buttonType);
}

function setButtonApearanceAndEventHandler($control, buttonType, enable) {
    // Set apearance and eventHandler to button.
    if (enable === true) {
        enableButton($control, buttonType);
    } else {
        disableButton($control, buttonType);
    }
}

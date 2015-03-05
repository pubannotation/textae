import cssUtil from './iconCssUtil';

const BUTTON_MAP = [{
        'read': 'Import [I]',
        'write': 'Upload [U]'
    }, {
        'undo': 'Undo [Z]',
        'redo': 'Redo [A]'
    }, {
        'replicate': 'Replicate span annotation [R]',
        'replicate-auto': 'Auto replicate',
        'boundary-detection': 'Boundary Detection [B]',
        'relation-edit-mode': 'Relation Edit Mode [F]'
    }, {
        'entity': 'New entity [E]',
        'pallet': 'Select label [Q]',
        'change-label': 'Change label [W]'
    }, {
        'negation': 'Negation [X]',
        'speculation': 'Speculation [S]'
    }, {
        'delete': 'Delete [D]',
        'copy': 'Copy [C]',
        'paste': 'Paste [V]'
    }, {
        'setting': 'Setting'
    }, {
        'help': 'Help [H]'
    }],
    // Buttons that always eanable.
    ALWAYS_ENABLES = {
        'read': true,
        'help': true
    },
    EVENT = 'click';

// The control is a control bar to edit.
// This can controls mulitple instance of editor.
export default function($control) {
    // This contains buttons and event definitions like as {'buttonType' : { instance: $button, eventValue : 'textae.control.button.read.click' }}
    let buttonList = makeButtons($control, BUTTON_MAP),
        updateAllButtonEnableState = enableButtons => {
            // Make buttons in a enableButtons enabled, and other buttons in the buttonList disabled.
            let enables = _.extend({}, buttonList, ALWAYS_ENABLES, enableButtons);

            // A function to enable/disable button.
            updateButtons($control, buttonList, enables);
        },
        // Update button push state.
        updateButtonPushState = (buttonType, isPushed) => {
            if (isPushed) {
                cssUtil.push($control, buttonType);
            } else {
                cssUtil.unpush($control, buttonType);
            }
        };

    // Public API
    $control.updateAllButtonEnableState = updateAllButtonEnableState;
    $control.updateButtonPushState = updateButtonPushState;

    return $control;
}

function TitleDom() {
    const TITLE = `
    <span class="textae-control__title">
        <a href="http://textae.pubannotation.org/" target="_blank">TextAE</a>
    </span>
    `;

    return $(TITLE);
}

function ButtonDom(buttonType, title) {
    const BUTTON = `
    <span class="textae-control__icon textae-control__${buttonType}-button ${buttonType}" title="${title}">
    `;

    return $(BUTTON);
}

function SeparatorDom() {
    return $('<span class="textae-control__separator">');
}

function makeButtons($control, buttonMap) {
    let buttonGroups = buttonMap.map(params => Object.keys(params)
            .map(buttonType => [
                buttonType,
                new ButtonDom(buttonType, params[buttonType])
            ])
        ),
        // Make a group of buttons that is headed by the separator.
        icons = buttonGroups.reduce(
            (ary, buttons) => ary
            .concat([new SeparatorDom()])
            .concat(buttons.map(button => button[1])), []
        ),
        buttonList = buttonGroups.reduce((buttonList, buttons) => {
            return buttons.reduce((buttonList, button) => {
                buttonList[button[0]] = 1;

                return buttonList;
            }, buttonList);
        }, {});

    $control
        .append(new TitleDom())
        .append($('<span>').append(icons));

    return buttonList;
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

// A parameter can be spesified by object like { 'buttonType1': true, 'buttonType2': false }.
function updateButtons($control, buttonList, buttonEnables) {
    Object.keys(buttonEnables)
        .filter(buttonType => buttonList[buttonType])
        .forEach(buttonType => setButtonApearanceAndEventHandler(
            $control,
            buttonType,
            buttonEnables[buttonType]
        ));
}

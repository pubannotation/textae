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
    // This contains buttons and event definitions like as {'buttonName' : { instance: $button, eventValue : 'textae.control.button.read.click' }}
    let buttonContainer = makeButtons($control, BUTTON_MAP),
        updateAllButtonEnableState = enableButtons => {
            // Make buttons in a enableButtons enabled, and other buttons in the buttonContainer disabled.
            let enables = _.extend({}, buttonContainer, ALWAYS_ENABLES, enableButtons);

            // A function to enable/disable button.
            updateButtons($control, buttonContainer, enables);
        },
        // Update button push state.
        updateButtonPushState = (bottonName, isPushed) => {
            let button = buttonContainer[bottonName].instance;

            if (isPushed) {
                cssUtil.push(button);
            } else {
                cssUtil.unpush(button);
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
    <span class="textae-control__icon textae-control__${buttonType}-button" title="${title}">
    `;

    return $(BUTTON);
}

function SeparatorDom() {
    return $('<span class="textae-control__separator">');
}

function makeButtons($control, buttonMap) {
    let buttonContainer = {},
        // Make a group of buttons that is headed by the separator.
        icons = _.flatten(
            buttonMap.map(function(params) {
                let buttons = _.map(params, function(title, buttonType) {
                    let button = new ButtonDom(buttonType, title);

                    buttonContainer[buttonType] = {
                        instance: button,
                        eventValue: `textae.control.button.${buttonType.replace(/-/g, '_')}.click`
                    };

                    return button;
                });

                return [new SeparatorDom()]
                    .concat(buttons);
            })
        );

    $control
        .append(new TitleDom())
        .append($('<span>').append(icons));

    return buttonContainer;
}

function enableButton(button, eventHandler) {
    button
        .off(EVENT)
        .on(EVENT, eventHandler);
    cssUtil.enable(button);
}

function disableButton(button) {
    button.off(EVENT);
    cssUtil.disable(button);
}

function setButtonApearanceAndEventHandler(button, enable, eventHandler) {
    // Set apearance and eventHandler to button.
    if (enable === true) {
        enableButton(button, eventHandler);
    } else {
        disableButton(button);
    }
}

// A parameter can be spesified by object like { 'buttonName1': true, 'buttonName2': false }.
function updateButtons($control, buttonContainer, buttonEnables) {
    Object.keys(buttonEnables)
        .filter(buttonName => buttonContainer[buttonName])
        .map(buttonName => {
            let button = buttonContainer[buttonName];

            return [
                button.instance,
                buttonEnables[buttonName], () => {
                    $control.trigger('textae.control.button.click', button.eventValue);
                    return false;
                }
            ];
        })
        .forEach(button => setButtonApearanceAndEventHandler(
            button[0], button[1], button[2]
        ));
}

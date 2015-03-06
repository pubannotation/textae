import makeButtons from './makeButtons';
import cssUtil from './iconCssUtil';
import updateButtons from './updateButtons';

// Buttons that always eanable.
const ALWAYS_ENABLES = {
    'read': true,
    'help': true
};

// The control is a control bar to edit.
// This can controls mulitple instance of editor.
export default function($control) {
    let buttonList = makeButtons($control),
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

import jQuerySugar from '../jQuerySugar';
import updateLineHeight from './updateLineHeight';
import updateTypeGapEnable from './updateTypeGapEnable';
import updateTypeGapValue from './updateTypeGapValue';

export default function($dialog, editor, displayInstance) {
    updateEditMode(
        displayInstance,
        $dialog);
    updateTypeGapEnable(
        displayInstance,
        $dialog
    );
    updateTypeGapValue(
        displayInstance,
        $dialog
    );
    updateLineHeight(
        editor,
        $dialog
    );
}

// Update the checkbox state, because it is updated by the button on control too.
function updateEditMode(displayInstance, $dialog) {
    return jQuerySugar.setChecked(
        $dialog,
        '.mode',
        displayInstance.showInstance() ? 'checked' : null
    );
}

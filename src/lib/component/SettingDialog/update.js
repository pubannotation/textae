import jQuerySugar from '../jQuerySugar';
import updateLineHeight from './updateLineHeight';
import updateTypeGapEnable from './updateTypeGapEnable';
import updateTypeGapValue from './updateTypeGapValue';

export default function($dialog, editor, displayInstance) {
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

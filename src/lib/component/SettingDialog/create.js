import * as lineHeight from '../../editor/View/lineHeight';
import updateLineHeight from './updateLineHeight';
import updateTypeGapEnable from './updateTypeGapEnable';
import updateTypeGapValue from './updateTypeGapValue';

const CONTENT = `
    <div class="textae-editor__setting-dialog">
        <div>
            <label class="textae-editor__setting-dialog__label">Instance/Relation View</label>
            <input type="checkbox" class="textae-editor__setting-dialog__term-centric-view mode">
        </div>
        <div>
            <label class="textae-editor__setting-dialog__label">Type Gap</label>
            <input type="number" class="textae-editor__setting-dialog__type-gap type-gap" step="1" min="0" max="5">
        </div>
        <div>
            <label class="textae-editor__setting-dialog__label">Line Height</label>
            <input type="number" class="textae-editor__setting-dialog__line-height line-height" step="1" min="50" max="500">
            px
        </div>
    </div>
`;

export default function create(editor, editMode, displayInstance) {
    let $content = $(CONTENT);

    bind($content, editor, editMode, displayInstance);

    return $content;
}

function bind($content, editor, editMode, displayInstance) {
    bindChangeMode(
        $content,
        editor,
        editMode,
        displayInstance
    );

    bindChangeTypeGap(
        $content,
        editor,
        displayInstance
    );

    bindChangeLineHeight(
        $content,
        editor
    );
}

function bindChangeMode($content, editor, editMode, displayInstance) {
    let onModeChanged = debounce300(
        (e) => changeMode(editor, editMode, displayInstance, $content, e.target.checked)
    );

    $content.on(
        'click',
        '.mode',
        onModeChanged
    );
}

function changeMode(editor, editMode, displayInstance, $content, checked) {
    if (checked) {
        if (editMode.editable) {
            editMode.toInstance();
        } else {
            editMode.toViewInstance();
        }
    } else {
        if (editMode.editable) {
            editMode.toTerm();
        } else {
            editMode.toViewTerm();
        }
    }
    updateTypeGapEnable(displayInstance, $content);
    updateTypeGapValue(displayInstance, $content);
    updateLineHeight(editor, $content);
}

function bindChangeTypeGap($content, editor, displayInstance) {
    let onTypeGapChange = debounce300(
        (e) => {
            displayInstance.changeTypeGap(e.target.value);
            updateLineHeight(editor, $content);
        }
    );

    return $content
        .on(
            'change',
            '.type-gap',
            onTypeGapChange
        );
}

function bindChangeLineHeight($content, editor) {
    let onLineHeightChange = debounce300(
        (e) => {
            lineHeight.set(editor[0], e.target.value);
            redrawAllEditor();
        }
    );

    return $content
        .on(
            'change',
            '.line-height',
            onLineHeightChange
        );
}

// Redraw all editors in tha windows.
function redrawAllEditor() {
    $(window).trigger('resize');
}

function debounce300(func) {
    return _.debounce(func, 300);
}

function sixteenTimes(val) {
    return val * 16;
}

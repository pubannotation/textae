import GetEditorDialog from '../dialog/GetEditorDialog';
import create from './create';
import update from './update';

export default function(editor, displayInstance) {
    // Update values after creating a dialog because the dialog is re-used.
    let $content = create(editor, displayInstance),
        $dialog = appendToDialog(
            $content, editor
        );

    return () => {
        update($dialog, editor, displayInstance);
        return $dialog.open();
    };
}

function appendToDialog($content, editor) {
    return new GetEditorDialog(editor)(
        'textae.dialog.setting',
        'Setting',
        $content, {
            noCancelButton: true
        });
}

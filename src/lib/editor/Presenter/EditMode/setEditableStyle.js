export default function(editor, buttonStateHelper, isEditable) {
    if (isEditable) {
        editor.addClass('textae-editor_editable');
        buttonStateHelper.enabled('line-height', true);
    } else {
        editor.removeClass('textae-editor_editable');
        buttonStateHelper.enabled('replicate-auto', false);
        buttonStateHelper.enabled('boundary-detection', false);
    }
}

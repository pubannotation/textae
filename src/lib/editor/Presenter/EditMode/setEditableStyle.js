export default function(editor, buttonStateHelper, isEditable) {
    if (isEditable) {
        editor.addClass('textae-editor_editable');
    } else {
        editor.removeClass('textae-editor_editable');
    }
}

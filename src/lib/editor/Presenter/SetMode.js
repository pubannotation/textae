import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode';

let showForEdit;

export default function(annotationData, editMode, writable) {
    let showForEdit = (annotationData, multitrack, reject) => showLoadNoticeForEditableMode(annotationData, multitrack, reject, writable);

    return (editable) => setModeToEditable(annotationData, editMode, showForEdit, editable);
}

function setModeToEditable(annotationData, editMode, showForEdit, editable) {
    if (editable) {
        editMode.setEditModeApi();
        annotationData.on('all.change', showForEdit);
    } else {
        editMode.setViewModeApi();
        annotationData.removeListener('all.change', showForEdit);
    }
}

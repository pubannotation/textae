import {
    hasError
}
from '../model/AnnotationData/parseAnnotation/validateAnnotation';

let showForEdit;

export default function(annotationData, editMode, writable) {
    let showForEdit = (annotationData, multitrack, reject) => showMessageForEditMode(annotationData, multitrack, reject, writable);

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

function showMessageForEditMode(annotationData, multitrack, reject, writable) {
    writable.forceModified(false);

    if (multitrack) {
        toastr.success("track annotations have been merged to root annotations.");
        writable.forceModified(true);
    }

    if (hasError(reject)) {
        writable.forceModified(true);
    }
}

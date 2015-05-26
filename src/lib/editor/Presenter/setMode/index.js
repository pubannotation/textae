import {
    hasError
}
from '../../model/AnnotationData/parseAnnotation/validateAnnotation';

let showForEdit;

export default function(annotationData, editMode, mode, writable) {
    let isEditable = mode === 'edit';

    editMode.setModeApi(isEditable);

    if (!showForEdit)
        showForEdit = (annotationData, multitrack, reject) => showMessageForEditMode(annotationData, multitrack, reject, writable);

    if (isEditable) {
        annotationData.on('all.change', showForEdit);
    } else {
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

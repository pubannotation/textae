import {
    hasError
}
from '../model/AnnotationData/parseAnnotation/validateAnnotation';

import showLoadNoticeForEditableMode from './showLoadNoticeForEditableMode';

export default function(annotationData, editMode, writable, mode) {
    let editable = mode !== 'view';

    annotationData
        .on('all.change', (annotationData, multitrack, reject) => hoge(annotationData, multitrack, reject, writable));

    if (editable) {
        let showForEdit = (annotationData, multitrack, reject) => showLoadNoticeForEditableMode(annotationData, multitrack, reject, writable);

        annotationData
            .on('all.change', showForEdit)
            .on('all.change', (annotationData) => changeViewForEditable(editMode, annotationData));
    } else {
        annotationData
            .on('all.change', (annotationData) => changeViewForView(editMode, annotationData));
    }
}

 function hoge(annotationData, multitrack, reject, writable) {
    writable.forceModified(false);

    if (multitrack) {
        writable.forceModified(true);
    }

    if (hasError(reject)) {
        writable.forceModified(true);
    }
}


function changeViewForEditable(editMode, annotationData) {
    if (isSimple(annotationData)) {
        editMode.toTerm();
    } else {
        editMode.toInstance();
    }
}

function changeViewForView(editMode, annotationData) {
    if (isSimple(annotationData)) {
        editMode.toViewTerm();
    } else {
        editMode.toViewInstance();
    }
}

// Change view mode accoding to the annotation data.
function isSimple(annotationData) {
    return !annotationData.relation.some() && annotationData.span.multiEntities().length === 0;
}

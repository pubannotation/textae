export function forEditable(editMode, annotationData) {
    if (isSimple(annotationData)) {
        editMode.toTerm();
    } else {
        editMode.toInstance();
    }
}

export function forView(editMode, annotationData) {
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

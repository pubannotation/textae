export default function(editMode, annotationData, editable) {
    // Change view mode accoding to the annotation data.
    if (annotationData.relation.some() || annotationData.span.multiEntities().length > 0) {
        if (editable) {
            editMode.toInstance();
        } else {
            editMode.toViewInstance();
        }
    } else {
        if (editable) {
            editMode.toTerm();
        } else {
            editMode.toViewTerm();
        }
    }
}

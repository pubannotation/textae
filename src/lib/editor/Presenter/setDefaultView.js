export default function(editMode, annotationData) {
    // Change view mode accoding to the annotation data.
    if (annotationData.relation.some() || annotationData.span.multiEntities().length > 0) {
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
}

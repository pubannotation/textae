import isSimple from '../isSimple'

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

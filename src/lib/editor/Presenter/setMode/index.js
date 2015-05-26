import {
    hasError
}
from '../../model/AnnotationData/parseAnnotation/validateAnnotation';

export default function(annotationData, editMode, mode, writable) {
    let isEditable = mode === 'edit';

    editMode.setModeApi(isEditable);

    if (isEditable) {
        annotationData
            .on('all.change', (annotationData, multitrack, reject) => {
                writable.forceModified(false);

                if (multitrack) {
                    toastr.success("track annotations have been merged to root annotations.");
                    writable.forceModified(true);
                }

                if (hasError(reject)) {
                    writable.forceModified(true);
                }
            });
    }
}

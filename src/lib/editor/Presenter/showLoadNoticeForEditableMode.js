import {
    hasError
}
from '../model/AnnotationData/parseAnnotation/validateAnnotation';

export default function(annotationData, multitrack, reject, writable) {
    writable.forceModified(false);

    if (multitrack) {
        toastr.success("track annotations have been merged to root annotations.");
        writable.forceModified(true);
    }

    if (hasError(reject)) {
        writable.forceModified(true);
    }
}

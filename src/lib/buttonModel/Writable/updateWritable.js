import {
    hasError
}
from '../../editor/Model/AnnotationData/parseAnnotation/validateAnnotation'

export default function(writable, multitrack, reject) {
  writable.forceModified(false)

  if (multitrack) {
    writable.forceModified(true)
  }

  if (hasError(reject)) {
    writable.forceModified(true)
  }
}

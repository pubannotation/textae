import {
    hasError
}
from '../../Model/AnnotationData/parseAnnotation/validateAnnotation'

export default function(multitrack, reject, writable) {
  writable.forceModified(false)

  if (multitrack) {
    writable.forceModified(true)
  }

  if (hasError(reject)) {
    writable.forceModified(true)
  }
}

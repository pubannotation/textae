// Maintainance a state of which the save button is able to be push.
import Observable from 'observ'
import hasError from '../../editor/Model/AnnotationData/parseAnnotation/validateAnnotation/Reject/hasError'

export default function(
  history,
  dataAccessObject,
  annotationData,
  buttonController
) {
  // Fix loading annotation automatically when loading multitrack or broken annotation.
  // That is differnt with data on the serever.
  // So even if no changes at the editor, there is something to save to the server.
  let loadedAnnotationIsModified = false

  const o = new Observable(false)

  history.on('change', () => {
    o.set(loadedAnnotationIsModified || history.hasAnythingToSaveAnnotation)
  })

  dataAccessObject.on('annotation.save', () => {
    o.set(false)
    loadedAnnotationIsModified = false
  })

  annotationData.on('all.change', (_, multitrack, reject) => {
    if (multitrack || hasError(reject)) {
      o.set(true)
      loadedAnnotationIsModified = true
    }

    o.set(false)
  })

  o((val) => {
    buttonController.buttonStateHelper.transit('write', val)
  })
}

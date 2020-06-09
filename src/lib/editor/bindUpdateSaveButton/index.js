// Maintainance a state of which the save button is able to be push.
import Observable from 'observ'
import hasError from '../../hasError'

export default function(editor) {
  // Fix loading annotation automatically when loading multitrack or broken annotation.
  // That is differnt with data on the serever.
  // So even if no changes at the editor, there is something to save to the server.
  let loadedAnnotationIsModified = false

  const o = new Observable(false)

  editor.eventEmitter.on('textae.history.change', (history) => {
    o.set(loadedAnnotationIsModified || history.hasAnythingToSaveAnnotation)
  })

  editor.eventEmitter.on('textae.dataAccessObject.annotation.save', () => {
    o.set(false)
    loadedAnnotationIsModified = false
  })

  editor.eventEmitter.on(
    'textae.annotationData.all.change',
    (_, multitrack, reject) => {
      if (multitrack || hasError(reject)) {
        o.set(true)
        loadedAnnotationIsModified = true
      }

      o.set(false)
    }
  )

  o((val) => {
    editor.eventEmitter.emit('textae.control.buttons.transit', {
      write: val
    })
  })
}

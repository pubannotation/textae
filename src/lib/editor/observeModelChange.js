import ValidationDialog from '../component/ValidationDialog'
import hasError from '../hasError'

export default function(editor, history) {
  editor.eventEmitter.on(
    'textae.annotationData.all.change',
    (_, __, reject) => {
      history.resetAllHistories()

      if (hasError(reject)) {
        new ValidationDialog(reject).open()
      }
    }
  )
}

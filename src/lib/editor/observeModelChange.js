import ValidationDialog from '../component/ValidationDialog'

export default function (editor, history) {
  editor.eventEmitter.on(
    'textae.annotationData.all.change',
    (_, __, hasError, reject) => {
      history.resetAllHistories()

      if (hasError) {
        new ValidationDialog(reject).open()
      }
    }
  )
}

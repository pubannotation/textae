import showValidationDialog from '../component/showValidationDialog'

export default function(editor, history) {
  editor.eventEmitter.on(
    'textae.annotationData.all.change',
    (_, __, reject) => {
      history.resetAllHistories()
      showValidationDialog(reject)
    }
  )
}

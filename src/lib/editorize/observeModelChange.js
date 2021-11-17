import ValidationDialog from '../component/ValidationDialog'

export default function (editor, history) {
  editor.eventEmitter.on(
    'textae-event.annotation-data.all.change',
    (_, __, hasError, reject) => {
      if (hasError) {
        new ValidationDialog(reject).open()
      }
    }
  )
}

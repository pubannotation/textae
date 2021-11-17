import alertifyjs from 'alertifyjs'

export default function (editor, history) {
  editor.eventEmitter
    .on('textae-event.data-access-object.annotation.save', () => {
      alertifyjs.success('annotation saved')
    })
    .on('textae-event.data-access-object.configuration.save', () => {
      alertifyjs.success('configuration saved')
    })
    .on('textae-event.data-access-object.save.error', () => {
      alertifyjs.error('could not save')
    })
}

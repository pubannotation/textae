import alertifyjs from 'alertifyjs'

export default function (editor, history) {
  editor.eventEmitter
    .on('taxtae-event.annotation-data.annotation.save', () => {
      history.annotatioSaved()
      alertifyjs.success('annotation saved')
    })
    .on('taxtae-event.annotation-data.configuration.save', () => {
      history.configurationSaved()
      alertifyjs.success('configuration saved')
    })
    .on('textae-event.data-access-object.save.error', () => {
      alertifyjs.error('could not save')
    })
}

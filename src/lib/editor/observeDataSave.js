import alertifyjs from 'alertifyjs'

export default function (editor, history) {
  editor.eventEmitter
    .on('textae-event.annotation.save', () => {
      history.annotatioSaved()
      alertifyjs.success('annotation saved')
    })
    .on('textae-event.configuration.save', () => {
      history.configurationSaved()
      alertifyjs.success('configuration saved')
    })
    .on('textae-event.saveError', () => {
      alertifyjs.error('could not save')
    })
}

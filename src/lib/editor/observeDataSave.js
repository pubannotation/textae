import alertifyjs from 'alertifyjs'

export default function (editor, history) {
  editor.eventEmitter
    .on('textae.annotation.save', () => {
      history.annotatioSaved()
      alertifyjs.success('annotation saved')
    })
    .on('textae.configuration.save', () => {
      history.configurationSaved()
      alertifyjs.success('configuration saved')
    })
    .on('textae.saveError', () => {
      alertifyjs.error('could not save')
    })
}

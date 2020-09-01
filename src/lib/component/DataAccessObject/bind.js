export default function bind(editor, ajaxSender) {
  const emitter = editor.eventEmitter

  emitter
    .on('textae.saveAnnotationDialog.download.click', () =>
      emitter.emit('textae.annotation.save')
    )
    .on('textae.saveAnnotationDialog.viewsource.click', () =>
      emitter.emit('textae.annotation.save')
    )
    .on('textae.saveConfigurationDialog.download.click', () =>
      emitter.emit('textae.configuration.save')
    )
}

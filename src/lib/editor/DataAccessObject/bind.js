export default function bind(editor, ajaxSender) {
  const emitter = editor.eventEmitter

  emitter
    .on('textae-event.saveAnnotationDialog.download.click', () =>
      emitter.emit('textae-event.annotation.save')
    )
    .on('textae-event.saveAnnotationDialog.viewsource.click', () =>
      emitter.emit('textae-event.annotation.save')
    )
    .on('textae-event.saveConfigurationDialog.download.click', () =>
      emitter.emit('textae-event.configuration.save')
    )
}

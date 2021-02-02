export default function bind(editor, ajaxSender) {
  const emitter = editor.eventEmitter

  emitter
    .on('textae-event.save-annotation-dialog.download.click', () =>
      emitter.emit('taxtae-event.data-access-object.annotation.save')
    )
    .on('textae-event.save-annotation-dialog.viewsource.click', () =>
      emitter.emit('taxtae-event.data-access-object.annotation.save')
    )
    .on('textae-event.save-configuration-dialog.download.click', () =>
      emitter.emit('taxtae-event.data-access-object.configuration.save')
    )
}

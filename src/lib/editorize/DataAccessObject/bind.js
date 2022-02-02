export default function bind(editor) {
  const emitter = editor.eventEmitter

  emitter
    .on('textae-event.save-annotation-dialog.download.click', (editedData) =>
      emitter.emit(
        'textae-event.data-access-object.annotation.save',
        editedData
      )
    )
    .on('textae-event.save-annotation-dialog.viewsource.click', (editedData) =>
      emitter.emit(
        'textae-event.data-access-object.annotation.save',
        editedData
      )
    )
    .on('textae-event.save-configuration-dialog.download.click', (editedData) =>
      emitter.emit(
        'textae-event.data-access-object.configuration.save',
        editedData
      )
    )
}

export default function(editor, ajaxSender, url, data) {
  return ajaxSender.post(url, data, () =>
    editor.eventEmitter.emit('textae.dataAccessObject.annotation.save')
  )
}

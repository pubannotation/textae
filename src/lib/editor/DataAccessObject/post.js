export default function (editor, ajaxSender, url, data, event) {
  return ajaxSender.post(url, data, () => editor.eventEmitter.emit(event))
}

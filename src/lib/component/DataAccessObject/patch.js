export default function patch(editor, ajaxSender, url, data, event) {
  ajaxSender.patch(url, data, () => editor.eventEmitter.emit(event))
}

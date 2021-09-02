export default function changeCursor(editor, action) {
  editor[0].classList[action]('textae-editor--wait')
}

import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript.js'

export default function initJSONEditor(textarea, dialogHeight) {
  const JSONEditor = CodeMirror.fromTextArea(textarea, {
    mode: {
      name: 'javascript',
      json: true
    },
    lineNumbers: true,
    value: textarea.value
  })
  JSONEditor.setSize('auto', dialogHeight * 0.6)
  JSONEditor.on('change', (cm) => {
    textarea.value = cm.getValue()
  })
}

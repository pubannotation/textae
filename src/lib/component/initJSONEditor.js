import { EditorView, basicSetup } from 'codemirror'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { javascript } from '@codemirror/lang-javascript'

export default function initJSONEditor(textarea, dialogHeight) {
  const editorHeightTheme = EditorView.theme({
    '&': {
      height: `${dialogHeight * 0.6}px`
    }
  })

  const view = new EditorView({
    doc: textarea.value,
    extensions: [
      basicSetup,
      javascript(),
      syntaxHighlighting(defaultHighlightStyle),
      editorHeightTheme
    ]
  })

  // Replace the textarea with the new editor.
  textarea.parentNode.insertBefore(view.dom, textarea)
  textarea.style.display = 'none'

  return view
}

export default function (editor, mode) {
  for (const cssClass of editor.classList) {
    if (cssClass.startsWith('textae-editor__mode')) {
      editor.classList.remove(cssClass)
    }
  }

  editor.classList.add(`textae-editor__mode--${mode}`)
}

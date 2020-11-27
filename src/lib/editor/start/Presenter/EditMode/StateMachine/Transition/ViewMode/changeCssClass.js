export default function (editor, mode) {
  for (const cssClass of editor[0].classList) {
    if (cssClass.startsWith('textae-editor__mode')) {
      editor[0].classList.remove(cssClass)
    }
  }

  editor[0].classList.add(`textae-editor__mode--${mode}`)
}

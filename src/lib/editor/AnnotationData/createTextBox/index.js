import TextBox from './TextBox'

export default function (editor, annotationData) {
  // Place the text box behind the annotation box to allow you
  // to select the text behind the relationship label in entity editing mode.
  const html = `
    <div class="textae-editor__body">
      <div class="textae-editor__annotation-box"></div>
      <div class="textae-editor__text-box"></div>
      <svg
        namespace="http://www.w3.org/2000/svg"
        class="textae-editor__relation-box">
        <defs></defs>
      </svg>
    </div>
    `
  // The editor itself has a "white-space: pre" style for processing text that contains a series of whitespace.
  // In this case, HTML line breaks are included in the editor's height calculation.
  // Remove CRLF so that it is not included in the height calculation.
  editor[0].innerHTML = html.replace(/[\n\r]+/g, '')

  const textBox = new TextBox(editor[0], annotationData)
  return textBox
}

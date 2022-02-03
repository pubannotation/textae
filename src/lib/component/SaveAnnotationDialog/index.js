import Dialog from '../Dialog'
import bind from './bind'

function template(context) {
  const { url, filename } = context

  return `
<div class="textae-editor__save-dialog__container">
  <div class="textae-editor__save-dialog__row">
    <label>URL</label>
    <input 
      type="text"
      value="${url}"
      class="textae-editor__save-dialog__url-text">
    <input 
      type="button"
      class="textae-editor__save-dialog__url-button"
      ${url ? '' : `disabled="disabled"`}
      value="Save">
  </div>
  <div class="textae-editor__save-dialog__row">
    <label>Local</label>
    <input
      type="text"
      value="${filename}"
      >
    <a class="textae-editor__save-dialog__download-link" href="#">Download</a>
  </div>
  <div class="textae-editor__save-dialog__row">
    <a class="textae-editor__save-dialog__viewsource-link" href="#">Click to see the json source in a new window.</a>
  </div>
</div>
`
}

export default class SaveAnnotationDialog extends Dialog {
  constructor(editor, url, filename, data, saveAnnotation) {
    super('Save Annotations', template({ filename, url }))

    bind(
      editor.eventEmitter,
      super.el,
      data,
      () => super.close(),
      saveAnnotation
    )
  }
}

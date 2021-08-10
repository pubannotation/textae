import Dialog from '../Dialog'
import bind from './bind'

function template(context) {
  const { url, filename } = context

  return `
<div class="textae-editor__save-dialog__container">
  <div class="textae-editor__save-dialog__row">
    <label class="textae-editor__save-dialog__label">URL</label>
    <input 
      type="text"
      value="${url}"
      class="textae-editor__save-dialog__server-file-name url">
    <input 
      type="button"
      class="url"
      ${url ? '' : `disabled="disabled"`}
      value="Save">
  </div>
  <div class="textae-editor__save-dialog__row">
    <label class="textae-editor__save-dialog__label">Local</label>
    <input
      type="text"
      value="${filename}"
      class="textae-editor__save-dialog__local-file-name local">
    <a class="download" href="#">Download</a>
  </div>
  <div class="textae-editor__save-dialog__row">
    <a class="viewsource" href="#">Click to see the json source in a new window.</a>
  </div>
</div>
`
}

export default class SaveAnnotationDialog extends Dialog {
  constructor(editor, url, filename, data, saveAnnotation) {
    super('Save Annotations', template({ filename, url }), 'Cancel')

    bind(editor, super.el, data, () => super.close(), saveAnnotation)
  }
}

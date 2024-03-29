import { hideUnchanged } from 'jsondiffpatch/formatters/html'
import Dialog from '../Dialog'
import jsonDiff from './jsonDiff'
import bind from './bind'

function template(context) {
  const { url, filename, diff } = context

  return `
<div class="textae-editor__save-dialog__container">
  <div class="textae-editor__save-dialog__row">
    <label>URL</label>
    <input
      type="text" value="${url}"
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
      type="text" value="${filename}"
      >
    <a class="textae-editor__save-dialog__download-link" href="#">Download</a>
  </div>
  <div class="textae-editor__save-dialog__row">
    <div class="textae-editor__save-dialog__diff-title">
      Configuration differences
      <span class="textae-editor__save-dialog__diff-add-legend">added</span>
      <span class="textae-editor__save-dialog__diff-remove-legend">removed</span>
    </div>
    <div class="textae-editor__save-dialog__diff-viewer">${diff}</div>
  </div>
</div>
`
}

export default class SaveConfigurationDialog extends Dialog {
  constructor(
    eventEmitter,
    url,
    filename,
    originalData,
    editedData,
    saveConfiguration
  ) {
    super(
      'Save Configurations',
      template({
        filename,
        url,
        diff: jsonDiff(originalData, editedData) || 'nothing.'
      }),

      {
        maxWidth: 550
      }
    )

    // Hide unchanged diff.
    this._$dialog.on('dialogopen', () => hideUnchanged())

    bind(
      eventEmitter,
      super.el,
      editedData,
      () => super.close(),
      saveConfiguration
    )
  }
}

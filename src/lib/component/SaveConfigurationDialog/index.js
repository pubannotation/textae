import { formatters } from 'jsondiffpatch'
import Dialog from '../Dialog'
import jsonDiff from './jsonDiff'
import bind from './bind'

function template(context) {
  const { url, filename, diff } = context

  return `<div>
<div class="textae-editor__save-dialog__row">
  <label class="textae-editor__save-dialog__label">URL</label>
  <input type="text" value="${url}" class="textae-editor__save-dialog__server-file-name url">
  <input type="button" class="url" ${
    url ? '' : `disabled="disabled"`
  } value="Save">
</div>
<div class="textae-editor__save-dialog__row">
  <label class="textae-editor__save-dialog__label">Local</label>
  <input type="text" value="${filename}" class="textae-editor__save-dialog__local-file-name local">
  <a class="download" href="#">Download</a>
</div>
<div class="textae-editor__save-dialog__row"><p class="textae-editor__save-dialog__diff-title">Configuration differences<span class="diff-info diff-info--add">added</span><span class="diff-info diff-info--remove">removed</span></p></div>
<div class="textae-editor__save-dialog__diff-viewer">${diff}</div>
</div>`
}

export default class SaveConfigurationDialog extends Dialog {
  constructor(
    editor,
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
      'Cancel',
      {
        width: 550
      }
    )

    // Hide unchanged diff.
    this._$dialog.on('dialogopen', () => formatters.html.hideUnchanged())

    bind(editor, super.el, editedData, () => super.close(), saveConfiguration)
  }
}

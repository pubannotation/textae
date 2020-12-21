import Dialog from '../Dialog'
import bind from './bind'
import compileHandlebarsTemplate from '../compileHandlebarsTemplate'

const template = compileHandlebarsTemplate(`<div>
<div class="textae-editor__save-dialog__row">
  <label class="textae-editor__save-dialog__label">URL</label>
  <input type="text" value="{{url}}" class="textae-editor__save-dialog__server-file-name url">
  <input type="button" class="url" {{#unless url}}disabled="disabled"{{/unless}} value="Save">
</div>
<div class="textae-editor__save-dialog__row">
  <label class="textae-editor__save-dialog__label">Local</label>
  <input type="text" value="{{filename}}" class="textae-editor__save-dialog__local-file-name local">
  <a class="download" href="#">Download</a>
</div>
<div class="textae-editor__save-dialog__row">
  <label class="textae-editor__save-dialog__label"></label>
  <a class="viewsource" href="#">Click to see the json source in a new window.</a>
</div>
</div>
`)

export default class SaveAnnotationDialog extends Dialog {
  constructor(editor, url, filename, data, saveAnnotation) {
    super('Save Annotations', template({ filename, url }), 'Cancel')

    bind(editor, super.el, data, () => super.close(), saveAnnotation)
  }
}

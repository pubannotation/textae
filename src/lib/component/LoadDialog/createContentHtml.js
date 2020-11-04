import Handlebars from 'handlebars'

const source = `<div>
<div class="textae-editor__load-dialog__row">
  <label class="textae-editor__load-dialog__label">URL</label>
  <input type="text" value="{{url}}" class="textae-editor__load-dialog__file-name url">
  <input type="button" class="url" {{#unless url}}disabled="disabled"{{/unless}} value="Open">
</div>
<div class="textae-editor__load-dialog__row">
  <label class="textae-editor__load-dialog__label">Local</label>
  <input class="textae-editor__load-dialog__file" type="file">
  <input type="button" class="local" disabled="disabled" value="Open">
</div>
</div>`
const template = Handlebars.compile(source)

export default function (content) {
  return template(content)
}

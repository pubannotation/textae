import Handlebars from 'handlebars'
import attributePatial from './attributePartialHtml'

// Since registerPartial is a global configuration, templates that depend on the attribute partial template are defined in this file.
Handlebars.registerPartial('attributePartialTemplate', attributePatial)

export const wholeTemplate = Handlebars.compile(`
<div class="textae-editor__edit-type-dialog__container">
  <div class="textae-editor__edit-type-dialog__type">
    <div class="textae-editor__edit-type-dialog__type__predicate">
      <label>Predicate:</label><br>
      <span class="textae-editor__edit-type-dialog__type__predicate__value">type</span>
    </div>
    <div class="textae-editor__edit-type-dialog__type__value ui-front">
      <label>Value:</label><br>
      <input class="textae-editor__edit-type-dialog__type__value__value" value="{{value}}">
    </div>
    <div class="textae-editor__edit-type-dialog__type__label">
      <label>Label:</label><br>
      <span class="textae-editor__edit-type-dialog__type__label__value">{{label}}</span>
    </div>
  </div>
  <div class="textae-editor__edit-type-dialog__attributes">
    {{#each attributes}}
    {{> attributePartialTemplate}}
    {{/each}}
  </div>
</div>`)

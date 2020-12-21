import Handlebars from 'handlebars'

// Since registerPartial is a global configuration, templates that depend on the attribute partial template are defined in this file.
Handlebars.registerPartial(
  'attributePartialTemplate',
  `
<div class="textae-editor__edit-type-dialog__attribute">
<div class="textae-editor__edit-type-dialog__attribute__predicate">
  <label>Predicate:</label><br>
  <input class="textae-editor__edit-type-dialog__attribute__predicate__value" value="{{this.pred}}" disabled="disabled">
</div>
<div class="textae-editor__edit-type-dialog__attribute__value">
  <label>Value:</label><br>
  <input class="textae-editor__edit-type-dialog__attribute__value__value" value="{{this.obj}}" disabled="disabled">
</div>
<div class="textae-editor__edit-type-dialog__attribute__edit">
  <button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__edit__value" data-predicate="{{this.pred}}"{{#if this.editDisabled}} disabled="disabled"{{/if}}>edit</button>
</div>
<div class="textae-editor__edit-type-dialog__attribute__remove">
  <button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__remove__value">remove</button>
</div>
</div>`
)

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

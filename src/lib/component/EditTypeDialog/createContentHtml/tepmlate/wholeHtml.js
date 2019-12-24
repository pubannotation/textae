const html = `
<div class="textae-editor__edit-type-dialog__container">
  <div class="textae-editor__edit-type-dialog__type">
    <div class="textae-editor__edit-type-dialog__type__predicate">
      <label>Predicate:</label><br>
      <span class="textae-editor__edit-type-dialog__type__predicate__value">type</span>
    </div>
    <div class="textae-editor__edit-type-dialog__type__value">
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
  <div class="textae-editor__edit-type-dialog__attribute__message textae-editor__edit-type-dialog__attribute__message--valid">An entity cannot have more than one attribute with the same predicate</div>
  <div class="textae-editor__edit-type-dialog__attribute__add">
    <button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__add__value">add an attribute</button>
  </div>
</div>`

export default html

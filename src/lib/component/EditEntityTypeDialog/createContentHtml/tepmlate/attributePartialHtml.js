const html = `
<div class="textae-editor__edit-type-dialog__attribute">
<div class="textae-editor__edit-type-dialog__attribute__predicate">
  <label>Predicate:</label><br>
  <input class="textae-editor__edit-type-dialog__attribute__predicate__value" value="{{this.pred}}" disabled="disabled">
</div>
<div class="textae-editor__edit-type-dialog__attribute__value">
  <label>Value:</label><br>
  <input class="textae-editor__edit-type-dialog__attribute__value__value" value="{{this.obj}}" disabled="disabled">
</div>
<div class="textae-editor__edit-type-dialog__attribute__remove">
  <button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__remove__value">remove</button>
</div>
</div>`
export default html

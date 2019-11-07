import Handlebars from 'handlebars'

const source = `
<div class="textae-editor__create-attribute-definition-dialog__container">
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <label>Attribute type:</label>
    <select class="textae-editor__create-attribute-definition-dialog__value-type">
      <option value="flag"{{#if flagSelected}} selected{{/if}}>flag</option>
      <option value="selection"{{#if selectionSelected}} selected{{/if}}>selection</option>
      <option value="string"{{#if stringSelected}} selected{{/if}}>string</option>
      <option value="numeric"{{#if numericSelected}} selected{{/if}}>numeric</option>
    </select>
  </div>
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <div class="textae-editor__create-attribute-definition-dialog__pred">
      <label>Predicate:</label><br>
      <input value="{{pred}}">
    </div>
    {{#if showDefault}}
      <div class="textae-editor__create-attribute-definition-dialog__default">
        <label>Default:</label><br>
        <input value="{{default}}">
      </div>
    {{/if}}
  </div>
  {{#if showNumeric}}
    <div class="textae-editor__create-attribute-definition-dialog__row">
      <div class="textae-editor__create-attribute-definition-dialog__min">
        <label>Min:</label><br>
        <input type="text" value="{{min}}">
      </div>
      <div class="textae-editor__create-attribute-definition-dialog__max">
        <label>Max:</label><br>
        <input type="text" value="{{max}}">
      </div>
      <div class="textae-editor__create-attribute-definition-dialog__step">
        <label>Step:</label><br>
        <input type="text" value="{{step}}">
      </div>
    </div>
  {{/if}}
</div>`
const template = Handlebars.compile(source)

export default function createContentHtml(conttent) {
  return template(conttent)
}

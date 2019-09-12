import create from './create'
import update from './update'

export default class {
  constructor(typeDefinition, done, autocompletionWs, title) {
    this.typeDefinition = typeDefinition
    this.done = done
    this.autocompletionWs = autocompletionWs

    const el = document.createElement('div')
    el.classList.add('textae-editor__edit-type-definition-dialog__container')
    el.innerHTML = `
<div class="textae-editor__edit-type-definition-dialog__input-box">
  <label>Id:</label><br>
  <input>
</div>
<div class="textae-editor__edit-type-definition-dialog__input-box">
  <label>Label:<span></span></label><br>
  <input>
</div>
<div class="textae-editor__edit-type-definition-dialog__color-picker">
  <label>Color:<input class="textae-editor__edit-type-definition-dialog__color-picker__input" type="color"></label>
</div>
<div class="textae-editor__edit-type-definition-dialog__set-default">
  <label>Default type:<input class="textae-editor__edit-type-definition-dialog__set-default__input" type="checkbox"></label>
</div>`

    const inputs = el.querySelectorAll('input')
    this.$dialog = create(el, inputs, title)
  }

  update(id, label, color, isDefault) {
    update(
      this.$dialog,
      this.typeDefinition,
      this.autocompletionWs,
      this.done,
      id,
      label,
      color,
      isDefault
    )
  }

  open() {
    const inputs = this.$dialog.find('input')
    if (!inputs.eq(0).prop('disabled')) {
      this.$dialog
        .find('input')
        .eq(0)
        .focus()
        .select()
    } else {
      this.$dialog
        .find('input')
        .eq(1)
        .focus()
        .select()
    }
    this.$dialog.open()
  }
}

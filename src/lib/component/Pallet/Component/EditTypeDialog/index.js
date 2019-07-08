import create from './create'
import update from './update'
import CLASS_NAMES from './className'

export default class {
  constructor(editor, typeContainer, done, autocompletionWs, title) {
    this.typeContainer = typeContainer
    this.done = done
    this.autocompletionWs = autocompletionWs

    const el = document.createElement('div')
    el.classList.add(CLASS_NAMES.container)
    el.innerHTML = `
<div class="${CLASS_NAMES.inputBox}">
  <label>Id:</label><br>
  <input>
</div>
<div class="${CLASS_NAMES.inputBox}">
  <label>Label:<span></span></label><br>
  <input>
</div>
<div class="${CLASS_NAMES.colorPicker}">
  <label>Color:<input class="${CLASS_NAMES.colorPickerInput}" type="color"></label>
</div>
<div class="${CLASS_NAMES.setDefault}">
  <label>Default type:<input class="${CLASS_NAMES.setDefaultInput}" type="checkbox"></label>
</div>`

    const inputs = el.querySelectorAll('input')
    this.$dialog = create(editor, el, inputs, title)
  }

  update(id, label, color, isDefault) {
    update(this.$dialog, this.typeContainer, this.autocompletionWs, this.done, id, label, color, isDefault)
  }

  open() {
    let inputs = this.$dialog.find('input')
    if (!inputs.eq(0).prop('disabled')) {
      this.$dialog.find('input').eq(0).focus().select()
    } else {
      this.$dialog.find('input').eq(1).focus().select()
    }
    this.$dialog.open()
  }
}

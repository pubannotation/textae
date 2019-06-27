import CLASS_NAMES from './className'
import create from './create'
import update from './update'

export default class {

  constructor(editor, label1, label2, done, typeContainer, autocompletionWs) {
    this.typeContainer = typeContainer
    this.done = done
    this.autocompletionWs = autocompletionWs

    const el = document.createElement('div')
    el.classList.add(CLASS_NAMES.container)
    el.innerHTML = `
<div class="${CLASS_NAMES.inputBox}">
  <label>${label1}:</label><br>
  <input class="${CLASS_NAMES.value1}">
</div>
<div class="${CLASS_NAMES.inputBox}">
  <label>${label2}:<span></span></label><br>
  <input class="${CLASS_NAMES.value2}">
</div>`

    const label = el.querySelector('span'),
      input = el.querySelectorAll('input')

    this.$dialog = create(editor, el, input[0], input[1], label)
  }

  update(value1, value2) {
    update(this.$dialog, this.typeContainer, this.autocompletionWs, this.done, value1, value2)
  }

  open() {
    this.$dialog.open()
    this.$dialog.find('input').eq(1).focus().select()
  }
}

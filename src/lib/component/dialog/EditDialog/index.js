import CLASS_NAMES from './className'
import create from './create'
import update from './update'

export default class {

  constructor(editor, predicate, value, done, typeContainer, autocompletionWs) {
    this.typeContainer = typeContainer
    this.done = done
    this.autocompletionWs = autocompletionWs

    const el = document.createElement('div')
    el.classList.add(CLASS_NAMES.container)
    el.innerHTML = `
<div class="${CLASS_NAMES.inputBox}">
  <label>${predicate}:</label><br>
  <input class="${CLASS_NAMES.predicate}">
</div>
<div class="${CLASS_NAMES.inputBox}">
  <label>${value}:<span></span></label><br>
  <input class="${CLASS_NAMES.value}">
</div>`

    const label = el.querySelector('span'),
      input = el.querySelectorAll('input')

    this.$dialog = create(editor, el, input[0], input[1], label)
  }

  update(predicate, value) {
    update(this.$dialog, this.typeContainer, this.autocompletionWs, this.done, predicate, value)
  }

  open() {
    this.$dialog.open()
    this.$dialog.find('input').eq(1).focus().select()
  }
}

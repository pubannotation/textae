import source from '../source'
import EditDialog from '../dialog/EditDialog'
import select from './select'

export default class extends EditDialog {
  constructor(editor, done, typeDefinition, autocompletionWs) {
    super(editor, done)
    this.typeDefinition = typeDefinition
    this.autocompletionWs = autocompletionWs

    const disableInput = this.$dialog.find('input').eq(0)
    disableInput.prop('disabled', true)
    disableInput.attr('disabled', 'disabled')
  }

  update(predicate, value) {
    super.update(predicate, value)

    const $labelSpan = this.$dialog.find('label').eq(1).find('span')

    // Update the source
    if (this.typeDefinition && this.autocompletionWs) {
      const $inputs = this.$dialog.find('input')

      $inputs
        .eq(1)
        .autocomplete({
          source: (request, response) => {
            $labelSpan.text('')
            source(this.typeDefinition, this.autocompletionWs, request, response)
          },
          minLength: 3,
          select: (_, ui) => select($inputs.eq(1), $labelSpan, ui)
        })
    }

    if (this.typeDefinition && this.typeDefinition.getLabel(value)) {
      $labelSpan.text(this.typeDefinition.getLabel(value))
    } else {
      $labelSpan.text('')
    }
  }
}

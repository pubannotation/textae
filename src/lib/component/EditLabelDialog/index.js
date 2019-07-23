import EditDialog from '../dialog/EditDialog'
import setAutocompleteSource from './setAutocompleteSource'

export default class extends EditDialog {
  constructor(editor, predicate, value, done, typeDefinition, autocompletionWs) {
    super(editor, predicate, value, done)

    // Make predicate unmodifiable
    const $inputs = this.$dialog.find('input')
    const disableInput = $inputs.eq(0)
    disableInput.prop('disabled', true)
    disableInput.attr('disabled', 'disabled')

    // Update the source
    const $value = $inputs.eq(1)
    const $labelSpan = this.$dialog.find('label').eq(1).find('span')
    setAutocompleteSource(typeDefinition, autocompletionWs, $value, $labelSpan)

    // Sel a label
    if (typeDefinition && typeDefinition.getLabel(value)) {
      $labelSpan.text(typeDefinition.getLabel(value))
    } else {
      $labelSpan.text('')
    }
  }
}

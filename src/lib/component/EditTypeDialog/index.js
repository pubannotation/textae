import setAutocompleteSource from './setAutocompleteSource'
import create from './create'

export default class {
  constructor(type, done, typeDefinition, autocompletionWs) {
    this.$dialog = create(type, done)

    // Setup autocomplete
    const $value = this.$dialog.find(
      '.textae-editor__edit-type-dialog__type__value__value'
    )
    const $labelSpan = this.$dialog.find(
      '.textae-editor__edit-type-dialog__type__label__value'
    )
    setAutocompleteSource(typeDefinition, autocompletionWs, $value, $labelSpan)

    // Set a label
    if (typeDefinition && typeDefinition.getLabel(type.name)) {
      $labelSpan.text(typeDefinition.getLabel(type.name))
    }
  }

  open() {
    this.$dialog.open()
  }
}

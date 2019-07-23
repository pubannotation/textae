import source from '../source'
import EditDialog from '../dialog/EditDialog'
import select from './select'

export default class extends EditDialog {
  constructor(editor, predicate, value, done, typeDefinition, autocompletionWs) {
    super(editor, predicate, value, done)

    const disableInput = this.$dialog.find('input').eq(0)
    disableInput.prop('disabled', true)
    disableInput.attr('disabled', 'disabled')

    const $labelSpan = this.$dialog.find('label').eq(1).find('span')

    // Update the source
    if (typeDefinition && autocompletionWs) {
      const $inputs = this.$dialog.find('input')

      $inputs
        .eq(1)
        .autocomplete({
          source: (request, response) => {
            $labelSpan.text('')
            source(typeDefinition, autocompletionWs, request, response)
          },
          minLength: 3,
          select: (_, ui) => select($inputs.eq(1), $labelSpan, ui)
        })
    }

    if (typeDefinition && typeDefinition.getLabel(value)) {
      $labelSpan.text(typeDefinition.getLabel(value))
    } else {
      $labelSpan.text('')
    }
  }
}

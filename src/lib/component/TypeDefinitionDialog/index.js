import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

export default class TypeDefinitionDialog extends PromiseDialog {
  constructor(
    title,
    content,
    typeContainer,
    autocompletionWs,
    convertToReseltsFunc
  ) {
    super(
      title,
      createContentHtml(content),
      {
        height: 250
      },
      '.textae-editor__edit-type-definition-dialog--id',
      () => {
        const inputs = super.el.querySelectorAll('input')
        return convertToReseltsFunc(
          inputs[0].value,
          inputs[1].value,
          inputs[2].value,
          inputs[3].checked
        )
      }
    )

    setSourceOfAutoComplete(super.el, autocompletionWs, (term) =>
      typeContainer.findByLabel(term)
    )
  }
}

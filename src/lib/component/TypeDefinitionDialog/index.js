import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'

export default class extends PromiseDialog {
  constructor(
    title,
    content,
    typeDefinition,
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

    setSourceOfAutoComplete(super.el, typeDefinition, autocompletionWs)
  }
}

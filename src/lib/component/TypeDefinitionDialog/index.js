import PromiseDialog from '../PromiseDialog'
import setSourceOfAutoComplete from './setSourceOfAutoComplete'
import template from './template'

export default class TypeDefinitionDialog extends PromiseDialog {
  constructor(
    title,
    content,
    definitionContainer,
    autocompletionWs,
    convertToResultsFunc
  ) {
    super(title, template(content), {}, () => {
      const inputs = super.el.querySelectorAll('input')
      return convertToResultsFunc(
        inputs[0].value,
        inputs[1].value,
        inputs[2].value,
        inputs[3].checked
      )
    })

    setSourceOfAutoComplete(super.el, autocompletionWs, (term) =>
      definitionContainer.findByLabel(term)
    )
  }
}

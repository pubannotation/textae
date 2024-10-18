import PromiseDialog from '../PromiseDialog'
import searchTerm from '../searchTerm'
import Autocomplete from '../autocomplete'
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

    const [idElement, labelElement] = super.el.querySelectorAll('input')
    const onSearch = (term, onResult) =>
      searchTerm(
        term,
        onResult,
        autocompletionWs,
        definitionContainer.findByLabel(term)
      )
    new Autocomplete(idElement, onSearch, (id, label) => {
      idElement.value = id
      labelElement.value = label
    })
    new Autocomplete(labelElement, onSearch, (id, label) => {
      idElement.value = id
      labelElement.value = label
    })
  }
}

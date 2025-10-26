import Autocomplete from 'popover-autocomplete'
import PromiseDialog from '../PromiseDialog'
import template from './template'

export default class TypeDefinitionDialog extends PromiseDialog {
  constructor(title, content, definitionContainer, convertToResultsFunc) {
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
      definitionContainer.searchByLabel(term, onResult)

    const onSelect = (result) => {
      idElement.value = result.id
      labelElement.value = result.label
    }

    const onRender = (item) => `${item.id} ${item.label}`

    new Autocomplete({
      inputElement: idElement,
      onSearch,
      onSelect,
      onRender
    })

    new Autocomplete({
      inputElement: labelElement,
      onSearch,
      onSelect,
      onRender
    })
  }
}

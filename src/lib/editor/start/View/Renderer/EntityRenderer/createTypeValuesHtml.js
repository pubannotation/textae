import Handlebars from 'handlebars'
import './registerTypeValeusPartial'

const typeValuesTemplate = Handlebars.compile(`
{{> type-values}}
`)

export default function(type, namespace, typeContainer) {
  return typeValuesTemplate(type.toDomInfo(namespace, typeContainer))
}

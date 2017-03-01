import importSource from './importSource'
import translateModification from './translateModification'

export default importAnnotations

function importAnnotations(span, entity, relation, modification, denotations, relations, modifications, prefix) {
  importSource([modification], _.partial(translateModification, prefix), modifications)
}

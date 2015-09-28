import importSource from './importSource'
import translateRelation from './translateRelation'

export default function(relation, relations, prefix) {
  importSource(
      [relation], (relation) => translateRelation(prefix, relation),
      relations
  )
}

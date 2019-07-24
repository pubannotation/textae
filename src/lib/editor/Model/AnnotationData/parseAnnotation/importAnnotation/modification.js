import importSource from './importSource'
import translateModification from './translateModification'

export default function(modification, modifications, prefix) {
  importSource(
    [modification],
    (modification) => translateModification(prefix, modification),
    modifications
  )
}

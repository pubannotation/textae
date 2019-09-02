import toModel from './toModel'

export default function(editor, emitter, denotations) {
  denotations = denotations || []
  return denotations.map((entity) => toModel(editor, emitter, entity))
}

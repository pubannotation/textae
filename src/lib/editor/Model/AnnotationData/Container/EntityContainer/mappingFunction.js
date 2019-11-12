import toModel from './toModel'

export default function(
  editor,
  attributeContainer,
  relationContaier,
  denotations
) {
  denotations = denotations || []
  return denotations.map((entity) =>
    toModel(editor, attributeContainer, relationContaier, entity)
  )
}

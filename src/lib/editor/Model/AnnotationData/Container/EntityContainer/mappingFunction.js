import idFactory from '../../../../idFactory'
import EntityModel from './EntityModel'

export default function(
  editor,
  attributeContainer,
  relationContaier,
  definedTypes,
  denotations
) {
  denotations = denotations || []
  return denotations.map((entity) => {
    // Expected an entity like {id: "E21", span: "editor2__S50_54", obj: "Protein"}.
    return new EntityModel(
      attributeContainer,
      relationContaier,
      definedTypes,
      idFactory.makeSpanId(editor, entity.span),
      entity.obj,
      entity.id
    )
  })
}

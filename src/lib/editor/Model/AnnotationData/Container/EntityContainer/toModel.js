import idFactory from '../../../../idFactory'
import EntityModel from './EntityModel'

// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
export default function(editor, attributeContainer, relationContaier, entity) {
  return new EntityModel(
    attributeContainer,
    relationContaier,
    idFactory.makeSpanId(editor, entity.span),
    entity.obj,
    entity.id
  )
}

import idFactory from '../../../../idFactory'
import EntityModel from './EntityModel'

// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
export default function(editor, emitter, entity) {
  return new EntityModel(
    emitter,
    idFactory.makeSpanId(editor, entity.span),
    entity.obj,
    entity.id
  )
}

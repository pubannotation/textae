import { EventEmitter } from 'events'
import ModelContainer from './ModelContainer'
import ParagraphContainer from './ParagraphContainer'
import SpanContainer from './SpanContainer'
import EntityContainer from './EntityContainer'
import AttributeContainer from './AttributeContainer'
import _ from 'underscore'

export default function(editor) {
  const emitter = new EventEmitter()
  const namespace = new ModelContainer(emitter, 'namespace', _.identity)
  const paragraph = new ParagraphContainer(editor, emitter)
  const span = new SpanContainer(editor, emitter, paragraph)
  const attribute = new AttributeContainer(emitter)
  const relation = new ModelContainer(emitter, 'relation', mapRelations)
  const entity = new EntityContainer(editor, emitter, relation)
  const modification = new ModelContainer(emitter, 'modification', _.identity)

  return Object.assign(emitter, {
    namespace,
    sourceDoc: '',
    paragraph,
    span,
    entity,
    attribute,
    relation,
    modification
  })
}

function mapRelations(relations) {
  return relations.map((r) => {
    return {
      id: r.id,
      type: r.pred,
      subj: r.subj,
      obj: r.obj
    }
  })
}

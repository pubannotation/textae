import { EventEmitter } from 'events'
import ModelContainer from './ModelContainer'
import ParagraphContainer from './ParagraphContainer'
import SpanContainer from './SpanContainer'
import EntityContainer from './EntityContainer'
import AttributeContainer from './AttributeContainer'
import _ from 'underscore'

export default function(editor) {
  let emitter = new EventEmitter()
  let namespace = new ModelContainer(emitter, 'namespace', _.identity)
  let paragraph = new ParagraphContainer(editor, emitter)
  let span = new SpanContainer(editor, emitter, paragraph)
  let attribute = new AttributeContainer(emitter)
  let relation = new ModelContainer(emitter, 'relation', mapRelations)
  let entity = new EntityContainer(editor, emitter, relation)
  let modification = new ModelContainer(emitter, 'modification', _.identity)

  return Object.assign(emitter, {
    namespace: namespace,
    sourceDoc: '',
    paragraph: paragraph,
    span: span,
    entity: entity,
    attribute: attribute,
    relation: relation,
    modification: modification
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

import {
  EventEmitter as EventEmitter
}
from 'events'
import ModelContainer from './ModelContainer'
import ParagraphContainer from './ParagraphContainer'
import SpanContainer from './SpanContainer'
import EntityContainer from './EntityContainer'
import AttributeContainer from './AttributeContainer'
import _ from 'underscore'

export default function(editor) {
  let emitter = new EventEmitter(),
    namespace = new ModelContainer(emitter, 'namespace', _.identity),
    paragraph = new ParagraphContainer(editor, emitter),
    span = new SpanContainer(editor, emitter, paragraph),
    attribute = new AttributeContainer(emitter),
    relation = new ModelContainer(emitter, 'relation', mapRelations),
    entity = new EntityContainer(editor, emitter, relation),
    modification = new ModelContainer(emitter, 'modification', _.identity)

  return _.extend(emitter, {
    namespace: namespace,
    sourceDoc: '',
    paragraph: paragraph,
    span: span,
    entity: entity,
    attribute: attribute,
    relation: relation,
    modification: modification,
  })
}

function mapRelations(relations) {
  return relations.map(r => {
    return {
      id: r.id,
      type: r.pred,
      subj: r.subj,
      obj: r.obj
    }
  })
}

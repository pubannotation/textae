import {
  EventEmitter as EventEmitter
}
from 'events'
import ModelContainer from './ModelContainer'
import ParagraphContainer from './ParagraphContainer'
import SpanContainer from './SpanContainer'
import EntityContainer from './EntityContainer'
import _ from 'underscore'

export default function(editor) {
  let emitter = new EventEmitter(),
    namespace = new ModelContainer(emitter, 'namespace', _.identity),
    paragraph = new ParagraphContainer(editor, emitter),
    span = new SpanContainer(editor, emitter, paragraph),
    attribute = new ModelContainer(emitter, 'attribute', mapAttributesAndRelations),
    relation = new ModelContainer(emitter, 'relation', mapAttributesAndRelations),
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

function mapAttributesAndRelations(attributesOrRelations) {
  return attributesOrRelations.map(aor => {
    return {
      id: aor.id,
      type: aor.pred,
      subj: aor.subj,
      obj: aor.obj
    }
  })
}

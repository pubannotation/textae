import {
    EventEmitter as EventEmitter
}
from 'events';
import ModelContainer from './ModelContainer';
import ParagraphContainer from './ParagraphContainer';
import SpanContainer from './SpanContainer';
import EntityContainer from './EntityContainer';

export default function(editor) {
    var emitter = new EventEmitter(),
        paragraph = new ParagraphContainer(editor, emitter),
        span = new SpanContainer(editor, emitter, paragraph),
        relation = new ModelContainer(emitter, 'relation', mapRelation),
        entity = new EntityContainer(editor, emitter, relation),
        modification = new ModelContainer(emitter, 'modification', _.identity);

    return _.extend(emitter, {
        sourceDoc: '',
        paragraph: paragraph,
        span: span,
        entity: entity,
        relation: relation,
        modification: modification
    });
}

function mapRelation(relations) {
    return relations.map((r) => {
        return {
            id: r.id,
            type: r.pred,
            subj: r.subj,
            obj: r.obj
        };
    });
}

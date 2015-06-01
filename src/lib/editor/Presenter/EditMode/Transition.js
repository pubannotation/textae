import {
    EventEmitter
}
from 'events';
import setEditableStyle from './setEditableStyle';
import ViewMode from './ViewMode';
import resetView from './resetView';
import event from './event';

const TERM = 'term',
    INSTANCE = 'instance',
    RELATION = 'relation';

export default function(editor, model, typeEditor, buttonStateHelper) {
    let viewMode = new ViewMode(editor, model, buttonStateHelper),
        emitter = new EventEmitter(),
        api = {
            toTerm: function() {
                emitter.emit(event.HIDE);
                emitter.emit(event.CHANGE, true, TERM);

                typeEditor.editEntity();
                viewMode.setTerm();
                setEditableStyle(editor, buttonStateHelper, true);
            },
            toInstance: function() {
                emitter.emit(event.SHOW);
                emitter.emit(event.CHANGE, true, INSTANCE);

                typeEditor.editEntity();
                viewMode.setInstance();
                setEditableStyle(editor, buttonStateHelper, true);
            },
            toRelation: function() {
                emitter.emit(event.SHOW);
                emitter.emit(event.CHANGE, true, RELATION);

                typeEditor.editRelation();
                viewMode.setRelation();
                setEditableStyle(editor, buttonStateHelper, true);
            },
            toViewTerm: function() {
                emitter.emit(event.HIDE);
                emitter.emit(event.CHANGE, false, TERM);

                typeEditor.noEdit();
                viewMode.setTerm();
                setEditableStyle(editor, buttonStateHelper, false);
            },
            toViewInstance: function() {
                emitter.emit(event.SHOW);
                emitter.emit(event.CHANGE, false, INSTANCE);

                typeEditor.noEdit();
                viewMode.setInstance();
                setEditableStyle(editor, buttonStateHelper, false);
            }
        };

    return _.extend(emitter, api);
}

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
                typeEditor.editEntity();
                viewMode.setTerm();
                setEditableStyle(editor, buttonStateHelper, true);

                emitter.emit(event.HIDE);
                emitter.emit(event.CHANGE, true, TERM);
            },
            toInstance: function() {
                typeEditor.editEntity();
                viewMode.setInstance();
                setEditableStyle(editor, buttonStateHelper, true);

                emitter.emit(event.SHOW);
                emitter.emit(event.CHANGE, true, INSTANCE);
            },
            toRelation: function() {
                typeEditor.editRelation();
                viewMode.setRelation();
                setEditableStyle(editor, buttonStateHelper, true);

                emitter.emit(event.SHOW);
                emitter.emit(event.CHANGE, true, RELATION);
            },
            toViewTerm: function() {
                typeEditor.noEdit();
                viewMode.setTerm();
                setEditableStyle(editor, buttonStateHelper, false);

                emitter.emit(event.HIDE);
                emitter.emit(event.CHANGE, false, TERM);
            },
            toViewInstance: function() {
                typeEditor.noEdit();
                viewMode.setInstance();
                setEditableStyle(editor, buttonStateHelper, false);

                emitter.emit(event.SHOW);
                emitter.emit(event.CHANGE, false, INSTANCE);
            }
        };

    return _.extend(emitter, api);
}

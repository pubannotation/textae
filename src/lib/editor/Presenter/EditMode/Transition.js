import {
    EventEmitter
}
from 'events';
import setEditableStyle from './setEditableStyle';
import ViewMode from './ViewMode';
import resetView from './resetView';

export default function(editor, model, typeEditor, buttonStateHelper, modeAccordingToButton) {
    let viewMode = new ViewMode(editor, model, buttonStateHelper, modeAccordingToButton),
        emitter = new EventEmitter(),
        api = {
            toTerm: function() {
                typeEditor.editEntity();
                viewMode.setTerm();
                setEditableStyle(editor, buttonStateHelper, true);

                emitter.emit('hide');
                emitter.emit('change');
            },
            toInstance: function() {
                typeEditor.editEntity();
                viewMode.setInstance();
                setEditableStyle(editor, buttonStateHelper, true);

                emitter.emit('show');
                emitter.emit('change');
            },
            toRelation: function() {
                typeEditor.editRelation();
                viewMode.setRelation();
                setEditableStyle(editor, buttonStateHelper, true);

                emitter.emit('show');
                emitter.emit('change');
            },
            toViewTerm: function() {
                typeEditor.noEdit();
                viewMode.setTerm();
                setEditableStyle(editor, buttonStateHelper, false);

                emitter.emit('hide');
                emitter.emit('change');
            },
            toViewInstance: function() {
                typeEditor.noEdit();
                viewMode.setInstance();
                setEditableStyle(editor, buttonStateHelper, false);

                emitter.emit('show');
                emitter.emit('change');
            }
        };

    return _.extend(emitter, api);
}

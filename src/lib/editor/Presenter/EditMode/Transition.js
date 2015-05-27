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
                emitter.emit('change', true, 'term');
            },
            toInstance: function() {
                typeEditor.editEntity();
                viewMode.setInstance();
                setEditableStyle(editor, buttonStateHelper, true);

                emitter.emit('show');
                emitter.emit('change', true, 'instance');
            },
            toRelation: function() {
                typeEditor.editRelation();
                viewMode.setRelation();
                setEditableStyle(editor, buttonStateHelper, true);

                emitter.emit('show');
                emitter.emit('change', true, 'relation');
            },
            toViewTerm: function() {
                typeEditor.noEdit();
                viewMode.setTerm();
                setEditableStyle(editor, buttonStateHelper, false);

                emitter.emit('hide');
                emitter.emit('change', false, 'term');
            },
            toViewInstance: function() {
                typeEditor.noEdit();
                viewMode.setInstance();
                setEditableStyle(editor, buttonStateHelper, false);

                emitter.emit('show');
                emitter.emit('change', false, 'instance');
            }
        };

    return _.extend(emitter, api);
}

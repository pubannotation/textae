var EventEmitter = require('events').EventEmitter,
    Machine = require('emitter-fsm'),
    ViewMode = require('./ViewMode'),
    StateMachine = require('./StateMachine'),
    Transition = require('./Transition'),
    ViewModeApi = require('./ViewModeApi'),
    EditModeApi = require('./EditModeApi'),
    setModeApi = function(typeEditor, viewMode, transition, editModeApi, viewModeApi, isEditable) {
        if (isEditable) {
            viewMode.setEditable(true);

            _.extend(transition, editModeApi);
        } else {
            typeEditor.noEdit();
            viewMode.setEditable(false);

            _.extend(transition, viewModeApi);
        }
    };

module.exports = function(editor, model, typeEditor, buttonStateHelper, modeAccordingToButton) {
    var viewMode = new ViewMode(editor, model, buttonStateHelper, modeAccordingToButton),
        m = new StateMachine(),
        instanceEvent = new EventEmitter(),
        transition = new Transition(typeEditor, model.selectionModel, viewMode, instanceEvent),
        viewModeApi = new ViewModeApi(m),
        editModeApi = new EditModeApi(m);

    m.on('transition', function(e) {
            // For debug.
            // console.log(editor.editorId, 'from:', e.from, ' to:', e.to);
        })
        .on('enter:Term Contric', transition.toTerm)
        .on('enter:Instance / Relation', transition.toInstance)
        .on('enter:Relation Edit', transition.toRelation)
        .on('enter:View Term', transition.toViewTerm)
        .on('enter:View Instance', transition.toViewInstance);

    instanceEvent.init = _.partial(setModeApi, typeEditor, viewMode, instanceEvent, editModeApi, viewModeApi);

    return instanceEvent;
};

import Selector from '../../View/Selector';

export default function(editor, model, buttonStateHelper) {
    let selector = new Selector(editor, model),
        // This notify is off at relation-edit-mode.
        entitySelectChanged = _.compose(buttonStateHelper.updateByEntity, selector.entityLabel.update);

    let api = {
        setTerm: function() {
            changeCssClass(editor, 'term');
            removeListeners(model.selectionModel, entitySelectChanged, buttonStateHelper);

            model.selectionModel
                .on('entity.select', entitySelectChanged)
                .on('entity.deselect', entitySelectChanged)
                .on('entity.change', buttonStateHelper.updateByEntity);
        },
        setInstance: function() {
            changeCssClass(editor, 'instance');
            removeListeners(model.selectionModel, entitySelectChanged, buttonStateHelper);

            model.selectionModel
                .on('entity.select', entitySelectChanged)
                .on('entity.deselect', entitySelectChanged)
                .on('entity.change', buttonStateHelper.updateByEntity);
        },
        setRelation: function() {
            changeCssClass(editor, 'relation');
            removeListeners(model.selectionModel, entitySelectChanged, buttonStateHelper);
        }
    };

    return api;
}

function changeCssClass(editor, mode) {
    editor
        .removeClass('textae-editor_term-mode')
        .removeClass('textae-editor_instance-mode')
        .removeClass('textae-editor_relation-mode')
        .addClass('textae-editor_' + mode + '-mode');
}

function removeListeners(selectionModel, entitySelectChanged, buttonStateHelper) {
    selectionModel
        .removeListener('entity.select', entitySelectChanged)
        .removeListener('entity.deselect', entitySelectChanged)
        .removeListener('entity.change', entitySelectChanged)
        .removeListener('entity.change', buttonStateHelper.updateByEntity);
}

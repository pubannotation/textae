import Selector from '../../view/Selector';
import setEditable from './setEditableStyle';
import enableButtonHasAnnotation from './enableButtonHasAnnotation';

export default function(editor, model, buttonStateHelper) {
    let selector = new Selector(editor, model),
        aaa = () => enableButtonHasAnnotation(buttonStateHelper),
        // This notify is off at relation-edit-mode.
        entitySelectChanged = _.compose(buttonStateHelper.updateByEntity, selector.entityLabel.update);

    let api = {
        setTerm: function() {
            changeCssClass(editor, 'term');
            aaa();

            model.selectionModel
                .removeListener('entity.select', entitySelectChanged)
                .removeListener('entity.deselect', entitySelectChanged)
                .removeListener('entity.change', entitySelectChanged)
                .on('entity.select', entitySelectChanged)
                .on('entity.deselect', entitySelectChanged)
                .on('entity.change', buttonStateHelper.updateByEntity);
        },
        setInstance: function() {
            changeCssClass(editor, 'instance');
            aaa();

            model.selectionModel
                .removeListener('entity.select', entitySelectChanged)
                .removeListener('entity.deselect', entitySelectChanged)
                .removeListener('entity.change', buttonStateHelper.updateByEntity)
                .on('entity.select', entitySelectChanged)
                .on('entity.deselect', entitySelectChanged)
                .on('entity.change', buttonStateHelper.updateByEntity);
        },
        setRelation: function() {
            changeCssClass(editor, 'relation');
            aaa();

            model.selectionModel
                .removeListener('entity.select', entitySelectChanged)
                .removeListener('entity.deselect', entitySelectChanged)
                .removeListener('entity.change', buttonStateHelper.updateByEntity);
        },
        setEditable: isEditable => setEditable(editor, buttonStateHelper, isEditable)
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

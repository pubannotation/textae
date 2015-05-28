import Selector from '../../view/Selector';
import setEditable from './setEditableStyle';

export default function(editor, model, buttonStateHelper) {
    let selector = new Selector(editor, model),
        setSettingButtonEnable = () => {
            buttonStateHelper.enabled('view', true);
            buttonStateHelper.enabled('relation', true);
            buttonStateHelper.enabled('simple', true);
            buttonStateHelper.enabled('setting', true);
        },
        // This notify is off at relation-edit-mode.
        entitySelectChanged = _.compose(buttonStateHelper.updateByEntity, selector.entityLabel.update);

    let api = {
        setTerm: function() {
            changeCssClass(editor, 'term');
            setSettingButtonEnable();

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
            setSettingButtonEnable();

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
            setSettingButtonEnable();

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

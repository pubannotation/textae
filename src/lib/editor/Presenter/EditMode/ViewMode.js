var Selector = require('../../view/Selector'),
    changeCssClass = function(editor, mode) {
        editor
            .removeClass('textae-editor_term-mode')
            .removeClass('textae-editor_instance-mode')
            .removeClass('textae-editor_relation-mode')
            .addClass('textae-editor_' + mode + '-mode');
    };

module.exports = function(editor, model, buttonStateHelper, modeAccordingToButton) {
    var selector = new Selector(editor, model),
        setSettingButtonEnable = _.partial(buttonStateHelper.enabled, 'setting', true),
        setControlButtonForRelation = function(isRelation) {
            buttonStateHelper.enabled('replicate-auto', !isRelation);
            buttonStateHelper.enabled('boundary-detection', !isRelation);
            modeAccordingToButton['relation-edit-mode'].value(isRelation);
        },
        // This notify is off at relation-edit-mode.
        entitySelectChanged = _.compose(buttonStateHelper.updateByEntity, selector.entityLabel.update);

    var api = {
        setTerm: function() {
            changeCssClass(editor, 'term');
            setSettingButtonEnable();
            setControlButtonForRelation(false);

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
            setControlButtonForRelation(false);

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
            setControlButtonForRelation(true);

            model.selectionModel
                .removeListener('entity.select', entitySelectChanged)
                .removeListener('entity.deselect', entitySelectChanged)
                .removeListener('entity.change', buttonStateHelper.updateByEntity);
        },
        setEditable: function(isEditable) {
            if (isEditable) {
                editor.addClass('textae-editor_editable');
                buttonStateHelper.enabled('relation-edit-mode', true);
                buttonStateHelper.enabled('line-height', true);
            } else {
                editor.removeClass('textae-editor_editable');
                buttonStateHelper.enabled('replicate-auto', false);
                buttonStateHelper.enabled('boundary-detection', false);
                buttonStateHelper.enabled('relation-edit-mode', false);
            }
        }
    };

    return api;
};

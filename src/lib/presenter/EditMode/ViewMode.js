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
                .unbind('entity.select', entitySelectChanged)
                .unbind('entity.deselect', entitySelectChanged)
                .unbind('entity.change', entitySelectChanged)
                .bind('entity.select', entitySelectChanged)
                .bind('entity.deselect', entitySelectChanged)
                .bind('entity.change', buttonStateHelper.updateByEntity);
        },
        setInstance: function() {
            changeCssClass(editor, 'instance');
            setSettingButtonEnable();
            setControlButtonForRelation(false);

            model.selectionModel
                .unbind('entity.select', entitySelectChanged)
                .unbind('entity.deselect', entitySelectChanged)
                .unbind('entity.change', buttonStateHelper.updateByEntity)
                .bind('entity.select', entitySelectChanged)
                .bind('entity.deselect', entitySelectChanged)
                .bind('entity.change', buttonStateHelper.updateByEntity);
        },
        setRelation: function() {
            changeCssClass(editor, 'relation');
            setSettingButtonEnable();
            setControlButtonForRelation(true);

            model.selectionModel
                .unbind('entity.select', entitySelectChanged)
                .unbind('entity.deselect', entitySelectChanged)
                .unbind('entity.change', buttonStateHelper.updateByEntity);
        },
        setEditable: function(isEditable) {
            if (isEditable) {
                editor.addClass('textae-editor_editable');
                buttonStateHelper.enabled('relation-edit-mode', true);
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

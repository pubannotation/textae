var lineHeight = require('../view/lineHeight'),
    jQuerySugar = require('../util/jQuerySugar'),
    GetEditorDialog = require('./dialog/GetEditorDialog'),
    debounce300 = function(func) {
        return _.debounce(func, 300);
    },
    sixteenTimes = function(val) {
        return val * 16;
    },
    // Redraw all editors in tha windows.
    redrawAllEditor = function() {
        $(window).trigger('resize');
    },
    createContent = function() {
        return jQuerySugar.Div('textae-editor__setting-dialog');
    },
    // Open the dialog.
    open = function($dialog) {
        return $dialog.open();
    },
    // Update the checkbox state, because it is updated by the button on control too.
    updateEditMode = function(displayInstance, $content) {
        return jQuerySugar.setChecked(
            $content,
            '.mode',
            displayInstance.showInstance() ? 'checked' : null
        );
    },
    updateLineHeight = function(editor, $content) {
        return jQuerySugar.setValue(
            $content,
            '.line-height',
            lineHeight.get(editor)
        );
    },
    updateTypeGapValue = function(displayInstance, $content) {
        return jQuerySugar.setValue(
            $content,
            '.type-gap',
            displayInstance.getTypeGap
        );
    },
    toTypeGap = function($content) {
        return $content.find('.type-gap');
    },
    updateTypeGapEnable = function(displayInstance, $content) {
        jQuerySugar.enabled(toTypeGap($content), displayInstance.showInstance());
        return $content;
    },
    changeMode = function(editor, editMode, displayInstance, $content, checked) {
        if (checked) {
            editMode.toInstance();
        } else {
            editMode.toTerm();
        }
        updateTypeGapEnable(displayInstance, $content);
        updateTypeGapValue(displayInstance, $content);
        updateLineHeight(editor, $content);
    },
    SettingDialogLabel = _.partial(jQuerySugar.Label, 'textae-editor__setting-dialog__label');

module.exports = function(editor, editMode, displayInstance) {
    var addInstanceRelationView = function($content) {
            var onModeChanged = debounce300(function() {
                changeMode(editor, editMode, displayInstance, $content, $(this).is(':checked'));
            });

            return $content
                .append(jQuerySugar.Div()
                    .append(
                        new SettingDialogLabel('Instance/Relation View')
                    )
                    .append(
                        jQuerySugar.Checkbox('textae-editor__setting-dialog__term-centric-view mode')
                    )
                )
                .on(
                    'click',
                    '.mode',
                    onModeChanged
                );
        },
        addTypeGap = function($content) {
            var onTypeGapChange = debounce300(
                function() {
                    displayInstance.changeTypeGap($(this).val());
                    updateLineHeight(editor, $content);
                }
            );

            return $content
                .append(jQuerySugar.Div()
                    .append(
                        new SettingDialogLabel('Type Gap')
                    )
                    .append(
                        jQuerySugar.Number('textae-editor__setting-dialog__type-gap type-gap')
                        .attr({
                            step: 1,
                            min: 0,
                            max: 5
                        })
                    )
                ).on(
                    'change',
                    '.type-gap',
                    onTypeGapChange
                );
        },
        addLineHeight = function($content) {
            var changeLineHeight = _.compose(_.partial(lineHeight.set, editor), sixteenTimes),
                onLineHeightChange = debounce300(
                    function() {
                        changeLineHeight($(this).val());
                        redrawAllEditor();
                    }
                );

            return $content
                .append(jQuerySugar.Div()
                    .append(
                        new SettingDialogLabel('Line Height')
                    )
                    .append(
                        jQuerySugar.Number('textae-editor__setting-dialog__line-height line-height')
                        .attr({
                            'step': 1,
                            'min': 3,
                            'max': 50
                        })
                    ))
                .on(
                    'change',
                    '.line-height',
                    onLineHeightChange
                );
        },
        appendToDialog = function($content) {
            return new GetEditorDialog(editor)(
                'textae.dialog.setting',
                'Setting',
                $content,
                true
            );
        };

    // Update values after creating a dialog because the dialog is re-used.
    return _.compose(
        open,
        _.partial(updateLineHeight, editor),
        _.partial(updateTypeGapValue, displayInstance),
        _.partial(updateTypeGapEnable, displayInstance),
        _.partial(updateEditMode, displayInstance),
        appendToDialog,
        addLineHeight,
        addTypeGap,
        addInstanceRelationView,
        createContent
    );
};

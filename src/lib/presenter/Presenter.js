var TypeEditor = require('./typeEditor/TypeEditor'),
    EditMode = require('./EditMode'),
    DisplayInstance = require('./DisplayInstance'),
    DefaultEntityHandler = require('./DefaultEntityHandler'),
    ClipBoardHandler = require('./ClipBoardHandler'),
    ModificationHandler = require('./ModificationHandler'),
    EditHandler = require('./EditHandler'),
    ToggleButtonHandler = require('./ToggleButtonHandler'),
    SelectSpanHandler = require('./SelectSpanHandler'),
    SetEditableHandler = require('./SetEditableHandler'),
    SettingDialog = require('../component/SettingDialog'),
    lineHeight = require('../view/lineHeight');

module.exports = function(editor, model, view, command, spanConfig, clipBoard, buttonController, typeGap, typeContainer) {
    var typeEditor = new TypeEditor(
            editor,
            model,
            spanConfig,
            command,
            buttonController.modeAccordingToButton,
            typeContainer
        ),
        editMode = new EditMode(
            editor,
            model,
            typeEditor,
            buttonController.buttonStateHelper,
            buttonController.modeAccordingToButton
        ),
        displayInstance = new DisplayInstance(
            typeGap,
            editMode
            ),
        defaultEntityHandler = new DefaultEntityHandler(
            command,
            model.annotationData,
            model.selectionModel,
            buttonController.modeAccordingToButton,
            spanConfig,
            typeContainer.entity
        ),
        clipBoardHandler = new ClipBoardHandler(
            command,
            model.annotationData,
            model.selectionModel,
            clipBoard
        ),
        modificationHandler = new ModificationHandler(
            command,
            model.annotationData,
            buttonController.modeAccordingToButton,
            typeEditor
        ),
        editHandler = new EditHandler(
            command,
            model.selectionModel,
            typeEditor
        ),
        toggleButtonHandler = new ToggleButtonHandler(
            buttonController.modeAccordingToButton,
            editMode
        ),
        selectSpanHandler = new SelectSpanHandler(
            model.annotationData,
            model.selectionModel
        ),
        setEditableHandler = new SetEditableHandler(
            model.annotationData,
            editMode
        ),
        showSettingDialog = new SettingDialog(
            editor,
            editMode,
            displayInstance
        ),
        editorSelected = function() {
            typeEditor.hideDialogs();

            // Select this editor.
            editor.eventEmitter.trigger('textae.editor.select');
            buttonController.buttonStateHelper.propagate();
        };

    return {
        init: function() {
            // The jsPlumbConnetion has an original event mecanism.
            // We can only bind the connection directory.
            editor
                .on('textae.editor.jsPlumbConnection.add', function(event, jsPlumbConnection) {
                    jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked);
                });

            // Set bind the lineHeight to the typeGap.
            typeGap.on('change', function(newValue) {
                lineHeight.setToTypeGap(editor, model, typeContainer, newValue);
            });

            defaultEntityHandler.on('createEntity', displayInstance.notifyNewInstance);
        },
        setMode: setEditableHandler.bindSetDefaultEditMode,
        event: {
            editorSelected: editorSelected,
            copyEntities: clipBoardHandler.copyEntities,
            removeSelectedElements: editHandler.removeSelectedElements,
            createEntity: defaultEntityHandler.createEntity,
            showPallet: typeEditor.showPallet,
            replicate: defaultEntityHandler.replicate,
            pasteEntities: clipBoardHandler.pasteEntities,
            newLabel: editHandler.newLabel,
            cancelSelect: typeEditor.cancelSelect,
            selectLeftSpan: selectSpanHandler.selectLeftSpan,
            selectRightSpan: selectSpanHandler.selectRightSpan,
            toggleDetectBoundaryMode: toggleButtonHandler.toggleDetectBoundaryMode,
            toggleRelationEditMode: toggleButtonHandler.toggleRelationEditMode,
            negation: modificationHandler.negation,
            speculation: modificationHandler.speculation,
            showSettingDialog: showSettingDialog
        }
    };
};

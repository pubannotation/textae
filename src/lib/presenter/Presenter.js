var TypeEditor = require('./typeEditor/TypeEditor'),
    EditMode = require('./EditMode'),
    DefaultEntityHandler = require('./DefaultEntityHandler'),
    ClipBoardHandler = require('./ClipBoardHandler'),
    ModificationHandler = require('./ModificationHandler'),
    EditHandler = require('./EditHandler'),
    ToggleButtonHandler = require('./ToggleButtonHandler'),
    SelectSpanHandler = require('./SelectSpanHandler'),
    SetEditableHandler = require('./SetEditableHandler'),
    SettingDialog = require('./SettingDialog'),
    CursorChanger =  require('../util/CursorChanger');

module.exports = function(editor, model, view, command, spanConfig, clipBoard, buttonController, viewMode, typeGap) {
    var typeEditor = new TypeEditor(
            editor,
            model,
            spanConfig,
            command,
            buttonController.modeAccordingToButton,
            view.typeContainer
        ),
        editMode = new EditMode(model,
            viewMode,
            typeEditor,
            typeGap
        ),
        defaultEntityHandler = new DefaultEntityHandler(
            command,
            model.annotationData,
            model.selectionModel,
            buttonController.modeAccordingToButton,
            spanConfig,
            view.typeContainer.entity
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
            typeGap
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

            // Set cursor control by view rendering events.
            var cursorChanger =new CursorChanger(editor);
            view
                .bind('render.start', function(editor) {
                    // console.log(editor.editorId, 'render.start');
                    cursorChanger.startWait();
                })
                .bind('render.end', function(editor) {
                    // console.log(editor.editorId, 'render.end');
                    cursorChanger.endWait();
                });
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

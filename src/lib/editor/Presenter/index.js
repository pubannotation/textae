import SettingDialog from '../../component/SettingDialog';
import TypeEditor from './TypeEditor';
import EditMode from './EditMode';
import DisplayInstance from './DisplayInstance';
import setDefaultView from './setDefaultView';
import setMode from './setMode';
import changeLabelHandler from './handlers/changeLabelHandler';
import ClipBoardHandler from './handlers/ClipBoardHandler';
import DefaultEntityHandler from './handlers/DefaultEntityHandler';
import removeSelectedElements from './handlers/removeSelectedElements';
import ModificationHandler from './handlers/ModificationHandler';
import SelectSpanHandler from './handlers/SelectSpanHandler';
import ToggleButtonHandler from './handlers/ToggleButtonHandler';

export default function(editor, model, view, command, spanConfig, clipBoard, buttonController, typeGap, typeContainer) {
    let typeEditor = new TypeEditor(
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
        toggleButtonHandler = new ToggleButtonHandler(
            buttonController.modeAccordingToButton,
            editMode
        ),
        selectSpanHandler = new SelectSpanHandler(
            model.annotationData,
            model.selectionModel
        ),
        showSettingDialog = new SettingDialog(
            editor,
            editMode,
            displayInstance
        ),
        editorSelected = () => {
            typeEditor.hideDialogs();

            // Select this editor.
            editor.eventEmitter.emit('textae.editor.select');
            buttonController.buttonStateHelper.propagate();
        };

    return {
        init: function(mode, writable) {
            // The jsPlumbConnetion has an original event mecanism.
            // We can only bind the connection directory.
            editor
                .on('textae.editor.jsPlumbConnection.add', (event, jsPlumbConnection) => {
                    jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked);
                });

            defaultEntityHandler.on('createEntity', displayInstance.notifyNewInstance);

            model.annotationData.on('all.change', annotationData => setDefaultView(
                editMode,
                annotationData
            ));

            setMode(model.annotationData, editMode, mode, writable);
        },
        event: {
            editorSelected: editorSelected,
            copyEntities: clipBoardHandler.copyEntities,
            removeSelectedElements: () => removeSelectedElements(
                command,
                model.selectionModel
            ),
            createEntity: defaultEntityHandler.createEntity,
            showPallet: typeEditor.showPallet,
            replicate: defaultEntityHandler.replicate,
            pasteEntities: clipBoardHandler.pasteEntities,
            changeLabel: () => changeLabelHandler(typeEditor),
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
}

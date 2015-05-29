import extend from 'xtend';
import SettingDialog from '../../component/SettingDialog';
import TypeEditor from './TypeEditor';
import EditMode from './EditMode';
import DisplayInstance from './DisplayInstance';
import setDefaultEditability from './setDefaultEditability';
import changeLabelHandler from './handlers/changeLabelHandler';
import ClipBoardHandler from './handlers/ClipBoardHandler';
import DefaultEntityHandler from './handlers/DefaultEntityHandler';
import removeSelectedElements from './handlers/removeSelectedElements';
import ModificationHandler from './handlers/ModificationHandler';
import SelectSpanHandler from './handlers/SelectSpanHandler';
import ToggleButtonHandler from './handlers/ToggleButtonHandler';
import setButtonState from './setButtonState';

export default function(
    editor,
    model,
    view,
    command,
    spanConfig,
    clipBoard,
    buttonController,
    typeGap,
    typeContainer,
    writable
) {
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
            buttonController.buttonStateHelper
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
            displayInstance
        ),
        editorSelected = () => {
            typeEditor.hideDialogs();

            // Select this editor.
            editor.eventEmitter.emit('textae.editor.select');
            buttonController.buttonStateHelper.propagate();
        },
        event = {
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
            negation: modificationHandler.negation,
            speculation: modificationHandler.speculation,
            showSettingDialog: showSettingDialog
        };

    event = extend(event, toggleButtonHandler);

    let latestWritableState = false,
        editModeEditable = false;

    writable(val => {
        latestWritableState = val;
        buttonController.buttonStateHelper.enabled("write", val && editModeEditable);
    });

    editMode
        .on('change', (editable, mode) => setButtonState(buttonController, editable, mode))
        .on('change', (editable, mode) => {
            // Enable the save button only at edit mode.
            editModeEditable = editable;

            if (editable) {
                buttonController.buttonStateHelper.enabled("write", latestWritableState);
            } else {
                buttonController.buttonStateHelper.enabled("write", false);
            }
        });

    return {
        init: function(mode) {
            // The jsPlumbConnetion has an original event mecanism.
            // We can only bind the connection directory.
            editor
                .on('textae.editor.jsPlumbConnection.add', (event, jsPlumbConnection) => {
                    jsPlumbConnection.bindClickAction(typeEditor.jsPlumbConnectionClicked);
                });

            defaultEntityHandler.on('createEntity', displayInstance.notifyNewInstance);
            setDefaultEditability(model.annotationData, editMode, writable, mode);
        },
        event: event
    };
}

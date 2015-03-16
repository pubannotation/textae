import SelectEnd from '../SelectEnd';
import dismissBrowserSelection from '../dismissBrowserSelection';
import unbindAllEventhandler from './unbindAllEventhandler';
import changeType from './changeType';

export default function(editor, model, command, modeAccordingToButton, typeContainer, spanConfig, cancelSelect) {
    let selectEnd = new SelectEnd(editor, model, command, modeAccordingToButton, typeContainer),
        selectSpan = new SelectSpan(editor, model.annotationData, model.selectionModel, typeContainer),
        selectionModel = model.selectionModel,
        bind = () => {
            editor
                .on('mouseup', '.textae-editor__body', () => bodyClicked(cancelSelect, selectEnd, spanConfig))
                .on('mouseup', '.textae-editor__span', (e) => spanClicked(spanConfig, selectEnd, selectSpan, e))
                .on('mouseup', '.textae-editor__type-label', (e) => typeLabelClicked(selectionModel, e))
                .on('mouseup', '.textae-editor__entity-pane', (e) => entityPaneClicked(selectionModel, e))
                .on('mouseup', '.textae-editor__entity', (e) => entityClicked(selectionModel, e));
        },
        getSelectedIdEditable = selectionModel.entity.all,
        handler = {
            typeContainer: typeContainer.entity,
            getSelectedIdEditable: getSelectedIdEditable,
            changeTypeOfSelected: (newType) => changeType(
                command,
                getSelectedIdEditable, (id, newType) => command.factory.entityChangeTypeCommand(
                    id,
                    newType,
                    typeContainer.entity.isBlock(newType)
                ),
                newType
            ),
            jsPlumbConnectionClicked: null
        };

    return () => [bind, handler];
}

function spanClicked(spanConfig, selectEnd, selectSpan, event) {
    let selection = window.getSelection();

    // No select
    if (selection.isCollapsed) {
        selectSpan(event);
        return false;
    } else {
        selectEnd.onSpan({
            spanConfig: spanConfig,
            selection: getSelectionSnapShot()
        });
        // Cancel selection of a paragraph.
        // And do non propagate the parent span.
        event.stopPropagation();
    }
}

function typeLabelClicked(selectionModel, e) {
    let typeLabel = e.target,
        entities = e.target.nextElementSibling.children;

    return selectEntities(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities);
}

function entityPaneClicked(selectionModel, e) {
    let typeLabel = e.target.previousElementSibling,
        entities = e.target.children;

    return selectEntities(selectionModel, e.ctrlKey || e.metaKey, typeLabel, entities);
}

function entityClicked(selectionModel, e) {
    dismissBrowserSelection();

    if (e.ctrlKey || e.metaKey) {
        selectionModel.entity.toggle(e.target.title);
    } else {
        selectionModel.clear();
        selectionModel.entity.add(e.target.title);
    }
    return false;
}

function selectEntities(selectionModel, ctrlKey, typeLabel, entities) {
    dismissBrowserSelection();

    if (ctrlKey) {
        if (typeLabel.classList.contains('ui-selected')) {
            deselect(selectionModel, entities);
        } else {
            select(selectionModel, entities);
        }
    } else {
        selectionModel.clear();
        select(selectionModel, entities);
    }
    return false;

    function select(selectionModel, entities) {
        Array.prototype.forEach.call(entities, (entity) => selectionModel.entity.add(entity.title));
    }

    function deselect(selectionModel, entities) {
        Array.prototype.forEach.call(entities, (entity) => selectionModel.entity.remove(entity.title));
    }
}

function getSelectionSnapShot() {
    let selection = window.getSelection(),
        snapShot = {
            anchorNode: selection.anchorNode,
            anchorOffset: selection.anchorOffset,
            focusNode: selection.focusNode,
            focusOffset: selection.focusOffset,
            range: selection.getRangeAt(0)
        };

    dismissBrowserSelection();

    // Return the snap shot of the selection.
    return snapShot;
}

function bodyClicked(cancelSelect, selectEnd, spanConfig) {
    let selection = window.getSelection();

    // No select
    if (selection.isCollapsed) {
        cancelSelect();
    } else {
        selectEnd.onText({
            spanConfig: spanConfig,
            selection: getSelectionSnapShot()
        });
    }
}

function SelectSpan(editor, annotationData, selectionModel, typeContainer) {
    let getBlockEntities = function(spanId) {
            return _.flatten(
                annotationData.span.get(spanId)
                .getTypes()
                .filter(function(type) {
                    return typeContainer.entity.isBlock(type.name);
                })
                .map(function(type) {
                    return type.entities;
                })
            );
        },
        operateSpanWithBlockEntities = function(method, spanId) {
            selectionModel.span[method](spanId);
            if (editor.find('#' + spanId).hasClass('textae-editor__span--block')) {
                getBlockEntities(spanId).forEach(selectionModel.entity[method]);
            }
        },
        selectSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'add'),
        toggleSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'toggle');

    return function(event) {
        let firstId = selectionModel.span.single(),
            target = event.target,
            id = target.id;

        if (event.shiftKey && firstId) {
            //select reange of spans.
            selectionModel.clear();
            annotationData.span.range(firstId, id)
                .forEach(function(spanId) {
                    selectSpanWithBlockEnities(spanId);
                });
        } else if (event.ctrlKey || event.metaKey) {
            toggleSpanWithBlockEnities(id);
        } else {
            selectionModel.clear();
            selectSpanWithBlockEnities(id);
        }
    };
}

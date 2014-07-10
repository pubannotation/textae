    var Presenter = function(editor, idFactory, model, view, command, spanConfig) {
        // constant values
        var CONSTS = {
            BLOCK_THRESHOLD: 100
        };

        // A Swithing point to change a behavior when relation is clicked.
        var jsPlumbConnectionClickedImpl = null;

        // A relation is drawn by a jsPlumbConnection.
        // The EventHandlar for clieck event of jsPlumbConnection. 
        var jsPlumbConnectionClicked = function() {
            return function(jsPlumbConnection, event) {
                // Check the event is processed already.
                // Because the jsPlumb will call the event handler twice
                // when a label is clicked that of a relation added after the initiation.
                if (jsPlumbConnectionClickedImpl && !event.processedByTextae) {
                    jsPlumbConnectionClickedImpl(jsPlumbConnection, event);
                }

                event.processedByTextae = true;
            };
        }();

        var editorSelected = function() {
            userEvent.viewHandler.hideDialogs();

            // Select this editor.
            editor.tool.selectMe();
            view.viewModel.buttonStateHelper.propagate();
        };

        var userEvent = function() {
            // changeEventHandler will init.
            var changeTypeOfSelected,
                getSelectedAndEditableIds;

            return {
                // User event to edit model
                editHandler: function() {
                    var toggleModification = function() {

                        return function(modificationType) {
                            var isModificationType = function(modification) {
                                    return modification.pred === modificationType;
                                },
                                getSpecificModification = function(id) {
                                    return model.annotationData
                                        .getModificationOf(id)
                                        .filter(isModificationType);
                                };

                            var commands,
                                has = view.viewModel.modeAccordingToButton[modificationType.toLowerCase()].value();

                            if (has) {
                                commands = getSelectedIdEditable().map(function(id) {
                                    var modification = getSpecificModification(id)[0];
                                    return command.factory.modificationRemoveCommand(modification.id);
                                });
                            } else {
                                commands = _.reject(getSelectedIdEditable(), function(id) {
                                    return getSpecificModification(id).length > 0;
                                }).map(function(id) {
                                    return command.factory.modificationCreateCommand({
                                        obj: id,
                                        pred: modificationType
                                    });
                                });
                            }

                            command.invoke(commands);
                        };
                    }();

                    return {
                        replicate: function() {
                            var spanId = model.selectionModel.span.single();
                            if (spanId) {
                                command.invoke(
                                    [command.factory.spanReplicateCommand(
                                        model.annotationData.span.get(spanId)
                                    )]
                                );
                            } else {
                                alert('You can replicate span annotation when there is only span selected.');
                            }
                        },
                        createEntity: function() {
                            var commands = model.selectionModel.span.all().map(function(spanId) {
                                return command.factory.entityCreateCommand({
                                    span: spanId,
                                    type: view.viewModel.typeContainer.entity.getDefaultType()
                                });
                            });

                            command.invoke(commands);
                        },
                        // set the type of an entity
                        setEntityType: function() {
                            var newType = $(this).attr('label');
                            changeTypeOfSelected(newType);
                            return false;
                        },
                        newLabel: function() {
                            if (model.selectionModel.entity.some() || model.selectionModel.relation.some()) {
                                var newTypeLabel = prompt("Please enter a new label", "");
                                if (newTypeLabel) {
                                    changeTypeOfSelected(newTypeLabel);
                                }
                            }
                        },
                        negation: _.partial(toggleModification, 'Negation'),
                        speculation: _.partial(toggleModification, 'Speculation'),
                        removeSelectedElements: function() {
                            var removeCommand = function() {
                                var spanIds = [],
                                    entityIds = [],
                                    relationIds = [];

                                return {
                                    addSpanId: function(spanId) {
                                        spanIds.push(spanId);
                                    },
                                    addEntityId: function(entityId) {
                                        entityIds.push(entityId);
                                    },
                                    addRelations: function(addedRelations) {
                                        relationIds = relationIds.concat(addedRelations);
                                    },
                                    getAll: function() {
                                        return _.uniq(relationIds).map(command.factory.relationRemoveCommand)
                                            .concat(
                                                _.uniq(entityIds).map(function(entity) {
                                                    // Wrap by a anonymous function, because command.factory.entityRemoveCommand has two optional arguments.
                                                    return command.factory.entityRemoveCommand(entity);
                                                }),
                                                _.uniq(spanIds).map(command.factory.spanRemoveCommand));
                                    },
                                };
                            }();

                            var removeEnitity = function(entityId) {
                                removeCommand.addEntityId(entityId);
                                removeCommand.addRelations(model.annotationData.entity.assosicatedRelations(entityId));
                            };

                            //remove spans
                            model.selectionModel.span.all().forEach(function(spanId) {
                                removeCommand.addSpanId(spanId);

                                model.annotationData.span.get(spanId).getTypes().forEach(function(type) {
                                    type.entities.forEach(function(entityId) {
                                        removeEnitity(entityId);
                                    });
                                });
                            });

                            //remove entities
                            model.selectionModel.entity.all().forEach(function(entityId) {
                                //an entity element has the entityId in title. an id is per Editor.
                                removeEnitity(entityId);
                            });

                            //remove relations
                            removeCommand.addRelations(model.selectionModel.relation.all());

                            command.invoke(removeCommand.getAll());
                        },
                        copyEntities: function() {
                            // Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
                            view.viewModel.clipBoard = _.uniq(
                                function getEntitiesFromSelectedSpan() {
                                    return _.flatten(model.selectionModel.span.all().map(function(spanId) {
                                        return model.annotationData.span.get(spanId).getEntities();
                                    }));
                                }().concat(
                                    model.selectionModel.entity.all()
                                )
                            );
                        },
                        pasteEntities: function() {
                            // Make commands per selected spans from entities in clipBord. 
                            var commands = _.flatten(model.selectionModel.span.all().map(function(spanId) {
                                // The view.viewModel.clipBoard has entityIds.
                                return view.viewModel.clipBoard.map(function(entityId) {
                                    return command.factory.entityCreateCommand({
                                        span: spanId,
                                        type: model.annotationData.entity.get(entityId).type
                                    });
                                });
                            }));

                            command.invoke(commands);
                        }
                    };
                }(),
                // User event that does not change data.
                viewHandler: function() {
                    // The Reference to content to be shown in the pallet.
                    var palletConfig = {};

                    var eventHandlerComposer = function() {
                        var changeType = function(getSelectedAndEditableIds, createChangeTypeCommandFunction, newType) {
                                var ids = getSelectedAndEditableIds();
                                if (ids.length > 0) {
                                    var commands = ids.map(function(id) {
                                        return createChangeTypeCommandFunction(id, newType);
                                    });

                                    command.invoke(commands);
                                }
                            },
                            unbindAllEventhandler = function() {
                                return editor
                                    .off('mouseup', '.textae-editor__body')
                                    .off('mouseup', '.textae-editor__span')
                                    .off('mouseup', '.textae-editor__type-label')
                                    .off('mouseup', '.textae-editor__entity-pane')
                                    .off('mouseup', '.textae-editor__entity');
                            };

                        return {
                            relationEdit: function() {
                                var entityClickedAtRelationMode = function(e) {
                                        if (!model.selectionModel.entity.some()) {
                                            model.selectionModel.clear();
                                            model.selectionModel.entity.add($(e.target).attr('title'));
                                        } else {
                                            // Cannot make a self reference relation.
                                            var subjectEntityId = model.selectionModel.entity.all()[0];
                                            var objectEntityId = $(e.target).attr('title');

                                            if (subjectEntityId === objectEntityId) {
                                                // Deslect already selected entity.
                                                model.selectionModel.entity.remove(subjectEntityId);
                                            } else {
                                                model.selectionModel.entity.add(objectEntityId);
                                                _.defer(function() {
                                                    command.invoke([command.factory.relationCreateCommand({
                                                        subj: subjectEntityId,
                                                        obj: objectEntityId,
                                                        type: view.viewModel.typeContainer.relation.getDefaultType()
                                                    })]);

                                                    if (e.ctrlKey || e.metaKey) {
                                                        // Remaining selection of the subject entity.
                                                        model.selectionModel.entity.remove(objectEntityId);
                                                    } else if (e.shiftKey) {
                                                        view.domUtil.manipulate.dismissBrowserSelection();
                                                        model.selectionModel.entity.remove(subjectEntityId);
                                                        model.selectionModel.entity.add(objectEntityId);
                                                        return false;
                                                    } else {
                                                        model.selectionModel.entity.remove(subjectEntityId);
                                                        model.selectionModel.entity.remove(objectEntityId);
                                                    }
                                                });
                                            }
                                        }
                                        return false;
                                    },
                                    // Select or deselect relation.
                                    // This function is expected to be called when Relation-Edit-Mode.
                                    selectRelation = function(jsPlumbConnection, event) {
                                        var relationId = jsPlumbConnection.getParameter("id");

                                        if (event.ctrlKey || event.metaKey) {
                                            model.selectionModel.relation.toggle(relationId);
                                        } else {
                                            // Select only self
                                            model.selectionModel.clear();
                                            model.selectionModel.relation.add(relationId);
                                        }
                                    },
                                    returnFalse = function() {
                                        return false;
                                    };

                                return function() {
                                    // Control only entities and relations.
                                    // Cancel events of relations and theier label.
                                    // Because a jQuery event and a jsPlumb event are both fired when a relation are clicked.
                                    // And jQuery events are propergated to body click events and cancel select.
                                    // So multi selection of relations with Ctrl-key is not work. 
                                    unbindAllEventhandler()
                                        .on('mouseup', '.textae-editor__entity', entityClickedAtRelationMode)
                                        .on('mouseup', '.textae-editor__relation, .textae-editor__relation__label', returnFalse)
                                        .on('mouseup', '.textae-editor__body', userEvent.viewHandler.cancelSelect);

                                    palletConfig.typeContainer = view.viewModel.typeContainer.relation;
                                    getSelectedIdEditable = model.selectionModel.relation.all;
                                    changeTypeOfSelected = _.partial(changeType, getSelectedIdEditable, command.factory.relationChangeTypeCommand);

                                    jsPlumbConnectionClickedImpl = selectRelation;
                                };
                            }(),
                            noRelationEdit: function() {
                                var spanAdjuster = function() {
                                        var getPosition = function(node) {
                                            var $parent = $(node).parent();
                                            var parentId = $parent.attr("id");

                                            var pos;
                                            if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
                                                pos = view.viewModel.paragraphs[parentId].begin;
                                            } else if ($parent.hasClass("textae-editor__span")) {
                                                pos = model.annotationData.span.get(parentId).begin;
                                            } else {
                                                console.log(parentId);
                                                return;
                                            }

                                            var childNodes = node.parentElement.childNodes;
                                            for (var i = 0; childNodes[i] != node; i++) { // until the focus node
                                                pos += (childNodes[i].nodeName == "#text") ? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
                                            }

                                            return pos;
                                        };

                                        var getFocusPosition = function(selection) {
                                            var pos = getPosition(selection.focusNode);
                                            return pos += selection.focusOffset;
                                        };

                                        var getAnchorPosition = function(selection) {
                                            var pos = getPosition(selection.anchorNode);
                                            return pos + selection.anchorOffset;
                                        };

                                        // adjust the beginning position of a span
                                        var adjustSpanBegin = function(beginPosition) {
                                            var pos = beginPosition;

                                            while (
                                                spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos))
                                            ) {
                                                pos++;
                                            }

                                            while (
                                                pos > 0 &&
                                                !spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos)) &&
                                                !spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos - 1))
                                            ) {
                                                pos--;
                                            }
                                            return pos;
                                        };

                                        // adjust the end position of a span
                                        var adjustSpanEnd = function(endPosition) {
                                            var pos = endPosition;

                                            while (
                                                spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos - 1))
                                            ) {
                                                pos--;
                                            }

                                            while (!spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos)) &&
                                                pos < model.annotationData.sourceDoc.length
                                            ) {
                                                pos++;
                                            }
                                            return pos;
                                        };

                                        // adjust the beginning position of a span for shortening
                                        var adjustSpanBegin2 = function(beginPosition) {
                                            var pos = beginPosition;
                                            while (
                                                pos < model.annotationData.sourceDoc.length &&
                                                (
                                                    spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos)) ||
                                                    !spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos - 1))
                                                )
                                            ) {
                                                pos++;
                                            }
                                            return pos;
                                        };

                                        // adjust the end position of a span for shortening
                                        var adjustSpanEnd2 = function(endPosition) {
                                            var pos = endPosition;
                                            while (
                                                pos > 0 &&
                                                (
                                                    spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos - 1)) ||
                                                    !spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos))
                                                )
                                            ) {
                                                pos--;
                                            }
                                            return pos;
                                        };

                                        var doCreate = function(beginPosition, endPosition) {
                                            // The span cross exists spans.
                                            if (model.annotationData.isBoundaryCrossingWithOtherSpans({
                                                begin: beginPosition,
                                                end: endPosition
                                            })) {
                                                view.domUtil.manipulate.dismissBrowserSelection();
                                                return;
                                            }

                                            // The span exists already.
                                            var spanId = idFactory.makeSpanId(beginPosition, endPosition);
                                            if (model.annotationData.span.get(spanId)) {
                                                view.domUtil.manipulate.dismissBrowserSelection();
                                                return;
                                            }

                                            var commands = [command.factory.spanCreateCommand({
                                                begin: beginPosition,
                                                end: endPosition
                                            })];

                                            if (view.viewModel.modeAccordingToButton['replicate-auto'].value() && endPosition - beginPosition <= CONSTS.BLOCK_THRESHOLD) {
                                                commands.push(command.factory.spanReplicateCommand({
                                                    begin: beginPosition,
                                                    end: endPosition
                                                }));
                                            }

                                            command.invoke(commands);
                                            view.domUtil.manipulate.dismissBrowserSelection();
                                        };

                                        var createSpanIfOneParent = function(selection) {
                                            // A span can be created at the same parent node.
                                            // The parentElement is expected as a paragraph or a span.
                                            if (selection.anchorNode.parentElement.id !== selection.focusNode.parentElement.id) {
                                                console.log(selection.anchorNode.parentElement.id, selection.focusNode.parentElement.id);
                                                return false;
                                            }

                                            var anchorPosition = getAnchorPosition(selection);
                                            var focusPosition = getFocusPosition(selection);

                                            // switch the position when the selection is made from right to left
                                            if (anchorPosition > focusPosition) {
                                                var tmpPos = anchorPosition;
                                                anchorPosition = focusPosition;
                                                focusPosition = tmpPos;
                                            }

                                            // A span cannot be created include nonEdgeCharacters only.
                                            var stringWithoutNonEdgeCharacters = model.annotationData.sourceDoc.substring(anchorPosition, focusPosition);
                                            spanConfig.nonEdgeCharacters.forEach(function(char) {
                                                stringWithoutNonEdgeCharacters = stringWithoutNonEdgeCharacters.replace(char, '');
                                            });
                                            if (stringWithoutNonEdgeCharacters.length === 0) {
                                                view.domUtil.manipulate.dismissBrowserSelection();
                                                // Return true to return from the caller function.
                                                return true;
                                            }

                                            model.selectionModel.clear();
                                            doCreate(adjustSpanBegin(anchorPosition), adjustSpanEnd(focusPosition));

                                            return true;
                                        };

                                        var moveSpan = function(spanId, begin, end) {
                                            // Do not need move.
                                            if (spanId === idFactory.makeSpanId(begin, end)) {
                                                return;
                                            }

                                            return [command.factory.spanMoveCommand(spanId, begin, end)];
                                        };

                                        var expandSpan = function(spanId, selection) {
                                            var commands = [];

                                            var focusPosition = getFocusPosition(selection);

                                            var range = selection.getRangeAt(0);
                                            var anchorRange = document.createRange();
                                            anchorRange.selectNode(selection.anchorNode);

                                            if (range.compareBoundaryPoints(Range.START_TO_START, anchorRange) < 0) {
                                                // expand to the left
                                                var newBegin = adjustSpanBegin(focusPosition);
                                                commands = moveSpan(spanId, newBegin, model.annotationData.span.get(spanId).end);
                                            } else {
                                                // expand to the right
                                                var newEnd = adjustSpanEnd(focusPosition);
                                                commands = moveSpan(spanId, model.annotationData.span.get(spanId).begin, newEnd);
                                            }

                                            command.invoke(commands);
                                        };

                                        var shortenSpan = function(spanId, selection) {
                                            var commands = [];

                                            var focusPosition = getFocusPosition(selection);

                                            var range = selection.getRangeAt(0);
                                            var focusRange = document.createRange();
                                            focusRange.selectNode(selection.focusNode);

                                            var removeSpan = function(spanId) {
                                                return [command.factory.spanRemoveCommand(spanId)];
                                            };

                                            var new_sid, tid, eid, type;
                                            if (range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {
                                                // shorten the right boundary
                                                var newEnd = adjustSpanEnd2(focusPosition);

                                                if (newEnd > model.annotationData.span.get(spanId).begin) {
                                                    new_sid = idFactory.makeSpanId(model.annotationData.span.get(spanId).begin, newEnd);
                                                    if (model.annotationData.span.get(new_sid)) {
                                                        commands = removeSpan(spanId);
                                                    } else {
                                                        commands = moveSpan(spanId, model.annotationData.span.get(spanId).begin, newEnd);
                                                    }
                                                } else {
                                                    model.selectionModel.span.add(spanId);
                                                    userEvent.editHandler.removeSelectedElements();
                                                }
                                            } else {
                                                // shorten the left boundary
                                                var newBegin = adjustSpanBegin2(focusPosition);

                                                if (newBegin < model.annotationData.span.get(spanId).end) {
                                                    new_sid = idFactory.makeSpanId(newBegin, model.annotationData.span.get(spanId).end);
                                                    if (model.annotationData.span.get(new_sid)) {
                                                        commands = removeSpan(spanId);
                                                    } else {
                                                        commands = moveSpan(spanId, newBegin, model.annotationData.span.get(spanId).end);
                                                    }
                                                } else {
                                                    model.selectionModel.span.add(spanId);
                                                    userEvent.editHandler.removeSelectedElements();
                                                }
                                            }

                                            command.invoke(commands);
                                        };

                                        var isInSelectedSpan = function(position) {
                                            var spanId = model.selectionModel.span.single();
                                            if (spanId) {
                                                var selectedSpan = model.annotationData.span.get(spanId);
                                                return selectedSpan.begin < position && position < selectedSpan.end;
                                            }
                                            return false;
                                        };

                                        var expandIfable = function(selection) {
                                            if (selection.anchorNode.parentNode.parentNode === selection.focusNode.parentNode) {
                                                // To expand the span , belows are needed:
                                                // 1. The anchorNode is in the span.
                                                // 2. The foucusNode is out of the span and in the parent of the span.
                                                model.selectionModel.clear();
                                                expandSpan(selection.anchorNode.parentNode.id, selection);

                                                view.domUtil.manipulate.dismissBrowserSelection();
                                                return true;
                                            }

                                            // If a span is selected, it is able to begin drag a span in the span and expand the span.
                                            if (isInSelectedSpan(getAnchorPosition(selection))) {
                                                var selectedSpanId = model.selectionModel.span.all()[0];

                                                // The focus node should be at one level above the selected node.
                                                if (view.domUtil.selector.span.get(selectedSpanId).parent().attr('id') === selection.focusNode.parentNode.id) {
                                                    // cf.
                                                    // 1. Select an outside span.
                                                    // 2. Begin Drug from an inner span to out of an outside span. 
                                                    // Expand the selected span.
                                                    expandSpan(selectedSpanId, selection);
                                                    view.domUtil.manipulate.dismissBrowserSelection();
                                                    return true;
                                                } else {
                                                    // cf.
                                                    // 1. Select an inner span.
                                                    // 2. Begin Drug from an inner span to out of an outside span. 
                                                    // To expand the selected span is disable.
                                                    alert('A span cannot be expanded to make a boundary crossing.');
                                                    view.domUtil.manipulate.dismissBrowserSelection();
                                                    return true;
                                                }
                                            }

                                            // To expand a span is disable.
                                            return false;
                                        };

                                        var shrinkIfable = function(selection) {
                                            if (selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode) {
                                                // To shrink the span , belows are needed:
                                                // 1. The anchorNode out of the span and in the parent of the span.
                                                // 2. The foucusNode is in the span.
                                                model.selectionModel.clear();
                                                shortenSpan(selection.focusNode.parentNode.id, selection);
                                                view.domUtil.manipulate.dismissBrowserSelection();
                                                return true;
                                            }

                                            // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
                                            if (isInSelectedSpan(getFocusPosition(selection))) {
                                                var selectedSpanId = model.selectionModel.span.all()[0];

                                                // The focus node should be at the selected node.
                                                if (selection.focusNode.parentNode.id === selectedSpanId) {
                                                    // cf.
                                                    // 1. Select an inner span.
                                                    // 2. Begin Drug from out of an outside span to the selected span. 
                                                    // Shrink the selected span.
                                                    shortenSpan(selectedSpanId, selection);
                                                    view.domUtil.manipulate.dismissBrowserSelection();
                                                    return true;
                                                } else {
                                                    // cf.
                                                    // 1. Select an outside span.
                                                    // 2. Begin Drug from out of an outside span to an inner span. 
                                                    // To shrink the selected span is disable.
                                                    alert('A span cannot be shrinked to make a boundary crossing.');
                                                    view.domUtil.manipulate.dismissBrowserSelection();
                                                    return true;
                                                }
                                            }

                                            // To shrink a span is disable.
                                            return false;
                                        };

                                        var overParagraph = function() {
                                            alert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
                                            view.domUtil.manipulate.dismissBrowserSelection();
                                        };

                                        return {
                                            createSpanIfOneParent: createSpanIfOneParent,
                                            expandIfable: expandIfable,
                                            shrinkIfable: shrinkIfable,
                                            overParagraph: overParagraph
                                        };
                                    }(),
                                    selectEndOfText = function(selection) {
                                        // The Both node is not TextNode( nodeType == 3 ) either.
                                        // This occurs by triple-clicks of a text.
                                        if (selection.anchorNode.nodeType !== 3 || selection.focusNode.nodeType !== 3) {
                                            // Blinking occurs if dissmiss here.
                                            // Return true and the browser dissmiss the selection. 
                                            return true;
                                        }

                                        if (spanAdjuster.createSpanIfOneParent(selection)) {
                                            return false;
                                        }

                                        if (spanAdjuster.expandIfable(selection)) {
                                            return false;
                                        }

                                        spanAdjuster.overParagraph();
                                        return false;
                                    },
                                    bodyClicked = function(e) {
                                        var selection = window.getSelection();

                                        // No select
                                        if (selection.isCollapsed) {
                                            userEvent.viewHandler.cancelSelect();
                                            return true;
                                        }

                                        return selectEndOfText(selection);
                                    },
                                    selectEndOnSpan = function(selection) {
                                        // The Both node is not TextNode( nodeType == 3 ) either.
                                        // This occurs by triple-clicks of a span.
                                        if (selection.anchorNode.nodeType !== 3 || selection.focusNode.nodeType !== 3) {
                                            // Blinking occurs if dissmiss here.
                                            // Return true and the browser dissmiss the selection. 
                                            return true;
                                        }

                                        if (spanAdjuster.createSpanIfOneParent(selection)) {
                                            return false;
                                        }

                                        if (spanAdjuster.expandIfable(selection)) {
                                            return false;
                                        }

                                        if (spanAdjuster.shrinkIfable(selection)) {
                                            return false;
                                        }

                                        spanAdjuster.overParagraph();
                                        return false;
                                    },
                                    spanClicked = function(e) {
                                        var selection = window.getSelection();

                                        // No select
                                        if (selection.isCollapsed) {
                                            var firstId = model.selectionModel.span.single();
                                            if (e.shiftKey && firstId) {
                                                //select reange of spans.
                                                var secondId = $(this).attr('id');

                                                model.selectionModel.clear();

                                                model.annotationData.span.range(firstId, secondId)
                                                    .forEach(function(spanId) {
                                                        model.selectionModel.span.add(spanId);
                                                    });
                                            } else if (e.ctrlKey || e.metaKey) {
                                                model.selectionModel.span.toggle(e.target.id);
                                            } else {
                                                model.selectionModel.clear();
                                                model.selectionModel.span.add(e.target.id);
                                            }

                                            return false;
                                        }

                                        return selectEndOnSpan(selection);
                                    },
                                    labelOrPaneClicked = function(ctrlKey, $typeLabel, $entities) {
                                        var selectEntities = function($entities) {
                                                $entities.each(function() {
                                                    model.selectionModel.entity.add($(this).attr('title'));
                                                });
                                            },
                                            deselectEntities = function($entities) {
                                                $entities.each(function() {
                                                    model.selectionModel.entity.remove($(this).attr('title'));
                                                });
                                            };

                                        if (ctrlKey) {
                                            if ($typeLabel.hasClass('ui-selected')) {
                                                deselectEntities($entities);
                                            } else {
                                                selectEntities($entities);
                                            }
                                        } else {
                                            model.selectionModel.clear();
                                            selectEntities($entities);
                                        }
                                        return false;
                                    },
                                    typeLabelClicked = function(e) {
                                        var $typeLabel = $(e.target);
                                        return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typeLabel, $typeLabel.next().children());
                                    },
                                    entityClicked = function(e) {
                                        var $target = $(e.target);
                                        if (e.ctrlKey || e.metaKey) {
                                            model.selectionModel.entity.toggle($target.attr('title'));
                                        } else {
                                            model.selectionModel.clear();
                                            model.selectionModel.entity.add($target.attr('title'));
                                        }
                                        return false;
                                    },
                                    entityPaneClicked = function(e) {
                                        var $typePane = $(e.target);
                                        return labelOrPaneClicked(e.ctrlKey || e.metaKey, $typePane.prev(), $typePane.children());
                                    };

                                return function() {
                                    unbindAllEventhandler()
                                        .on('mouseup', '.textae-editor__body', bodyClicked)
                                        .on('mouseup', '.textae-editor__span', spanClicked)
                                        .on('mouseup', '.textae-editor__type-label', typeLabelClicked)
                                        .on('mouseup', '.textae-editor__entity-pane', entityPaneClicked)
                                        .on('mouseup', '.textae-editor__entity', entityClicked);

                                    palletConfig.typeContainer = view.viewModel.typeContainer.entity;
                                    getSelectedIdEditable = model.selectionModel.entity.all;
                                    changeTypeOfSelected = _.partial(changeType, getSelectedIdEditable, command.factory.entityChangeTypeCommand);

                                    jsPlumbConnectionClickedImpl = null;
                                };
                            }(),
                            noEdit: function() {
                                unbindAllEventhandler();

                                palletConfig.typeContainer = null;
                                changeTypeOfSelected = null;

                                jsPlumbConnectionClickedImpl = null;
                            }
                        };
                    }();

                    var controllerState = function() {
                        var resetView = function() {
                            userEvent.viewHandler.hideDialogs();
                            model.selectionModel.clear();
                        };

                        var transition = {
                            toTerm: function() {
                                resetView();

                                eventHandlerComposer.noRelationEdit();
                                view.viewModel.viewMode.setTerm();
                                view.viewModel.viewMode.setEditable(true);

                                view.helper.redraw();

                                controllerState = state.termCentric;
                            },
                            toInstance: function() {
                                resetView();

                                eventHandlerComposer.noRelationEdit();
                                view.viewModel.viewMode.setInstance();
                                view.viewModel.viewMode.setEditable(true);

                                view.helper.redraw();

                                controllerState = state.instanceRelation;
                            },
                            toRelation: function() {
                                resetView();

                                eventHandlerComposer.relationEdit();
                                view.viewModel.viewMode.setRelation();
                                view.viewModel.viewMode.setEditable(true);

                                view.helper.redraw();

                                controllerState = state.relationEdit;
                            },
                            toViewTerm: function() {
                                resetView();

                                eventHandlerComposer.noEdit();
                                view.viewModel.viewMode.setTerm();
                                view.viewModel.viewMode.setEditable(false);

                                view.helper.redraw();

                                controllerState = state.viewTerm;
                            },
                            toViewInstance: function() {
                                resetView();

                                eventHandlerComposer.noEdit();
                                view.viewModel.viewMode.setInstance();
                                view.viewModel.viewMode.setEditable(false);

                                view.helper.redraw();

                                controllerState = state.viewInstance;
                            }
                        };

                        var notTransit = function() {
                            view.helper.redraw();
                        };
                        var state = {
                            termCentric: _.extend({}, transition, {
                                name: 'Term Centric',
                                toTerm: notTransit
                            }),
                            instanceRelation: _.extend({}, transition, {
                                name: 'Instance / Relation',
                                toInstance: notTransit,
                            }),
                            relationEdit: _.extend({}, transition, {
                                name: 'Relation Edit',
                                toRelation: notTransit
                            }),
                            viewTerm: _.extend({}, transition, {
                                name: 'View Only',
                                toTerm: notTransit,
                                toInstance: transition.toViewInstance,
                                toRelation: notTransit,
                                toViewTerm: notTransit
                            }),
                            viewInstance: _.extend({}, transition, {
                                name: 'View Only',
                                toTerm: transition.toViewTerm,
                                toInstance: notTransit,
                                toRelation: notTransit,
                                toViewInstance: notTransit
                            })
                        };

                        return {
                            // Init as TermCentricState
                            init: function() {
                                transition.toTerm();
                            }
                        };
                    }();

                    // Redraw all editors in tha windows.
                    var redrawAllEditor = function() {
                        $(window).trigger('resize');
                    };

                    var debounce300 = function(func) {
                        return _.debounce(func, 300);
                    };

                    var sixteenTimes = function(val) {
                        return val * 16;
                    };

                    var changeLineHeight = debounce300(_.compose(redrawAllEditor, view.helper.changeLineHeight, sixteenTimes));

                    var changeTypeGap = debounce300(view.helper.changeTypeGap);

                    var setViewMode = function(mode) {
                        if (controllerState['to' + mode]) {
                            controllerState['to' + mode]();
                        }
                    };

                    return {
                        init: function() {
                            controllerState.init();
                        },
                        showPallet: function() {
                            var hideAndDo = function(doFunction) {
                                return function() {
                                    userEvent.viewHandler.hidePallet();
                                    doFunction.call(this);
                                };
                            };

                            var makePalletRow = function(typeContainer) {
                                var makeRadioButton = function(typeName) {
                                    // The event handler is bound direct,because jQuery detects events of radio buttons directly only.
                                    var $radioButton = $('<input>')
                                        .addClass('textae-editor__entity-pallet__entity-type__radio')
                                        .attr({
                                            'type': 'radio',
                                            'name': 'etype',
                                            'label': typeName
                                        }).change(hideAndDo(function() {
                                            typeContainer.setDefaultType($(this).attr('label'));
                                            return false;
                                        }));

                                    // Select the radio button if it is default type.
                                    if (typeName === typeContainer.getDefaultType()) {
                                        $radioButton.attr({
                                            'title': 'default type',
                                            'checked': 'checked'
                                        });
                                    }
                                    return $radioButton;
                                };

                                var makeLink = function(uri) {
                                    if (uri) {
                                        return $('<a>')
                                            .attr({
                                                'href': uri,
                                                'target': '_blank'
                                            })
                                            .append($('<span>').addClass('textae-editor__entity-pallet__link'));
                                    }
                                };

                                var wrapTd = function($element) {
                                    if ($element) {
                                        return $('<td>').append($element);
                                    } else {
                                        return $('<td>');
                                    }
                                };

                                var makeColumn1 = _.compose(wrapTd, makeRadioButton);

                                var makeColumn2 = function(typeName) {
                                    return $('<td>')
                                        .addClass('textae-editor__entity-pallet__entity-type__label')
                                        .attr('label', typeName)
                                        .text(typeName);
                                };

                                var makeColumn3 = _.compose(wrapTd, makeLink, typeContainer.getUri);

                                return typeContainer.getSortedNames().map(function(typeName) {
                                    var $column1 = makeColumn1(typeName);
                                    var $column2 = makeColumn2(typeName);
                                    var $column3 = makeColumn3(typeName);

                                    return $('<tr>')
                                        .addClass('textae-editor__entity-pallet__entity-type')
                                        .css({
                                            'background-color': typeContainer.getColor(typeName)
                                        })
                                        .append([$column1, $column2, $column3]);
                                });
                            };

                            var createEmptyPallet = function(setTypeFunction) {
                                return $('<div>')
                                    .addClass("textae-editor__entity-pallet")
                                    .append($('<table>'))
                                    .css('position', 'fixed')
                                    .on('click', '.textae-editor__entity-pallet__entity-type__label', hideAndDo(setTypeFunction))
                                    .hide();
                            };

                            var reuseOldPallet = function($pallet) {
                                var $oldPallet = $('.textae-editor__entity-pallet');
                                if ($oldPallet.length !== 0) {
                                    return $oldPallet.find('table').empty().end().css('width', 'auto');
                                } else {
                                    // Append the pallet to body to show on top.
                                    $("body").append($pallet);
                                    return $pallet;
                                }
                            };

                            var appendRows = function($pallet) {
                                return $pallet.find("table")
                                    .append(makePalletRow(palletConfig.typeContainer))
                                    .end();
                            };

                            var setMaxHeight = function($pallet) {
                                // Show the scrollbar-y if the height of the pallet is same witch max-height.
                                if ($pallet.outerHeight() + 'px' === $pallet.css('max-height')) {
                                    return $pallet.css('overflow-y', 'scroll');
                                } else {
                                    return $pallet.css('overflow-y', '');
                                }
                            };

                            var makePallet = _.compose(setMaxHeight, appendRows, reuseOldPallet, createEmptyPallet);

                            return function(point) {
                                if (palletConfig.typeContainer && palletConfig.typeContainer.getSortedNames().length > 0) {
                                    // Move the pallet to mouse.
                                    makePallet(userEvent.editHandler.setEntityType)
                                        .css(point)
                                        .show();
                                }
                            };
                        }(),
                        hidePallet: function() {
                            $('.textae-editor__entity-pallet').hide();
                        },
                        hideDialogs: function() {
                            userEvent.viewHandler.hidePallet();
                            editor.tool.cancel();
                        },
                        redraw: function() {
                            view.helper.redraw();
                        },
                        cancelSelect: function() {
                            userEvent.viewHandler.hideDialogs();
                            model.selectionModel.clear();
                            view.domUtil.manipulate.dismissBrowserSelection();
                        },
                        selectLeftSpan: function() {
                            var spanId = model.selectionModel.span.single();
                            if (spanId) {
                                var span = model.annotationData.span.get(spanId);
                                model.selectionModel.clear();
                                if (span.left) {
                                    model.selectionModel.span.add(span.left.id);
                                }
                            }
                        },
                        selectRightSpan: function() {
                            var spanId = model.selectionModel.span.single();
                            if (spanId) {
                                var span = model.annotationData.span.get(spanId);
                                model.selectionModel.clear();
                                if (span.right) {
                                    model.selectionModel.span.add(span.right.id);
                                }
                            }
                        },
                        showSettingDialog: function() {
                            var typeGapValue;

                            return function() {
                                var content = function() {
                                        return $('<div>')
                                            .addClass('textae-editor__setting-dialog');
                                    },
                                    lineHeight = function($content) {
                                        return $content
                                            .append($('<div>')
                                                .append('<label class="textae-editor__setting-dialog__label">Line Height')
                                                .append($('<input>')
                                                    .attr({
                                                        'type': 'number',
                                                        'step': 1,
                                                        'min': 3,
                                                        'max': 10,
                                                        'value': view.helper.getLineHeight(),
                                                    })
                                                    .addClass('textae-editor__setting-dialog__line-height')
                                                ))
                                            .on('change', '.textae-editor__setting-dialog__line-height', function() {
                                                changeLineHeight($(this).val());
                                            });
                                    },
                                    instanceRelationView = function($content) {
                                        return $content.append($('<div>')
                                                .append('<label class="textae-editor__setting-dialog__label">Instance/Relation View')
                                                .append($('<input>')
                                                    .attr({
                                                        'type': 'checkbox'
                                                    })
                                                    .addClass('textae-editor__setting-dialog__term-centric-view')
                                                )
                                            )
                                            .on('click', '.textae-editor__setting-dialog__term-centric-view', function() {
                                                if ($(this).is(':checked')) {
                                                    controllerState.toInstance();
                                                } else {
                                                    controllerState.toTerm();
                                                }
                                            });
                                    },
                                    typeGap = function($content) {
                                        return $content.append($('<div>')
                                            .append('<label class="textae-editor__setting-dialog__label">Type Gap')
                                            .append($('<input>')
                                                .attr({
                                                    type: 'number',
                                                    step: 1,
                                                    min: 0,
                                                    max: 5
                                                }).addClass('textae-editor__setting-dialog__type_gap')
                                            )
                                        ).on('change', '.textae-editor__setting-dialog__type_gap', function() {
                                            typeGapValue = $(this).val();
                                            changeTypeGap(typeGapValue);
                                        });
                                    },
                                    dialog = function($content) {
                                        return textAeUtil.getDialog(editor.editorId, 'textae.dialog.setting', 'Chage Settings', $content, true);
                                    },
                                    // Update the checkbox state, because it is updated by the button on control too.
                                    updateViewMode = function($dialog) {
                                        return $dialog.find('.textae-editor__setting-dialog__term-centric-view')
                                            .prop({
                                                'checked': view.viewModel.viewMode.isTerm() ? null : 'checked'
                                            })
                                            .end();
                                    },
                                    updateTypeGapValue = function($dialog) {
                                        return $dialog.find('.textae-editor__setting-dialog__type_gap')
                                            .prop({
                                                value: typeGapValue ? typeGapValue : view.viewModel.viewMode.isTerm() ? 0 : 1
                                            })
                                            .end();
                                    },
                                    // Open the dialog.
                                    open = function($dialog) {
                                        return $dialog.open();
                                    };

                                _.compose(open, updateTypeGapValue, updateViewMode, dialog, typeGap, instanceRelationView, lineHeight, content)();
                            };
                        }(),
                        toggleRelationEditMode: function() {
                            // ビューモードを切り替える
                            if (view.viewModel.modeAccordingToButton['relation-edit-mode'].value()) {
                                controllerState.toInstance();
                            } else {
                                controllerState.toRelation();
                            }
                        },
                        setViewMode: setViewMode,
                        bindChangeViewMode: function() {
                            var changeViewMode = function(prefix) {
                                // Change view mode accoding to the annotation data.
                                if (model.annotationData.relation.some() || model.annotationData.span.multiEntities().length > 0) {
                                    setViewMode(prefix + 'Instance');
                                    view.helper.calculateLineHeight(36);
                                } else {
                                    setViewMode(prefix + 'Term');
                                    view.helper.calculateLineHeight(18);
                                }
                            };

                            return function(mode) {
                                var prefix = mode === 'edit' ? '' : 'View';
                                model.annotationData.bind('all.change', _.partial(changeViewMode, prefix));
                            };
                        }()
                    };
                }()
            };
        }();

        return {
            jsPlumbConnectionAdded: function(event, jsPlumbConnection) {
                jsPlumbConnection.bindClickAction(jsPlumbConnectionClicked);
            },
            editorSelected: editorSelected,
            userEvent: userEvent
        };
    };
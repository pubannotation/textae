module.exports = function(editor, model, spanConfig, command, viewModel, typeContainer) {
	var dismissBrowserSelection = require('./dismissBrowserSelection'),
		// changeEventHandler will init.
		changeTypeOfSelected,
		getSelectedIdEditable,
		// The Reference to content to be shown in the pallet.
		palletConfig = {},
		pallet = require('../component/Pallet')(),
		hideDialogs = function() {
			pallet.hide();
		},
		cancelSelect = function() {
			hideDialogs();
			model.selectionModel.clear();
			dismissBrowserSelection();
		},
		changeType = function(getSelectedAndEditable, createChangeTypeCommandFunction, newType) {
			var ids = getSelectedAndEditable();
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
				.off('mouseup', '.textae-editor__span_block')
				.off('mouseup', '.textae-editor__type-label')
				.off('mouseup', '.textae-editor__entity-pane')
				.off('mouseup', '.textae-editor__entity');
		},
		editRelation = function() {
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
									type: typeContainer.relation.getDefaultType()
								})]);

								if (e.ctrlKey || e.metaKey) {
									// Remaining selection of the subject entity.
									model.selectionModel.entity.remove(objectEntityId);
								} else if (e.shiftKey) {
									dismissBrowserSelection();
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
						if (model.selectionModel.relation.single() !== relationId) {
							model.selectionModel.clear();
							model.selectionModel.relation.add(relationId);
						}
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
					.on('mouseup', '.textae-editor__body', cancelSelect);

				palletConfig.typeContainer = typeContainer.relation;
				getSelectedIdEditable = model.selectionModel.relation.all;
				changeTypeOfSelected = _.partial(changeType, getSelectedIdEditable, command.factory.relationChangeTypeCommand);

				jsPlumbConnectionClickedImpl = selectRelation;
			};
		}(),
		getSelectionSnapShot = function() {
			var selection = window.getSelection(),
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
		},
		editEntity = function() {
			var selectEnd = require('./SelectEnd')(editor, model, command, viewModel, typeContainer),
				bodyClicked = function() {
					var selection = window.getSelection();

					// No select
					if (selection.isCollapsed) {
						cancelSelect();
					} else {
						selectEnd.onText({
							spanConfig: spanConfig,
							selection: getSelectionSnapShot()
						});
					}
				},
				selectSpan = function() {
					var getBlockEntities = function(spanId) {
							return _.flatten(
								model.annotationData.span.get(spanId)
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
							model.selectionModel.span[method](spanId);
							if (editor.find('#' + spanId).hasClass('textae-editor__span--block')) {
								getBlockEntities(spanId).forEach(model.selectionModel.entity[method]);
							}
						},
						selectSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'add'),
						toggleSpanWithBlockEnities = _.partial(operateSpanWithBlockEntities, 'toggle');

					return function(event) {
						var firstId = model.selectionModel.span.single(),
							target = event.target,
							id = target.id;

						if (event.shiftKey && firstId) {
							//select reange of spans.
							model.selectionModel.clear();
							model.annotationData.span.range(firstId, id)
								.forEach(function(spanId) {
									selectSpanWithBlockEnities(spanId);
								});
						} else if (event.ctrlKey || event.metaKey) {
							toggleSpanWithBlockEnities(id);
						} else {
							model.selectionModel.clear();
							selectSpanWithBlockEnities(id);
						}
					};
				}(),
				spanClicked = function(event) {
					var selection = window.getSelection();

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

					dismissBrowserSelection();

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
					dismissBrowserSelection();

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
				},
				createEntityChangeTypeCommand = function(id, newType) {
					return command.factory.entityChangeTypeCommand(
						id,
						newType,
						typeContainer.entity.isBlock(newType)
					);
				};

			return function() {
				unbindAllEventhandler()
					.on('mouseup', '.textae-editor__body', bodyClicked)
					.on('mouseup', '.textae-editor__span', spanClicked)
					.on('mouseup', '.textae-editor__type-label', typeLabelClicked)
					.on('mouseup', '.textae-editor__entity-pane', entityPaneClicked)
					.on('mouseup', '.textae-editor__entity', entityClicked);

				palletConfig.typeContainer = typeContainer.entity;
				getSelectedIdEditable = model.selectionModel.entity.all;
				changeTypeOfSelected = _.partial(
					changeType,
					getSelectedIdEditable,
					createEntityChangeTypeCommand
				);

				jsPlumbConnectionClickedImpl = null;
			};
		}(),
		noEdit = function() {
			unbindAllEventhandler();

			palletConfig.typeContainer = null;
			changeTypeOfSelected = null;
			getSelectedIdEditable = null;

			jsPlumbConnectionClickedImpl = null;
		};

	pallet
		.bind('type.select', function(label) {
			pallet.hide();
			changeTypeOfSelected(label);
		})
		.bind('default-type.select', function(label) {
			pallet.hide();
			palletConfig.typeContainer.setDefaultType(label);
		});

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

	return {
		editRelation: editRelation,
		editEntity: editEntity,
		noEdit: noEdit,
		showPallet: function(point) {
			pallet.show(palletConfig, point);
		},
		setNewType: function(newTypeName) {
			changeTypeOfSelected(newTypeName);
		},
		hideDialogs: hideDialogs,
		cancelSelect: cancelSelect,
		jsPlumbConnectionClicked: jsPlumbConnectionClicked,
		getSelectedIdEditable: function() {
			return getSelectedIdEditable && getSelectedIdEditable();
		}
	};
};
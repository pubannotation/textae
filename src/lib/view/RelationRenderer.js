var makeJsPlumbInstance = function(container) {
		var newInstance = jsPlumb.getInstance({
			ConnectionsDetachable: false,
			Endpoint: ['Dot', {
				radius: 1
			}]
		});
		newInstance.setRenderMode(newInstance.SVG);
		newInstance.Defaults.Container = container;
		return newInstance;
	},
	label = {
		cssClass: 'textae-editor__relation__label',
		id: 'label'
	},
	LabelOverlay = function(connect) {
		// Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
		var labelOverlay = connect.getOverlay(label.id);
		if (!labelOverlay) {
			throw 'no label overlay';
		}

		return labelOverlay;
	};

module.exports = function(editor, model, domPositionUtils, domUtil, viewModel, modification) {
	// Init a jsPlumb instance.
	var jsPlumbInstance,
		init = function(container) {
			jsPlumbInstance = makeJsPlumbInstance(container);
		},
		ConnectorStrokeStyle = function() {
			var converseHEXinotRGBA = function(color, opacity) {
				var c = color.slice(1);
				r = parseInt(c.substr(0, 2), 16);
				g = parseInt(c.substr(2, 2), 16);
				b = parseInt(c.substr(4, 2), 16);

				return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
			};

			return function(relationId) {
				var type = model.annotationData.relation.get(relationId).type,
					colorHex = viewModel.typeContainer.relation.getColor(type);

				return {
					lineWidth: 1,
					strokeStyle: converseHEXinotRGBA(colorHex, 1)
				};
			};
		}(),
		// Parameters to render relations.
		renderParameters = {
			// curviness parameters
			xrate: 0.6,
			yrate: 0.05,

			// curviness offset
			c_offset: 20,
		},
		render = function() {
			// Overlay styles for jsPlubm connections.
			var normalArrow = {
					width: 7,
					length: 9,
					location: 1,
					id: 'normal-arrow'
				},
				hoverArrow = {
					width: 14,
					length: 18,
					location: 1,
					id: 'hover-arrow',
				},
				toAnchors = function(relationId) {
					return {
						sourceId: model.annotationData.relation.get(relationId).subj,
						targetId: model.annotationData.relation.get(relationId).obj
					};
				},
				isGridPrepared = function(relationId) {
					var anchors = toAnchors(relationId);
					return domPositionUtils.gridPositionCache.isGridPrepared(anchors.sourceId) &&
						domPositionUtils.gridPositionCache.isGridPrepared(anchors.targetId);
				},
				determineCurviness = function(relationId) {
					var anchors = toAnchors(relationId);
					var sourcePosition = domPositionUtils.getEntity(anchors.sourceId);
					var targetPosition = domPositionUtils.getEntity(anchors.targetId);

					var sourceX = sourcePosition.center;
					var targetX = targetPosition.center;

					var sourceY = sourcePosition.top;
					var targetY = targetPosition.top;

					var xdiff = Math.abs(sourceX - targetX);
					var ydiff = Math.abs(sourceY - targetY);
					var curviness = xdiff * renderParameters.xrate + ydiff * renderParameters.yrate + renderParameters.c_offset;
					curviness /= 2.4;

					return curviness;
				},
				create = function() {
					var createJsPlumbConnect = function(relation, curviness) {
						// Make a connect by jsPlumb.
						return jsPlumbInstance.connect({
							source: domUtil.selector.entity.get(relation.subj),
							target: domUtil.selector.entity.get(relation.obj),
							anchors: ['TopCenter', "TopCenter"],
							connector: ['Bezier', curviness],
							paintStyle: new ConnectorStrokeStyle(relation.id),
							parameters: {
								'id': relation.id,
							},
							cssClass: 'textae-editor__relation',
							overlays: [
								['Arrow', normalArrow],
								['Label', _.extend({}, label, {
									label: '[' + relation.id + '] ' + relation.type,
									cssClass: label.cssClass + ' ' + modification.getClasses(relation.id)
								})]
							]
						});
					};

					return function(relation) {
						// Create a relation as simlified version when before moving grids after creation grids.
						var beforeMoveGrid = !isGridPrepared(relation.id);
						var curviness = beforeMoveGrid ? {} : {
							curviness: determineCurviness(relation.id)
						};

						// Make a connect by jsPlumb.
						var connect = createJsPlumbConnect(relation, curviness);

						// Create as invisible to prevent flash at the initiation.
						if (beforeMoveGrid) {
							connect.setVisible(false);
						}

						return connect;
					};
				}(),
				extend = function() {
					// Extend module for jsPlumb.Connection.
					var Pointupable = function() {
							var hoverupLabel = function(connect) {
									new LabelOverlay(connect).addClass('hover');
									return connect;
								},
								hoverdownLabel = function(connect) {
									new LabelOverlay(connect).removeClass('hover');
									return connect;
								},
								selectLabel = function(connect) {
									new LabelOverlay(connect).addClass('ui-selected');
									return connect;
								},
								deselectLabel = function(connect) {
									new LabelOverlay(connect).removeClass('ui-selected');
									return connect;
								},
								selectLine = function(connect) {
									connect.addClass('ui-selected');
									return connect;
								},
								deselectLine = function(connect) {
									connect.removeClass('ui-selected');
									return connect;
								},
								hasClass = function(connect, className) {
									return connect.connector.canvas.classList.contains(className);
								},
								unless = function(connect, predicate, func) {
									// Evaluate lazily to use with _.delay.
									return function() {
										if (!predicate(connect)) func(connect);
									};
								},
								// Show a big arrow when the connect is hoverd.
								// Remove a normal arrow and add a new big arrow.
								// Because an arrow is out of position if hideOverlay and showOverlay is used.
								pointupArrow = function(getStrokeStyle, connect) {
									connect.removeOverlay(normalArrow.id);
									connect.addOverlay(['Arrow', hoverArrow]);
									connect.setPaintStyle(_.extend(getStrokeStyle(), {
										lineWidth: 3
									}));
									return connect;
								},
								pointdownAllow = function(getStrokeStyle, connect) {
									connect.removeOverlay(hoverArrow.id);
									connect.addOverlay(['Arrow', normalArrow]);
									connect.setPaintStyle(getStrokeStyle());
									return connect;
								},
								delay30 = function(func) {
									return _.partial(_.delay, func, 30);
								};

							return function(connect) {
								var relationId = connect.getParameter('id'),
									getStrokeStyle = _.partial(ConnectorStrokeStyle, relationId),
									pointupArrowColor = _.partial(pointupArrow, getStrokeStyle),
									pointdownAllowColor = _.partial(pointdownAllow, getStrokeStyle),
									unlessSelect = _.partial(unless, connect, function(connect) {
										return hasClass(connect, 'ui-selected');
									}),
									unlessDead = _.partial(unless, connect, function(connect) {
										return connect.dead;
									}),
									hoverup = _.compose(hoverupLabel, pointupArrowColor),
									hoverdown = _.compose(hoverdownLabel, pointdownAllowColor),
									select = _.compose(selectLine, selectLabel, hoverdownLabel, pointupArrowColor),
									deselect = _.compose(deselectLine, deselectLabel, pointdownAllowColor);

								return {
									pointup: unlessSelect(hoverup),
									pointdown: unlessSelect(hoverdown),
									select: delay30(unlessDead(select)),
									deselect: delay30(unlessDead(deselect))
								};
							};
						}(),
						ExtendModule = function(connect) {
							var relationId = connect.getParameter('id'),
								arrangePosition = function(relationId) {
									// The grid may be destroyed when the spas was moved repetitively by undo or redo.   
									if (!isGridPrepared(relationId)) {
										return;
									}

									var connect = domPositionUtils.toConnect(relationId);
									connect.endpoints[0].repaint();
									connect.endpoints[1].repaint();

									// Re-set arrow disappered when setConnector is called.
									connect.removeOverlay('normal-arrow');
									connect.setConnector(['Bezier', {
										curviness: determineCurviness(relationId)
									}]);
									connect.addOverlay(['Arrow', normalArrow]);

									// Create as invisible to prevent flash at the initiation.
									if (!connect.isVisible()) {
										connect.setVisible(true);
									}
								},
								bindClickAction = function(onClick) {
									this.bind('click', onClick);
									this.getOverlay(label.id).bind('click', function(label, event) {
										onClick(label.component, event);
									});
								};

							return _.extend({
								// Set a function debounce to avoid over rendering.
								arrangePosition: _.debounce(_.partial(arrangePosition, relationId), 20),
								bindClickAction: bindClickAction
							});
						};

					return function(connect) {
						return _.extend(
							connect,
							new ExtendModule(connect),
							new Pointupable(connect)
						);
					};
				}(),
				// Set hover action.
				hoverize = function() {
					var bindHoverAction = function(jsPlumbElement, onMouseOver, onMouseRemove) {
							jsPlumbElement.bind('mouseenter', onMouseOver).bind('mouseexit', onMouseRemove);
						},
						pointup = function(connect) {
							connect.pointup();
						},
						pointdown = function(connect) {
							connect.pointdown();
						},
						toComponent = function(label) {
							return label.component;
						};

					return function(connect) {
						bindHoverAction(connect, pointup, pointdown);
						bindHoverAction(
							new LabelOverlay(connect),
							_.compose(pointup, toComponent),
							_.compose(pointdown, toComponent)
						);
						return connect;
					};
				}(),
				// Cache a connect instance.
				cache = function(connect) {
					var relationId = connect.getParameter('id');
					domPositionUtils.connectCache.set(relationId, connect);
					return connect;
				},
				// Notify to controller that a new jsPlumbConnection is added.
				notify = function(connect) {
					editor.trigger('textae.editor.jsPlumbConnection.add', connect);
					return connect;
				};

			return _.compose(notify, cache, hoverize, extend, create);
		}(),
		Connect = function(relationId) {
			var connect = domPositionUtils.toConnect(relationId);
			if (!connect) {
				throw 'no connect';
			}

			return connect;
		},
		changeType = function(relation) {
			var connect = new Connect(relation.id);
			var labelOverlay = new LabelOverlay(connect);

			labelOverlay.setLabel('[' + relation.id + '] ' + relation.type);
			connect.setPaintStyle(new ConnectorStrokeStyle(relation.id));

			// Re-set style of the line and arrow if selected.
			if (model.selectionModel.relation.has(relation.id)) {
				connect.select();
			}
		},
		changeJsModification = function(relation) {
			var connect = new Connect(relation.id);
			var labelOverlay = new LabelOverlay(connect);
			modification.update(labelOverlay, relation.id);
		},
		remove = function(relation) {
			var connect = new Connect(relation.id);
			jsPlumbInstance.detach(connect);
			domPositionUtils.connectCache.remove(relation.id);

			// Set the flag dead already to delay selection.
			connect.dead = true;
		};

	return {
		init: init,
		reset: function() {
			jsPlumbInstance.reset();
			domPositionUtils.connectCache.clear();
		},
		render: render,
		change: changeType,
		changeModification: changeJsModification,
		remove: remove
	};
};
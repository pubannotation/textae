var POINTUP_LINE_WIDTH = 3,
	LABEL = {
		cssClass: 'textae-editor__relation__label',
		id: 'label'
	},
	CURVINESS_PARAMETERS = {
		// curviness parameters
		xrate: 0.6,
		yrate: 0.05,

		// curviness offset
		c_offset: 20,
	},
	makeJsPlumbInstance = function(container) {
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
	LabelOverlay = function(connect) {
		// Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
		var labelOverlay = connect.getOverlay(LABEL.id);
		if (!labelOverlay) {
			throw 'no label overlay';
		}

		return labelOverlay;
	},
	debounce20 = function(func) {
		return _.debounce(func, 20);
	},
	// A Module to modify jsPlumb Arrow Overlays.
	jsPlumbArrowOverlayUtil = require('./jsPlumbArrowOverlayUtil');

module.exports = function(editor, model, typeContainer, modification) {
	// Init a jsPlumb instance.
	var domUtil = require('../../util/DomUtil')(editor),
		domPositionUtils = require('../DomPositionCache')(editor, model),
		jsPlumbInstance,
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
					colorHex = typeContainer.relation.getColor(type);

				return {
					lineWidth: 1,
					strokeStyle: converseHEXinotRGBA(colorHex, 1)
				};
			};
		}(),
		// Cache a connect instance.
		cache = function(connect) {
			var relationId = connect.relationId;
			domPositionUtils.connectCache.set(relationId, connect);
			return connect;
		},
		toAnchors = function(relationId) {
			return {
				sourceId: model.annotationData.relation.get(relationId).subj,
				targetId: model.annotationData.relation.get(relationId).obj
			};
		},
		isGridPrepared = function(relationId) {
			if (!model.annotationData.relation.get(relationId)) return;

			var anchors = toAnchors(relationId);
			return domPositionUtils.gridPositionCache.isGridPrepared(anchors.sourceId) &&
				domPositionUtils.gridPositionCache.isGridPrepared(anchors.targetId);
		},
		filterGridExists = function(connect) {
			// The grid may be destroyed when the spans was moved repetitively by undo or redo.   
			if (!isGridPrepared(connect.relationId)) {
				return;
			}
			return connect;
		},
		arrangePosition = function(func, connect) {
			return debounce20(_.partial(_.compose(func, filterGridExists), connect));
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
			var curviness = xdiff * CURVINESS_PARAMETERS.xrate + ydiff * CURVINESS_PARAMETERS.yrate + CURVINESS_PARAMETERS.c_offset;
			curviness /= 2.4;

			return curviness;
		},
		moveConnect = function(connect) {
			// The connect.endpoints may be null by timming.
			if (connect && connect.endpoints) {
				connect.endpoints[0].repaint();
				connect.endpoints[1].repaint();
				connect.setConnector(['Bezier', {
					curviness: determineCurviness(connect.relationId)
				}]);

				// Re-set arrow because it is disappered when setConnector is called.
				jsPlumbArrowOverlayUtil.resetArrows(connect);
			}
		},
		render = function() {
			var createJsPlumbConnect = function(relation) {
					// Make a connect by jsPlumb.
					return jsPlumbInstance.connect({
						source: domUtil.selector.entity.get(relation.subj),
						target: domUtil.selector.entity.get(relation.obj),
						anchors: ['TopCenter', "TopCenter"],
						connector: ['Bezier', {
							curviness: determineCurviness(relation.id)
						}],
						paintStyle: new ConnectorStrokeStyle(relation.id),
						parameters: {
							'id': relation.id,
						},
						cssClass: 'textae-editor__relation',
						overlays: [
							['Arrow', jsPlumbArrowOverlayUtil.NORMAL_ARROW],
							['Label', _.extend({}, LABEL, {
								label: '[' + relation.id + '] ' + relation.type,
								cssClass: LABEL.cssClass + ' ' + modification.getClasses(relation.id)
							})]
						]
					});
				},
				create = function(relation) {
					return _.extend(createJsPlumbConnect(relation), {
						relationId: relation.id
					});
				},
				extendPointup = function() {
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
							hoverupLine = function(connect) {
								connect.addClass('hover');
								return connect;
							},
							hoverdownLine = function(connect) {
								connect.removeClass('hover');
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
							pointupLine = function(getStrokeStyle, connect) {
								connect.setPaintStyle(_.extend(getStrokeStyle(), {
									lineWidth: POINTUP_LINE_WIDTH
								}));
								return connect;
							},
							pointdownLine = function(getStrokeStyle, connect) {
								connect.setPaintStyle(getStrokeStyle());
								return connect;
							};

						return function(relationId, connect) {
							var getStrokeStyle = _.partial(ConnectorStrokeStyle, relationId),
								pointupLineColor = _.partial(pointupLine, getStrokeStyle),
								pointdownLineColor = _.partial(pointdownLine, getStrokeStyle),
								unlessSelect = _.partial(unless, connect, function(connect) {
									return hasClass(connect, 'ui-selected');
								}),
								unlessDead = _.partial(unless, connect, function(connect) {
									return connect.dead;
								}),
								hoverup = _.compose(
									hoverupLine,
									hoverupLabel,
									pointupLineColor,
									jsPlumbArrowOverlayUtil.showBigArrow
								),
								hoverdown = _.compose(
									hoverdownLine,
									hoverdownLabel,
									pointdownLineColor,
									jsPlumbArrowOverlayUtil.hideBigArrow
								),
								select = _.compose(
									selectLine,
									selectLabel,
									hoverdownLine,
									hoverdownLabel,
									pointupLineColor,
									jsPlumbArrowOverlayUtil.showBigArrow
								),
								deselect = _.compose(
									deselectLine,
									deselectLabel,
									pointdownLineColor,
									jsPlumbArrowOverlayUtil.hideBigArrow
								);

							return {
								pointup: unlessSelect(hoverup),
								pointdown: unlessSelect(hoverdown),
								select: unlessDead(select),
								deselect: unlessDead(deselect)
							};
						};
					}();

					return function(connect) {
						var relationId = connect.relationId;
						return _.extend(
							connect,
							new Pointupable(relationId, connect)
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
						},
						bindConnect = function(connect) {
							bindHoverAction(connect, pointup, pointdown);
							return connect;
						},
						bindLabel = function(connect) {
							bindHoverAction(
								new LabelOverlay(connect),
								_.compose(pointup, toComponent),
								_.compose(pointdown, toComponent)
							);
							return connect;
						};

					return _.compose(bindLabel, bindConnect);
				}(),
				extendApi = function() {
					// Extend module for jsPlumb.Connection.
					var Api = function(connect) {
						var bindClickAction = function(onClick) {
							this.bind('click', onClick);
							this.getOverlay(LABEL.id).bind('click', function(label, event) {
								onClick(label.component, event);
							});
						};

						return _.extend({
							// Set a function debounce to avoid over rendering.
							arrangePosition: arrangePosition(moveConnect, connect),
							bindClickAction: bindClickAction
						});
					};

					return function(connect) {
						return _.extend(
							connect,
							new Api(connect)
						);
					};
				}(),
				// Notify to controller that a new jsPlumbConnection is added.
				notify = function(connect) {
					editor.trigger('textae.editor.jsPlumbConnection.add', connect);
					return connect;
				};

			return _.compose(cache, notify, extendApi, hoverize, extendPointup, create);
		}(),
		// Create a dummy relation when before moving grids after creation grids.
		// Because a jsPlumb error occurs when a relation between same points.
		// And entities of same length spans was same point before moving grids.
		renderLazy = function() {
			var extendRelationId = function(relation) {
					return _.extend(relation, {
						relationId: relation.id
					})
				},
				renderAndMove = function(relation) {
					if (relation)
						moveConnect(render(relation));
				},
				extendDummyApiToCreateRlationWhenGridMoved = function(relation) {
					return _.extend(relation, {
						arrangePosition: arrangePosition(renderAndMove, relation)
					});
				};

			return _.compose(cache, extendDummyApiToCreateRlationWhenGridMoved, extendRelationId);
		}(),
		Connect = function(relationId) {
			var connect = domPositionUtils.toConnect(relationId);
			if (!connect) {
				throw 'no connect';
			}

			return connect;
		},
		changeType = function(relation) {
			var connect = new Connect(relation.id),
				strokeStyle = new ConnectorStrokeStyle(relation.id);

			// The connect may be an object for lazyRender instead of jsPlumb.Connection.
			// This occurs when changing types and deletes was reverted.
			if (connect instanceof jsPlumb.Connection) {
				if (model.selectionModel.relation.has(relation.id)) {
					// Re-set style of the line and arrow if selected.
					strokeStyle.lineWidth = POINTUP_LINE_WIDTH;
				}
				connect.setPaintStyle(strokeStyle);

				new LabelOverlay(connect).setLabel('[' + relation.id + '] ' + relation.type);
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
		render: renderLazy,
		change: changeType,
		changeModification: changeJsModification,
		remove: remove
	};
};
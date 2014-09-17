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
	// A Module to modify jsPlumb Arrow Overlays.
	jsPlumbArrowOverlayUtil = require('./jsPlumbArrowOverlayUtil');

module.exports = function(editor, model, typeContainer, modification) {
	// Init a jsPlumb instance.
	var domUtil = require('../../util/DomUtil')(editor),
		domPositionCaChe = require('../DomPositionCache')(editor, model.annotationData.entity),
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
			domPositionCaChe.connectCache.set(relationId, connect);
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
			return domPositionCaChe.gridPositionCache.isGridPrepared(anchors.sourceId) &&
				domPositionCaChe.gridPositionCache.isGridPrepared(anchors.targetId);
		},
		filterGridExists = function(connect) {
			// The grid may be destroyed when the spans was moved repetitively by undo or redo.   
			if (!isGridPrepared(connect.relationId)) {
				return;
			}
			return connect;
		},
		determineCurviness = function(relationId) {
			var anchors = toAnchors(relationId);
			var sourcePosition = domPositionCaChe.getEntity(anchors.sourceId);
			var targetPosition = domPositionCaChe.getEntity(anchors.targetId);

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
		render = function() {
			var deleteRender = function(relation) {
					delete relation.render;
					return relation;
				},
				createJsPlumbConnect = function(relation) {
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

			return _.compose(
				cache,
				notify,
				extendApi,
				hoverize,
				extendPointup,
				create,
				deleteRender
			);
		}(),
		Promise = require('Promise'),
		// Create a dummy relation when before moving grids after creation grids.
		// Because a jsPlumb error occurs when a relation between same points.
		// And entities of same length spans was same point before moving grids.
		renderLazy = function() {
			var extendRelationId = function(relation) {
					return _.extend(relation, {
						relationId: relation.id
					});
				},
				renderIfGridExists = function(relation) {
					if (filterGridExists(relation)) render(relation);
				},
				extendDummyApiToCreateRlationWhenGridMoved = function(relation) {
					var render = function() {
						return new Promise(function(resolve, reject) {
							_.defer(function() {
								try {
									renderIfGridExists(relation);
									resolve(relation);
								} catch (error) {
									reject(error);
								}
							});
						});
					};

					return _.extend(relation, {
						render: render
					});
				};

			return _.compose(cache, extendDummyApiToCreateRlationWhenGridMoved, extendRelationId);
		}(),
		Connect = function(relationId) {
			var connect = domPositionCaChe.toConnect(relationId);
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

			// A connect may be an object before it rendered.
			if (connect instanceof jsPlumb.Connection) {
				modification.update(new LabelOverlay(connect), relation.id);
			}
		},
		remove = function(relation) {
			var connect = new Connect(relation.id);
			jsPlumbInstance.detach(connect);
			domPositionCaChe.connectCache.remove(relation.id);

			// Set the flag dead already to delay selection.
			connect.dead = true;
		},
		resetAllCurviness = function() {
			model.annotationData.relation
				.all()
				.map(function(relation) {
					return new Connect(relation.id);
				})
				.filter(function(connect) {
					// Set changed values only.
					return connect.setConnector &&
						connect.connector.getCurviness() !== determineCurviness(connect.relationId);
				})
				.forEach(function(connect) {
					connect.setConnector(['Bezier', {
						curviness: determineCurviness(connect.relationId)
					}]);
					// Re-set arrow because it is disappered when setConnector is called.
					jsPlumbArrowOverlayUtil.resetArrows(connect);
				});
		},
		renderLazyRelationAll = function() {
			// Render relations unless rendered.
			return Promise.all(
				model.annotationData.relation
				.all()
				.filter(function(connect) {
					return connect.render;
				})
				.map(function(connect) {
					return connect.render();
				})
			);
		},
		reselectAll = function() {
			model.selectionModel.relation
				.all()
				.map(function(relationId) {
					return new Connect(relationId);
				})
				.filter(function(connect) {
					return connect instanceof jsPlumb.Connection;
				})
				.forEach(function(connect) {
					connect.select();
				});
		},
		arrangePositionAll = function() {
			return new Promise(function(resolve, reject) {
				_.defer(function() {
					try {
						// For tuning
						// var startTime = new Date();

						resetAllCurviness();
						jsPlumbInstance.repaintEverything();
						reselectAll();

						// For tuning
						// var endTime = new Date();
						// console.log(editor.editorId, 'arrangePositionAll : ', endTime.getTime() - startTime.getTime() + 'ms');

						resolve();
					} catch (error) {
						reject(error);
						throw error;
					}
				});
			});
		};

	return {
		init: init,
		reset: function() {
			jsPlumbInstance.reset();
			domPositionCaChe.connectCache.clear();
		},
		render: renderLazy,
		change: changeType,
		changeModification: changeJsModification,
		remove: remove,
		renderLazyRelationAll: renderLazyRelationAll,
		arrangePositionAll: arrangePositionAll
	};
};
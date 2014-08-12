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
		// Parameters to render relations.
		renderParameters = {
			// curviness parameters
			xrate: 0.6,
			yrate: 0.05,

			// curviness offset
			c_offset: 20,
		},
		// Cache a connect instance.
		cache = function(connect) {
			var relationId = connect.relationId;
			domPositionUtils.connectCache.set(relationId, connect);
			return connect;
		},
		debounce20 = function(func) {
			return _.debounce(func, 20);
		},
		// Create a dummy relation when before moving grids after creation grids.
		// Because a jsPlumb error occurs when a relation between same points.
		// And entities of same length spans was same point before moving grids.
		render0 = function() {
			var extendRelationId = function(relation) {
					return _.extend(relation, {
						relationId: relation.id
					})
				},
				extendDummyApiToCreateRlationWhenGridMoved = function(relation) {
					return _.extend(relation, {
						arrangePosition: debounce20(function() {
							render(relation).arrangePosition(relation.relationId);
						})
					});
				};

			return _.compose(cache, extendDummyApiToCreateRlationWhenGridMoved, extendRelationId);
		}(),
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
									['Arrow', normalArrow],
									['Label', _.extend({}, label, {
										label: '[' + relation.id + '] ' + relation.type,
										cssClass: label.cssClass + ' ' + modification.getClasses(relation.id)
									})]
								]
							});
						},
						createJsPlumbConnectWithRelationId = function(relation) {
							return _.extend(createJsPlumbConnect(relation), {
								relationId: relation.id
							});
						};

					return createJsPlumbConnectWithRelationId;
				}(),
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
							// Show a big arrow when the connect is hoverd.
							// Remove a normal arrow and add a new big arrow.
							// Because an arrow is out of position if hideOverlay and showOverlay is used.
							pointupArrow = function(getStrokeStyle, connect) {
								// Do not add a big arrow twice when a relation has been selected during hover.
								if (connect.getOverlay(hoverArrow.id))
									return connect;

								connect.removeOverlay(normalArrow.id);
								connect.addOverlay(['Arrow', hoverArrow]);
								connect.setPaintStyle(_.extend(getStrokeStyle(), {
									lineWidth: 3
								}));
								return connect;
							},
							pointdownAllow = function(getStrokeStyle, connect) {
								// Already affected
								if (connect.getOverlay(normalArrow.id))
									return connect;

								connect.removeOverlay(hoverArrow.id);
								connect.addOverlay(['Arrow', normalArrow]);
								connect.setPaintStyle(getStrokeStyle());
								return connect;
							},
							delay30 = function(func) {
								return _.partial(_.delay, func, 30);
							};

						return function(relationId, connect) {
							var getStrokeStyle = _.partial(ConnectorStrokeStyle, relationId),
								pointupArrowColor = _.partial(pointupArrow, getStrokeStyle),
								pointdownAllowColor = _.partial(pointdownAllow, getStrokeStyle),
								unlessSelect = _.partial(unless, connect, function(connect) {
									return hasClass(connect, 'ui-selected');
								}),
								unlessDead = _.partial(unless, connect, function(connect) {
									return connect.dead;
								}),
								hoverup = _.compose(hoverupLine, hoverupLabel, pointupArrowColor),
								hoverdown = _.compose(hoverdownLine, hoverdownLabel, pointdownAllowColor),
								select = _.compose(selectLine, selectLabel, hoverdownLine, hoverdownLabel, pointupArrowColor),
								deselect = _.compose(deselectLine, deselectLabel, pointdownAllowColor);

							return {
								pointup: unlessSelect(hoverup),
								pointdown: unlessSelect(hoverdown),
								select: delay30(unlessDead(select)),
								deselect: delay30(unlessDead(deselect))
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
						var arrangePosition = function() {
								connect.endpoints[0].repaint();
								connect.endpoints[1].repaint();

								// Re-set arrow disappered when setConnector is called.
								connect.removeOverlay('normal-arrow');
								connect.setConnector(['Bezier', {
									curviness: determineCurviness(connect.relationId)
								}]);
								connect.addOverlay(['Arrow', normalArrow]);
							},
							bindClickAction = function(onClick) {
								this.bind('click', onClick);
								this.getOverlay(label.id).bind('click', function(label, event) {
									onClick(label.component, event);
								});
							};

						return _.extend({
							// Set a function debounce to avoid over rendering.
							arrangePosition: debounce20(arrangePosition),
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
		render0: render0,
		render: render,
		change: changeType,
		changeModification: changeJsModification,
		remove: remove
	};
};
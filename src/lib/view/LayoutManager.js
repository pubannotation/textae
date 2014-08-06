    // Management position of annotation components.
   module.exports = function(editor, model, renderer, viewModel) {
   	var domPositionUtils = require('./DomPositionCache')(editor, model),
   		domUtil = require('../util/DomUtil')(editor),
   		filterChanged = function(span, newPosition) {
   			var oldGridPosition = domPositionUtils.getGrid(span.id);
   			if (!oldGridPosition || oldGridPosition.top !== newPosition.top || oldGridPosition.left !== newPosition.left) {
   				return newPosition;
   			} else {
   				return undefined;
   			}
   		},
   		arrangeRelationPosition = function(span) {
   			_.compact(
   				_.flatten(
   					span.getEntities().map(model.annotationData.entity.assosicatedRelations)
   				)
   				.map(domPositionUtils.toConnect)
   			).forEach(function(connect) {
   				connect.arrangePosition();
   			});
   			return span;
   		},
   		getGrid = function(span) {
   			if (span) {
   				return domUtil.selector.grid.get(span.id);
   			}
   		},
   		updateGridPositon = function(span, newPosition) {
   			if (newPosition) {
   				getGrid(span).css(newPosition);
   				domPositionUtils.setGrid(span.id, newPosition);
   				return span;
   			}
   		},
   		getNewPosition = function(span) {
   			var stickGridOnSpan = function(span) {
   				var spanPosition = domPositionUtils.getSpan(span.id);

   				return {
   					'top': spanPosition.top - getGrid(span).outerHeight(),
   					'left': spanPosition.left
   				};
   			};

   			var pullUpGridOverDescendants = function(span) {
   				// Culculate the height of the grid include descendant grids, because css style affects slowly.
   				var getHeightIncludeDescendantGrids = function(span) {
   					var descendantsMaxHeight = span.children.length === 0 ? 0 :
   						Math.max.apply(null, span.children.map(function(childSpan) {
   							return getHeightIncludeDescendantGrids(childSpan);
   						}));

   					var gridHeight = span.getTypes().length * (viewModel.viewMode.isTerm() ? 18 : 36);
   					return gridHeight + descendantsMaxHeight;
   				};

   				var spanPosition = domPositionUtils.getSpan(span.id);
   				var descendantsMaxHeight = getHeightIncludeDescendantGrids(span);

   				return {
   					'top': spanPosition.top - descendantsMaxHeight,
   					'left': spanPosition.left
   				};
   			};

   			if (span.children.length === 0) {
   				return stickGridOnSpan(span);
   			} else {
   				return pullUpGridOverDescendants(span);
   			}
   		},
   		filterVisibleGrid = function(grid) {
   			if (grid && grid.hasClass('hidden')) {
   				return grid;
   			}
   		},
   		showGrid = function(grid) {
   			if (grid) {
   				grid.removeClass('hidden');
   			}
   		},
   		arrangeGridPosition = function(span) {
   			var moveTheGridIfChange = _.compose(_.partial(updateGridPositon, span), _.partial(filterChanged, span), getNewPosition),
   				showInvisibleGrid = _.compose(showGrid, filterVisibleGrid, getGrid);

   			// The span may be remeved because this functon is call asynchronously.
   			if (model.annotationData.span.get(span.id)) {
   				// Move all relations because entities are increased or decreased unless the grid is moved.  
   				_.compose(showInvisibleGrid, moveTheGridIfChange, arrangeRelationPosition)(span);
   			}
   		},
   		arrangePositionAll = function() {
   			domPositionUtils.reset();

   			model.annotationData.span.all()
   				.filter(function(span) {
   					// There is at least one type in span that has a grid.
   					return span.getTypes().length > 0;
   				})
   				.forEach(function(span) {
   					_.defer(_.partial(arrangeGridPosition, span));
   				});
   		},
   		updateDisplay = _.debounce(arrangePositionAll, 10);

   	renderer.bind('change', updateDisplay);

   	return {
   		updateDisplay: updateDisplay
   	};
   };
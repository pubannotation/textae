var filterVisibleGrid = function(grid) {
      if (grid && grid.hasClass('hidden')) {
         return grid;
      }
   },
   showGrid = function(grid) {
      if (grid) {
         grid.removeClass('hidden');
      }
   };

// Management position of annotation components.
module.exports = function(editor, annotationData) {
   var domPositionCaChe = require('./DomPositionCache')(editor, annotationData.entity),
      domUtil = require('../util/DomUtil')(editor),
      filterChanged = function(span, newPosition) {
         var oldGridPosition = domPositionCaChe.getGrid(span.id);
         if (!oldGridPosition || oldGridPosition.top !== newPosition.top || oldGridPosition.left !== newPosition.left) {
            return newPosition;
         } else {
            return undefined;
         }
      },
      getGrid = function(span) {
         if (span) {
            return domUtil.selector.grid.get(span.id);
         }
      },
      updateGridPositon = function(span, newPosition) {
         if (newPosition) {
            getGrid(span).css(newPosition);
            domPositionCaChe.setGrid(span.id, newPosition);
            return span;
         }
      },
      getNewPosition = function(typeGapValue, span) {
         var stickGridOnSpan = function(span) {
            var spanPosition = domPositionCaChe.getSpan(span.id);

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

               var gridHeight = span.getTypes().length * (typeGapValue * 18 + 18);
               return gridHeight + descendantsMaxHeight;
            };

            var spanPosition = domPositionCaChe.getSpan(span.id);
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
      arrangeGridPosition = function(typeGapValue, span) {
         var moveTheGridIfChange = _.compose(
               _.partial(updateGridPositon, span),
               _.partial(filterChanged, span),
               _.partial(getNewPosition, typeGapValue)
            ),
            showInvisibleGrid = _.compose(showGrid, filterVisibleGrid, getGrid);

         // The span may be remeved because this functon is call asynchronously.
         if (annotationData.span.get(span.id)) {
            // Move all relations because entities are increased or decreased unless the grid is moved.  
            _.compose(showInvisibleGrid, moveTheGridIfChange)(span);
         }
      },
      arrangeGridPositionAll = function(typeGapValue) {
         annotationData.span.all()
            .filter(function(span) {
               // There is at least one type in span that has a grid.
               return span.getTypes().length > 0;
            })
            .map(function(span) {
               // Cache all span position because alternating between getting offset and setting offset.
               domPositionCaChe.getSpan(span.id);
               return span;
            })
            .forEach(_.partial(arrangeGridPosition, typeGapValue));
      },
      arrangePositionAll = function(typeGapValue) {
         domPositionCaChe.reset();
         arrangeGridPositionAll(typeGapValue);
      };

   return {
      arrangePosition: arrangePositionAll
   };
};
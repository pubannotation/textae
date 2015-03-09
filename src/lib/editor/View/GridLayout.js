var filterVisibleGrid = function(grid) {
    if (grid && grid.hasClass('hidden')) {
      return grid;
    }
  },
  showGrid = function(grid) {
    if (grid) {
      grid.removeClass('hidden');
    }
  },
  filterMoved = function(oldPosition, newPosition) {
    if (!oldPosition || oldPosition.top !== newPosition.top || oldPosition.left !== newPosition.left) {
      return newPosition;
    } else {
      return null;
    }
  },
  doIfSpan = function(func, span) {
    if (span) {
      return func(span.id);
    }
  },
  Promise = require('bluebird'),
  getGridPosition = require('./getGridPosition'),
  domUtil = require('../../util/domUtil');

// Management position of annotation components.
module.exports = function(editor, annotationData, typeContainer) {
  var domPositionCaChe = require('./DomPositionCache')(editor, annotationData.entity),
    getGridOfSpan = domUtil.selector.grid.get,
    getGrid = _.partial(doIfSpan, getGridOfSpan),
    updatePositionCache = function(span, newPosition) {
      if (newPosition) {
        domPositionCaChe.setGrid(span.id, newPosition);
        return span;
      }
    },
    updateGridPositon = function(span, newPosition) {
      if (newPosition) {
        getGrid(span).css(newPosition);
        return newPosition;
      }
    },
    arrangeGridPosition = function(typeGapValue, span) {
      var getNewPosition = _.partial(getGridPosition, domPositionCaChe.getSpan, getGridOfSpan, typeContainer, typeGapValue),
        moveTheGridIfChange = _.compose(
          _.partial(updatePositionCache, span),
          _.partial(updateGridPositon, span),
          _.partial(filterMoved, domPositionCaChe.getGrid(span.id)),
          _.partial(getNewPosition)
        ),
        showInvisibleGrid = _.compose(showGrid, filterVisibleGrid, getGrid);

      // The span may be remeved because this functon is call asynchronously.
      if (annotationData.span.get(span.id)) {
        // Move all relations because entities are increased or decreased unless the grid is moved.
        _.compose(showInvisibleGrid, moveTheGridIfChange)(span);
      }
    },
    arrangeGridPositionPromise = function(typeGapValue, span) {
      return new Promise(function(resolve, reject) {
        _.defer(function() {
          try {
            arrangeGridPosition(typeGapValue, span);
            resolve();
          } catch (error) {
            console.error(error, error.stack);
            reject();
          }
        });
      });
    },
    arrangeGridPositionAll = function(typeGapValue) {
      return annotationData.span.all()
        .filter(function(span) {
          // There is at least one type in span that has a grid.
          return span.getTypes().length > 0;
        })
        .map(function(span) {
          // Cache all span position because alternating between getting offset and setting offset.
          domPositionCaChe.getSpan(span.id);
          return span;
        })
        .map(_.partial(arrangeGridPositionPromise, typeGapValue));
    },
    arrangePositionAll = function(typeGapValue) {
      domPositionCaChe.reset();
      return Promise.all(arrangeGridPositionAll(typeGapValue));
    };

  return {
    arrangePosition: arrangePositionAll
  };
};

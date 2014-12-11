var stickGridOnSpan = function(getSpan, getGridOfSpan, span) {
    var spanPosition = getSpan(span.id);

    return {
      'top': spanPosition.top - getGridOfSpan(span.id).outerHeight(),
      'left': spanPosition.left
    };
  },
  pullUpGridOverDescendants = function(getSpan, typeGapValue, span) {
    // Culculate the height of the grid include descendant grids, because css style affects slowly.
    var getHeightIncludeDescendantGrids = function(span) {
      var descendantsMaxHeight = span.children.length === 0 ? 0 :
        Math.max.apply(null, span.children.map(function(childSpan) {
          return getHeightIncludeDescendantGrids(childSpan);
        }));

      var gridHeight = span.getTypes().filter(function(type) {
        //    console.log(type);
        return type.name !== 'Sentence';
      }).length * (typeGapValue * 18 + 18);
      return gridHeight + descendantsMaxHeight;
    };

    var spanPosition = getSpan(span.id);
    var descendantsMaxHeight = getHeightIncludeDescendantGrids(span);

    return {
      'top': spanPosition.top - descendantsMaxHeight,
      'left': spanPosition.left
    };
  };

module.exports = function(getSpan, getGridOfSpan, typeGapValue, span) {
  if (span.children.length === 0) {
    return stickGridOnSpan(getSpan, getGridOfSpan, span);
  } else {
    return pullUpGridOverDescendants(getSpan, typeGapValue, span);
  }
};

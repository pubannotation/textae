var exists = function(span) {
    return document.getElementById(span.id) !== null;
  },
  not = function(value) {
    return !value;
  },
  hasType = function(span, isBlock) {
    return span.getTypes()
      .map(function(type) {
        return type.name;
      })
      .filter(isBlock)
      .length > 0;
  };

module.exports = function(editor, model, typeContainer, entityRenderer, gridRenderer) {
  var domUtil = require('../../util/DomUtil')(editor),
    renderSingleSpan = require('./RenderSingleSpan')(editor),
    renderBlockOfSpan = function(span, clearCache) {
      var $span = domUtil.selector.span.get(span.id);

      if (hasType(span, typeContainer.entity.isBlock)) {
        $span.addClass('textae-editor__span--block');
      } else {
        $span.removeClass('textae-editor__span--block');
      }

      if (hasType(span, _.compose(not, typeContainer.entity.isBlock))) {
        if ($span.hasClass('textae-editor__span--wrap')) {
          // The span maybe move.
          $span.removeClass('textae-editor__span--wrap');
          if (clearCache) clearCache();
        }
      } else {
        $span.addClass('textae-editor__span--wrap');
      }

      return span;
    },
    renderEntitiesOfType = function(type) {
      type.entities.forEach(_.compose(entityRenderer.render, model.annotationData.entity.get));
    },
    renderEntitiesOfSpan = function(span) {
      span.getTypes()
        .forEach(renderEntitiesOfType);

      return span;
    },
    destroy = function(span) {
      var spanElement = document.getElementById(span.id),
        parent = spanElement.parentNode;

      // Move the textNode wrapped this span in front of this span.
      while (spanElement.firstChild) {
        parent.insertBefore(spanElement.firstChild, spanElement);
      }

      $(spanElement).remove();
      parent.normalize();

      // Destroy a grid of the span.
      gridRenderer.remove(span.id);
    },
    destroyChildrenSpan = function(span) {
      // Destroy DOM elements of descendant spans.
      var destroySpanRecurcive = function(span) {
        span.children.forEach(function(span) {
          destroySpanRecurcive(span);
        });
        destroy(span);
      };

      // Destroy rendered children.
      span.children.filter(exists).forEach(destroySpanRecurcive);

      return span;
    },
    renderChildresnSpan = function(span) {
      span.children.filter(_.compose(not, exists))
        .forEach(create);

      return span;
    },
    // Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
    create = _.compose(renderChildresnSpan, renderEntitiesOfSpan, renderBlockOfSpan, renderSingleSpan, destroyChildrenSpan);

  return {
    render: create,
    remove: destroy,
    change: renderBlockOfSpan
  };
};

var getPosition = function(span, textNodeStartPosition) {
		var startPos = span.begin - textNodeStartPosition;
		var endPos = span.end - textNodeStartPosition;
		return {
			start: startPos,
			end: endPos
		};
	},
	validatePosition = function(position, textNode, span) {
		if (position.start < 0 || textNode.length < position.end) {
			throw new Error('oh my god! I cannot render this span. ' + span.toStringOnlyThis() + ', textNode ' + textNode.textContent);
		}
	},
	createRange = function(textNode, position) {
		var range = document.createRange();
		range.setStart(textNode, position.start);
		range.setEnd(textNode, position.end);
		return range;
	},
	// Create the Range to a new span add 
	createSpanRange = function(span, textNodeStartPosition, textNode) {
		var position = getPosition(span, textNodeStartPosition);
		validatePosition(position, textNode, span);

		return createRange(textNode, position);
	},
	isTextNode = function() {
		return this.nodeType === 3; //TEXT_NODE
	},
	getFirstTextNode = function($element) {
		return $element.contents().filter(isTextNode).get(0);
	},
	getParagraphElement = function(paragraphId) {
		return $('#' + paragraphId);
	},
	createRangeForFirstSpan = function(getJqueryObjectFunc, span, textaeRange) {
		var getTextNode = _.compose(getFirstTextNode, getJqueryObjectFunc);
		var textNode = getTextNode(textaeRange.id);
		return createSpanRange(span, textaeRange.begin, textNode);
	},
	createRangeForFirstSpanInParagraph = _.partial(createRangeForFirstSpan, getParagraphElement),
	createSpanElement = function(span) {
		var element = document.createElement('span');
		element.setAttribute('id', span.id);
		element.setAttribute('title', span.id);
		element.setAttribute('class', 'textae-editor__span');
		return element;
	},
	exists = function(span) {
		return document.getElementById(span.id) !== null;
	},
	not = function(value) {
		return !value;
	};

module.exports = function(editor, model, viewModel, entityRenderer, gridRenderer) {
	var domUtil = require('../util/DomUtil')(editor),
		// Get the Range to that new span tag insert.
		// This function works well when no child span is rendered. 
		getRangeToInsertSpanTag = function(span) {
			var createRangeForFirstSpanInParent = _.partial(createRangeForFirstSpan, domUtil.selector.span.get);

			// The parent of the bigBrother is same with span, which is a span or the root of spanTree. 
			var bigBrother = span.getBigBrother();
			if (bigBrother) {
				// The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.
				return createSpanRange(span, bigBrother.end, document.getElementById(bigBrother.id).nextSibling);
			} else {
				// The target text arrounded by span is the first child of parent unless bigBrother exists.
				if (span.parent) {
					// The parent is span.
					// This span is first child of span.
					return createRangeForFirstSpanInParent(span, span.parent);
				} else {
					// The parent is paragraph
					return createRangeForFirstSpanInParagraph(span, span.paragraph);
				}
			}
		},
		appendSpanElement = function(span, element) {
			getRangeToInsertSpanTag(span).surroundContents(element);

			return span;
		},
		renderSingleSpan = function(span) {
			return appendSpanElement(span, createSpanElement(span));
		},
		isBlockSpan = function(span) {
			return span.getTypes().filter(function(type) {
				return viewModel.typeContainer.entity.isBlock(type.name);
			}).length > 0;
		},
		renderBlockOfSpan = function(span) {
			var $span = domUtil.selector.span.get(span.id);

			if (isBlockSpan(span)) {
				$span.addClass('textae-editor__span--block');
			} else {
				$span.removeClass('textae-editor__span--block');
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
			var spanElement = document.getElementById(span.id);
			var parent = spanElement.parentNode;

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
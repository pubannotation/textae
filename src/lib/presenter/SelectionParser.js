module.exports = function(editor, model) {
	var selectPosition = require('./selectPosition'),
		domUtil = require('../util/DomUtil')(editor),
		// A span cannot be created include nonEdgeCharacters only.
		hasCharacters = function(spanConfig, selection) {
			if (!selection) return false;

			var positions = selectPosition.toPositions(model.annotationData, selection),
				selectedString = model.annotationData.sourceDoc.substring(positions.anchorPosition, positions.focusPosition),
				stringWithoutBlankCharacters = spanConfig.removeBlankChractors(selectedString);

			return stringWithoutBlankCharacters.length > 0;
		},
		isInOneParent = function(selection) {
			// A span can be created at the same parent node.
			// The parentElement is expected as a paragraph or a span.
			return selection.anchorNode.parentElement.id === selection.focusNode.parentElement.id;
		},
		getAnchorNodeParent = function(selection) {
			return $(selection.anchorNode.parentNode);
		},
		getFocusNodeParent = function(selection) {
			return $(selection.focusNode.parentNode);
		},
		hasSpan = function($node) {
			return $node.hasClass('textae-editor__span');
		},
		hasParagraphs = function($node) {
			return $node.hasClass('textae-editor__body__text-box__paragraph');
		},
		hasSpanOrParagraphs = function($node) {
			return hasSpan($node) || hasParagraphs($node);
		},
		isAnchrNodeInSpan = _.compose(hasSpan, getAnchorNodeParent),
		isFocusNodeInSpan = _.compose(hasSpan, getFocusNodeParent),
		isFocusNodeInParagraph = _.compose(hasParagraphs, getFocusNodeParent),
		isAnchrNodeInSpanOrParagraph = _.compose(hasSpanOrParagraphs, getAnchorNodeParent),
		isInSameParagraph = function() {
			var getParagraph = function($node) {
					if (hasParagraphs($node)) {
						return $node;
					} else if (hasSpan($node)) {
						return getParagraph($node.parent());
					} else {
						return null;
					}
				},
				getParagraphId = function(selection, position) {
					var $parent = $(selection[position + 'Node'].parentNode),
						$paragraph = getParagraph($parent);
					return $paragraph && $paragraph.attr('id');
				};

			return function(selection) {
				var anchorParagraphId = getParagraphId(selection, 'anchor'),
					focusParagraphId = getParagraphId(selection, 'focus');

				return anchorParagraphId === focusParagraphId;
			};
		}(),
		isAnchorOneDownUnderForcus = function(selection) {
			return selection.anchorNode.parentNode.parentNode === selection.focusNode.parentNode;
		},
		isForcusOneDownUnderAnchor = function(selection) {
			return selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode;
		},
		isInSelectedSpan = function(position) {
			var spanId = model.selectionModel.span.single();
			if (spanId) {
				var selectedSpan = model.annotationData.span.get(spanId);
				return selectedSpan.begin < position && position < selectedSpan.end;
			}
			return false;
		},
		isAnchorInSelectedSpan = function(selection) {
			return isInSelectedSpan(selectPosition.getAnchorPosition(model.annotationData, selection));
		},
		isFocusOnSelectedSpan = function(selection) {
			return selection.focusNode.parentNode.id === model.selectionModel.span.single();
		},
		isFocusInSelectedSpan = function(selection) {
			return isInSelectedSpan(selectPosition.getFocusPosition(model.annotationData, selection));
		},
		isSelectedSpanOneDownUnderFocus = function(selection) {
			var selectedSpanId = model.selectionModel.span.single();
			return domUtil.selector.span.get(selectedSpanId).parent().attr('id') === selection.focusNode.parentNode.id;
		},
		isLongerThanParentSpan = function(selection) {
			var $getAnchorNodeParent = getAnchorNodeParent(selection),
				focusPosition = selectPosition.getFocusPosition(model.annotationData, selection);

			if (hasSpan($getAnchorNodeParent) && $getAnchorNodeParent.parent() && hasSpan($getAnchorNodeParent.parent())) {
				var span = model.annotationData.span.get($getAnchorNodeParent.parent().attr('id'));
				if (focusPosition < span.begin || span.end < focusPosition)
					return true;
			}
		},
		isShorterThanChildSpan = function(selection) {
			var $getFocusNodeParent = getFocusNodeParent(selection),
				anchorPosition = selectPosition.getAnchorPosition(model.annotationData, selection);

			if (hasSpan($getFocusNodeParent) && $getFocusNodeParent.parent() && hasSpan($getFocusNodeParent.parent())) {
				var span = model.annotationData.span.get($getFocusNodeParent.parent().attr('id'));
				if (anchorPosition < span.begin || span.end < anchorPosition)
					return true;
			}
		};

	return {
		hasCharacters: hasCharacters,
		isInOneParent: isInOneParent,
		isAnchrNodeInSpan: isAnchrNodeInSpan,
		isAnchrNodeInSpanOrParagraph: isAnchrNodeInSpanOrParagraph,
		isFocusNodeInSpan: isFocusNodeInSpan,
		isFocusNodeInParagraph: isFocusNodeInParagraph,
		isInSameParagraph: isInSameParagraph,
		isAnchorOneDownUnderForcus: isAnchorOneDownUnderForcus,
		isForcusOneDownUnderAnchor: isForcusOneDownUnderAnchor,
		isAnchorInSelectedSpan: isAnchorInSelectedSpan,
		isFocusOnSelectedSpan: isFocusOnSelectedSpan,
		isFocusInSelectedSpan: isFocusInSelectedSpan,
		isSelectedSpanOneDownUnderFocus: isSelectedSpanOneDownUnderFocus,
		isLongerThanParentSpan: isLongerThanParentSpan,
		isShorterThanChildSpan: isShorterThanChildSpan
	};
};
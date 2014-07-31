module.exports = function(editor, model, spanConfig, command, view) {
	var selectionValidator = function(editor, model, spanConfig) {
			var spanAdjuster = require('./SpanAdjuster')(spanConfig, model.annotationData),
				domUtil = require('../util/DomUtil')(editor),
				hasCharacters = function(selection) {
					var positions = spanAdjuster.toPositions(selection);

					// A span cannot be created include nonEdgeCharacters only.
					var stringWithoutNonEdgeCharacters = model.annotationData.sourceDoc.substring(positions.anchorPosition, positions.focusPosition);
					spanConfig.nonEdgeCharacters.forEach(function(char) {
						stringWithoutNonEdgeCharacters = stringWithoutNonEdgeCharacters.replace(char, '');
					});

					return stringWithoutNonEdgeCharacters.length > 0;
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
							} else {
								return getParagraph($node.parent());
							}
						},
						getParagraphId = function(selection, position) {
							var $parent = $(selection[position + 'Node'].parentNode);
							return getParagraph($parent).attr('id');
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
					return isInSelectedSpan(spanAdjuster.getAnchorPosition(selection));
				},
				isFocusOnSelectedSpan = function(selection) {
					return selection.focusNode.parentNode.id === model.selectionModel.span.single();
				},
				isFocusInSelectedSpan = function(selection) {
					return isInSelectedSpan(spanAdjuster.getFocusPosition(selection));
				},
				isSelectedSpanOneDownUnderFocus = function(selection) {
					var selectedSpanId = model.selectionModel.span.single();
					return domUtil.selector.span.get(selectedSpanId).parent().attr('id') === selection.focusNode.parentNode.id;
				},
				isLongerThanParentSpan = function(selection) {
					var $getAnchorNodeParent = getAnchorNodeParent(selection),
						focusPosition = spanAdjuster.getFocusPosition(selection);

					if (hasSpan($getAnchorNodeParent) && $getAnchorNodeParent.parent() && hasSpan($getAnchorNodeParent.parent())) {
						var span = model.annotationData.span.get($getAnchorNodeParent.parent().attr('id'));
						if (focusPosition < span.begin || span.end < focusPosition)
							return true;
					}
				},
				isShorterThanChildSpan = function(selection) {
					var $getFocusNodeParent = getFocusNodeParent(selection),
						anchorPosition = spanAdjuster.getAnchorPosition(selection);

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
		}(editor, model, spanConfig),
		dismissBrowserSelection = require('./dismissBrowserSelection'),
		validate = function(selectionValidator) {
			var boundaryMiss = function() {
					alert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
					dismissBrowserSelection();
				},
				doUnless = function(doFunc, predicate, selection) {
					if (selection && !predicate(selection)) {
						return doFunc();
					}
					return selection;
				},
				cancelSelectionUnless = _.partial(doUnless, dismissBrowserSelection),
				validateAnchrNodeInSpanOrParagraph = _.partial(
					cancelSelectionUnless,
					selectionValidator.isAnchrNodeInSpanOrParagraph
				),
				validateFocusNodeInParagraph = _.partial(
					cancelSelectionUnless,
					selectionValidator.isFocusNodeInParagraph
				),
				validateFocusNodeInSpan = _.partial(
					cancelSelectionUnless,
					selectionValidator.isFocusNodeInSpan
				),
				validateInSameParagrarh = _.partial(
					doUnless,
					boundaryMiss,
					selectionValidator.isInSameParagraph
				),
				validateHasCharactor = _.partial(
					cancelSelectionUnless,
					selectionValidator.hasCharacters
				),
				commonValidate = _.partial(
					_.compose,
					validateHasCharactor,
					validateInSameParagrarh,
					validateAnchrNodeInSpanOrParagraph
				),
				validateOnText = commonValidate(
					validateFocusNodeInParagraph
				),
				validateOnSpan = commonValidate(
					validateFocusNodeInSpan
				);

			return {
				validateOnText: validateOnText,
				validateOnSpan: validateOnSpan
			};
		}(selectionValidator),
		process = function(editor, model, spanConfig, selectionValidator, command) {
			var spanManipulater = require('./SpanManipulater')(spanConfig, model),
				idFactory = require('../util/IdFactory')(editor),
				moveSpan = function(spanId, begin, end) {
					// Do not need move.
					if (spanId === idFactory.makeSpanId(begin, end)) {
						return;
					}

					return [command.factory.spanMoveCommand(spanId, begin, end)];
				},
				removeSpan = function(spanId) {
					return [command.factory.spanRemoveCommand(spanId)];
				},
				doCreate = function(selection) {
					var BLOCK_THRESHOLD = 100,
						newSpan = spanManipulater.create(selection);

					// The span cross exists spans.
					if (model.annotationData.isBoundaryCrossingWithOtherSpans({
						begin: newSpan.begin,
						end: newSpan.end
					})) {
						dismissBrowserSelection();
						return;
					}

					// The span exists already.
					var spanId = idFactory.makeSpanId(newSpan.begin, newSpan.end);
					if (model.annotationData.span.get(spanId)) {
						dismissBrowserSelection();
						return;
					}

					var commands = [command.factory.spanCreateCommand(
						view.viewModel.typeContainer.entity.getDefaultType(), {
							begin: newSpan.begin,
							end: newSpan.end
						}
					)];

					if (view.viewModel.modeAccordingToButton['replicate-auto'].value() && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
						commands.push(command.factory.spanReplicateCommand(
							view.viewModel.typeContainer.entity.getDefaultType(), {
								begin: newSpan.begin,
								end: newSpan.end
							}));
					}

					command.invoke(commands);
					dismissBrowserSelection();
				},
				doExpand = function() {
					var expandSpanToSelection = function(spanId, selection) {
						var newSpan = spanManipulater.expand(spanId, selection);

						// The span cross exists spans.
						if (model.annotationData.isBoundaryCrossingWithOtherSpans({
							begin: newSpan.begin,
							end: newSpan.end
						})) {
							alert('A span cannot be expanded to make a boundary crossing.');
							dismissBrowserSelection();
							return;
						}

						var commands = moveSpan(spanId, newSpan.begin, newSpan.end);
						command.invoke(commands);
						dismissBrowserSelection();
					};

					return function(selection) {
						// If a span is selected, it is able to begin drag a span in the span and expand the span.
						// The focus node should be at one level above the selected node.
						if (selectionValidator.isAnchorInSelectedSpan(selection)) {
							// cf.
							// 1. one side of a inner span is same with one side of the outside span.
							// 2. Select an outside span.
							// 3. Begin Drug from an inner span to out of an outside span. 
							// Expand the selected span.
							expandSpanToSelection(model.selectionModel.span.single(), selection);
						} else if (selectionValidator.isAnchorOneDownUnderForcus(selection)) {
							// To expand the span , belows are needed:
							// 1. The anchorNode is in the span.
							// 2. The foucusNode is out of the span and in the parent of the span.
							expandSpanToSelection(selection.anchorNode.parentNode.id, selection);
						}
						return selection;
					};
				}(),
				doShrink = function() {
					var shrinkSpanToSelection = function(spanId, selection) {
						var newSpan = spanManipulater.shrink(spanId, selection);

						// The span cross exists spans.
						if (model.annotationData.isBoundaryCrossingWithOtherSpans({
							begin: newSpan.begin,
							end: newSpan.end
						})) {
							alert('A span cannot be shrinked to make a boundary crossing.');
							dismissBrowserSelection();
							return;
						}

						var newSpanId = idFactory.makeSpanId(newSpan.begin, newSpan.end),
							sameSpan = model.annotationData.span.get(newSpanId),
							commands = newSpan.begin < newSpan.end && !sameSpan ?
							moveSpan(spanId, newSpan.begin, newSpan.end) :
							removeSpan(spanId);

						command.invoke(commands);
						dismissBrowserSelection();
					};

					return function(selection) {
						if (selectionValidator.isFocusInSelectedSpan(selection)) {
							// If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
							// The focus node should be at the selected node.
							// cf.
							// 1. Select an inner span.
							// 2. Begin Drug from out of an outside span to the selected span. 
							// Shrink the selected span.
							shrinkSpanToSelection(model.selectionModel.span.single(), selection);
						} else if (selectionValidator.isForcusOneDownUnderAnchor(selection)) {
							// To shrink the span , belows are needed:
							// 1. The anchorNode out of the span and in the parent of the span.
							// 2. The foucusNode is in the span.
							shrinkSpanToSelection(selection.focusNode.parentNode.id, selection);
						}
						return selection;
					};
				}(),
				processSelectionIf = function(doFunc, predicate, selection) {
					if (selection && predicate(selection)) {
						return doFunc(selection);
					}
					return selection;
				},
				create = _.partial(processSelectionIf, doCreate, selectionValidator.isInOneParent),
				expand = _.partial(processSelectionIf, doExpand, selectionValidator.isAnchrNodeInSpan),
				shrink = _.partial(processSelectionIf, doShrink, selectionValidator.isFocusNodeInSpan),
				dismissUnlessProcess = _.partial(processSelectionIf, dismissBrowserSelection, function() {
					return true;
				}),
				selectEndOfText = _.compose(dismissUnlessProcess, expand, create, validate.validateOnText),
				selectEndOnSpan = _.compose(dismissUnlessProcess, shrink, expand, create, validate.validateOnSpan);

			return {
				selectEndOfText: selectEndOfText,
				selectEndOnSpan: selectEndOnSpan
			};
		}(editor, model, spanConfig, selectionValidator, command, view);

	return {
		onText: process.selectEndOfText,
		onSpan: process.selectEndOnSpan
	};
};
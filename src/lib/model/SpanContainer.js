var idFactory = require('../util/IdFactory');

module.exports = function(editor, annotationDataApi, paragraph) {
	var toSpanModel = function() {
			var spanExtension = {
				isChildOf: function(maybeParent) {
					if (!maybeParent) return false;

					var id = idFactory.makeSpanId(editor, maybeParent);
					if (!spanContainer.get(id)) throw new Error('maybeParent is removed. ' + maybeParent.toStringOnlyThis());

					return maybeParent.begin <= this.begin && this.end <= maybeParent.end;
				},
				//for debug. print myself only.
				toStringOnlyThis: function() {
					return "span " + this.begin + ":" + this.end + ":" + annotationDataApi.sourceDoc.substring(this.begin, this.end);
				},
				//for debug. print with children.
				toString: function(depth) {
					depth = depth || 1; //default depth is 1

					var childrenString = this.children && this.children.length > 0 ?
						"\n" + this.children.map(function(child) {
							return new Array(depth + 1).join("\t") + child.toString(depth + 1);
						}).join("\n") : "";

					return this.toStringOnlyThis() + childrenString;
				},
				// A big brother is brother node on a structure at rendered.
				// There is no big brother if the span is first in a paragraph.
				// Warning: parent is set at updateSpanTree, is not exists now.
				getBigBrother: function() {
					var index;
					if (this.parent) {
						index = this.parent.children.indexOf(this);
						return index === 0 ? null : this.parent.children[index - 1];
					} else {
						index = spanTopLevel.indexOf(this);
						return index === 0 || spanTopLevel[index - 1].paragraph !== this.paragraph ? null : spanTopLevel[index - 1];
					}
				},
				// Get online for update is not grantieed.
				getTypes: function() {
					var spanId = this.id;

					// Return an array of type like { id : "editor2__S1741_1755-1", name: "Negative_regulation", entities: ["E16", "E17"] }.
					return annotationDataApi.entity.all()
						.filter(function(entity) {
							return spanId === entity.span;
						})
						.reduce(function(a, b) {
							var typeId = idFactory.makeTypeId(b.span, b.type);

							var type = a.filter(function(type) {
								return type.id === typeId;
							});

							if (type.length > 0) {
								type[0].entities.push(b.id);
							} else {
								a.push({
									id: typeId,
									name: b.type,
									entities: [b.id]
								});
							}
							return a;
						}, []);
				},
				getEntities: function() {
					return _.flatten(this.getTypes().map(function(type) {
						return type.entities;
					}));
				}
			};

			return function(span) {
				return $.extend({},
					span, {
						id: idFactory.makeSpanId(editor, span),
						paragraph: paragraph.getBelongingTo(span),
					},
					spanExtension);
			};
		}(),
		isBoundaryCrossingWithOtherSpans = require('./isBoundaryCrossingWithOtherSpans'),
		mappingFunction = function(denotations) {
			denotations = denotations || [];
			return denotations.map(function(entity) {
					return entity.span;
				}).map(toSpanModel)
				.filter(function(span, index, array) {
					return !isBoundaryCrossingWithOtherSpans(
						array.slice(0, index - 1),
						span
					);
				});
		},
		spanContainer = require('./ModelContainer')(annotationDataApi, 'span', mappingFunction),
		spanTopLevel = [],
		adopt = function(parent, span) {
			parent.children.push(span);
			span.parent = parent;
		},
		getParet = function(parent, span) {
			if (span.isChildOf(parent)) {
				return parent;
			} else {
				if (parent.parent) {
					return getParet(parent.parent, span);
				} else {
					return null;
				}
			}
		},
		updateSpanTree = function() {
			// Sort id of spans by the position.
			var sortedSpans = spanContainer.all().sort(spanComparator);

			// the spanTree has parent-child structure.
			var spanTree = [];

			sortedSpans
				.map(function(span, index, array) {
					return $.extend(span, {
						// Reset parent
						parent: null,
						// Reset children
						children: [],
						// Order by position
						left: index !== 0 ? array[index - 1] : null,
						right: index !== array.length - 1 ? array[index + 1] : null,
					});
				})
				.forEach(function(span) {
					if (span.left) {
						var parent = getParet(span.left, span);
						if (parent) {
							adopt(parent, span);
						} else {
							spanTree.push(span);
						}
					} else {
						spanTree.push(span);
					}
				});

			//this for debug.
			spanTree.toString = function() {
				return this.map(function(span) {
					return span.toString();
				}).join("\n");
			};
			// console.log(spanTree.toString());

			spanTopLevel = spanTree;
		},
		spanComparator = function(a, b) {
			return a.begin - b.begin || b.end - a.end;
		},
		api = {

			//expected span is like { "begin": 19, "end": 49 }
			add: function(span) {
				if (span)
					return spanContainer.add(toSpanModel(span), updateSpanTree);
				throw new Error('span is undefined.');
			},
			addSource: function(spans) {
				spanContainer.addSource(spans);
				updateSpanTree();
			},
			get: function(spanId) {
				return spanContainer.get(spanId);
			},
			all: spanContainer.all,
			range: function(firstId, secondId) {
				var first = spanContainer.get(firstId);
				var second = spanContainer.get(secondId);

				//switch if seconfId before firstId
				if (spanComparator(first, second) > 0) {
					var temp = first;
					first = second;
					second = temp;
				}

				return spanContainer.all()
					.filter(function(span) {
						return first.begin <= span.begin && span.end <= second.end;
					})
					.map(function(span) {
						return span.id;
					});
			},
			topLevel: function() {
				return spanTopLevel;
			},
			multiEntities: function() {
				return spanContainer.all()
					.filter(function(span) {
						var multiEntitiesTypes = span.getTypes().filter(function(type) {
							return type.entities.length > 1;
						});

						return multiEntitiesTypes.length > 0;
					});
			},
			remove: spanContainer.remove,
			clear: function() {
				spanContainer.clear();
				spanTopLevel = [];
			}
		};

	return api;
};

    var editor = function() {
        // constant values
        var CONSTS = {
            BLOCK_THRESHOLD: 100
        };

        // A sub component to save and load data.
        var dataAccessObject = function(self) {
            //load/saveDialog
            var loadSaveDialog = function() {
                var getLoadDialog = function() {
                    var $content = $('<div>')
                        .append('<div>Sever :<input type="text" class="textae-editor__load-dialog__file-name" /><input type="button" value="OK" /></div>')
                        .append('<div>Local :<input type="file" /></div>')
                        .on('change', '[type="file"]',
                            function() {
                                dataAccessObject.getAnnotationFromFile(this);
                                $content.dialogClose();
                            })
                        .on('click', '[type="button"]',
                            function() {
                                var url = $content.find('.textae-editor__load-dialog__file-name').val();
                                dataAccessObject.getAnnotationFromServer(url);
                                $content.dialogClose();
                            });

                    return textAeUtil.getDialog(self.editorId, 'textae.dialog.load', 'Load document with annotation.', $content);
                };

                var getSaveDialog = function() {
                    var $content = $('<div>')
                        .append('<div>Sever :<input type="text" class="textae-editor__save-dialog__file-name" /><input type="button" value="OK" /></div>')
                        .append('<div>Local :<span class="span_link_place"><a target="_blank"/></span></div>')
                        .on('click', 'a', function() {
                            controller.command.updateSavePoint();
                            $content.dialogClose();
                        })
                        .on('click', '[type="button"]', function() {
                            var url = $content.find('.textae-editor__save-dialog__file-name').val();
                            dataAccessObject.saveAnnotationToServer(url);
                            $content.dialogClose();
                        });

                    return textAeUtil.getDialog(self.editorId, 'textae.dialog.save', 'Save document with annotation.', $content);
                };

                return {
                    showLoad: function(url) {
                        getLoadDialog().open(url);
                    },
                    showSave: function(url, downloadPath) {
                        var createFileLink = function($save_dialog, downloadPath) {
                            var $fileInput = getLoadDialog().find("input[type='file']");

                            var file = $fileInput.prop('files')[0];
                            var name = file ? file.name : 'annotations.json';
                            var link = $save_dialog.find('a')
                                .text(name)
                                .attr('href', downloadPath)
                                .attr('download', name);
                        };

                        var $dialog = getSaveDialog();

                        //create local link
                        createFileLink($dialog, downloadPath);

                        //open dialog
                        $dialog.open(url);
                    }
                };
            }();

            var getMessageArea = function() {
                $messageArea = self.find('.textae-editor__footer .textae-editor__footer__message');
                if ($messageArea.length === 0) {
                    $messageArea = $("<div>").addClass("textae-editor__footer__message");
                    var $footer = $("<div>")
                        .addClass("textae-editor__footer")
                        .append($messageArea);
                    self.append($footer);
                }

                return $messageArea;
            };

            var showSaveSuccess = function() {
                getMessageArea().html("annotation saved").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    setDataSourceUrl(dataSourceUrl);
                });
                controller.command.updateSavePoint();
                view.domUtil.cursorChanger.endWait();
            };

            var showSaveError = function() {
                getMessageArea().html("could not save").fadeIn().fadeOut(5000, function() {
                    $(this).html('').removeAttr('style');
                    setDataSourceUrl(dataSourceUrl);
                });
                view.domUtil.cursorChanger.endWait();
            };

            var setDataSourceUrl = function(url) {
                if (url !== "") {
                    var targetDoc = url.replace(/\/annotations\.json$/, '');
                    getMessageArea().html("(Target: <a href='" + targetDoc + "'>" + targetDoc + "</a>)");
                    dataSourceUrl = url;
                }
            };

            var dataSourceUrl = "";

            return {
                getAnnotationFromServer: function(url) {
                    view.domUtil.cursorChanger.startWait();
                    textAeUtil.ajaxAccessor.getAsync(url, function getAnnotationFromServerSuccess(annotation) {
                        controller.command.reset(annotation);
                        setDataSourceUrl(url);
                    }, function() {
                        view.domUtil.cursorChanger.endWait();
                    });
                },
                getAnnotationFromFile: function(fileEvent) {
                    var reader = new FileReader();
                    reader.onload = function() {
                        var annotation = JSON.parse(this.result);
                        controller.command.reset(annotation);
                    };
                    reader.readAsText(fileEvent.files[0]);
                },
                saveAnnotationToServer: function(url) {
                    view.domUtil.cursorChanger.startWait();
                    var postData = model.annotationData.toJson();
                    textAeUtil.ajaxAccessor.post(url, postData, showSaveSuccess, showSaveError, function() {
                        view.domUtil.cursorChanger.endWait();
                    });
                    controller.command.updateSavePoint();
                },
                showAccess: function() {
                    loadSaveDialog.showLoad(dataSourceUrl);
                },
                showSave: function() {
                    var createSaveFile = function(contents) {
                        var blob = new Blob([contents], {
                            type: 'application/json'
                        });
                        return URL.createObjectURL(blob);
                    };

                    loadSaveDialog.showSave(dataSourceUrl, createSaveFile(model.annotationData.toJson()));
                },
            };
        }(this);

        var idFactory = function(editor) {
            var typeCounter = [];
            return {
                // The ID of spans has editorId and begin and end, like 'editor1__S0_15'.
                makeSpanId: function(begin, end) {
                    return editor.editorId + '__S' + begin + '_' + end;
                },
                // Get a span object from the spanId.
                parseSpanId: function(spanId) {
                    var beginEnd = spanId.replace(editor.editorId + '__S', '').split('_');
                    return {
                        begin: beginEnd[0],
                        end: beginEnd[1]
                    };
                },
                // The ID of type has number of type.
                // This IDs are used for id of DOM element and css selector for jQuery.
                // But types are inputed by users and may have `!"#$%&'()*+,./:;<=>?@[\]^`{|}~` which can not be used for css selecor. 
                makeTypeId: function(spanId, type) {
                    if (typeCounter.indexOf(type) === -1) {
                        typeCounter.push(type);
                    }
                    return spanId + '-' + typeCounter.indexOf(type);
                },
                makeEntityDomId: function(entityId) {
                    return editor.editorId + '__E' + entityId;
                },
                makeParagraphId: function(index) {
                    return editor.editorId + '__P' + index;
                }
            };
        }(this);

        // model manages data objects.
        var model = makeModel(idFactory);

        var view = function(editor) {
            // The cachedConnectors has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
            // This is refered by view.render.relation and view.domUtil.selector.relation.
            var cachedConnectors = {};
            var toConnector = function(relationId) {
                return cachedConnectors[relationId];
            };

            // Data for view.
            var viewModel = function() {
                var createTypeContainer = function(getActualTypesFunction, defaultColor) {
                    var definedTypes = {},
                        defaultType = 'something';

                    return {
                        setDefinedTypes: function(newDefinedTypes) {
                            definedTypes = newDefinedTypes;
                        },
                        setDefaultType: function(name) {
                            defaultType = name;
                        },
                        getDefaultType: function() {
                            return defaultType || this.getSortedNames()[0];
                        },
                        getColor: function(name) {
                            return definedTypes[name] && definedTypes[name].color || defaultColor;
                        },
                        getUri: function(name) {
                            return definedTypes[name] && definedTypes[name].uri || undefined;
                        },
                        getSortedNames: function() {
                            if (getActualTypesFunction) {
                                var typeCount = getActualTypesFunction()
                                    .concat(Object.keys(definedTypes))
                                    .reduce(function(a, b) {
                                        a[b] = a[b] ? a[b] + 1 : 1;
                                        return a;
                                    }, {});

                                // Sort by number of types, and by name if numbers are same.
                                var typeNames = Object.keys(typeCount);
                                typeNames.sort(function(a, b) {
                                    var diff = typeCount[b] - typeCount[a];
                                    return diff !== 0 ? diff :
                                        a > b ? 1 :
                                        b < a ? -1 :
                                        0;
                                });

                                return typeNames;
                            } else {
                                return [];
                            }
                        }
                    };
                };

                var setContainerDefinedTypes = function(container, newDefinedTypes) {
                    // expected newDefinedTypes is an array of object. example of object is {"name": "Regulation","color": "#FFFF66","default": true}.
                    if (newDefinedTypes !== undefined) {
                        container.setDefinedTypes(
                            newDefinedTypes.map(function(type) {
                                return type;
                            }).reduce(function(a, b) {
                                a[b.name] = b;
                                return a;
                            }, {})
                        );

                        container.setDefaultType(
                            newDefinedTypes.filter(function(type) {
                                return type["default"] === true;
                            }).map(function(type) {
                                return type.name;
                            }).shift() || ''
                        );
                    }
                };

                var entityContainer = createTypeContainer(model.annotationData.getEntityTypes, '#77DDDD');
                var relationContaier = createTypeContainer(model.annotationData.getRelationTypes, '#555555');

                return {
                    // view.viewModel.clipBoard has entity id only.
                    clipBoard: [],
                    // Modes accoding to buttons of control.
                    modeAccordingToButton: function() {
                        // Functions to propagate to each buttons.
                        var propagateFunctions = [];

                        // The public object.
                        var ret = {
                            propagate: function() {
                                propagateFunctions.forEach(function(func) {
                                    func();
                                });
                            }
                        };

                        var setupButton = _.partial(function bindButton(ret, propagateFunctions, buttonName) {
                            // Button state is true when the button is pushed.
                            var buttonState = false;

                            // Propagate button state to the tool.
                            var push = function() {
                                editor.tool.push(buttonName, buttonState);
                            };

                            // Set property to public object.
                            ret[buttonName] = {
                                value: function(newValue) {
                                    if (newValue !== undefined) {
                                        buttonState = newValue;
                                        push();
                                    } else {
                                        return buttonState;
                                    }
                                },
                                toggle: function toggleButton() {
                                    buttonState = !buttonState;
                                    push();
                                }
                            };

                            // Set propagate functions. They will be called when the editor is switched.
                            propagateFunctions.push(push);
                        }, ret, propagateFunctions);

                        // Set up buttons value and function.
                        ['replicate-auto', 'relation-edit-mode'].forEach(setupButton);

                        return ret;
                    }(),
                    // Helper to update button state. 
                    buttonStateHelper: function() {
                        var isEntityOrRelationSelected = function() {
                            return view.domUtil.selector.entity.hasSelecteds() || view.domUtil.selector.relation.hasSelecteds();
                        };
                        var disableButtons = {};
                        var updateDisableButtons = function(button, enable) {
                            if (enable) {
                                delete disableButtons[button];
                            } else {
                                disableButtons[button] = false;
                            }
                        };
                        var updateEntity = function() {
                            updateDisableButtons("entity", view.domUtil.selector.span.hasSelecteds());
                        };
                        var updatePaste = function() {
                            updateDisableButtons("paste", view.viewModel.clipBoard.length > 0 && view.domUtil.selector.span.hasSelecteds());
                        };
                        var updateReplicate = function() {
                            updateDisableButtons("replicate", view.domUtil.selector.span.isSelectOne());
                        };
                        var updatePallet = function() {
                            updateDisableButtons("pallet", isEntityOrRelationSelected());
                        };
                        var updateNewLabel = function() {
                            updateDisableButtons("change-label", isEntityOrRelationSelected());
                        };
                        var updateDelete = function() {
                            updateDisableButtons("delete", view.domUtil.selector.hasSelecteds());
                        };
                        var updateCopy = function() {
                            updateDisableButtons("copy", view.domUtil.selector.span.hasSelecteds() || view.domUtil.selector.entity.hasSelecteds());
                        };
                        var updateBySpanAndEntityBoth = function() {
                            updateDelete();
                            updateCopy();
                        };
                        return {
                            propagate: function() {
                                editor.tool.changeButtonState(disableButtons);
                                view.viewModel.modeAccordingToButton.propagate();
                            },
                            init: function() {
                                updateBySpanAndEntityBoth();

                                updateEntity();
                                updatePaste();
                                updateReplicate();
                                updatePallet();
                                updateNewLabel();

                                this.propagate();
                            },
                            enabled: function(button, enable) {
                                updateDisableButtons(button, enable);
                                this.propagate();
                            },
                            updateBySpan: function() {
                                updateBySpanAndEntityBoth();

                                updateEntity();
                                updatePaste();
                                updateReplicate();

                                this.propagate();
                            },
                            updateByEntity: function() {
                                updateBySpanAndEntityBoth();

                                updatePallet();
                                updateNewLabel();

                                this.propagate();
                            },
                            updateByRelation: function() {
                                updateDelete();
                                updatePallet();
                                updateNewLabel();

                                this.propagate();
                            }
                        };
                    }(),
                    viewMode: function() {
                        var changeCssClass = function(mode) {
                                editor
                                    .removeClass('textae-editor_term-mode')
                                    .removeClass('textae-editor_instance-mode')
                                    .removeClass('textae-editor_relation-mode')
                                    .addClass('textae-editor_' + mode + '-mode');
                            },
                            setRelationEditButtonPushed = function(push) {
                                view.viewModel.modeAccordingToButton['relation-edit-mode'].value(push);
                            };

                        return {
                            // This is base value to calculate the position of grids.
                            // Grids cannot be set positon by 'margin-bottom' style.
                            // Because grids is setted 'positin:absolute' style in the overlay over spans.
                            // So we caluclate and set 'top' of grids in functions of 'view.renderer.grid'. 
                            marginBottomOfGrid: 0,
                            isTerm: function() {
                                return editor.hasClass('textae-editor_term-mode');
                            },
                            setTerm: function() {
                                changeCssClass('term');
                                setRelationEditButtonPushed(false);

                                view.viewModel.viewMode.marginBottomOfGrid = 0;
                            },
                            setInstance: function() {
                                changeCssClass('instance');
                                setRelationEditButtonPushed(false);

                                view.viewModel.viewMode.marginBottomOfGrid = 2;
                            },
                            setRelation: function() {
                                changeCssClass('relation');
                                setRelationEditButtonPushed(true);

                                view.viewModel.viewMode.marginBottomOfGrid = 2;
                            }
                        };
                    }(),
                    typeContainer: {
                        entity: entityContainer,
                        setDefinedEntityTypes: _.partial(setContainerDefinedTypes, entityContainer),
                        relation: relationContaier,
                        setDefinedRelationTypes: _.partial(setContainerDefinedTypes, relationContaier)
                    },
                    getConnectorStrokeStyle: function(relationId) {
                        var converseHEXinotRGBA = function(color, opacity) {
                            var c = color.slice(1);
                            r = parseInt(c.substr(0, 2), 16);
                            g = parseInt(c.substr(2, 2), 16);
                            b = parseInt(c.substr(4, 2), 16);

                            return 'rgba(' + r + ', ' + g + ', ' + b + ', 1)';
                        };

                        // TODO configにrelationの設定がなくて、annotationにrelationがひとつも無いときにはcolorHexが取得できないため、relationが作れない。
                        // そもそもそのような状況を想定すべきか謎。何かしらの・・・configは必須ではないか？
                        var pred = model.annotationData.relations[relationId].pred;
                        var colorHex = view.viewModel.typeContainer.relation.getColor(pred);

                        return {
                            strokeStyle: converseHEXinotRGBA(colorHex, 1)
                        };
                    }
                };
            }();

            // Render DOM elements conforming with the Model.
            var renderer = function() {
                var destroyGrid = function(spanId) {
                    view.domUtil.manipulate.remove(view.domUtil.selector.grid.get(spanId));
                    view.renderer.grid.destroy(spanId);
                };

                // The cache for span positions.
                // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
                // This cache is big effective for the initiation, and little effective for resize. 
                var positionCache = {};

                var useCache = function(prefix, getPositionFunciton, spanId) {
                    var chacheId = prefix + spanId;
                    return positionCache[chacheId] ? positionCache[chacheId] : positionCache[chacheId] = getPositionFunciton(spanId);
                };

                // The posion of the text-box to calculate span postion; 
                var textOffset;

                // Utility functions for get positions of elemnts.
                var positionUtils = {
                    reset: function() {
                        positionCache = {};
                        textOffset = editor.find('.textae-editor__body__text-box').offset();
                    },
                    getSpan: _.partial(useCache, 'S', function(spanId) {
                        var $span = view.domUtil.selector.span.get(spanId);
                        if ($span.length === 0) {
                            throw new Error("span is not renderd : " + spanId);
                        }

                        var offset = $span.offset();
                        return {
                            top: offset.top - textOffset.top,
                            left: offset.left - textOffset.left,
                            width: $span.outerWidth(),
                            height: $span.outerHeight(),
                            center: $span.get(0).offsetLeft + $span.outerWidth() / 2
                        };
                    }),
                    getGrid: _.partial(useCache, 'G', function(spanId) {
                        return view.domUtil.selector.grid.get(spanId).offset();
                    }),
                    getEntity: function(entityId) {
                        var spanId = model.annotationData.getEntity(entityId).span;

                        var $entity = view.domUtil.selector.entity.get(entityId);
                        if ($entity.length === 0) {
                            throw new Error("entity is not rendered : " + entityId);
                        }

                        var gridPosition = positionUtils.getGrid(spanId);
                        var entityElement = $entity.get(0);
                        return {
                            top: gridPosition.top + entityElement.offsetTop,
                            center: gridPosition.left + entityElement.offsetLeft + $entity.outerWidth() / 2,
                        };
                    },
                };

                var getElement = function($parent, tagName, className) {
                    var $area = $parent.find('.' + className);
                    if ($area.length === 0) {
                        $area = $('<' + tagName + '>').addClass(className);
                        $parent.append($area);
                    }
                    return $area;
                };

                // Make the display area for text, spans, denotations, relations.
                var displayArea = getElement(editor, 'div', 'textae-editor__body');

                // Get the display area for denotations and relations.
                var getAnnotationArea = function() {
                    return getElement(displayArea, 'div', 'textae-editor__body__annotation-box');
                };

                return {
                    reset: function() {
                        // the Souce document has multi paragraphs that are splited by '\n'.
                        var getTaggedSourceDoc = function() {
                            //set sroucedoc tagged <p> per line.
                            return model.annotationData.sourceDoc.split("\n").map(function(par) {
                                return '<p class="textae-editor__body__text-box__paragraph">' + par + '</p>';
                            }).join("\n");
                        };

                        // Paragraphs is Object that has position of charactor at start and end of the statement in each paragraph.
                        var makeParagraphs = function() {
                            var paragraphs = {};

                            //enchant id to paragraph element and chache it.
                            view.renderer.helper.getSourceDocArea().find('p').each(function(index, element) {
                                var $element = $(element);
                                var paragraph = $.extend(model.annotationData.paragraphsArray[index], {
                                    element: $element,
                                });
                                $element.attr('id', paragraph.id);

                                paragraphs[paragraph.id] = paragraph;
                            });

                            return paragraphs;
                        };

                        // Render the source document
                        view.renderer.helper.getSourceDocArea().html(getTaggedSourceDoc());
                        view.renderer.paragraphs = makeParagraphs();

                        // Render annotations
                        getAnnotationArea().empty();
                        positionUtils.reset();
                        view.renderer.grid.reset();
                        view.renderer.helper.renderAllSpan();

                        // Render relations
                        view.renderer.helper.renderAllRelation();
                    },
                    helper: function() {
                        return {
                            // Get the display area for text and spans.
                            getSourceDocArea: function() {
                                return getElement(displayArea, 'div', 'textae-editor__body__text-box');
                            },
                            renderAllSpan: function() {
                                // For tuning
                                // var startTime = new Date();

                                model.annotationData.spansTopLevel.forEach(function(span) {
                                    view.renderer.span.render(span.id);
                                });

                                view.renderer.grid.arrangePositionAll();

                                // For tuning
                                // var endTime = new Date();
                                // console.log('render all span : ', endTime.getTime() - startTime.getTime() + 'ms');
                            },
                            renderAllRelation: function() {
                                view.renderer.relation.reset();

                                model.annotationData.getRelationIds()
                                    .forEach(function(relationId) {
                                        _.defer(_.partial(view.renderer.relation.render, relationId));
                                    });
                            },
                            changeLineHeight: function(heightValue) {
                                editor.find('.textae-editor__body__text-box').css({
                                    'line-height': heightValue * 100 + '%'
                                });
                            },
                            changeTypeGap: function(typeGapValue) {
                                editor.find('.textae-editor__type').css({
                                    height: 18 * typeGapValue + 18 + 'px',
                                    'padding-top': 18 * typeGapValue + 'px'
                                });
                            }
                        };
                    }(),
                    span: function() {
                        var renderSingleSpan = function(span) {
                            // Create the Range to a new span add 
                            var createRange = function(textNode, textNodeStartPosition) {
                                var startPos = span.begin - textNodeStartPosition;
                                var endPos = span.end - textNodeStartPosition;
                                if (startPos < 0 || textNode.length < endPos) {
                                    throw new Error('oh my god! I cannot render this span. ' + span.toStringOnlyThis() + ', textNode ' + textNode.textContent);
                                }

                                var range = document.createRange();
                                range.setStart(textNode, startPos);
                                range.setEnd(textNode, endPos);
                                return range;
                            };

                            // Get the Range to that new span tag insert.
                            // This function works well when no child span is rendered. 
                            var getRangeToInsertSpanTag = function(spanId) {
                                var createRangeForFirstSpanInParagraph = function(span) {
                                    var paragraph = view.renderer.paragraphs[span.paragraph.id];
                                    textNodeInParagraph = paragraph.element.contents().filter(function() {
                                        return this.nodeType === 3; //TEXT_NODE
                                    }).get(0);
                                    return createRange(textNodeInParagraph, paragraph.begin);
                                };

                                // The parent of the bigBrother is same with span, whitc is a span or the root of spanTree. 
                                var bigBrother = span.getBigBrother();
                                if (bigBrother) {
                                    // The target text arrounded by span is in a textNode after the bigBrother if bigBrother exists.
                                    return createRange(document.getElementById(bigBrother.id).nextSibling, bigBrother.end);
                                } else {
                                    // The target text arrounded by span is the first child of parent unless bigBrother exists.
                                    if (span.parent) {
                                        // The parent is span
                                        var textNodeInPrevSpan = view.domUtil.selector.span.get(span.parent.id).contents().filter(function() {
                                            return this.nodeType === 3;
                                        }).get(0);
                                        return createRange(textNodeInPrevSpan, span.parent.begin);
                                    } else {
                                        // The parent is paragraph
                                        return createRangeForFirstSpanInParagraph(span);
                                    }
                                }
                            };

                            var element = document.createElement('span');
                            element.setAttribute('id', span.id);
                            element.setAttribute('title', span.id);
                            element.setAttribute('class', 'textae-editor__span');
                            getRangeToInsertSpanTag(span.id).surroundContents(element);

                            return span;
                        };

                        var renderEntitiesOfType = function(type) {
                            type.entities.forEach(_.compose(view.renderer.entity.render, model.annotationData.getEntity));
                        };

                        var renderEntitiesOfSpan = function(span) {
                            span.getTypes().forEach(renderEntitiesOfType);
                            return span;
                        };

                        var exists = function(span) {
                            return document.getElementById(span.id) !== null;
                        };

                        var not = function(value) {
                            return !value;
                        };

                        var getId = function(span) {
                            return span.id;
                        };

                        var destroyChildrenSpan = function(span) {
                            // Destroy DOM elements of descendant spans.
                            var destroySpanRecurcive = function(span) {
                                span.children.forEach(function(span) {
                                    destroySpanRecurcive(span);
                                });
                                _.compose(view.renderer.span.destroy, getId)(span);
                            };

                            // Destroy rendered children.
                            span.children.filter(exists).forEach(destroySpanRecurcive);

                            return span;
                        };

                        var renderChildresnSpan = function(span) {
                            span.children.filter(_.compose(not, exists))
                                .forEach(_.compose(view.renderer.span.render, getId));

                            return span;
                        };

                        return {
                            // Destroy children spans to wrap a TextNode with <span> tag when new span over exists spans.
                            render: _.compose(renderChildresnSpan, renderEntitiesOfSpan, renderSingleSpan, destroyChildrenSpan, model.annotationData.getSpan),
                            destroy: function(spanId) {
                                var spanElement = document.getElementById(spanId);
                                var parent = spanElement.parentNode;

                                // Move the textNode wrapped this span in front of this span.
                                while (spanElement.firstChild) {
                                    parent.insertBefore(spanElement.firstChild, spanElement);
                                }

                                view.domUtil.manipulate.remove(spanElement);
                                parent.normalize();

                                // Destroy a grid of the span. 
                                destroyGrid(spanId);
                            },
                        };
                    }(),
                    entity: function() {
                        var getTypeDom = function(spanId, type) {
                            return $('#' + idFactory.makeTypeId(spanId, type));
                        };

                        // Arrange a position of the pane to center entities when entities width is longer than pane width.
                        var arrangePositionOfPane = function(pane) {
                            var paneWidth = pane.outerWidth();
                            var entitiesWidth = pane.find('.textae-editor__entity').toArray().map(function(e) {
                                return e.offsetWidth;
                            }).reduce(function(pv, cv) {
                                return pv + cv;
                            }, 0);

                            pane.css({
                                'left': entitiesWidth > paneWidth ? (paneWidth - entitiesWidth) / 2 : 0
                            });
                        };

                        var removeEntityElement = function(entity) {
                            var doesTypeHasNoEntity = function(typeName) {
                                return model.annotationData.getSpan(entity.span).getTypes().filter(function(type) {
                                    return type.name === typeName;
                                }).length === 0;
                            };

                            // Get old type from Dom, Because the entity may have new type when changing type of the entity.
                            var oldType = view.domUtil.manipulate.remove(view.domUtil.selector.entity.get(entity.id)).attr('type');

                            // Delete type if no entity.
                            if (doesTypeHasNoEntity(oldType)) {
                                getTypeDom(entity.span, oldType).remove();
                            } else {
                                // Arrage the position of TypePane, because number of entities decrease.
                                arrangePositionOfPane(getTypeDom(entity.span, oldType).find('.textae-editor__entity-pane'));
                            }
                        };

                        return {
                            // An entity is a circle on Type that is an endpoint of a relation.
                            // A span have one grid and a grid can have multi types and a type can have multi entities.
                            // A grid is only shown when at least one entity is owned by a correspond span.  
                            render: function(entity) {
                                //render type unless exists.
                                var getTypeElement = function(spanId, type) {
                                    // A Type element has an entity_pane elment that has a label and will have entities.
                                    var createEmptyTypeDomElement = function(spanId, type) {
                                        var typeId = idFactory.makeTypeId(spanId, type);
                                        // The EntityPane will have entities.
                                        var $entityPane = $('<div>')
                                            .attr('id', 'P-' + typeId)
                                            .addClass('textae-editor__entity-pane');

                                        // Display short name for URL(http or https);
                                        var displayName = type;
                                        // For tunning, search the scheme before execute a regular-expression.
                                        if (String(type).indexOf('http') > -1) {
                                            // The regular-expression to parse URL.
                                            // See detail:
                                            // http://someweblog.com/url-regular-expression-javascript-link-shortener/
                                            var urlRegex = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;
                                            var matches = urlRegex.exec(type);
                                            // Order to dispaly.
                                            // 1. The file name with the extention.
                                            // 2. The last directory name.
                                            // 3. The domain name.
                                            displayName = matches[6] ? matches[6] + (matches[7] || '') :
                                                matches[5] ? matches[5].split('/').filter(function(s) {
                                                    return s !== '';
                                                }).pop() :
                                                matches[3];
                                        }

                                        // The label over the span.
                                        var $typeLabel = $('<div>')
                                            .addClass('textae-editor__type-label')
                                            .text(displayName)
                                            .css({
                                                'background-color': view.viewModel.typeContainer.entity.getColor(type),
                                            });

                                        return $('<div>')
                                            .attr('id', typeId)
                                            .addClass('textae-editor__type')
                                            .append($typeLabel)
                                            .append($entityPane); // Set pane after label because pane is over label.
                                    };

                                    var getGrid = function(spanId) {
                                        var createGrid = function(spanId) {
                                            var spanPosition = positionUtils.getSpan(spanId);
                                            var $grid = $('<div>')
                                                .attr('id', 'G' + spanId)
                                                .addClass('textae-editor__grid')
                                                .addClass('hidden')
                                                .css({
                                                    'width': spanPosition.width
                                                });

                                            //append to the annotation area.
                                            getAnnotationArea().append($grid);

                                            return $grid;
                                        };

                                        // Create a grid unless it exists.
                                        var $grid = view.domUtil.selector.grid.get(spanId);
                                        if ($grid.length === 0) {
                                            return createGrid(spanId);
                                        } else {
                                            return $grid;
                                        }
                                    };

                                    var $type = getTypeDom(spanId, type);
                                    if ($type.length === 0) {
                                        $type = createEmptyTypeDomElement(spanId, type);
                                        getGrid(spanId).append($type);
                                    }

                                    return $type;
                                };

                                var createEntityElement = function(entity) {
                                    var $entity = $('<div>')
                                        .attr('id', idFactory.makeEntityDomId(entity.id))
                                        .attr('title', entity.id)
                                        .attr('type', entity.type)
                                        .addClass('textae-editor__entity')
                                        .css({
                                            'border-color': view.viewModel.typeContainer.entity.getColor(entity.type)
                                        });

                                    // Set css classes for modifications.
                                    model.annotationData.modifications.filter(function(m) {
                                        return m.obj === entity.id;
                                    }).map(function(m) {
                                        return 'textae-editor__entity-' + m.pred.toLowerCase();
                                    }).forEach(function(className) {
                                        $entity.addClass(className);
                                    });

                                    return $entity;
                                };

                                // Replace null to 'null' if type is null and undefined too.
                                entity.type = String(entity.type);

                                // Append a new entity to the type
                                var pane = getTypeElement(entity.span, entity.type)
                                    .find('.textae-editor__entity-pane')
                                    .append(createEntityElement(entity));

                                arrangePositionOfPane(pane);
                            },
                            destroy: function(entity) {
                                var doesSpanHasNoEntity = function(spanId) {
                                    return model.annotationData.getSpan(spanId).getTypes().length === 0;
                                };

                                if (doesSpanHasNoEntity(entity.span)) {
                                    // Destroy a grid when all entities are remove. 
                                    destroyGrid(entity.span);
                                } else {
                                    // Destroy an each entity.
                                    removeEntityElement(entity);
                                }
                            },
                            changeTypeOfExists: function(entity) {
                                // Remove old entity.
                                removeEntityElement(entity);

                                // Show new entity.
                                view.renderer.entity.render(entity);
                            },
                        };
                    }(),
                    grid: function() {
                        var gridPositionCache = {};

                        var filterChanged = function(span, newPosition) {
                            var oldGridPosition = gridPositionCache[span.id];
                            if (!oldGridPosition || oldGridPosition.top !== newPosition.top || oldGridPosition.left !== newPosition.left) {
                                return newPosition;
                            } else {
                                return undefined;
                            }
                        };

                        var arrangeRelationPosition = function(span) {
                            _.compact(
                                span.getTypes().map(function(type) {
                                    return type.entities;
                                }).reduce(textAeUtil.flatten, [])
                                .map(model.annotationData.getAssosicatedRelations)
                                .reduce(textAeUtil.flatten, [])
                                .map(toConnector)
                            ).forEach(function(connector) {
                                connector.arrangePosition();
                            });
                        };

                        var getGrid = function(span) {
                            if (span) {
                                return view.domUtil.selector.grid.get(span.id);
                            }
                        };

                        var updateGridPositon = function(span, newPosition) {
                            if (newPosition) {
                                getGrid(span).css(newPosition);
                                gridPositionCache[span.id] = newPosition;
                                arrangeRelationPosition(span);
                                return span;
                            }
                        };

                        var getNewPosition = function(span) {
                            var stickGridOnSpan = function(span) {
                                var spanPosition = positionUtils.getSpan(span.id);

                                return {
                                    'top': spanPosition.top - view.viewModel.viewMode.marginBottomOfGrid - getGrid(span).outerHeight(),
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

                                    return getGrid(span).outerHeight() + descendantsMaxHeight + view.viewModel.viewMode.marginBottomOfGrid;
                                };

                                var spanPosition = positionUtils.getSpan(span.id);
                                var descendantsMaxHeight = getHeightIncludeDescendantGrids(span);

                                return {
                                    'top': spanPosition.top - view.viewModel.viewMode.marginBottomOfGrid - descendantsMaxHeight,
                                    'left': spanPosition.left
                                };
                            };

                            if (span.children.length === 0) {
                                return stickGridOnSpan(span);
                            } else {
                                return pullUpGridOverDescendants(span);
                            }
                        };

                        var filterVisibleGrid = function(grid) {
                            if (grid && grid.hasClass('hidden')) {
                                return grid;
                            }
                        };

                        var visibleGrid = function(grid) {
                            if (grid) {
                                grid.removeClass('hidden');
                            }
                        };

                        var arrangeGridPosition = function(span) {
                            var moveTheGridIfChange = _.compose(_.partial(updateGridPositon, span), _.partial(filterChanged, span));
                            _.compose(visibleGrid, filterVisibleGrid, getGrid, moveTheGridIfChange, getNewPosition)(span);
                        };

                        return {
                            arrangePositionAll: function() {
                                var arrangePositionGridAndoDescendant = function(span) {
                                    // Arrange position All descendants because a grandchild maybe have types when a child has no type. 
                                    span.children
                                        .forEach(function(span) {
                                            arrangePositionGridAndoDescendant(span);
                                        });

                                    // There is at least one type in span that has a grid.
                                    if (span.getTypes().length > 0) {
                                        arrangeGridPosition(span);
                                    }
                                };

                                positionUtils.reset();

                                model.annotationData.spansTopLevel
                                    .forEach(function(span) {
                                        _.defer(_.partial(arrangePositionGridAndoDescendant, span));
                                    });
                            },
                            destroy: function(spanId) {
                                delete gridPositionCache[spanId];
                            },
                            reset: function() {
                                gridPositionCache = {};
                            }
                        };
                    }(),
                    relation: function() {
                        // Init a jsPlumb instance.
                        var jsPlumbInstance = function() {
                            var newInstance = jsPlumb.getInstance({
                                ConnectionsDetachable: false,
                                Endpoint: ['Dot', {
                                    radius: 1
                                }]
                            });
                            newInstance.setRenderMode(newInstance.SVG);
                            newInstance.Defaults.Container = getAnnotationArea();
                            return newInstance;
                        }();

                        var determineCurviness = function(relationId) {
                            var sourceId = model.annotationData.relations[relationId].subj;
                            var targetId = model.annotationData.relations[relationId].obj;

                            var sourcePosition = positionUtils.getEntity(sourceId);
                            var targetPosition = positionUtils.getEntity(targetId);

                            var sourceX = sourcePosition.center;
                            var targetX = targetPosition.center;

                            var sourceY = sourcePosition.top;
                            var targetY = targetPosition.top;

                            var xdiff = Math.abs(sourceX - targetX);
                            var ydiff = Math.abs(sourceY - targetY);
                            var curviness = xdiff * view.renderer.relation.settings.xrate + ydiff * view.renderer.relation.settings.yrate + view.renderer.relation.settings.c_offset;
                            curviness /= 2.4;

                            return curviness;
                        };

                        var arrowStyle = {
                            width: 7,
                            length: 9,
                            location: 1
                        };

                        var arrangePosition = function(relationId) {
                            var conn = toConnector(relationId);
                            conn.endpoints[0].repaint();
                            conn.endpoints[1].repaint();
                            conn.setConnector(['Bezier', {
                                curviness: determineCurviness(relationId)
                            }]);
                            conn.addOverlay(['Arrow', arrowStyle]);
                        };

                        return {
                            // Parameters to render relations.
                            settings: {
                                // opacity of connectorsA
                                connOpacity: 0.6,

                                // curviness parameters
                                xrate: 0.6,
                                yrate: 0.05,

                                // curviness offset
                                c_offset: 20,
                            },
                            reset: function() {
                                jsPlumbInstance.reset();
                                cachedConnectors = {};
                                view.domUtil.selector.relation.emptyRelationIdsSelected();
                            },
                            render: function(relationId) {
                                // Make a connector by jsPlumb.
                                var conn = jsPlumbInstance.connect({
                                    source: view.domUtil.selector.entity.get(model.annotationData.relations[relationId].subj),
                                    target: view.domUtil.selector.entity.get(model.annotationData.relations[relationId].obj),
                                    anchors: ['TopCenter', "TopCenter"],
                                    connector: ['Bezier', {
                                        curviness: determineCurviness(relationId)
                                    }],
                                    paintStyle: view.viewModel.getConnectorStrokeStyle(relationId),
                                    parameters: {
                                        'id': relationId,
                                    },
                                    cssClass: 'textae-editor__relation',
                                    overlays: [
                                        ['Arrow', arrowStyle],
                                        ['Label', {
                                            label: '[' + relationId + '] ' + model.annotationData.relations[relationId].pred,
                                            cssClass: 'textae-editor__relation__label'
                                        }]
                                    ]
                                });

                                // Notify to controller that a new jsPlumbConnection is added.
                                editor.trigger('textae.editor.jsPlumbConnection.add', conn);

                                // Set a function debounce to avoid over rendering.
                                conn.arrangePosition = _.debounce(_.partial(arrangePosition, relationId), 20);

                                // Cache a connector instance.
                                cachedConnectors[relationId] = conn;
                                return conn;
                            },
                            destroy: function(relationId) {
                                jsPlumbInstance.detach(toConnector(relationId));
                                delete cachedConnectors[relationId];
                            },
                            changePredicate: function(relationId, predicate) {
                                var connector = toConnector(relationId);
                                if (!connector) {
                                    throw 'no connector';
                                }

                                // Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
                                var labelOverlay = connector.getOverlays().filter(function(overlay) {
                                    return overlay.type === 'Label';
                                })[0];
                                if (!labelOverlay) {
                                    throw 'no label overlay';
                                }

                                labelOverlay.setLabel('[' + relationId + '] ' + predicate);
                                connector.setPaintStyle(view.viewModel.getConnectorStrokeStyle(relationId));
                            },
                            arrangePositionAll: function() {
                                // Move entitis before a calculation the position of relations.
                                _.invoke(_.values(cachedConnectors), 'arrangePosition');
                            }
                        };
                    }(),
                };
            }();

            var domUtil = { //view.domUtil.cursorChanger
                cursorChanger: function() {
                    var wait = function() {
                        editor.addClass('textae-editor_wait');
                    };
                    var endWait = function() {
                        editor.removeClass('textae-editor_wait');
                    };
                    return {
                        startWait: wait,
                        endWait: endWait,
                    };
                }(),
                selector: {
                    getSelecteds: function() {
                        return editor.find('.ui-selected');
                    },
                    hasSelecteds: function() {
                        return view.domUtil.selector.getSelecteds().length > 0;
                    },
                    span: {
                        get: function(spanId) {
                            return editor.find('#' + spanId);
                        },
                        getSelecteds: function() {
                            return editor.find('.textae-editor__span.ui-selected').map(function() {
                                return this.id;
                            }).get();
                        },
                        hasSelecteds: function() {
                            return view.domUtil.selector.span.getSelecteds().length > 0;
                        },
                        isSelectOne: function() {
                            return view.domUtil.selector.span.getSelecteds().length === 1;
                        },
                        select: function(spanId) {
                            view.domUtil.manipulate.select(view.domUtil.selector.span.get(spanId));
                        },
                    },
                    entity: {
                        get: function(entityId) {
                            return $('#' + idFactory.makeEntityDomId(entityId));
                        },
                        getSelecteds: function() {
                            return editor.find('.textae-editor__entity.ui-selected').map(function() {
                                return this.title;
                            }).get();
                        },
                        hasSelecteds: function() {
                            return view.domUtil.selector.entity.getSelecteds().length > 0;
                        },
                        select: function(entityId) {
                            view.domUtil.manipulate.select(view.domUtil.selector.entity.get(entityId));
                        },
                        deselect: function(entityId) {
                            view.domUtil.manipulate.deselect(view.domUtil.selector.entity.get(entityId));
                        }
                    },
                    relation: function() {
                        // Management selected relationId, because a Dom node of jsPlumbConnector have no relationId.
                        var relationIdsSelected = [],
                            isRelationSelected = function(relationId) {
                                return relationIdsSelected.indexOf(relationId) > -1;
                            },
                            addUiSelectClass = function(connector) {
                                connector.addClass('ui-selected');
                            },
                            removeUiSelectClass = function(connector) {
                                connector.removeClass('ui-selected');
                            },
                            selectRelation = _.compose(addUiSelectClass, toConnector),
                            deselectRelation = _.compose(removeUiSelectClass, toConnector);

                        return {
                            getSelecteds: function() {
                                return relationIdsSelected;
                            },
                            hasSelecteds: function() {
                                return relationIdsSelected.length > 0;
                            },
                            select: function(relationId) {
                                if (!isRelationSelected(relationId)) {
                                    relationIdsSelected.push(relationId);
                                    view.viewModel.buttonStateHelper.updateByRelation();
                                    toConnector(relationId).addClass('ui-selected');
                                }
                            },
                            deselect: function(relationId) {
                                var i = relationIdsSelected.indexOf(relationId);
                                if (i > -1) {
                                    deselectRelation(relationId);

                                    relationIdsSelected.splice(i, 1);
                                    view.viewModel.buttonStateHelper.updateByRelation();
                                }
                            },
                            clearRelationSelection: function() {
                                relationIdsSelected.forEach(deselectRelation);
                                view.domUtil.selector.relation.emptyRelationIdsSelected();
                            },
                            emptyRelationIdsSelected: function() {
                                relationIdsSelected = [];
                                view.viewModel.buttonStateHelper.updateByRelation();
                            },
                            toggle: function(relationId) {
                                if (isRelationSelected(relationId)) {
                                    view.domUtil.selector.relation.deselect(relationId);
                                } else {
                                    view.domUtil.selector.relation.select(relationId);
                                }
                            }
                        };
                    }(),
                    grid: {
                        get: function(spanId) {
                            return editor.find('#G' + spanId);
                        }
                    },
                },
                manipulate: function() {
                    var isSelected = function(target) {
                        return $(target).hasClass('ui-selected');
                    };
                    var select = function() {
                        if (!isSelected(this)) {
                            $(this).addClass('ui-selected').trigger('selectChanged', true);
                        }
                    };
                    var deselect = function() {
                        if (isSelected(this)) {
                            $(this).removeClass('ui-selected').trigger('selectChanged', false);
                        }
                    };
                    var toggle = function() {
                        if (isSelected(this)) {
                            deselect.apply(this);
                        } else {
                            select.apply(this);
                        }
                    };
                    var remove = function() {
                        var $self = $(this);
                        deselect.call($self.add($self.find('.ui-selected')));
                        $self.remove();
                    };
                    var applyMultiJQueryObject = function(func, target) {
                        // A target may be multi jQuery object.
                        return $(target).each(func);
                    };

                    return {
                        select: _.partial(applyMultiJQueryObject, select),
                        deselect: _.partial(applyMultiJQueryObject, deselect),
                        toggle: _.partial(applyMultiJQueryObject, toggle),
                        remove: _.partial(applyMultiJQueryObject, remove),
                        selectOnly: function(target) {
                            view.domUtil.manipulate.deselect(view.domUtil.selector.getSelecteds().not(target));
                            view.domUtil.selector.relation.clearRelationSelection();

                            view.domUtil.manipulate.select(target);
                        },
                        unselect: function() {
                            view.domUtil.manipulate.deselect(view.domUtil.selector.getSelecteds());
                            view.domUtil.selector.relation.clearRelationSelection();
                        },
                        // dismiss the default selection by the browser
                        dismissBrowserSelection: function() {
                            var selection = window.getSelection();
                            selection.collapse(document.body, 0);
                        },
                    };
                }(),
                hover: function() {
                    var processAccosiatedRelation = function(func, entityId) {
                        model.annotationData.getAssosicatedRelations(entityId)
                            .map(toConnector)
                            .forEach(func);
                    };

                    return {
                        on: _.partial(processAccosiatedRelation, function(connector) {
                            connector.addClass('hover');
                        }),
                        off: _.partial(processAccosiatedRelation, function(connector) {
                            connector.removeClass('hover');
                        })
                    };
                }()
            };
            return {
                init: function() {
                    view.viewModel.buttonStateHelper.init();
                },
                renderer: renderer,
                domUtil: domUtil,
                viewModel: viewModel
            };
        }(this);

        //handle user input event.
        var controller = function(editor) {
            var cancelBubble = function(e) {
                e = e || window.event;
                e.cancelBubble = true;
                e.bubbles = false;
                if (e.stopPropagation) e.stopPropagation();
            };

            var getPosition = function(node) {
                var $parent = $(node).parent();
                var parentId = $parent.attr("id");

                var pos;
                if ($parent.hasClass("textae-editor__body__text-box__paragraph")) {
                    pos = view.renderer.paragraphs[parentId].begin;
                } else if ($parent.hasClass("textae-editor__span")) {
                    pos = model.annotationData.getSpan(parentId).begin;
                } else {
                    console.log(parentId);
                    return;
                }

                var childNodes = node.parentElement.childNodes;
                for (var i = 0; childNodes[i] != node; i++) { // until the focus node
                    pos += (childNodes[i].nodeName == "#text") ? childNodes[i].nodeValue.length : $('#' + childNodes[i].id).text().length;
                }

                return pos;
            };

            var getFocusPosition = function(selection) {
                var pos = getPosition(selection.focusNode);
                return pos += selection.focusOffset;
            };

            var getAnchorPosition = function(selection) {
                var pos = getPosition(selection.anchorNode);
                return pos + selection.anchorOffset;
            };

            // adjust the beginning position of a span
            var adjustSpanBegin = function(beginPosition) {
                var pos = beginPosition;
                while (controller.spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos))) {
                    pos++;
                }
                while (!controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos)) && pos > 0 && !controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos - 1))) {
                    pos--;
                }
                return pos;
            };

            // adjust the end position of a span
            var adjustSpanEnd = function(endPosition) {
                var pos = endPosition;
                while (controller.spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos - 1))) {
                    pos--;
                }
                while (!controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos)) && pos < model.annotationData.sourceDoc.length) {
                    pos++;
                }
                return pos;
            };

            // adjust the beginning position of a span for shortening
            var adjustSpanBegin2 = function(beginPosition) {
                var pos = beginPosition;
                while ((pos < model.annotationData.sourceDoc.length) && (controller.spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos)) || !controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos - 1)))) {
                    pos++;
                }
                return pos;
            };

            // adjust the end position of a span for shortening
            var adjustSpanEnd2 = function(endPosition) {
                var pos = endPosition;
                while ((pos > 0) && (controller.spanConfig.isNonEdgeCharacter(model.annotationData.sourceDoc.charAt(pos - 1)) || !controller.spanConfig.isDelimiter(model.annotationData.sourceDoc.charAt(pos)))) {
                    pos--;
                }
                return pos;
            };

            var createSpanIfOneParent = function(selection) {
                // A span can be created at the same parent node.
                // The parentElement is expected as a paragraph or a span.
                if (selection.anchorNode.parentElement.id !== selection.focusNode.parentElement.id) {
                    console.log(selection.anchorNode.parentElement.id, selection.focusNode.parentElement.id);
                    return false;
                }

                var anchorPosition = getAnchorPosition(selection);
                var focusPosition = getFocusPosition(selection);

                // switch the position when the selection is made from right to left
                if (anchorPosition > focusPosition) {
                    var tmpPos = anchorPosition;
                    anchorPosition = focusPosition;
                    focusPosition = tmpPos;
                }

                // A span cannot be created include nonEdgeCharacters only.
                var stringWithoutNonEdgeCharacters = model.annotationData.sourceDoc.substring(anchorPosition, focusPosition);
                controller.spanConfig.nonEdgeCharacters.forEach(function(char) {
                    stringWithoutNonEdgeCharacters = stringWithoutNonEdgeCharacters.replace(char, '');
                });
                if (stringWithoutNonEdgeCharacters.length === 0) {
                    view.domUtil.manipulate.dismissBrowserSelection();
                    // Return true to return from the caller function.
                    return true;
                }

                view.domUtil.manipulate.unselect();
                (function doCreate(beginPosition, endPosition) {
                    var spanId = idFactory.makeSpanId(beginPosition, endPosition);

                    // The span exists already.
                    if (model.annotationData.getSpan(spanId)) {
                        return;
                    }

                    var commands = [controller.command.factory.spanCreateCommand({
                        begin: beginPosition,
                        end: endPosition
                    })];

                    if (view.viewModel.modeAccordingToButton['replicate-auto'].value() && endPosition - beginPosition <= CONSTS.BLOCK_THRESHOLD) {
                        commands.push(controller.command.factory.spanReplicateCommand({
                            begin: beginPosition,
                            end: endPosition
                        }));
                    }

                    controller.command.invoke(commands);

                })(adjustSpanBegin(anchorPosition), adjustSpanEnd(focusPosition));

                return true;
            };

            var moveSpan = function(spanId, begin, end) {
                // Do not need move.
                if (spanId === idFactory.makeSpanId(begin, end)) {
                    return;
                }

                return [controller.command.factory.spanMoveCommand(spanId, begin, end)];
            };

            var expandSpan = function(spanId, selection) {
                var commands = [];

                var focusPosition = getFocusPosition(selection);

                var range = selection.getRangeAt(0);
                var anchorRange = document.createRange();
                anchorRange.selectNode(selection.anchorNode);

                if (range.compareBoundaryPoints(Range.START_TO_START, anchorRange) < 0) {
                    // expand to the left
                    var newBegin = adjustSpanBegin(focusPosition);
                    commands = moveSpan(spanId, newBegin, model.annotationData.getSpan(spanId).end);
                } else {
                    // expand to the right
                    var newEnd = adjustSpanEnd(focusPosition);
                    commands = moveSpan(spanId, model.annotationData.getSpan(spanId).begin, newEnd);
                }

                controller.command.invoke(commands);
            };

            var shortenSpan = function(spanId, selection) {
                var commands = [];

                var focusPosition = getFocusPosition(selection);

                var range = selection.getRangeAt(0);
                var focusRange = document.createRange();
                focusRange.selectNode(selection.focusNode);

                var removeSpan = function(spanId) {
                    return [controller.command.factory.spanRemoveCommand(spanId)];
                };

                var new_sid, tid, eid, type;
                if (range.compareBoundaryPoints(Range.START_TO_START, focusRange) > 0) {
                    // shorten the right boundary
                    var newEnd = adjustSpanEnd2(focusPosition);

                    if (newEnd > model.annotationData.getSpan(spanId).begin) {
                        new_sid = idFactory.makeSpanId(model.annotationData.getSpan(spanId).begin, newEnd);
                        if (model.annotationData.getSpan(new_sid)) {
                            commands = removeSpan(spanId);
                        } else {
                            commands = moveSpan(spanId, model.annotationData.getSpan(spanId).begin, newEnd);
                        }
                    } else {
                        view.domUtil.selector.span.select(spanId);
                        controller.userEvent.editHandler.removeSelectedElements();
                    }
                } else {
                    // shorten the left boundary
                    var newBegin = adjustSpanBegin2(focusPosition);

                    if (newBegin < model.annotationData.getSpan(spanId).end) {
                        new_sid = idFactory.makeSpanId(newBegin, model.annotationData.getSpan(spanId).end);
                        if (model.annotationData.getSpan(new_sid)) {
                            commands = removeSpan(spanId);
                        } else {
                            commands = moveSpan(spanId, newBegin, model.annotationData.getSpan(spanId).end);
                        }
                    } else {
                        view.domUtil.selector.span.select(spanId);
                        controller.userEvent.editHandler.removeSelectedElements();
                    }
                }

                controller.command.invoke(commands);
            };

            var isInSelectedSpan = function(position) {
                if (view.domUtil.selector.span.isSelectOne()) {
                    var spanId = view.domUtil.selector.span.getSelecteds()[0];
                    var selectedSpan = model.annotationData.getSpan(spanId);
                    return selectedSpan.begin < position && position < selectedSpan.end;
                }
                return false;
            };

            var expandIfable = function(selection) {
                if (selection.anchorNode.parentNode.parentNode === selection.focusNode.parentNode) {
                    // To expand the span , belows are needed:
                    // 1. The anchorNode is in the span.
                    // 2. The foucusNode is out of the span and in the parent of the span.
                    view.domUtil.manipulate.unselect();
                    expandSpan(selection.anchorNode.parentNode.id, selection);

                    view.domUtil.manipulate.dismissBrowserSelection();
                    return true;
                }

                // If a span is selected, it is able to begin drag a span in the span and expand the span.
                if (isInSelectedSpan(getAnchorPosition(selection))) {
                    var selectedSpanId = view.domUtil.selector.span.getSelecteds()[0];

                    // The focus node should be at one level above the selected node.
                    if (view.domUtil.selector.span.get(selectedSpanId).parent().attr('id') === selection.focusNode.parentNode.id) {
                        // cf.
                        // 1. Select an outside span.
                        // 2. Begin Drug from an inner span to out of an outside span. 
                        // Expand the selected span.
                        expandSpan(selectedSpanId, selection);
                        view.domUtil.manipulate.dismissBrowserSelection();
                        return true;
                    } else {
                        // cf.
                        // 1. Select an inner span.
                        // 2. Begin Drug from an inner span to out of an outside span. 
                        // To expand the selected span is disable.
                        alert('A span cannot be expanded to make a boundary crossing.');
                        view.domUtil.manipulate.dismissBrowserSelection();
                        return true;
                    }
                }

                // To expand a span is disable.
                return false;
            };

            var shrinkIfable = function(selection) {
                if (selection.anchorNode.parentNode === selection.focusNode.parentNode.parentNode) {
                    // To shrink the span , belows are needed:
                    // 1. The anchorNode out of the span and in the parent of the span.
                    // 2. The foucusNode is in the span.
                    view.domUtil.manipulate.unselect();
                    shortenSpan(selection.focusNode.parentNode.id, selection);
                    view.domUtil.manipulate.dismissBrowserSelection();
                    return true;
                }

                // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
                if (isInSelectedSpan(getFocusPosition(selection))) {
                    var selectedSpanId = view.domUtil.selector.span.getSelecteds()[0];

                    // The focus node should be at the selected node.
                    if (selection.focusNode.parentNode.id === selectedSpanId) {
                        // cf.
                        // 1. Select an inner span.
                        // 2. Begin Drug from out of an outside span to the selected span. 
                        // Shrink the selected span.
                        shortenSpan(selectedSpanId, selection);
                        view.domUtil.manipulate.dismissBrowserSelection();
                        return true;
                    } else {
                        // cf.
                        // 1. Select an outside span.
                        // 2. Begin Drug from out of an outside span to an inner span. 
                        // To shrink the selected span is disable.
                        alert('A span cannot be shrinked to make a boundary crossing.');
                        view.domUtil.manipulate.dismissBrowserSelection();
                        return true;
                    }
                }

                // To shrink a span is disable.
                return false;
            };

            var overParagraph = function() {
                alert('It is ambiguous for which span you want to adjust the boundary. Select the span, and try again.');
                view.domUtil.manipulate.dismissBrowserSelection();
            };

            var selectEndOfText = function(selection) {
                // The Both node is not TextNode( nodeType == 3 ) either.
                if (selection.anchorNode.nodeType !== 3 || selection.focusNode.nodeType !== 3) {
                    // Blinking occurs if dissmiss here.
                    // Return true and the browser dissmiss the selection. 
                    return true;
                }

                if (createSpanIfOneParent(selection)) {
                    return false;
                }

                if (expandIfable(selection)) {
                    return false;
                }

                overParagraph();
                return false;
            };

            var selectEndOnSpan = function(selection) {
                // The Both node is not TextNode( nodeType == 3 ) either.
                if (selection.anchorNode.nodeType !== 3 || selection.focusNode.nodeType !== 3) {
                    // Blinking occurs if dissmiss here.
                    // Return true and the browser dissmiss the selection. 
                    // A span is clicked and come here when the selection over that span by triple-clicked. 
                    return true;
                }

                if (createSpanIfOneParent(selection)) {
                    return false;
                }

                if (expandIfable(selection)) {
                    return false;
                }

                if (shrinkIfable(selection)) {
                    return false;
                }

                overParagraph();
                return false;
            };

            var bodyClicked = function(e) {
                controller.userEvent.viewHandler.hidePallet();
                var selection = window.getSelection();

                // No select
                if (selection.isCollapsed) {
                    controller.userEvent.viewHandler.cancelSelect();
                    view.domUtil.manipulate.dismissBrowserSelection();

                    return true;
                }

                return selectEndOfText(selection);
            };

            var spanClicked = function(e) {
                controller.userEvent.viewHandler.hidePallet();
                var selection = window.getSelection();

                // No select
                if (selection.isCollapsed) {
                    if (e.shiftKey && view.domUtil.selector.span.isSelectOne()) {
                        //select reange of spans.
                        var firstId = view.domUtil.selector.span.getSelecteds()[0];
                        var secondId = $(this).attr('id');

                        view.domUtil.manipulate.unselect();

                        model.annotationData.getRangeOfSpan(firstId, secondId)
                            .forEach(function(spanId) {
                                view.domUtil.selector.span.select(spanId);
                            });
                    } else if (e.ctrlKey || e.metaKey) {
                        view.domUtil.manipulate.toggle(e.target);
                    } else {
                        view.domUtil.manipulate.selectOnly(e.target);
                    }

                    return false;
                }

                return selectEndOnSpan(selection);
            };

            var entitiesClicked = function(ctrlKey, $typeLabel, $entities) {
                var $targets = $typeLabel.add($entities);
                if (ctrlKey) {
                    if ($typeLabel.hasClass('ui-selected')) {
                        view.domUtil.manipulate.deselect($targets);
                    } else {
                        view.domUtil.manipulate.select($targets);
                    }
                } else {
                    view.domUtil.manipulate.selectOnly($targets);
                }
                return false;
            };

            var typeLabelClicked = function(e) {
                var $typeLabel = $(e.target);
                return entitiesClicked(e.ctrlKey || e.metaKey, $typeLabel, $typeLabel.next().children());
            };

            var entityPaneClicked = function(e) {
                var $typePane = $(e.target);
                return entitiesClicked(e.ctrlKey || e.metaKey, $typePane.prev(), $typePane.children());
            };

            var spanSelectChanged = function(e, isSelected) {
                view.viewModel.buttonStateHelper.updateBySpan();
            };

            var entitySelectChanged = function(e, isSelected) {
                var $typePane = $(e.target).parent();

                // Select the typeLabel if all entities is selected.
                if ($typePane.children().length === $typePane.find('.ui-selected').length) {
                    view.domUtil.manipulate.select($typePane.prev());
                } else {
                    view.domUtil.manipulate.deselect($typePane.prev());
                }

                view.viewModel.buttonStateHelper.updateByEntity();
            };

            // Select or deselect relation.
            // This function is expected to be called when Relation-Edit-Mode.
            var selectRelation = function(jsPlumbConnection, event) {
                var relationId = jsPlumbConnection.getParameter("id");

                if (event.ctrlKey || event.metaKey) {
                    view.domUtil.selector.relation.toggle(relationId);
                } else {
                    // Select only self
                    view.domUtil.manipulate.unselect();
                    view.domUtil.selector.relation.select(relationId);
                }
            };

            // A Swithing point to change a behavior when relation is clicked.
            var jsPlumbConnectionClickedImpl = null;

            // A relation is drawn by a jsPlumbConnection.
            // The EventHandlar for clieck event of jsPlumbConnection. 
            var jsPlumbConnectionClicked = function(jsPlumbConnection, event) {
                if (jsPlumbConnectionClickedImpl) {
                    jsPlumbConnectionClickedImpl(jsPlumbConnection, event);
                }

                cancelBubble(event);
                return false;
            };

            var editorSelected = function() {
                editor.tool.selectMe();
                view.viewModel.buttonStateHelper.propagate();
            };

            // A command is an operation by user that is saved as history, and can undo and redo.
            // Users can edit model only via commands. 
            var command = function() {
                // histories of edit to undo and redo.
                var history = function() {
                    var lastSaveIndex = -1,
                        lastEditIndex = -1,
                        history = [],
                        onChangeFunc,
                        trigger = function() {
                            if (onChangeFunc) {
                                onChangeFunc();
                            }
                        };

                    return {
                        init: function(onChange) {
                            if (onChange !== undefined) {
                                onChangeFunc = onChange.bind(this);
                            }
                        },
                        reset: function() {
                            lastSaveIndex = -1;
                            lastEditIndex = -1;
                            history = [];
                            trigger();
                        },
                        push: function(commands) {
                            history.splice(lastEditIndex + 1, history.length - lastEditIndex, commands);
                            lastEditIndex++;
                            trigger();
                        },
                        next: function() {
                            lastEditIndex++;
                            trigger();
                            return history[lastEditIndex];
                        },
                        prev: function() {
                            var lastEdit = history[lastEditIndex];
                            lastEditIndex--;
                            trigger();
                            return lastEdit;
                        },
                        saved: function() {
                            lastSaveIndex = lastEditIndex;
                            trigger();
                        },
                        hasAnythingToUndo: function() {
                            return lastEditIndex > -1;
                        },
                        hasAnythingToRedo: function() {
                            return lastEditIndex < history.length - 1;
                        },
                        hasAnythingToSave: function() {
                            return lastEditIndex != lastSaveIndex;
                        }
                    };
                }();

                var invoke = function(commands) {
                    commands.forEach(function(command) {
                        command.execute();
                    });

                    view.renderer.grid.arrangePositionAll();
                };

                var setDefautlViewMode = function() {
                    var multiEntitiesSpans = model.annotationData.getAllSpan()
                        .filter(function(span) {
                            var multiEntitiesTypes = span.getTypes().filter(function(type) {
                                return type.entities.length > 1;
                            });

                            return multiEntitiesTypes.length > 0;
                        });

                    if (multiEntitiesSpans.length > 0) {
                        controller.userEvent.viewHandler.setViewMode('instance');
                    } else if (Object.keys(model.annotationData.relations).length) {
                        controller.userEvent.viewHandler.setViewMode('relation');
                    } else {
                        controller.userEvent.viewHandler.setViewMode('term');
                    }
                };

                return {
                    init: function(onChange) {
                        history.init(onChange);
                        history.reset();
                    },
                    reset: function(annotation) {
                        model.annotationData.reset(annotation);
                        history.reset();
                        view.renderer.reset();
                        setDefautlViewMode();
                    },
                    updateSavePoint: function() {
                        history.saved();
                    },
                    invoke: function(commands) {
                        if (commands && commands.length > 0) {
                            invoke(commands);
                            history.push(commands);
                        }
                    },
                    undo: function() {
                        var getRevertCommands = function(commands) {
                            commands = Object.create(commands);
                            commands.reverse();
                            return commands.map(function(originCommand) {
                                return originCommand.revert();
                            });
                        };

                        if (history.hasAnythingToUndo()) {
                            view.domUtil.manipulate.unselect();
                            invoke(getRevertCommands(history.prev()));
                        }
                    },
                    redo: function() {
                        if (history.hasAnythingToRedo()) {
                            view.domUtil.manipulate.unselect();
                            invoke(history.next());
                        }
                    },
                    factory: function() {
                        var debugLog = function(message) {
                            // For debug
                            console.log('[controller.command.invoke]', message);
                        };

                        return {
                            spanCreateCommand: function(newSpan) {
                                var id = idFactory.makeSpanId(newSpan.begin, newSpan.end);
                                return {
                                    execute: function() {
                                        // model
                                        model.annotationData.addSpan({
                                            begin: newSpan.begin,
                                            end: newSpan.end
                                        });

                                        // rendering
                                        view.renderer.span.render(id);

                                        // select
                                        view.domUtil.selector.span.select(id);

                                        debugLog('create a new span, spanId:' + id);
                                    },
                                    revert: _.partial(controller.command.factory.spanRemoveCommand, id)
                                };
                            },
                            spanRemoveCommand: function(spanId) {
                                var span = model.annotationData.getSpan(spanId);
                                return {
                                    execute: function() {
                                        // Save a span potision for undo
                                        this.begin = span.begin;
                                        this.end = span.end;
                                        // model
                                        model.annotationData.removeSpan(spanId);
                                        // rendering
                                        view.renderer.span.destroy(spanId);

                                        debugLog('remove a span, spanId:' + spanId);
                                    },
                                    revert: _.partial(controller.command.factory.spanCreateCommand, {
                                        begin: span.begin,
                                        end: span.end
                                    })
                                };
                            },
                            spanMoveCommand: function(spanId, begin, end) {
                                var commands = [];
                                var newSpanId = idFactory.makeSpanId(begin, end);
                                if (!model.annotationData.getSpan(newSpanId)) {
                                    commands.push(controller.command.factory.spanRemoveCommand(spanId));
                                    commands.push(controller.command.factory.spanCreateCommand({
                                        begin: begin,
                                        end: end
                                    }));
                                    model.annotationData.getSpan(spanId).getTypes().forEach(function(type) {
                                        type.entities.forEach(function(entityId) {
                                            commands.push(controller.command.factory.entityCreateCommand(newSpanId, type.name, entityId));
                                        });
                                    });
                                }
                                var oldBeginEnd = idFactory.parseSpanId(spanId);

                                return {
                                    execute: function() {
                                        commands.forEach(function(command) {
                                            command.execute();
                                        });
                                        debugLog('move a span, spanId:' + spanId + ', newBegin:' + begin + ', newEnd:' + end);
                                    },
                                    revert: _.partial(controller.command.factory.spanMoveCommand, newSpanId, oldBeginEnd.begin, oldBeginEnd.end)
                                };
                            },
                            spanReplicateCommand: function(span) {
                                var commands = model.getReplicationSpans(span, controller.spanConfig)
                                    .map(controller.command.factory.spanCreateCommand);

                                return {
                                    execute: function() {
                                        commands.forEach(function(command) {
                                            command.execute();
                                        });
                                        debugLog('replicate a span, begin:' + span.begin + ', end:' + span.end);
                                    },
                                    revert: function() {
                                        var revertedCommands = commands.map(function(command) {
                                            return command.revert();
                                        });
                                        return {
                                            execute: function() {
                                                revertedCommands.forEach(function(command) {
                                                    command.execute();
                                                });
                                                debugLog('revert replicate a span, begin:' + span.begin + ', end:' + span.end);
                                            }
                                        };
                                    }
                                };
                            },
                            entityCreateCommand: function(spanId, typeName, entityId) {
                                return {
                                    execute: function() {
                                        // Overwrite to revert
                                        entityId = entityId || model.annotationData.getNewEntityId();
                                        // model
                                        var newEntity = {
                                            id: entityId,
                                            span: spanId,
                                            type: typeName
                                        };
                                        model.annotationData.addEntity(newEntity);
                                        // rendering
                                        view.renderer.entity.render(newEntity);
                                        // select
                                        view.domUtil.selector.entity.select(entityId);

                                        debugLog('create a new entity, spanId:' + spanId + ', type:' + typeName + '  entityId:' + entityId);
                                    },
                                    revert: function() {
                                        // This function cannot be bound, because a new entity id is created at execute.
                                        return controller.command.factory.entityRemoveCommand(entityId, spanId, typeName);
                                    }
                                };
                            },
                            entityRemoveCommand: function(entityId, spanId, typeName) {
                                // The spanId and typeName of exist entity are neccesary to revert.
                                // The spanId and typeName are specified when this function is called from revert of createEntityCommand.
                                // Because a new entity is not exist yet.
                                var entity = model.annotationData.getEntity(entityId);
                                return {
                                    execute: function() {
                                        // model
                                        var deleteEntity = model.annotationData.removeEnitity(entityId);
                                        // rendering
                                        view.renderer.entity.destroy(deleteEntity);

                                        debugLog('remove a entity, spanId:' + entity.span + ', type:' + entity.type + ', entityId:' + entityId);
                                    },
                                    revert: _.partial(controller.command.factory.entityCreateCommand, spanId || entity.span, typeName || entity.type, entityId)
                                };
                            },
                            entityChangeTypeCommand: function(entityId, newType) {
                                return {
                                    execute: function() {
                                        var changedEntity = model.annotationData.removeEnitity(entityId);
                                        var oldType = changedEntity.type;
                                        changedEntity.type = newType;
                                        model.annotationData.addEntity(changedEntity);
                                        // rendering
                                        view.renderer.entity.changeTypeOfExists(changedEntity);

                                        debugLog('change type of a entity, spanId:' + changedEntity.span + ', type:' + oldType + ', entityId:' + entityId + ', newType:' + newType);
                                    },
                                    revert: _.partial(controller.command.factory.entityChangeTypeCommand, entityId, model.annotationData.getEntity(entityId).type)
                                };
                            },
                            relationCreateCommand: function(relationId, subject, object, predicate) {
                                return {
                                    execute: function() {
                                        model.annotationData.relations[relationId] = {
                                            id: relationId,
                                            pred: predicate,
                                            subj: subject,
                                            obj: object
                                        };

                                        // Rendering
                                        view.renderer.relation.render(relationId);

                                        // Selection
                                        // Set the css class lately, because jsPlumbConnector is no applyed that css class immediately after create.
                                        _.delay(_.partial(view.domUtil.selector.relation.select, relationId), 100);

                                        debugLog('create a new relation relationId:' + relationId + ', subject:' + subject + ', object:' + object + ', predicate:' + predicate);
                                    },
                                    revert: _.partial(controller.command.factory.relationRemoveCommand, relationId)
                                };
                            },
                            relationRemoveCommand: function(relationId) {
                                var relation = model.annotationData.relations[relationId];
                                var subject = relation.subj;
                                var object = relation.obj;
                                var predicate = relation.pred;

                                return {
                                    execute: function() {
                                        // model
                                        delete model.annotationData.relations[relationId];

                                        // rendering
                                        view.renderer.relation.destroy(relationId);

                                        debugLog('remove a relation relationId:' + relationId + ', subject:' + subject + ', object:' + object + ', predicate:' + predicate);
                                    },
                                    revert: _.partial(controller.command.factory.relationCreateCommand, relationId, subject, object, predicate)
                                };
                            },
                            relationChangePredicateCommand: function(relationId, predicate) {
                                var oldPredicate = model.annotationData.relations[relationId].pred;
                                return {
                                    execute: function() {
                                        // model
                                        model.annotationData.relations[relationId].pred = predicate;

                                        // rendering
                                        view.renderer.relation.changePredicate(relationId, predicate);

                                        // selection
                                        view.domUtil.selector.relation.select(relationId);

                                        debugLog('change predicate of relation, relationId:' + relationId + ', subject:' + model.annotationData.relations[relationId].subj + ', object:' + model.annotationData.relations[relationId].obj + ', predicate:' + oldPredicate + ', newPredicate:' + predicate);
                                    },
                                    revert: _.partial(controller.command.factory.relationChangePredicateCommand, relationId, oldPredicate)
                                };
                            }
                        };
                    }(),
                };
            }();

            var userEvent = function() {
                // changeEventHandler will init.
                var changeTypeOfSelected;

                return {
                    // User event to edit model
                    editHandler: function() {
                        return {
                            replicate: function() {
                                if (view.domUtil.selector.span.isSelectOne()) {
                                    controller.command.invoke(
                                        [controller.command.factory.spanReplicateCommand(
                                            model.annotationData.getSpan(
                                                view.domUtil.selector.span.getSelecteds()[0]
                                            )
                                        )]
                                    );
                                } else {
                                    alert('You can replicate span annotation when there is only span selected.');
                                }
                            },
                            createEntity: function() {
                                var commands = view.domUtil.selector.span.getSelecteds().map(function(spanId) {
                                    return controller.command.factory.entityCreateCommand(spanId, view.viewModel.typeContainer.entity.getDefaultType());
                                });

                                controller.command.invoke(commands);
                            },
                            // set the type of an entity
                            setEntityType: function() {
                                var newType = $(this).attr('label');
                                changeTypeOfSelected(newType);
                                return false;
                            },
                            newLabel: function() {
                                if (view.domUtil.selector.entity.hasSelecteds() || view.domUtil.selector.relation.hasSelecteds()) {
                                    var newTypeLabel = prompt("Please enter a new label", "");
                                    if (newTypeLabel) {
                                        changeTypeOfSelected(newTypeLabel);
                                    }
                                }
                            },
                            removeSelectedElements: function() {
                                var removeCommand = function() {
                                    var unique = function(array) {
                                        return array.reduce(function(a, b) {
                                            if (a.indexOf(b) === -1) {
                                                a.push(b);
                                            }
                                            return a;
                                        }, []);
                                    };

                                    var spanIds = [],
                                        entityIds = [],
                                        relationIds = [];
                                    return {
                                        addSpanId: function(spanId) {
                                            spanIds.push(spanId);
                                        },
                                        addEntityId: function(entityId) {
                                            entityIds.push(entityId);
                                        },
                                        addRelations: function(addedRelations) {
                                            relationIds = relationIds.concat(addedRelations);
                                        },
                                        getAll: function() {
                                            return unique(relationIds).map(controller.command.factory.relationRemoveCommand)
                                                .concat(
                                                    unique(entityIds).map(function(entity) {
                                                        // Wrap by a anonymous function, because controller.command.factory.entityRemoveCommand has two optional arguments.
                                                        return controller.command.factory.entityRemoveCommand(entity);
                                                    }),
                                                    unique(spanIds).map(controller.command.factory.spanRemoveCommand));
                                        },
                                    };
                                }();

                                var removeEnitity = function(entityId) {
                                    removeCommand.addEntityId(entityId);
                                    removeCommand.addRelations(model.annotationData.getAssosicatedRelations(entityId));
                                };

                                //remove spans
                                view.domUtil.selector.span.getSelecteds().forEach(function(spanId) {
                                    removeCommand.addSpanId(spanId);

                                    model.annotationData.getSpan(spanId).getTypes().forEach(function(type) {
                                        type.entities.forEach(function(entityId) {
                                            removeEnitity(entityId);
                                        });
                                    });
                                });

                                //remove entities
                                view.domUtil.selector.entity.getSelecteds().forEach(function(entityId) {
                                    //an entity element has the entityId in title. an id is per Editor.
                                    removeEnitity(entityId);
                                });

                                //remove relations
                                removeCommand.addRelations(view.domUtil.selector.relation.getSelecteds());
                                view.domUtil.selector.relation.emptyRelationIdsSelected();

                                controller.command.invoke(removeCommand.getAll());
                            },
                            copyEntities: function() {
                                view.viewModel.clipBoard = function getEntitiesFromSelectedSpan() {
                                    return view.domUtil.selector.span.getSelecteds().map(function(spanId) {
                                        return model.annotationData.getSpan(spanId).getTypes().map(function(t) {
                                            return t.entities;
                                        }).reduce(textAeUtil.flatten);
                                    }).reduce(textAeUtil.flatten, []);
                                }().concat(
                                    view.domUtil.selector.entity.getSelecteds()
                                ).reduce(function(a, b) {
                                    // Unique Entities. Because a entity is deplicate When a span and thats entity is selected.
                                    if (a.indexOf(b) < 0) {
                                        a.push(b);
                                    }
                                    return a;
                                }, []);
                            },
                            pasteEntities: function() {
                                // Make commands per selected spans from entities in clipBord. 
                                var commands = view.domUtil.selector.span.getSelecteds().map(function(spanId) {
                                    // The view.viewModel.clipBoard has enitityIds.
                                    return view.viewModel.clipBoard.map(function(entityId) {
                                        return controller.command.factory.entityCreateCommand(spanId, model.annotationData.getEntity(entityId).type);
                                    });
                                }).reduce(textAeUtil.flatten, []);

                                controller.command.invoke(commands);
                            }
                        };
                    }(),
                    // User event that does not change data.
                    viewHandler: function() {
                        // The Reference to content to be shown in the pallet.
                        var palletConfig = {};

                        var eventHandlerComposer = function() {
                            var changeType = function(getIdsFunction, createChangeTypeCommandFunction, newType) {
                                var ids = getIdsFunction();
                                if (ids.length > 0) {
                                    var commands = ids.map(function(id) {
                                        return createChangeTypeCommandFunction(id, newType);
                                    });

                                    controller.command.invoke(commands);
                                }
                            };

                            return {
                                relationEdit: function() {
                                    var entityClickedAtRelationMode = function(e) {
                                        if (view.domUtil.selector.entity.getSelecteds().length === 0) {
                                            view.domUtil.manipulate.selectOnly(e.target);
                                        } else {
                                            // Cannot make a self reference relation.
                                            var subjectEntityId = view.domUtil.selector.entity.getSelecteds()[0];
                                            var objectEntityId = $(e.target).attr('title');

                                            if (subjectEntityId === objectEntityId) {
                                                // Deslect already selected entity.
                                                view.domUtil.selector.entity.deselect(subjectEntityId);
                                            } else {
                                                view.domUtil.selector.entity.select(objectEntityId);
                                                _.defer(function() {
                                                    controller.command.invoke([controller.command.factory.relationCreateCommand(
                                                        model.annotationData.getNewRelationId(),
                                                        subjectEntityId,
                                                        objectEntityId,
                                                        view.viewModel.typeContainer.relation.getDefaultType()
                                                    )]);

                                                    if (e.ctrlKey || e.metaKey) {
                                                        // Remaining selection of the subject entity.
                                                        view.domUtil.selector.entity.deselect(objectEntityId);
                                                    } else if (e.shiftKey) {
                                                        view.domUtil.manipulate.dismissBrowserSelection();
                                                        view.domUtil.selector.entity.deselect(subjectEntityId);
                                                        view.domUtil.selector.entity.select(objectEntityId);
                                                        return false;
                                                    } else {
                                                        view.domUtil.selector.entity.deselect(subjectEntityId);
                                                        view.domUtil.selector.entity.deselect(objectEntityId);
                                                    }
                                                });
                                            }
                                        }
                                    };

                                    // Control only entities and relations.
                                    editor
                                        .off('mouseup', '.textae-editor__body')
                                        .off('mouseup', '.textae-editor__span')
                                        .off('mouseup', '.textae-editor__type-label')
                                        .off('mouseup', '.textae-editor__entity-pane')
                                        .off('selectChanged', '.textae-editor__entity')
                                        .off('mouseup', '.textae-editor__entity')
                                        .on('mouseup', '.textae-editor__entity', entityClickedAtRelationMode);

                                    palletConfig.typeContainer = view.viewModel.typeContainer.relation;
                                    changeTypeOfSelected = _.partial(changeType, view.domUtil.selector.relation.getSelecteds, controller.command.factory.relationChangePredicateCommand);

                                    jsPlumbConnectionClickedImpl = selectRelation;
                                },
                                noRelationEdit: function() {
                                    var entityClicked = function(e) {
                                        if (e.ctrlKey || e.metaKey) {
                                            view.domUtil.manipulate.toggle(e.target);
                                        } else {
                                            var $typePane = $(e.target).parent();

                                            if ($typePane.children().length === 1) {
                                                // Select the typeLabel if only one entity is selected.
                                                view.domUtil.manipulate.selectOnly($typePane.prev().add($typePane.children()));
                                            } else {
                                                view.domUtil.manipulate.selectOnly(e.target);
                                            }
                                        }
                                        return false;
                                    };

                                    editor
                                        .on('mouseup', '.textae-editor__body', bodyClicked)
                                        .on('mouseup', '.textae-editor__span', spanClicked)
                                        .on('mouseup', '.textae-editor__type-label', typeLabelClicked)
                                        .on('mouseup', '.textae-editor__entity-pane', entityPaneClicked)
                                        .on('selectChanged', '.textae-editor__entity', entitySelectChanged)
                                        .off('mouseup', '.textae-editor__entity')
                                        .on('mouseup', '.textae-editor__entity', entityClicked);

                                    palletConfig.typeContainer = view.viewModel.typeContainer.entity;
                                    changeTypeOfSelected = _.partial(changeType, view.domUtil.selector.entity.getSelecteds, controller.command.factory.entityChangeTypeCommand);

                                    jsPlumbConnectionClickedImpl = null;
                                }
                            };
                        }();

                        var controllerState = function() {
                            var resetView = function() {
                                controller.userEvent.viewHandler.hidePallet();
                                view.domUtil.manipulate.unselect();
                            };

                            var transition = {
                                toTerm: function() {
                                    resetView();
                                    eventHandlerComposer.noRelationEdit();
                                    view.viewModel.viewMode.setTerm();
                                    view.renderer.grid.arrangePositionAll();

                                    controllerState = state.termCentric;
                                },
                                toInstance: function() {
                                    resetView();
                                    eventHandlerComposer.noRelationEdit();
                                    view.viewModel.viewMode.setInstance();
                                    view.renderer.grid.arrangePositionAll();

                                    controllerState = state.instanceRelation;
                                },
                                toRelation: function() {
                                    resetView();
                                    eventHandlerComposer.relationEdit();
                                    view.viewModel.viewMode.setRelation();
                                    view.renderer.grid.arrangePositionAll();

                                    controllerState = state.relationEdit;
                                }
                            };

                            var state = {
                                termCentric: {
                                    name: 'Term Centric',
                                    onInstance: transition.toInstance,
                                    onRelation: transition.toRelation
                                },
                                instanceRelation: {
                                    name: 'Instance / Relation',
                                    onRelation: transition.toRelation,
                                    offInstance: transition.toTerm
                                },
                                relationEdit: {
                                    name: 'Relation Edit',
                                    offRelation: transition.toInstance,
                                    offInstance: transition.toTerm
                                }
                            };

                            return {
                                // Init as TermCentricState
                                init: function() {
                                    transition.toTerm();
                                }
                            };
                        }();

                        // Redraw all editors in tha windows.
                        var redrawAllEditor = function() {
                            $(window).trigger('resize');
                        };

                        var debounce300 = function(func) {
                            return _.debounce(func, 300);
                        };

                        var changeLineHeight = debounce300(_.compose(redrawAllEditor, view.renderer.helper.changeLineHeight));

                        var changeTypeGap = debounce300(_.compose(view.renderer.grid.arrangePositionAll, view.renderer.helper.changeTypeGap));

                        return {
                            init: function() {
                                controllerState.init();
                            },
                            showPallet: function() {
                                var hideAndDo = function(doFunction) {
                                    return function() {
                                        controller.userEvent.viewHandler.hidePallet();
                                        doFunction.call(this);
                                    };
                                };

                                var makePalletRow = function(typeContainer) {
                                    var makeRadioButton = function(typeName) {
                                        // The event handler is bound direct,because jQuery detects events of radio buttons directly only.
                                        var $radioButton = $('<input>')
                                            .addClass('textae-editor__entity-pallet__entity-type__radio')
                                            .attr({
                                                'type': 'radio',
                                                'name': 'etype',
                                                'label': typeName
                                            }).change(hideAndDo(function() {
                                                typeContainer.setDefaultType($(this).attr('label'));
                                                return false;
                                            }));

                                        // Select the radio button if it is default type.
                                        if (typeName === typeContainer.getDefaultType()) {
                                            $radioButton.attr({
                                                'title': 'default type',
                                                'checked': 'checked'
                                            });
                                        }
                                        return $radioButton;
                                    };

                                    var makeLink = function(uri) {
                                        if (uri) {
                                            return $('<a>')
                                                .attr({
                                                    'href': uri,
                                                    'target': '_blank'
                                                })
                                                .append($('<span>').addClass('textae-editor__entity-pallet__link'));
                                        }
                                    };

                                    var wrapTd = function($element) {
                                        if ($element) {
                                            return $('<td>').append($element);
                                        } else {
                                            return $('<td>');
                                        }
                                    };

                                    var makeColumn1 = _.compose(wrapTd, makeRadioButton);

                                    var makeColumn2 = function(typeName) {
                                        return $('<td>')
                                            .addClass('textae-editor__entity-pallet__entity-type__label')
                                            .attr('label', typeName)
                                            .text(typeName);
                                    };

                                    var makeColumn3 = _.compose(wrapTd, makeLink, typeContainer.getUri);

                                    return typeContainer.getSortedNames().map(function(typeName) {
                                        var $column1 = makeColumn1(typeName);
                                        var $column2 = makeColumn2(typeName);
                                        var $column3 = makeColumn3(typeName);

                                        return $('<tr>')
                                            .addClass('textae-editor__entity-pallet__entity-type')
                                            .css({
                                                'background-color': typeContainer.getColor(typeName)
                                            })
                                            .append([$column1, $column2, $column3]);
                                    });
                                };

                                var createEmptyPallet = function(setTypeFunction) {
                                    return $('<div>')
                                        .addClass("textae-editor__entity-pallet")
                                        .append($('<table>'))
                                        .css('position', 'fixed')
                                        .on('click', '.textae-editor__entity-pallet__entity-type__label', hideAndDo(setTypeFunction))
                                        .hide();
                                };

                                var reuseOldPallet = function($pallet) {
                                    var $oldPallet = $('.textae-editor__entity-pallet');
                                    if ($oldPallet.length !== 0) {
                                        return $oldPallet.find('table').empty().end().css('width', 'auto');
                                    } else {
                                        // Append the pallet to body to show on top.
                                        $("body").append($pallet);
                                        return $pallet;
                                    }
                                };

                                var appendRows = function($pallet) {
                                    return $pallet.find("table")
                                        .append(makePalletRow(palletConfig.typeContainer))
                                        .end();
                                };

                                var setMaxHeight = function($pallet) {
                                    // Show the scrollbar-y if the height of the pallet is same witch max-height.
                                    if ($pallet.outerHeight() + 'px' === $pallet.css('max-height')) {
                                        return $pallet.css('overflow-y', 'scroll');
                                    } else {
                                        return $pallet.css('overflow-y', '');
                                    }
                                };

                                var makePallet = _.compose(setMaxHeight, appendRows, reuseOldPallet, createEmptyPallet);

                                return function(point) {
                                    if (palletConfig.typeContainer.getSortedNames().length > 0) {
                                        // Move the pallet to mouse.
                                        makePallet(controller.userEvent.editHandler.setEntityType)
                                            .css(point)
                                            .show();
                                    }
                                };
                            }(),
                            hidePallet: function() {
                                $('.textae-editor__entity-pallet').hide();
                            },
                            redraw: function() {
                                view.renderer.grid.arrangePositionAll();
                            },
                            cancelSelect: function() {
                                // if drag, bubble up
                                if (!window.getSelection().isCollapsed) {
                                    view.domUtil.manipulate.dismissBrowserSelection();
                                    return true;
                                }

                                view.domUtil.manipulate.unselect();
                                controller.userEvent.viewHandler.hidePallet();

                                editor.tool.cancel();
                            },
                            selectLeftSpan: function() {
                                if (view.domUtil.selector.span.isSelectOne()) {
                                    var span = model.annotationData.getSpan(view.domUtil.selector.span.getSelecteds()[0]);
                                    view.domUtil.manipulate.unselect();
                                    if (span.left) {
                                        view.domUtil.selector.span.select(span.left.id);
                                    }
                                }
                            },
                            selectRightSpan: function() {
                                if (view.domUtil.selector.span.isSelectOne()) {
                                    var span = model.annotationData.getSpan(view.domUtil.selector.span.getSelecteds()[0]);
                                    view.domUtil.manipulate.unselect();
                                    if (span.right) {
                                        view.domUtil.selector.span.select(span.right.id);
                                    }
                                }
                            },
                            showSettingDialog: function() {
                                var typeGapValue;

                                return function() {
                                    var content = function() {
                                            return $('<div>')
                                                .addClass('textae-editor__setting-dialog');
                                        },
                                        lineHeight = function($content) {
                                            return $content
                                                .append($('<div>')
                                                    .append('<label>Line Height:')
                                                    .append($('<input>')
                                                        .attr({
                                                            'type': 'number',
                                                            'step': 1,
                                                            'min': 3,
                                                            'max': 10,
                                                            'value': 4,
                                                        })
                                                        .addClass('textae-editor__setting-dialog__line-height')
                                                    ))
                                                .on('change', '.textae-editor__setting-dialog__line-height', function() {
                                                    changeLineHeight($(this).val());
                                                });
                                        },
                                        instanceRelationView = function($content) {
                                            return $content.append($('<div>')
                                                    .append('<label>Instance/Relation View:')
                                                    .append($('<input>')
                                                        .attr({
                                                            'type': 'checkbox'
                                                        })
                                                        .addClass('textae-editor__setting-dialog__term-centric-view')
                                                    )
                                                )
                                                .on('click', '.textae-editor__setting-dialog__term-centric-view', function() {
                                                    if ($(this).is(':checked')) {
                                                        controllerState.onInstance();
                                                    } else {
                                                        controllerState.offInstance();
                                                    }
                                                });
                                        },
                                        typeGap = function($content) {
                                            return $content.append($('<div>')
                                                .append('<label>Type Gap:')
                                                .append($('<input>')
                                                    .attr({
                                                        type: 'number',
                                                        step: 1,
                                                        min: 0,
                                                        max: 5
                                                    }).addClass('textae-editor__setting-dialog__type_gap')
                                                )
                                            ).on('change', '.textae-editor__setting-dialog__type_gap', function() {
                                                typeGapValue = $(this).val();
                                                changeTypeGap(typeGapValue);
                                            });
                                        },
                                        dialog = function($content) {
                                            return textAeUtil.getDialog(editor.editorId, 'textae.dialog.setting', 'Chage Settings', $content, true);
                                        },
                                        // Update the checkbox state, because it is updated by the button on control too.
                                        updateViewMode = function($dialog) {
                                            return $dialog.find('.textae-editor__setting-dialog__term-centric-view')
                                                .prop({
                                                    'checked': view.viewModel.viewMode.isTerm() ? null : 'checked'
                                                })
                                                .end();
                                        },
                                        updateTypeGapValue = function($dialog) {
                                            return $dialog.find('.textae-editor__setting-dialog__type_gap')
                                                .prop({
                                                    value: typeGapValue ? typeGapValue : view.viewModel.viewMode.isTerm() ? 0 : 1
                                                })
                                                .end();
                                        },
                                        // Open the dialog.
                                        open = function($dialog) {
                                            return $dialog.open();
                                        };

                                    _.compose(open, updateTypeGapValue, updateViewMode, dialog, typeGap, instanceRelationView, lineHeight, content)();
                                };
                            }(),
                            toggleRelationEditMode: function() {
                                // ビューモードを切り替える
                                if (view.viewModel.modeAccordingToButton['relation-edit-mode'].value()) {
                                    controllerState.offRelation();
                                } else {
                                    controllerState.onRelation();
                                }
                            },
                            setViewMode: function(mode) {
                                if (mode === 'term' && controllerState.offInstance) {
                                    controllerState.offInstance();
                                } else if (mode === 'instance' && controllerState.onInstance) {
                                    controllerState.onInstance();
                                } else if (mode === 'relation' && controllerState.onRelation) {
                                    controllerState.onRelation();
                                }
                            }
                        };
                    }()
                };
            }();

            // Configulation of span
            var spanConfig = {
                delimiterCharacters: null,
                nonEdgeCharacters: null,
                defaults: {
                    "delimiter characters": [
                        " ",
                        ".",
                        "!",
                        "?",
                        ",",
                        ":",
                        ";",
                        "-",
                        "/",
                        "&",
                        "(",
                        ")",
                        "{",
                        "}",
                        "[",
                        "]",
                        "+",
                        "*",
                        "\\",
                        "\"",
                        "'",
                        "\n",
                        "–"
                    ],
                    "non-edge characters": [
                        " ",
                        "\n"
                    ]
                },
                set: function(config) {
                    var settings = $.extend({}, this.defaults, config);

                    if (settings['delimiter characters'] !== undefined) {
                        this.delimiterCharacters = settings['delimiter characters'];
                    }

                    if (settings['non-edge characters'] !== undefined) {
                        this.nonEdgeCharacters = settings['non-edge characters'];
                    }
                },
                isNonEdgeCharacter: function(char) {
                    return (this.nonEdgeCharacters.indexOf(char) >= 0);
                },
                isDelimiter: function(char) {
                    if (this.delimiterCharacters.indexOf('ANY') >= 0) {
                        return 1;
                    }
                    return (this.delimiterCharacters.indexOf(char) >= 0);
                }
            };

            return {
                init: function() {
                    // Prevent the default selection by the browser with shift keies.
                    editor.on('mousedown', function(e) {
                        if (e.shiftKey) {
                            return false;
                        }
                    });

                    // Bind user input event to handler
                    editor
                        .on('mouseup', '.textae-editor__body,.textae-editor__span,.textae-editor__grid,.textae-editor__entity', editorSelected)
                        .on('selectChanged', '.textae-editor__span', spanSelectChanged)
                        .on('selectChanged', '.textae-editor__entity', entitySelectChanged)
                        .on('mouseenter', '.textae-editor__entity', function(e) {
                            view.domUtil.hover.on($(this).attr('title'));
                        }).on('mouseleave', '.textae-editor__entity', function(e) {
                            view.domUtil.hover.off($(this).attr('title'));
                        });


                    // The jsPlumbConnetion has an original event mecanism.
                    // We can only bind the connection directory.
                    editor
                        .on('textae.editor.jsPlumbConnection.add', function(event, jsPlumbConnection) {
                            jsPlumbConnection.bind('click', jsPlumbConnectionClicked);
                        });

                    // Init command
                    controller.command.init(
                        function commandChangedHandler() {
                            // An event handler called when command state is changed.

                            //change button state
                            view.viewModel.buttonStateHelper.enabled("write", this.hasAnythingToSave());
                            view.viewModel.buttonStateHelper.enabled("undo", this.hasAnythingToUndo());
                            view.viewModel.buttonStateHelper.enabled("redo", this.hasAnythingToRedo());

                            //change leaveMessage show
                            if (this.hasAnythingToSave()) {
                                window.onbeforeunload = function() {
                                    return "There is a change that has not been saved. If you leave now, you will lose it.";
                                };
                            } else {
                                window.onbeforeunload = null;
                            }
                        }
                    );

                    controller.userEvent.viewHandler.init();
                },
                command: command,
                userEvent: userEvent,
                spanConfig: spanConfig
            };
        }(this);

        var readSettingFiles = function(editor) {
            var setTypeConfig = function(config) {
                view.viewModel.typeContainer.setDefinedEntityTypes(config['entity types']);
                view.viewModel.typeContainer.setDefinedRelationTypes(config['relation types']);

                if (config.css !== undefined) {
                    $('#css_area').html('<link rel="stylesheet" href="' + config.css + '"/>');
                }
            };

            // read default controller.spanConfig
            controller.spanConfig.set();

            // Read model parameters from url parameters and html attributes.
            // Html attributes preced url parameters.
            var params = $.extend(textAeUtil.getUrlParameters(location.search), {
                config: editor.attr("config"),
                target: editor.attr("target")
            });

            if (params.config && params.config !== "") {
                // load sync, because load annotation after load config. 
                var data = textAeUtil.ajaxAccessor.getSync(params.config);
                if (data !== null) {
                    controller.spanConfig.set(data);
                    setTypeConfig(data);
                } else {
                    alert('could not read the span configuration from the location you specified.');
                }
            }

            if (params.target && params.target !== "") {
                dataAccessObject.getAnnotationFromServer(params.target);
            }
        };

        // public funcitons of editor
        this.api = {
            start: function startEdit(editor) {
                controller.init();
                view.init();

                readSettingFiles(editor);
            },
            handleKeyInput: function(key, mousePoint) {
                var keyApiMap = {
                    'A': dataAccessObject.showAccess,
                    'C': controller.userEvent.editHandler.copyEntities,
                    'D': controller.userEvent.editHandler.removeSelectedElements,
                    'DEL': controller.userEvent.editHandler.removeSelectedElements,
                    'E': controller.userEvent.editHandler.createEntity,
                    'Q': controller.userEvent.viewHandler.showPallet,
                    'R': controller.userEvent.editHandler.replicate,
                    'S': dataAccessObject.showSave,
                    'V': controller.userEvent.editHandler.pasteEntities,
                    'W': controller.userEvent.editHandler.newLabel,
                    'X': controller.command.redo,
                    'Y': controller.command.redo,
                    'Z': controller.command.undo,
                    'ESC': controller.userEvent.viewHandler.cancelSelect,
                    'LEFT': controller.userEvent.viewHandler.selectLeftSpan,
                    'RIGHT': controller.userEvent.viewHandler.selectRightSpan,
                };
                if (keyApiMap[key]) {
                    keyApiMap[key](mousePoint);
                }
            },
            handleButtonClick: function(name, mousePoint) {
                var buttonApiMap = {
                    'textae.control.button.read.click': dataAccessObject.showAccess,
                    'textae.control.button.write.click': dataAccessObject.showSave,
                    'textae.control.button.undo.click': controller.command.undo,
                    'textae.control.button.redo.click': controller.command.redo,
                    'textae.control.button.replicate.click': controller.userEvent.editHandler.replicate,
                    'textae.control.button.replicate_auto.click': view.viewModel.modeAccordingToButton['replicate-auto'].toggle,
                    'textae.control.button.relation_edit_mode.click': controller.userEvent.viewHandler.toggleRelationEditMode,
                    'textae.control.button.entity.click': controller.userEvent.editHandler.createEntity,
                    'textae.control.button.change_label.click': controller.userEvent.editHandler.newLabel,
                    'textae.control.button.pallet.click': controller.userEvent.viewHandler.showPallet,
                    'textae.control.button.delete.click': controller.userEvent.editHandler.removeSelectedElements,
                    'textae.control.button.copy.click': controller.userEvent.editHandler.copyEntities,
                    'textae.control.button.paste.click': controller.userEvent.editHandler.pasteEntities,
                    'textae.control.button.setting.click': controller.userEvent.viewHandler.showSettingDialog,
                };
                buttonApiMap[name](mousePoint);
            },
            redraw: controller.userEvent.viewHandler.redraw,
        };

        return this;
    };
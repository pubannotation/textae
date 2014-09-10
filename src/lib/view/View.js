var delay150 = function(func) {
        return _.partial(_.delay, func, 150);
    },
    ViewMode = function(editor, model, buttonController, renderFunc) {
        var selector = require('./Selector')(editor, model),
            changeCssClass = function(mode) {
                editor
                    .removeClass('textae-editor_term-mode')
                    .removeClass('textae-editor_instance-mode')
                    .removeClass('textae-editor_relation-mode')
                    .addClass('textae-editor_' + mode + '-mode');
            },
            setControlButtonForRelation = function(isRelation) {
                buttonController.buttonStateHelper.enabled('replicate-auto', !isRelation);
                buttonController.modeAccordingToButton['relation-edit-mode'].value(isRelation);
            },
            // This notify is off at relation-edit-mode.
            entitySelectChanged = _.compose(buttonController.buttonStateHelper.updateByEntity, selector.entityLabel.update),
            changeLineHeight = function(heightValue) {
                editor.find('.textae-editor__body__text-box').css({
                    'line-height': heightValue + 'px',
                    'padding-top': heightValue / 2 + 'px'
                });
            },
            calculateLineHeight = function(typeGapValue) {
                var TEXT_HEIGHT = 23,
                    MARGIN_TOP = 60,
                    MINIMUM_HEIGHT = 16 * 4,
                    heightOfType = typeGapValue * 18 + 18,
                    maxHeight = _.max(model.annotationData.span.all()
                        .map(function(span) {
                            var height = TEXT_HEIGHT + MARGIN_TOP;
                            var countHeight = function(span) {
                                // Grid height is height of types and margin bottom of the grid.
                                height += span.getTypes().length * heightOfType;
                                if (span.parent) {
                                    countHeight(span.parent);
                                }
                            };

                            countHeight(span);

                            return height;
                        }).concat(MINIMUM_HEIGHT)
                    );

                changeLineHeight(maxHeight);
            },
            typeGapValue = 0,
            TypeStyle = function(newValue) {
                return {
                    height: 18 * newValue + 18 + 'px',
                    'padding-top': 18 * newValue + 'px'
                };
            };

        var api = {
            getTypeGapValue: function() {
                return typeGapValue;
            },
            setTerm: function() {
                changeCssClass('term');
                setControlButtonForRelation(false);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', entitySelectChanged)
                    .bind('entity.select', entitySelectChanged)
                    .bind('entity.deselect', entitySelectChanged)
                    .bind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setInstance: function() {
                changeCssClass('instance');
                setControlButtonForRelation(false);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', buttonController.buttonStateHelper.updateByEntity)
                    .bind('entity.select', entitySelectChanged)
                    .bind('entity.deselect', entitySelectChanged)
                    .bind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setRelation: function() {
                changeCssClass('relation');
                setControlButtonForRelation(true);

                model.selectionModel
                    .unbind('entity.select', entitySelectChanged)
                    .unbind('entity.deselect', entitySelectChanged)
                    .unbind('entity.change', buttonController.buttonStateHelper.updateByEntity);
            },
            setEditable: function(isEditable) {
                if (isEditable) {
                    editor.addClass('textae-editor_editable');
                    buttonController.buttonStateHelper.enabled('relation-edit-mode', true);
                } else {
                    editor.removeClass('textae-editor_editable');
                    buttonController.buttonStateHelper.enabled('replicate-auto', false);
                    buttonController.buttonStateHelper.enabled('relation-edit-mode', false);
                }
            },
            getLineHeight: function() {
                return parseInt(editor.find('.textae-editor__body__text-box').css('line-height')) / 16;
            },
            changeLineHeight: changeLineHeight,
            changeTypeGap: function(newValue) {
                if (typeGapValue === newValue) return;

                // init
                if (newValue !== -1) {
                    editor.find('.textae-editor__type')
                        .css(new TypeStyle(newValue));
                    calculateLineHeight(newValue);
                    renderFunc(newValue);
                }

                typeGapValue = newValue;
            },
            getTypeStyle: function() {
                return new TypeStyle(typeGapValue);
            }
        };

        return api;
    };

module.exports = function(editor, model) {
    var selector = require('./Selector')(editor, model),
        clipBoard = {
            // clipBoard has entity type.
            clipBoard: []
        },
        buttonController = require('./ButtonController')(editor, model, clipBoard),
        typeContainer = require('./TypeContainer')(model),
        // Render DOM elements conforming with the Model.
        renderer = require('./renderer/Renderer')(editor, model, buttonController, typeContainer),
        gridLayout = require('./GridLayout')(editor, model.annotationData),
        api = require('../util/extendBindable')({}),
        render = function(typeGapValue) {
            api.trigger('render.start', editor);
            // Do asynchronous to change behavior of editor.
            // For example a wait cursor or a disabled control.
            _.defer(function() {
                gridLayout.arrangePosition(typeGapValue)
                    .then(renderer.renderLazyRelationAll)
                    .then(renderer.arrangeRelationPositionAll)
                    .then(function() {
                        api.trigger('render.end', editor);
                    });
            });
        },
        viewMode = new ViewMode(editor, model, buttonController, render),
        hover = function() {
            var domPositionCaChe = require('./DomPositionCache')(editor, model.annotationData.entity),
                processAccosiatedRelation = function(func, entityId) {
                    model.annotationData.entity.assosicatedRelations(entityId)
                        .map(domPositionCaChe.toConnect)
                        .forEach(func);
                };

            return {
                on: _.partial(processAccosiatedRelation, function(connect) {
                    connect.pointup();
                }),
                off: _.partial(processAccosiatedRelation, function(connect) {
                    connect.pointdown();
                })
            };
        }(),
        setSelectionModelHandler = function() {
            // The buttonController.buttonStateHelper.updateByEntity is set at viewMode.
            // Because entity.change is off at relation-edit-mode.
            model.selectionModel
                .bind('span.select', selector.span.select)
                .bind('span.deselect', selector.span.deselect)
                .bind('span.change', buttonController.buttonStateHelper.updateBySpan)
                .bind('entity.select', selector.entity.select)
                .bind('entity.deselect', selector.entity.deselect)
                .bind('relation.select', delay150(selector.relation.select))
                .bind('relation.deselect', delay150(selector.relation.deselect))
                .bind('relation.change', buttonController.buttonStateHelper.updateByRelation);
        },
        updateDisplay = function() {
            render(viewMode.getTypeGapValue());
        };

    renderer
        .bind('change', updateDisplay)
        .bind('entity.render', function(entity) {
            // Set css accoridng to the typeGapValue. 
            renderer.setEntityCss(entity, viewMode.getTypeStyle());
        });

    return _.extend(api, {
        init: _.compose(setSelectionModelHandler, renderer.setModelHandler),
        viewModel: buttonController,
        clipBoard: clipBoard,
        viewMode: viewMode,
        hoverRelation: hover,
        updateDisplay: updateDisplay,
        typeContainer: typeContainer
    });
};
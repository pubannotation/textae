var delay150 = function(func) {
        return _.partial(_.delay, func, 150);
    },
    ViewMode = require('./ViewMode');

module.exports = function(editor, model, clipBoard) {
    var selector = require('./Selector')(editor, model),
        buttonController = require('./ButtonController')(editor, model, clipBoard),
        viewMode = new ViewMode(editor, model, buttonController),
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
                    })
                    .catch(function(error) {
                        console.error(error, error.stack);
                    });
            });
        },
        hover = function() {
            var domPositionCaChe = require('./DomPositionCache')(editor, model.annotationData.entity),
                processAccosiatedRelation = function(func, entityId) {
                    model.annotationData.entity.assosicatedRelations(entityId)
                        .map(domPositionCaChe.toConnect)
                        .filter(function(connect) {
                            return connect.pointup && connect.pointdown;
                        })
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
        updateDisplay = render;

    viewMode.on('change.typeGap', render);

    renderer
        .bind('change', updateDisplay)
        .bind('entity.render', function(entity) {
            // Set css accoridng to the typeGapValue.
            renderer.setEntityCss(entity, viewMode.getTypeStyle());
        });

    return _.extend(api, {
        init: _.compose(setSelectionModelHandler, renderer.setModelHandler),
        viewModel: buttonController,
        viewMode: viewMode,
        hoverRelation: hover,
        updateDisplay: updateDisplay,
        typeContainer: typeContainer
    });
};

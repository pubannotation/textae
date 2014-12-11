var delay150 = function(func) {
    return _.partial(_.delay, func, 150);
  },
  TypeStyle = function(newValue) {
    return {
      height: 18 * newValue + 18 + 'px',
      'padding-top': 18 * newValue + 'px'
    };
  };

module.exports = function(editor, model, buttonController, getTypeGapValue) {
  var selector = require('./Selector')(editor, model),
    typeContainer = require('./TypeContainer')(model),
    // Render DOM elements conforming with the Model.
    renderer = require('./renderer/Renderer')(editor, model, buttonController.buttonStateHelper, typeContainer),
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

  renderer
    .bind('change', function() {
      updateDisplay(getTypeGapValue());
    })
    .bind('entity.render', function(entity) {
      // Set css accoridng to the typeGapValue.
      renderer.setEntityCss(entity, new TypeStyle(getTypeGapValue()));
    });

  return _.extend(api, {
    init: _.compose(setSelectionModelHandler, renderer.setModelHandler),
    hoverRelation: hover,
    updateDisplay: updateDisplay,
    typeContainer: typeContainer,
    setTypeGap: function(newValue) {
      editor.find('.textae-editor__type')
        .css(new TypeStyle(newValue));
      render(newValue);
    }
  });
};

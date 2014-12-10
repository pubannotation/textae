var changeCssClass = function(editor, mode) {
    editor
      .removeClass('textae-editor_term-mode')
      .removeClass('textae-editor_instance-mode')
      .removeClass('textae-editor_relation-mode')
      .addClass('textae-editor_' + mode + '-mode');
  },
  changeLineHeight = function(editor, heightValue) {
    editor.find('.textae-editor__body__text-box').css({
      'line-height': heightValue + 'px',
      'padding-top': heightValue / 2 + 'px'
    });
  },
  calculateLineHeight = function(editor, model, typeGapValue) {
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

    changeLineHeight(editor, maxHeight);
  },
  TypeStyle = function(newValue) {
    return {
      height: 18 * newValue + 18 + 'px',
      'padding-top': 18 * newValue + 'px'
    };
  },
  EventEmitter = require('events').EventEmitter;

module.exports = function(editor, model, buttonController) {
  var emitter = new EventEmitter(),
    selector = require('./Selector')(editor, model),
    setSettingButtonEnable = _.partial(buttonController.buttonStateHelper.enabled, 'setting', true),
    setControlButtonForRelation = function(isRelation) {
      buttonController.buttonStateHelper.enabled('replicate-auto', !isRelation);
      buttonController.buttonStateHelper.enabled('boundary-detection', !isRelation);
      buttonController.modeAccordingToButton['relation-edit-mode'].value(isRelation);
    },
    // This notify is off at relation-edit-mode.
    entitySelectChanged = _.compose(buttonController.buttonStateHelper.updateByEntity, selector.entityLabel.update),
    typeGapValue = 0;

  var api = {
    getTypeGapValue: function() {
      return typeGapValue;
    },
    setTerm: function() {
      changeCssClass(editor, 'term');
      setSettingButtonEnable();
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
      changeCssClass(editor, 'instance');
      setSettingButtonEnable();
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
      changeCssClass(editor, 'relation');
      setSettingButtonEnable();
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
    changeLineHeight: _.partial(changeLineHeight, editor),
    changeTypeGap: function(newValue) {
      if (typeGapValue === newValue) return;

      // init
      if (newValue !== -1) {
        editor.find('.textae-editor__type')
          .css(new TypeStyle(newValue));
        calculateLineHeight(editor, model, newValue);
        emitter.emit('change.typeGap', newValue);
      }

      typeGapValue = newValue;
    },
    getTypeStyle: function() {
      return new TypeStyle(typeGapValue);
    }
  };

  return _.extend(emitter, api);
};

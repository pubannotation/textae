import Selector from './Selector';
import Renderer from './Renderer';
import GridLayout from './GridLayout';
import lineHeight from './lineHeight';
import Hover from './Hover';
import CursorChanger from '../util/CursorChanger';
import {
    EventEmitter as EventEmitter
}
from 'events';

export default function(editor, model, buttonController, getTypeGapValue, typeContainer) {
    var selector = new Selector(editor, model),
        // Render DOM elements conforming with the Model.
        renderer = new Renderer(editor, model, buttonController.buttonStateHelper, typeContainer),
        gridLayout = new GridLayout(editor, model.annotationData, typeContainer),
        emitter = new EventEmitter(),
        hover = new Hover(editor, model.annotationData.entity),
        setSelectionModelHandler = function() {
            // Because entity.change is off at relation-edit-mode.
            model.selectionModel
                .on('span.select', selector.span.select)
                .on('span.deselect', selector.span.deselect)
                .on('span.change', buttonController.buttonStateHelper.updateBySpan)
                .on('entity.select', selector.entity.select)
                .on('entity.deselect', selector.entity.deselect)
                .on('relation.select', delay150(selector.relation.select))
                .on('relation.deselect', delay150(selector.relation.deselect))
                .on('relation.change', buttonController.buttonStateHelper.updateByRelation);
        },
        updateDisplay = _.partial(render, editor, emitter, gridLayout, renderer);

    return {
        init: () => {
            renderer.init(editor, model)
                .on('change', function() {
                    updateDisplay(getTypeGapValue());
                })
                .on('entity.render', function(entity) {
                    // Set css accoridng to the typeGapValue.
                    renderer.setEntityCss(entity, new TypeStyle(getTypeGapValue()));
                })
                .on('text.change', function() {
                    lineHeight.reduceBottomSpace(editor);
                });

            // Set cursor control by view rendering events.
            var cursorChanger = new CursorChanger(editor);
            emitter
                .on('render.start', function(editor) {
                    // console.log(editor.editorId, 'render.start');
                    cursorChanger.startWait();
                })
                .on('render.end', function(editor) {
                    // console.log(editor.editorId, 'render.end');
                    cursorChanger.endWait();
                });

            setSelectionModelHandler();
        },
        hoverRelation: hover,
        updateDisplay: updateDisplay,
        setTypeGap: function(newValue) {
            editor.find('.textae-editor__type')
                .css(new TypeStyle(newValue));
            render(editor, emitter, gridLayout, renderer, newValue);
        }
    };
}

function delay150(func) {
    return _.partial(_.delay, func, 150);
}

function TypeStyle(newValue) {
    return {
        height: 18 * newValue + 18 + 'px',
        'padding-top': 18 * newValue + 'px'
    };
}

function render(editor, emitter, gridLayout, renderer, typeGapValue) {
    emitter.emit('render.start', editor);
    // Do asynchronous to change behavior of editor.
    // For example a wait cursor or a disabled control.
    _.defer(function() {
        gridLayout.arrangePosition(typeGapValue)
            .then(renderer.renderLazyRelationAll)
            .then(renderer.arrangeRelationPositionAll)
            .then(function() {
                emitter.emit('render.end', editor);
            })
            .catch(function(error) {
                console.error(error, error.stack);
            });
    });
}

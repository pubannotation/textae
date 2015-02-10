import Renderer from './Renderer';
import lineHeight from './lineHeight';
import Hover from './Hover';
import Display from './Display';
import CursorChanger from '../util/CursorChanger';
import setSelectionModelHandler from './setSelectionModelHandler';

export default function(editor, model, buttonController, getTypeGapValue, typeContainer) {
    // Render DOM elements conforming with the Model.
    var renderer = new Renderer(editor, model, buttonController.buttonStateHelper, typeContainer),
        hover = new Hover(editor, model.annotationData.entity),
        display = new Display(editor, model.annotationData, typeContainer, renderer);

    setDisplayHandler(editor, display);
    setSelectionModelHandler(editor, model, buttonController);

    return {
        init: _.partial(
            initRenderer,
            editor,
            model,
            renderer,
            display.update,
            getTypeGapValue
        ),
        hoverRelation: hover,
        updateDisplay: display.update,
        setTypeGap: newValue => {
            editor.find('.textae-editor__type')
                .css(new TypeStyle(newValue));
            display.update(newValue);
        }
    };
}

function TypeStyle(newValue) {
    return {
        height: 18 * newValue + 18 + 'px',
        'padding-top': 18 * newValue + 'px'
    };
}

function initRenderer(editor, model, renderer, updateDisplay, getTypeGapValue) {
    renderer.init(editor, model)
        .on('change', () => updateDisplay(getTypeGapValue()))
        .on('entity.render', entity => {
            // Set css accoridng to the typeGapValue.
            renderer.setEntityCss(entity, new TypeStyle(getTypeGapValue()));
        })
        .on('text.change', () => lineHeight.reduceBottomSpace(editor));
}

function setDisplayHandler(editor, display) {
    // Set cursor control by view rendering events.
    var cursorChanger = new CursorChanger(editor);

    display
        .on('render.start', editor => {
            // console.log(editor.editorId, 'render.start');
            cursorChanger.startWait();
        })
        .on('render.end', editor => {
            // console.log(editor.editorId, 'render.end');
            cursorChanger.endWait();
        });
}

import Renderer from './Renderer';
import lineHeight from './lineHeight';
import Hover from './Hover';
import Display from './Display';
import CursorChanger from '../util/CursorChanger';
import setSelectionModelHandler from './setSelectionModelHandler';

export default function(editor, model, buttonController, typeGap, typeContainer) {
    // Render DOM elements conforming with the Model.
    var renderer = new Renderer(editor, model, buttonController.buttonStateHelper, typeContainer),
        hover = new Hover(editor, model.annotationData.entity),
        display = new Display(editor, model.annotationData, typeContainer, renderer),
        setTypeStyle = newValue => editor.find('.textae-editor__type').css(new TypeStyle(newValue));

    typeGap
        .on('change', setTypeStyle)
        .on('change', newValue => lineHeight.setToTypeGap(editor, model, typeContainer, newValue))
        .on('change', display.update);

    setDisplayHandler(editor, display);
    setSelectionModelHandler(editor, model, buttonController);

    return {
        init: _.partial(
            initRenderer,
            editor,
            model,
            renderer,
            display.update,
            typeGap.get
        ),
        hoverRelation: hover,
        updateDisplay: () => display.update(typeGap.get)
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

import Renderer from './Renderer';
import lineHeight from './lineHeight';
import Hover from './Hover';
import Display from './Display';
import CursorChanger from '../util/CursorChanger';
import setSelectionModelHandler from './setSelectionModelHandler';
import TypeStyle from './TypeStyle';

export default function(editor, model, buttonController, typeGap, typeContainer) {
    // Render DOM elements conforming with the Model.
    var renderer = new Renderer(editor, model, buttonController.buttonStateHelper, typeContainer, typeGap),
        hover = new Hover(editor, model.annotationData.entity),
        display = new Display(editor, model.annotationData, typeContainer, renderer),
        setTypeStyle = newValue => editor.find('.textae-editor__type').css(new TypeStyle(newValue));

    typeGap(setTypeStyle);
    typeGap(newValue => lineHeight.setToTypeGap(editor, model, typeContainer, newValue));
    typeGap(display.update);

    setDisplayHandler(editor, display);
    setSelectionModelHandler(editor, model, buttonController);

    return {
        init: _.partial(
            initRenderer,
            editor,
            model,
            renderer,
            display.update,
            typeGap
        ),
        hoverRelation: hover,
        updateDisplay: () => display.update(typeGap())
    };
}

function initRenderer(editor, model, renderer, updateDisplay, typeGap) {
    var debouncedUpdateDisplay = _.debounce(() => updateDisplay(typeGap()), 100);

    renderer.init(editor, model.annotationData, model.selectionModel)
        .on('change', debouncedUpdateDisplay)
        .on('all.change', debouncedUpdateDisplay)
        .on('text.change', () => lineHeight.reduceBottomSpace(editor))
        .on('span.add', debouncedUpdateDisplay)
        .on('span.remove', debouncedUpdateDisplay)
        .on('entity.add', debouncedUpdateDisplay)
        .on('entity.change', debouncedUpdateDisplay)
        .on('entity.remove', debouncedUpdateDisplay)
        .on('relation.add', debouncedUpdateDisplay);
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

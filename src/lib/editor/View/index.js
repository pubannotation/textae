import Renderer from './Renderer';
import lineHeight from './lineHeight';
import Hover from './Hover';
import Display from './Display';
import CursorChanger from '../../util/CursorChanger';
import setSelectionModelHandler from './setSelectionModelHandler';
import TypeStyle from './TypeStyle';
import RelationRenderer from './Renderer/RelationRenderer';

export default function(editor, model, buttonController, typeGap, typeContainer) {
    // Render DOM elements conforming with the Model.
    var relationRenderer = new RelationRenderer(editor, model, typeContainer),
        hover = new Hover(editor, model.annotationData.entity);

    setSelectionModelHandler(editor, model, buttonController);

    var api = {
        init: () => {
            var arrangePositionAllRelation = relationRenderer.init(editor),
                display = new Display(editor, model.annotationData, typeContainer, arrangePositionAllRelation);

            setHandlerOnTyapGapEvent(editor, model, typeGap, typeContainer, display);
            setHandlerOnDisplayEvent(editor, display);

            initRenderer(
                editor,
                model,
                display.update,
                typeGap,
                typeContainer,
                buttonController.buttonStateHelper,
                relationRenderer
            );

            api.updateDisplay = () => {
                display.update(typeGap());
                lineHeight.reduceBottomSpace(editor[0]);
            };
        },
        hoverRelation: hover
    };

    return api;
}

function initRenderer(editor, model, updateDisplay, typeGap, typeContainer, buttonStateHelper, relationRenderer) {
    var renderer = new Renderer(editor, model, buttonStateHelper, typeContainer, typeGap, relationRenderer),
        debouncedUpdateDisplay = _.debounce(() => updateDisplay(typeGap()), 100);

    renderer.init(editor, model.annotationData, model.selectionModel)
        .on('change', debouncedUpdateDisplay)
        .on('all.change', debouncedUpdateDisplay)
        .on('paragraph.change', () => lineHeight.reduceBottomSpace(editor[0]))
        .on('span.add', debouncedUpdateDisplay)
        .on('span.remove', debouncedUpdateDisplay)
        .on('entity.add', debouncedUpdateDisplay)
        .on('entity.change', debouncedUpdateDisplay)
        .on('entity.remove', debouncedUpdateDisplay)
        .on('relation.add', debouncedUpdateDisplay);
}

function setHandlerOnTyapGapEvent(editor, model, typeGap, typeContainer, display) {
    var setTypeStyle = newValue => editor.find('.textae-editor__type').css(new TypeStyle(newValue));

    typeGap(setTypeStyle);
    typeGap(newValue => lineHeight.setToTypeGap(editor[0], model.annotationData, typeContainer, newValue));
    typeGap(display.update);
}

function setHandlerOnDisplayEvent(editor, display) {
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

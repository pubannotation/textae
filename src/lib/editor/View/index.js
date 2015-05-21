import Renderer from './Renderer';
import * as lineHeight from './lineHeight';
import Hover from './Hover';
import Display from './Display';
import CursorChanger from '../../util/CursorChanger';
import setSelectionModelHandler from './setSelectionModelHandler';
import TypeStyle from './TypeStyle';
import RelationRenderer from './Renderer/RelationRenderer';

const BODY = `
<div class="textae-editor__body">
    <div class="textae-editor__body__annotation-box"></div>
    <div class="textae-editor__body__text-box"></div>
</div>
`;

export default function(editor, model) {
    let hover = new Hover(editor, model.annotationData.entity);

    let api = {
        init: (editor, buttonController, typeGap, typeContainer) => {
            setSelectionModelHandler(editor, model, buttonController);

            editor[0].innerHTML = BODY;

            let relationRenderer = new RelationRenderer(editor, model, typeContainer);
            let arrangePositionAllRelation = relationRenderer.init(editor),
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
    let renderer = new Renderer(editor, model, buttonStateHelper, typeContainer, typeGap, relationRenderer),
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
    let setTypeStyle = newValue => editor.find('.textae-editor__type').css(new TypeStyle(newValue));

    typeGap(setTypeStyle);
    typeGap(newValue => lineHeight.setToTypeGap(editor[0], model.annotationData, typeContainer, newValue));
    typeGap(display.update);
}

function setHandlerOnDisplayEvent(editor, display) {
    // Set cursor control by view rendering events.
    let cursorChanger = new CursorChanger(editor);

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

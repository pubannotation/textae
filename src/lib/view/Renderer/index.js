import capitalize from '../../util/capitalize';
import GridRenderer from './GridRenderer';
import EntityRenderer from './EntityRenderer';
import SpanRenderer from './SpanRenderer';
import RelationRenderer from './RelationRenderer';
import DomPositionCache from '../DomPositionCache';
import Initiator from './Initiator';

module.exports = function(editor, model, buttonStateHelper, typeContainer) {
    var domPositionCaChe = new DomPositionCache(editor, model.annotationData.entity),
        gridRenderer = new GridRenderer(editor, domPositionCaChe),
        entityRenderer = new EntityRenderer(editor, model, typeContainer, gridRenderer),
        spanRenderer = new SpanRenderer(editor, model, typeContainer, entityRenderer, gridRenderer),
        relationRenderer = new RelationRenderer(editor, model, typeContainer);

    var api = {
        init: new Initiator(
            domPositionCaChe,
            spanRenderer,
            gridRenderer,
            entityRenderer,
            relationRenderer
        ),
        arrangeRelationPositionAll: relationRenderer.arrangePositionAll,
        renderLazyRelationAll: relationRenderer.renderLazyRelationAll,
        setEntityCss: function(entity, css) {
            entityRenderer
                .getTypeDom(entity)
                .css(css);
        }
    };

    return api;
};

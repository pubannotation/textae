import DomPositionCache from '../DomPositionCache';
import Initiator from './Initiator';

module.exports = function(editor, model, buttonStateHelper, typeContainer, typeGap, relationRenderer) {
    var domPositionCaChe = new DomPositionCache(editor, model.annotationData.entity);

    var api = {
        init: new Initiator(
            domPositionCaChe,
            relationRenderer,
            buttonStateHelper,
            typeGap,
            editor, model, typeContainer
        ),
        arrangeRelationPositionAll: relationRenderer.arrangePositionAll,
        renderLazyRelationAll: relationRenderer.renderLazyRelationAll
    };

    return api;
};

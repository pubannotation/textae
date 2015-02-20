import importSource from './importSource';
import translateDenotation from './translateDenotation';
import translateRelation from './translateRelation';
import translateModification from './translateModification';

export default importAnnotations;

function importAnnotations(span, entity, relation, modification, denotations, relations, modifications, prefix) {
    importSource([span, entity], _.partial(translateDenotation, prefix), denotations);
    importSource([relation], _.partial(translateRelation, prefix), relations);
    importSource([modification], _.partial(translateModification, prefix), modifications);
}

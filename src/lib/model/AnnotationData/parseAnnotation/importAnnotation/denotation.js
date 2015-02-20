import importSource from './importSource';
import translateDenotation from './translateDenotation';

export default function(span, entity, denotations, prefix) {
    importSource(
        [span, entity], (denotation) => translateDenotation(prefix, denotation),
        denotations
    );
}

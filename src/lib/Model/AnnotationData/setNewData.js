import parseAnnotation from './parseAnnotation';
import importNamespace from './parseAnnotation/importAnnotation/namespace';

export default function(dataStore, annotation) {
    parseBaseText(dataStore.paragraph, annotation.text);

    dataStore.sourceDoc = annotation.text;
    dataStore.config = annotation.config;

    return parseDennotation(dataStore, annotation);
}

function parseBaseText(paragraph, sourceDoc) {
    paragraph.addSource(sourceDoc);
}

function parseTracks(span, entity, relation, modification, paragraph, text, annotation) {
    if (!annotation.tracks) return [false, []];

    var tracks = annotation.tracks;
    delete annotation.tracks;

    var rejects = tracks
        .map((track, i) => {
            var number = i + 1,
                prefix = `track${ number }_`,
                reject = parseAnnotation(
                    span,
                    entity,
                    relation,
                    modification,
                    paragraph,
                    text,
                    track,
                    prefix
                );

            reject.name = `Track ${ number } annotations.`;
            return reject;
        });

    return [true, rejects];
}

function parseDennotation(dataStore, annotation) {
    var tracks = parseTracks(
            dataStore.span,
            dataStore.entity,
            dataStore.relation,
            dataStore.modification,
            dataStore.paragraph,
            annotation.text,
            annotation
        ),
        annotationReject = parseAnnotation(
            dataStore.span,
            dataStore.entity,
            dataStore.relation,
            dataStore.modification,
            dataStore.paragraph,
            annotation.text,
            annotation);

    annotationReject.name = 'Root annotations.';

    importNamespace(
        dataStore.namespace,
        annotation.namespaces
    );

    return {
        multitrack: tracks[0],
        rejects: [annotationReject].concat(tracks[1])
    };
}

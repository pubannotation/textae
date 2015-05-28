import Machine from 'emitter-fsm';

export default function() {
    let m = new Machine({
        states: ['Init', 'Term Contric', 'Instance / Relation', 'Relation Edit', 'View Term', 'View Instance']
    });

    m.config('View Term', {
        to: {
            only: ['View Instance']
        }
    });

    m.config('View Instance', {
        to: {
            only: ['View Term']
        }
    });

    return m;
}

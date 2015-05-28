import Machine from 'emitter-fsm';
import state from './state';

export default function() {
    let m = new Machine({
        states: [
            state.INIT,
            state.TERM,
            state.INSTANCE,
            state.RELATION,
            state.VIEW_TERM,
            state.VIEW_INSTANCE
        ]
    });

    m.config(state.VIEW_TERM, {
        to: {
            only: [state.VIEW_INSTANCE]
        }
    });

    m.config(state.VIEW_INSTANCE, {
        to: {
            only: [state.VIEW_TERM]
        }
    });

    return m;
}

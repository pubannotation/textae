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

    m.config(state.INIT, {
        to: {
            exclude: [state.RELATION]
        }
    });

    m.config(state.TERM, {
        from: {
            exclude: [state.VIEW_INSTANCE]
        },
        to: {
            exclude: [
                state.INIT,
                state.VIEW_INSTANCE
            ]
        }
    });

    m.config(state.INSTANCE, {
        from: {
            exclude: [state.VIEW_TERM]
        },
        to: {
            exclude: [
                state.INIT,
                state.VIEW_TERM
            ]
        }
    });

    m.config(state.RELATION, {
        from: {
            exclude: [state.INIT]
        },
        to: {
            exclude: [
                state.INIT,
                state.VIEW_TERM
            ]
        }
    });

    m.config(state.VIEW_TERM, {
        from: {
            exclude: [
                state.INSTANCE,
                state.RELATION
            ]
        },
        to: {
            exclude: [
                state.INIT,
                state.INSTANCE
            ]
        }
    });

    m.config(state.VIEW_INSTANCE, {
        from: {
            exclude: [
                state.TERM
            ]
        },
        to: {
            exclude: [
                state.INIT,
                state.TERM
            ]
        }
    });

    return m;
}
